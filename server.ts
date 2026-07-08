import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Supabase config for dynamic sitemap blog slugs
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://exzhlhdjtvvjncphiofa.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_q6ROtjbX8jc-f3KiWYJDPw_6tR3HNZD';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getBlogSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug');
    if (error) {
      console.error('Sitemap DB query error:', error);
      return [];
    }
    return (data || []).map(row => row.slug);
  } catch (err) {
    console.error('Sitemap fetch failed:', err);
    return [];
  }
}

// Search engine crawler protection headers - only for private/api routes
app.use((req, res, next) => {
  const privatePaths = ['/admin', '/client-portal', '/api', '/workspace', '/dashboard', '/login', '/register', '/auth'];
  const isPrivate = privatePaths.some(p => req.path.startsWith(p));
  if (isPrivate) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  next();
});

// Sitemap generation
app.get('/sitemap.xml', async (req, res) => {
  const host = req.headers.host || 'goingtechnologies.com';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { path: '', changefreq: 'daily', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/services', changefreq: 'monthly', priority: '0.8' },
    { path: '/industries', changefreq: 'monthly', priority: '0.8' },
    { path: '/business-tools', changefreq: 'monthly', priority: '0.8' },
    { path: '/blogs', changefreq: 'daily', priority: '0.8' },
    { path: '/case-studies', changefreq: 'monthly', priority: '0.8' },
    { path: '/contact', changefreq: 'monthly', priority: '0.8' },
    { path: '/careers', changefreq: 'monthly', priority: '0.7' },
    { path: '/privacy', changefreq: 'yearly', priority: '0.5' },
    { path: '/terms', changefreq: 'yearly', priority: '0.5' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static URLs
  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  // Dynamic URLs (Blogs)
  const blogSlugs = await getBlogSlugs();
  for (const slug of blogSlugs) {
    xml += `
  <url>
    <loc>${baseUrl}/blogs/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }

  xml += `\n</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Robots.txt generation
app.get('/robots.txt', (req, res) => {
  const host = req.headers.host || 'goingtechnologies.com';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /client-portal
Disallow: /api/
Disallow: /workspace
Disallow: /dashboard

Sitemap: ${protocol}://${host}/sitemap.xml
`);
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Delete Supabase Auth User route
app.delete('/api/admin/delete-user/:id', async (req, res) => {
  const { id } = req.params;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Bypassing auth user deletion and proceeding with database cleanup.');
    return res.status(200).json({ 
      success: true, 
      warning: 'SUPABASE_SERVICE_ROLE_KEY is missing. Auth user not deleted, but database records will be purged.' 
    });
  }
  try {
    const adminClient = createClient(SUPABASE_URL, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    const { error } = await adminClient.auth.admin.deleteUser(id);
    if (error) {
      console.error('Supabase admin deleteUser error:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  } catch (err: any) {
    console.error('Failed to delete auth user:', err);
    return res.status(500).json({ error: err.message });
  }
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
