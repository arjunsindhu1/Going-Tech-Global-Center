import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Block direct access to proposal PDFs
app.use((req, res, next) => {
  if (req.path.toLowerCase().includes('proposal.pdf') || req.path.toLowerCase().includes('proposal')) {
    if (!req.path.startsWith('/api/proposal/')) {
      return res.status(403).send('Forbidden: Direct access to the PDF is not allowed.');
    }
  }
  next();
});

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://exzhlhdjtvvjncphiofa.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_q6ROtjbX8jc-f3KiWYJDPw_6tR3HNZD';
const supabase = createClient(supabaseUrl, supabaseKey);

// HMAC Signature secret
const SIGN_SECRET = process.env.DOWNLOAD_SECRET || crypto.randomBytes(32).toString('hex');

// In-memory rate limiting map
const rateLimits = new Map<string, { count: number; lastReset: number }>();

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute
  const maxRequests = 15; // 15 requests per minute

  const limit = rateLimits.get(ip);
  if (!limit || (now - limit.lastReset) > limitWindow) {
    rateLimits.set(ip, { count: 1, lastReset: now });
    return next();
  }

  if (limit.count >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests. Please try again after a minute.' });
  }

  limit.count++;
  next();
}

// Blocked email domains
const BLOCKED_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
  'live.com', 'icloud.com', 'me.com', 'msn.com', 'aol.com', 'proton.me', 
  'protonmail.com', 'gmx.com', 'mail.com', 'zoho.com', 'yandex.com', 
  'rediffmail.com', 'fastmail.com', 'qq.com', '163.com', '126.com', 
  'hey.com', 'tutanota.com'
]);

function isCorporateEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const parts = email.trim().split('@');
  if (parts.length < 2) return false;
  const domain = parts[parts.length - 1].toLowerCase();
  return !BLOCKED_DOMAINS.has(domain);
}

// Generate secure signed download token
function generateSignedToken(email: string, file: string): string {
  const expiresAt = Date.now() + 60 * 1000; // 1 minute
  const payload = JSON.stringify({ email, file, expiresAt });
  const hmac = crypto.createHmac('sha256', SIGN_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return Buffer.from(JSON.stringify({ payload, signature })).toString('base64');
}

// Verify signature and expiration
function verifySignedToken(token: string): { email: string; file: string } | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const { payload, signature } = JSON.parse(raw);
    
    const hmac = crypto.createHmac('sha256', SIGN_SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    if (signature !== expectedSignature) return null;
    
    const data = JSON.parse(payload);
    if (Date.now() > data.expiresAt) return null;
    return data;
  } catch (err) {
    return null;
  }
}

// Parse simple browser and device from User Agent
function parseUserAgent(userAgent: string = '') {
  let browser = 'Unknown Browser';
  let device = 'Desktop';
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('chrome') && !ua.includes('chromium')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge') || ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    if (ua.includes('ipad') || ua.includes('tablet')) {
      device = 'Tablet';
    } else {
      device = 'Mobile';
    }
  }
  return { browser, device };
}

// Retrieve telemetry (Country & City via ipapi)
async function getIpTelemetry(ip: string) {
  let country = 'Unknown';
  let city = 'Unknown';
  if (ip && ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('10.') && !ip.startsWith('192.168.')) {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      if (response.ok) {
        const data = await response.json();
        country = data.country_name || data.country || 'Unknown';
        city = data.city || 'Unknown';
      }
    } catch (err) {
      // Fail silently
    }
  }
  return { country, city };
}

// POST endpoint to handle download registration and token generation
app.post('/api/proposal/download', rateLimiter, async (req, res) => {
  const { email, source, page_url } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  if (!isCorporateEmail(email)) {
    return res.status(400).json({ error: 'Please use your company email address to download this proposal.' });
  }

  const parts = email.trim().split('@');
  const companyDomain = parts[parts.length - 1].toLowerCase();
  const fileName = 'Going Technologies Insurance operations proposal.pdf';
  
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || '';
  const { browser, device } = parseUserAgent(userAgent);

  const dbStart = Date.now();

  // Run database logging in parallel with signed token generation
  const dbPromise = (async () => {
    const emailClean = email.trim().toLowerCase();
    
    // Check if duplicate email exists in proposal_downloads
    const { data: existingData, error: fetchError } = await supabase
      .from('proposal_downloads')
      .select('id, download_count')
      .eq('email', emailClean)
      .maybeSingle();

    if (fetchError) {
      console.error('[ERROR] Supabase fetch error:', fetchError);
      throw fetchError;
    }

    if (existingData) {
      // Duplicate lead: Update count & last_downloaded_at
      const newCount = (existingData.download_count || 1) + 1;
      const { error: updateError } = await supabase
        .from('proposal_downloads')
        .update({
          download_count: newCount,
          last_downloaded_at: new Date().toISOString(),
          ip_address: ip,
          browser,
          device,
          user_agent: userAgent,
          source: source || 'Exit Popup',
          page_url: page_url || ''
        })
        .eq('id', existingData.id);

      if (updateError) {
        console.error('[ERROR] Supabase update error:', updateError);
        throw updateError;
      }
    } else {
      // New lead: Insert a brand new record
      const { error: insertError } = await supabase
        .from('proposal_downloads')
        .insert([{
          email: emailClean,
          company_domain: companyDomain,
          source: source || 'Exit Popup',
          page_url: page_url || '',
          downloaded_file: fileName,
          ip_address: ip,
          browser,
          device,
          user_agent: userAgent,
          download_count: 1,
          last_downloaded_at: new Date().toISOString(),
          download_time: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('[ERROR] Supabase insert error:', insertError);
        throw insertError;
      }
    }
  })();

  const tokenStart = Date.now();
  const token = generateSignedToken(email.trim().toLowerCase(), fileName);
  const tokenGenTime = Date.now() - tokenStart;

  try {
    // Wait for the parallel database operation to complete successfully
    await dbPromise;
    const databaseTime = Date.now() - dbStart;

    // Move non-essential IP enrichment/telemetry lookup completely to the background
    // This removes the slow outbound network fetch from delaying the critical path
    setTimeout(async () => {
      try {
        const telemetry = await getIpTelemetry(ip);
        if (telemetry.country !== 'Unknown' || telemetry.city !== 'Unknown') {
          await supabase
            .from('proposal_downloads')
            .update({
              country: telemetry.country,
              city: telemetry.city
            })
            .eq('email', email.trim().toLowerCase());
        }
      } catch (telemetryErr) {
        console.error('[BACKGROUND ERROR] IP enrichment telemetry failed:', telemetryErr);
      }
    }, 0);

    return res.json({
      success: true,
      token,
      filename: fileName,
      timings: {
        databaseTime,
        tokenGenTime
      }
    });
  } catch (err: any) {
    console.error('Proposal download processing error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// GET endpoint to serve the secure PDF file using temporary signed token
app.get('/api/proposal/file', rateLimiter, (req, res) => {
  const { token } = req.query;
  
  if (!token || typeof token !== 'string') {
    return res.status(401).send('Unauthorized: Missing or invalid token.');
  }

  const tokenData = verifySignedToken(token);
  if (!tokenData) {
    return res.status(403).send('Forbidden: Token is invalid or has expired.');
  }

  const filePath = path.join(process.cwd(), 'Going Technologies Insurance operations proposal.pdf');
  
  if (!fs.existsSync(filePath)) {
    console.error('[ERROR] Secure PDF file does not exist on server:', filePath);
    return res.status(404).send('Error: The proposal PDF file was not found on the server.');
  }

  const stat = fs.statSync(filePath);
  if (stat.size === 0) {
    console.error('[ERROR] Secure PDF file is empty (0 bytes):', filePath);
    return res.status(500).send('Error: The proposal PDF file is empty.');
  }

  // Verify the file begins with the PDF signature: %PDF- (hex: 25 50 44 46 2d)
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(10);
    fs.readSync(fd, buffer, 0, 10, 0);
    fs.closeSync(fd);
    
    const signature = buffer.toString('utf8', 0, 5);
    if (signature !== '%PDF-') {
      console.error('[ERROR] PDF signature mismatch! First 10 bytes (hex):', buffer.toString('hex'));
      return res.status(500).send('Error: The file on server is not a valid PDF document.');
    }
    
    console.log('[DEBUG] Server-side PDF validation passed. File size:', stat.size);
  } catch (err) {
    console.error('[ERROR] Failed to read PDF signature:', err);
    return res.status(500).send('Error: Failed to validate the PDF file on the server.');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Going Technologies Insurance Operations Proposal.pdf"');
  res.setHeader('Cache-Control', 'private');
  res.setHeader('Content-Length', stat.size);
  
  res.sendFile(filePath);
});

// Vite Development Server Middleware configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
