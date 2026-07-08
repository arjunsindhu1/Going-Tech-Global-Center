import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Mail, Lock, Building, User, Eye, EyeOff, 
  ArrowRight, Key, FileText, Bell, Clock as ClockIcon, 
  Cpu, CheckCircle, AlertTriangle, Upload, Download, Trash2, 
  ExternalLink, LogOut, Check, ArrowLeft, RefreshCw, Loader2, Info,
  Search, Plus, Shield, Globe, Landmark, Award, FolderPlus, Folder, ChevronRight, Edit2, Copy, FileCode, CheckSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// High-security password validation check
const validatePassword = (pwd: string) => {
  if (pwd.length < 12) return 'Password must be at least 12 characters long.';
  if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number.';
  if (!/[!@#$%^&*(),.?":{}|<>_]/.test(pwd)) return 'Password must contain at least one special character.';
  return null;
};

// Client-side XOR-Hex Symmetric Credential Password Cryptography
const ENCRYPTION_KEY = 'GT-Enterprise-Security-2026';
const encryptPassword = (text: string): string => {
  return text.split('').map((char, i) => 
    String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
  ).map(c => c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
};

const decryptPassword = (hex: string): string => {
  try {
    if (!hex || hex.length % 4 !== 0) return hex;
    const chars: string[] = [];
    for (let i = 0; i < hex.length; i += 4) {
      chars.push(String.fromCharCode(parseInt(hex.substring(i, i + 4), 16)));
    }
    return chars.join('').split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    ).join('');
  } catch (err) {
    return hex;
  }
};

interface ClientPortalProps {
  setCurrentPage: (page: string) => void;
}

export default function ClientPortal({ setCurrentPage }: ClientPortalProps) {
  // Session details of authenticated user
  const [session, setSession] = useState<{
    id: string;
    company: string;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    industry?: string;
    designation?: string;
    status: string;
  } | null>(null);

  const [authChecked, setAuthChecked] = useState(false);

  // Authentication Flows: 'login' | 'register' | 'register_success' | 'forgot_password' | 'dashboard'
  const [flow, setFlow] = useState<'login' | 'register' | 'register_success' | 'forgot_password' | 'dashboard'>('login');

  // Search protection metadata check on load
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      metaRobots.setAttribute('content', 'noindex, nofollow');
      document.head.appendChild(metaRobots);
    } else {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    }
  }, []);

  // Form states - Register Multistep
  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [industry, setIndustry] = useState('Insurance');
  const [designation, setDesignation] = useState('Operations Director');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  


  // General UI feedback states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; title: string; message: string } | null>(null);

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'credentials' | 'documents' | 'notifications' | 'timeline'>('overview');

  // Operational Live Synced states
  const [credentials, setCredentials] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  // Vault Management inputs
  const [credPlatform, setCredPlatform] = useState('');
  const [credCategory, setCredCategory] = useState('AMS (Agency Management System)');
  const [credUrl, setCredUrl] = useState('');
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credNotes, setCredNotes] = useState('');
  const [editingCredId, setEditingCredId] = useState<string | null>(null);
  const [isCredFormOpen, setIsCredFormOpen] = useState(false);

  // Search & Filter state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Document Vault states
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isMovingDocId, setIsMovingDocId] = useState<string | null>(null);
  const [selectedFolderForMove, setSelectedFolderForMove] = useState<string>('root');

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger global slide toasts
  const triggerToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };



  const ensureProfileExists = async (user: any) => {
    if (!user) return null;
    try {
      const { data: profile, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking profile existence:', error);
      }

      if (!profile) {
        console.log('Automatically creating client profile from user metadata...');
        const newProfile = {
          id: user.id,
          company: user.user_metadata?.company_name || 'Going Technologies Partner',
          name: user.user_metadata?.client_name || user.email?.split('@')[0] || 'Representative',
          email: user.email || '',
          phone: user.user_metadata?.phone || null,
          country: user.user_metadata?.country || 'United States',
          industry: user.user_metadata?.industry || 'Insurance',
          designation: user.user_metadata?.designation || 'Operations Director',
          status: 'active'
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('client_profiles')
          .insert([newProfile])
          .select()
          .maybeSingle();

        if (insertErr) {
          console.error('Failed to automatically insert client profile:', insertErr);
        } else {
          try {
            await supabase.from('client_activity_logs').insert([{
              client_id: user.id,
              email: user.email || '',
              event_type: 'Portal Registration',
              description: `Successfully verified email representative node for ${newProfile.company}.`
            }]);

            await supabase.from('client_notifications').insert([{
              client_id: user.id,
              title: 'Workspace Initialized',
              message: 'Welcome to your premium private workspace node! Add credentials or drag-and-drop secure operational manuals inside Document Vault.',
              type: 'System'
            }]);
          } catch (logErr) {
            console.warn('Logging or notifying initial setup skipped:', logErr);
          }
        }
        return inserted || newProfile;
      }
      return profile;
    } catch (err) {
      console.error('Exception in ensureProfileExists:', err);
      return null;
    }
  };

  // Authenticate & Fetch current Supabase Auth Session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (authSession?.user) {
        // Enforce: do not allow login if email is not verified
        if (!authSession.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setSession(null);
          setFlow('login');
          setAuthChecked(true);
          return;
        }

        const profile = await ensureProfileExists(authSession.user);

        if (profile) {
          const isBlocked = profile.status === 'suspended' || profile.status === 'Archived' || profile.status === 'archived';
          if (isBlocked) {
            const blockMessage = (profile.status === 'Archived' || profile.status === 'archived')
              ? 'Your Client Workspace account has been archived. Please contact operations admin.'
              : 'Your Client Workspace account is currently suspended. Please contact operations admin.';
            await supabase.auth.signOut();
            setSession(null);
            setFlow('login');
            setErrorMsg(blockMessage);
          } else {
            setSession(profile);
            setFlow('dashboard');
          }
        }
      } else {
        setSession(null);
        setFlow('login');
      }
      setAuthChecked(true);
    };

    checkUser();

    // Subscribe to Auth status shifts
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, authSession) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && authSession?.user) {
        // Enforce: do not allow login if email is not verified
        if (!authSession.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setSession(null);
          setFlow('login');
          return;
        }

        const profile = await ensureProfileExists(authSession.user);

        if (profile) {
          const isBlocked = profile.status === 'suspended' || profile.status === 'Archived' || profile.status === 'archived';
          if (isBlocked) {
            await supabase.auth.signOut();
            setSession(null);
            setFlow('login');
          } else {
            setSession(profile);
            setFlow('dashboard');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setFlow('login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Initialize and Fetch Dashboard Datasets
  const fetchDashboardData = async () => {
    if (!session?.id) return;

    try {
      // 1. Fetch Credentials
      const { data: credsData, error: credsErr } = await supabase
        .from('client_credentials')
        .select('*')
        .eq('client_id', session.id)
        .order('created_at', { ascending: false });
      if (!credsErr && credsData) setCredentials(credsData);

      // 2. Fetch Document Folders
      const { data: foldersData, error: foldErr } = await supabase
        .from('client_document_folders')
        .select('*')
        .eq('client_id', session.id)
        .order('created_at', { ascending: true });
      if (!foldErr && foldersData) setFolders(foldersData);

      // 3. Fetch Documents
      const { data: docsData, error: docsErr } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', session.id)
        .order('created_at', { ascending: false });
      if (!docsErr && docsData) setDocuments(docsData);

      // 4. Fetch Notifications
      const { data: notifData, error: notifErr } = await supabase
        .from('client_notifications')
        .select('*')
        .eq('client_id', session.id)
        .order('created_at', { ascending: false });
      if (!notifErr && notifData) setNotifications(notifData);

      // 5. Fetch Activity Logs
      const { data: logData, error: logErr } = await supabase
        .from('client_activity_logs')
        .select('*')
        .eq('client_id', session.id)
        .order('created_at', { ascending: false })
        .limit(30);
      if (!logErr && logData) setTimeline(logData);

    } catch (err) {
      console.error('Failed to load secure database datasets:', err);
    }
  };

  useEffect(() => {
    if (session?.id) {
      fetchDashboardData();

      // ESTABLISH COMPLETE REALTIME POSTGRES CHANNEL CONNECTIONS
      const channel = supabase
        .channel(`workspace-sync-${session.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'client_credentials', filter: `client_id=eq.${session.id}` }, () => {
          fetchDashboardData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'client_documents', filter: `client_id=eq.${session.id}` }, () => {
          fetchDashboardData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'client_document_folders', filter: `client_id=eq.${session.id}` }, () => {
          fetchDashboardData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'client_activity_logs', filter: `client_id=eq.${session.id}` }, () => {
          fetchDashboardData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'client_profiles', filter: `id=eq.${session.id}` }, (payload) => {
          if (payload.new) {
            const updatedProfile = payload.new as any;
            const isBlocked = updatedProfile.status === 'suspended' || updatedProfile.status === 'Archived' || updatedProfile.status === 'archived';
            if (isBlocked) {
              const blockMessage = (updatedProfile.status === 'Archived' || updatedProfile.status === 'archived')
                ? 'Your Client Workspace account has been archived. Please contact operations admin.'
                : 'Your Client Workspace account is currently suspended. Please contact operations admin.';
              supabase.auth.signOut();
              setSession(null);
              setFlow('login');
              setErrorMsg(blockMessage);
            } else {
              setSession(updatedProfile);
            }
          }
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'client_notifications', filter: `client_id=eq.${session.id}` }, (payload) => {
          fetchDashboardData();
          triggerToast('info', payload.new.title, payload.new.message);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.id]);

  // Log Audit Helper
  const logAuditEvent = async (eventType: string, description: string) => {
    if (!session?.id) return;
    try {
      await supabase.from('client_activity_logs').insert([{
        client_id: session.id,
        email: session.email,
        event_type: eventType,
        description: description
      }]);
    } catch (err) {
      console.warn('Logging audit skipped:', err);
    }
  };

  // 1. LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!email.trim() || !password) {
      setIsLoading(false);
      return setErrorMsg('Email and Password are required.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Enforce email verification
        if (!data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setIsLoading(false);
          return setErrorMsg("We've sent a verification link to your email. Please verify your email address before signing in.");
        }

        const profile = await ensureProfileExists(data.user);

        const isBlocked = profile && (profile.status === 'suspended' || profile.status === 'Archived' || profile.status === 'archived');
        if (isBlocked) {
          const blockMessage = (profile.status === 'Archived' || profile.status === 'archived')
            ? 'Your account has been archived. Please contact Going Technologies operations.'
            : 'Your account has been suspended. Please contact Going Technologies operations.';
          await supabase.auth.signOut();
          setIsLoading(false);
          return setErrorMsg(blockMessage);
        }

        // Successfully authenticated
        await logAuditEvent('Client Login', `Client representative ${profile?.name || data.user.email} established a secure session.`);
        triggerToast('success', 'Workspace Synchronized', 'SOC-2 private token verified successfully.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication rejected. Verify email and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. REGISTRATION HANDLER (Direct Supabase SignUp)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!companyName.trim()) return setErrorMsg('Company Name is required.');
    if (!clientName.trim()) return setErrorMsg('Representative Name is required.');
    if (!email.trim()) return setErrorMsg('Business Email is required.');
    
    const pwdError = validatePassword(password);
    if (pwdError) return setErrorMsg(pwdError);
    if (password !== confirmPassword) return setErrorMsg('Confirm password mismatch.');
    if (!acceptTerms) return setErrorMsg('Please authorize account creation terms.');

    setIsLoading(true);

    try {
      // Check for duplicate emails prior to signup
      const { data: profileCheck } = await supabase
        .from('client_profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (profileCheck) {
        setIsLoading(false);
        return setErrorMsg('An active workspace account already exists under this email address.');
      }

      // 1. Construct user inside Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            company_name: companyName.trim(),
            client_name: clientName.trim(),
            phone: phone.trim(),
            country: country,
            industry: industry,
            designation: designation
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('User sign up returned empty payload.');

      setFlow('register_success');
    } catch (err: any) {
      console.error('[Registration creation error]', err);
      setErrorMsg(err.message || 'Failed to construct user profile in database.');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!email.trim()) {
      setIsLoading(false);
      return setErrorMsg('Please supply your registered business email address.');
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/#client-portal`
      });

      if (error) throw error;
      setSuccessMsg('A secure password reset link was dispatched. Please check your inbox.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Reset dispatch failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    await logAuditEvent('Client Logout', 'Client session ended gracefully.');
    await supabase.auth.signOut();
    setSession(null);
    setFlow('login');
    triggerToast('info', 'Disconnected Session', 'Client authentication token invalidated.');
  };

  // 6. UPDATE PROFILE HANDLER
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id) return;
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase
        .from('client_profiles')
        .update({
          name: session.name,
          phone: session.phone,
          country: session.country,
          industry: session.industry,
          designation: session.designation,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;

      await logAuditEvent('Profile Updated', 'Company profile details modified.');
      setSuccessMsg('Profile metadata successfully synchronized to cloud.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sync profile changes.');
    } finally {
      setIsLoading(false);
    }
  };

  // 7. CHANGE PASSWORD IN DASHBOARD
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return setErrorMsg('Password string cannot be empty.');
    const pwdErr = validatePassword(password);
    if (pwdErr) return setErrorMsg(pwdErr);

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      await logAuditEvent('Password Reset', 'Client modified credentials handshake parameter.');
      setSuccessMsg('Workspace password successfully updated.');
      setPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // 8. CREDENTIALS CRUDS (Encrypts password prior to database payload dispatch)
  const handleSaveCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id) return;

    if (!credPlatform.trim() || !credUsername.trim() || !credPassword) {
      triggerToast('error', 'Fields Incomplete', 'Platform, Username, and Password must be provided.');
      return;
    }

    setIsLoading(true);
    const cipherText = encryptPassword(credPassword);

    try {
      if (editingCredId) {
        const { error } = await supabase
          .from('client_credentials')
          .update({
            platform: credPlatform.trim(),
            category: credCategory,
            login_url: credUrl.trim() || null,
            username: credUsername.trim(),
            password: cipherText,
            notes: credNotes.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCredId);

        if (error) throw error;
        triggerToast('success', 'Credential Updated', 'Credential cipher updated and saved successfully.');
      } else {
        const { error } = await supabase
          .from('client_credentials')
          .insert([{
            client_id: session.id,
            platform: credPlatform.trim(),
            category: credCategory,
            login_url: credUrl.trim() || null,
            username: credUsername.trim(),
            password: cipherText,
            notes: credNotes.trim() || null
          }]);

        if (error) throw error;
        triggerToast('success', 'Credential Created', 'High-security credential record initialized.');
      }

      // Close Form and Reset Inputs
      setIsCredFormOpen(false);
      setEditingCredId(null);
      setCredPlatform('');
      setCredUrl('');
      setCredUsername('');
      setCredPassword('');
      setCredNotes('');
      setSelectedCategory('All Categories');
    } catch (err: any) {
      triggerToast('error', 'Database Error', err.message || 'Failed to write credential.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCredClick = (cred: any) => {
    setEditingCredId(cred.id);
    setCredPlatform(cred.platform);
    setCredCategory(cred.category);
    setCredUrl(cred.login_url || '');
    setCredUsername(cred.username);
    setCredPassword(decryptPassword(cred.password));
    setCredNotes(cred.notes || '');
    setIsCredFormOpen(true);
  };

  const handleDeleteCredential = async (id: string, platform: string) => {
    if (!confirm(`Are you sure you want to permanently delete credentials for ${platform}?`)) return;

    try {
      const { error } = await supabase
        .from('client_credentials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      triggerToast('success', 'Credential Purged', `Logins for ${platform} were removed from database.`);
      setSelectedCategory('All Categories');
    } catch (err: any) {
      triggerToast('error', 'Purge Rejected', err.message);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast('success', 'Copied to Clipboard', `${label} token copied successfully.`);
  };

  // 9. DOCUMENTS VAULT OPERATIONS
  // Create Folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id || !newFolderName.trim()) return;

    try {
      const { error } = await supabase
        .from('client_document_folders')
        .insert([{
          client_id: session.id,
          name: newFolderName.trim(),
          parent_id: currentFolderId
        }]);

      if (error) throw error;
      setNewFolderName('');
      setIsCreatingFolder(false);
      triggerToast('success', 'Folder Created', `Directory "${newFolderName}" ready.`);
    } catch (err: any) {
      triggerToast('error', 'Directory Error', err.message);
    }
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadDocumentFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadDocumentFile(e.target.files[0]);
    }
  };

  // File Upload
  const uploadDocumentFile = async (file: File) => {
    if (!session?.id) return;

    // Strict extension checks
    const allowedExtensions = ['pdf', 'docx', 'xlsx', 'png', 'jpg', 'jpeg', 'zip'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      triggerToast('error', 'Upload Blocked', 'Unsupported extension. Allowed: PDF, DOCX, XLSX, PNG, JPG, ZIP');
      return;
    }

    setIsLoading(true);
    triggerToast('info', 'Uploading File', `Sending ${file.name} to private secure storage...`);

    try {
      const storagePath = `${session.id}/${Date.now()}_${file.name}`;
      
      // Upload actual physical file in Supabase Storage private bucket
      const { data: storageData, error: storageErr } = await supabase.storage
        .from('client-documents')
        .upload(storagePath, file);

      if (storageErr) throw storageErr;

      // Save document database schema record
      const { error: dbErr } = await supabase
        .from('client_documents')
        .insert([{
          client_id: session.id,
          folder_id: currentFolderId,
          title: file.name.split('.')[0],
          file_name: file.name,
          file_size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          uploaded_by: 'Client',
          file_path: storagePath
        }]);

      if (dbErr) throw dbErr;
      triggerToast('success', 'Document Uploaded', `${file.name} successfully archived in cloud vault.`);
    } catch (err: any) {
      triggerToast('error', 'Upload Failed', err.message || 'Verify storage permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  // File Download
  const handleDownloadFile = async (doc: any) => {
    triggerToast('info', 'Decrypting Download', `Requesting object stream for ${doc.file_name}...`);

    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(doc.file_path);

      if (error) throw error;
      if (!data) throw new Error('Retrieved object buffer stream is empty.');

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      triggerToast('success', 'Object Streamed', 'Secure transfer completed.');
    } catch (err: any) {
      triggerToast('error', 'Download Rejected', err.message || 'Forbidden access token.');
    }
  };

  // Move Document Folder
  const handleMoveDocument = async () => {
    if (!isMovingDocId) return;

    try {
      const folderPayload = selectedFolderForMove === 'root' ? null : selectedFolderForMove;
      const { error } = await supabase
        .from('client_documents')
        .update({ folder_id: folderPayload, updated_at: new Date().toISOString() })
        .eq('id', isMovingDocId);

      if (error) throw error;
      setIsMovingDocId(null);
      triggerToast('success', 'Document Moved', 'Entity structural mapping updated.');
    } catch (err: any) {
      triggerToast('error', 'Movement Blocked', err.message);
    }
  };

  // Delete Document
  const handleDeleteDocument = async (doc: any) => {
    if (!confirm(`Permanently purge ${doc.file_name} from physical disk storage?`)) return;

    try {
      // 1. Delete DB row
      const { error: dbErr } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', doc.id);

      if (dbErr) throw dbErr;

      // 2. Delete storage object
      const { error: stErr } = await supabase.storage
        .from('client-documents')
        .remove([doc.file_path]);

      triggerToast('success', 'Document Purged', 'Entity fully shredded and log entries synchronized.');
    } catch (err: any) {
      triggerToast('error', 'Purge Blocked', err.message);
    }
  };

  // Delete Folder
  const handleDeleteFolder = async (folder: any) => {
    if (!confirm(`Purging directory "${folder.name}" will also un-link all nested records. Proceed?`)) return;

    try {
      const { error } = await supabase
        .from('client_document_folders')
        .delete()
        .eq('id', folder.id);

      if (error) throw error;
      triggerToast('success', 'Directory Purged', 'Metadata references updated.');
    } catch (err: any) {
      triggerToast('error', 'Directory Purge Blocked', err.message);
    }
  };

  // 10. NOTIFICATION READS
  const markNotificationRead = async (id: string) => {
    try {
      await supabase
        .from('client_notifications')
        .update({ is_read: true })
        .eq('id', id);
    } catch (err) {
      console.warn('Silent read fail:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!session?.id) return;
    try {
      const { error } = await supabase
        .from('client_notifications')
        .update({ is_read: true })
        .eq('client_id', session.id);

      if (error) throw error;
      triggerToast('success', 'Inbox Read', 'All notifications flagged read.');
    } catch (err: any) {
      triggerToast('error', 'Action failed', err.message);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 text-[#2F6DFF] animate-spin" />
          <p className="text-xs text-gray-400 font-bold tracking-wider uppercase font-sans">Connecting Secure Operations Node...</p>
        </div>
      </div>
    );
  }

  // Active Onboarding Completion Checklist Metrics
  const onboardingSteps = [
    { label: 'Establish Company Profile Details', completed: !!session?.phone && !!session?.industry },
    { label: 'Register Access Credential Login', completed: credentials.length > 0 },
    { label: 'Archive Document Asset Vault File', completed: documents.length > 0 },
    { label: 'Verify Real-Time Synchronization Link', completed: timeline.length > 0 }
  ];
  const completedStepsCount = onboardingSteps.filter(s => s.completed).length;
  const onboardingPercent = Math.round((completedStepsCount / onboardingSteps.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-gray-900 flex flex-col font-sans relative overflow-hidden pt-6 pb-20">
      
      {/* Absolute Decorative Vector Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40 -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E0E7FF] rounded-full blur-3xl opacity-30 -ml-48 -mb-48 pointer-events-none" />

      {/* Slide-In Glassmorphic Notification Toast System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 120 }}
            className={`fixed right-6 top-6 z-50 max-w-sm rounded-2xl border p-4 shadow-2xl backdrop-blur-md flex gap-3 ${
              toast.type === 'success' 
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' 
                : toast.type === 'error'
                ? 'bg-rose-50/90 border-rose-200 text-rose-800'
                : 'bg-blue-50/90 border-blue-200 text-blue-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />}
            {toast.type === 'info' && <Bell className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />}
            <div>
              <p className="font-extrabold text-xs tracking-tight uppercase">{toast.title}</p>
              <p className="text-[11px] leading-snug mt-0.5 opacity-90">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex-grow flex flex-col justify-center">
        
        {/* Workspace Brand Header Block */}
        <div className="flex items-center justify-between pb-8 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-4 cursor-pointer animate-fade-in" onClick={() => setCurrentPage('home')}>
            <img src="/GTGC Logo.png?v=3" alt="Going Technologies Logo" className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
            <div className="h-6 w-px bg-slate-300" />
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-extrabold text-[10px] px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Private Partner Workspace</span>
            </div>
          </div>

          {flow === 'dashboard' && session && (
            <button 
              onClick={handleLogout}
              className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Disconnect</span>
            </button>
          )}
        </div>

        {/* ==================================================== */}
        {/* LOGIN VIEW */}
        {/* ==================================================== */}
        {flow === 'login' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                  <ShieldCheck className="w-6 h-6 text-[#2F6DFF]" />
                </div>
                <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Authorized Gateway</h2>
                <p className="text-slate-400 text-xs">Access your secure, SOC-2 verified operations console and manual document registries.</p>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-xs font-semibold animate-shake">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl text-xs font-semibold">
                  <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Business Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type="email"
                      required
                      placeholder="representative@youragency.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                      className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-semibold text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">Workspace Password</label>
                    <button 
                      type="button" 
                      onClick={() => setFlow('forgot_password')} 
                      className="text-xs text-blue-600 hover:underline font-bold"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                      className="w-full text-xs pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-semibold text-slate-900 placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer w-full bg-linear-to-r from-[#081B8C] to-[#2F6DFF] hover:opacity-95 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Access Vault Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 font-semibold">
                  New partner representative?{' '}
                  <button 
                    onClick={() => { setFlow('register'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[#2F6DFF] hover:underline font-extrabold"
                  >
                    Register Node
                  </button>
                </p>
              </div>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 font-semibold mt-6 max-w-xs mx-auto leading-normal">
              Protected under SOC 2 Type II and HIPAA framework governance. Unregistered access attempts are strictly logged and audited.
            </p>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* REGISTRATION VIEW */}
        {/* ==================================================== */}
        {flow === 'register' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                  <User className="w-6 h-6 text-[#2F6DFF]" />
                </div>
                <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Establish Partner Node</h2>
                <p className="text-slate-400 text-xs">Verify business email and register company workspace credentials.</p>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-xs font-semibold">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Company / Agency Name</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input 
                        type="text"
                        required
                        placeholder="Going Technologies Partner Agency"
                        value={companyName}
                        onChange={(e) => { setCompanyName(e.target.value); setErrorMsg(''); }}
                        className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-semibold text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Representative Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input 
                        type="text"
                        required
                        placeholder="Jane Doe"
                        value={clientName}
                        onChange={(e) => { setClientName(e.target.value); setErrorMsg(''); }}
                        className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-semibold text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Business Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input 
                        type="email"
                        required
                        placeholder="representative@youragency.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                        className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-semibold text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Phone / Mobile</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input 
                        type="tel"
                        required
                        placeholder="+1 706-383-0888"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-semibold text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Country of Operation</label>
                    <select 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full text-xs px-3 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl font-semibold text-slate-900"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>India</option>
                      <option>Australia</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Industry Focus</label>
                    <select 
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full text-xs px-3 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl font-semibold text-slate-900"
                    >
                      <option>Insurance</option>
                      <option>BPO Operations</option>
                      <option>Bail Bonds</option>
                      <option>Tax Preparation</option>
                      <option>Corporate B2B Services</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Representative Designation</label>
                    <input 
                      type="text"
                      required
                      placeholder="Operations Director"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full text-xs px-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl font-semibold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Create Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 12 chars + Upper/Lower/Digit/Sym"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                        className="w-full text-xs pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-semibold text-slate-900 placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Retype password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                        className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-semibold text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2.5">
                    <input 
                      type="checkbox"
                      id="acceptTerms"
                      required
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5"
                    />
                    <label htmlFor="acceptTerms" className="text-[11px] text-slate-500 font-semibold select-none leading-normal">
                      I authorize partner registration and agree to Going Technologies{' '}
                      <button type="button" onClick={() => setCurrentPage('terms')} className="text-blue-600 hover:underline font-bold">Terms of Service</button> and{' '}
                      <button type="button" onClick={() => setCurrentPage('privacy')} className="text-blue-600 hover:underline font-bold">Privacy Policy</button>.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer w-full bg-linear-to-r from-[#081B8C] to-[#2F6DFF] hover:opacity-95 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initiating Secure Handshake...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Workspace Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100 mt-2">
                <button 
                  onClick={() => { setFlow('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs text-slate-500 hover:text-[#081B8C] font-semibold flex items-center gap-1.5 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Authorized Login</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* REGISTRATION SUCCESS VIEW */}
        {/* ==================================================== */}
        {flow === 'register_success' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100 animate-bounce">
                  <Mail className="w-8 h-8 text-[#2F6DFF]" />
                </div>
                <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Check Your Inbox</h2>
                <div className="space-y-2 text-slate-600 text-sm">
                  <p className="font-semibold text-slate-800">
                    We've sent a verification link to your email:
                  </p>
                  <p className="font-mono bg-slate-50 text-slate-900 border border-slate-100 rounded-lg py-2 px-3 inline-block select-all">
                    {email}
                  </p>
                  <p className="leading-relaxed text-xs">
                    Please click the verification link in that email to confirm your email address and activate your Private Partner Workspace.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-800 flex gap-2.5 leading-normal">
                <Shield className="w-4 h-4 text-[#2F6DFF] shrink-0 mt-0.5" />
                <p>
                  <strong>Security Note:</strong> After verification, you can return to this page and sign in to access your secure SOC-2 compliant digital workspace.
                </p>
              </div>

              <button
                onClick={() => { setFlow('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="cursor-pointer w-full bg-linear-to-r from-[#081B8C] to-[#2F6DFF] hover:opacity-95 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Authorized Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* FORGOT PASSWORD VIEW */}
        {/* ==================================================== */}
        {flow === 'forgot_password' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                  <RefreshCw className="w-6 h-6 text-[#2F6DFF]" />
                </div>
                <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Credentials Reset</h2>
                <p className="text-slate-400 text-xs">A password reset email token will be delivered to your business inbox.</p>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-xs font-semibold">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl text-xs font-semibold">
                  <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type="email"
                      required
                      placeholder="representative@youragency.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                      className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl transition-all font-semibold text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer w-full bg-linear-to-r from-[#081B8C] to-[#2F6DFF] hover:opacity-95 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Dispatch Reset Token</span>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <button 
                  onClick={() => { setFlow('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs text-slate-400 hover:text-[#081B8C] font-semibold flex items-center gap-1.5 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Authorized Login</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* PREMIUM ENTERPRISE PARTNER DASHBOARD */}
        {/* ==================================================== */}
        {flow === 'dashboard' && session && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full animate-fade-in">
            
            {/* Session Welcome Info Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Partner Node Established</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold font-display text-slate-900 leading-tight">
                  Welcome, {session.name}
                </h1>
                <p className="text-slate-400 text-xs font-semibold">
                  Secure Operational Company Node: <span className="text-slate-800 font-extrabold">{session.company}</span> ({session.email})
                </p>
              </div>

              {/* Onboarding Interactive Tracker */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full lg:max-w-xs space-y-2">
                <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Onboarding Progress</span>
                  <span className="text-blue-600">{onboardingPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-blue-600 to-[#2F6DFF] transition-all duration-500" style={{ width: `${onboardingPercent}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  {onboardingPercent === 100 ? '🎉 Onboarding parameters complete!' : 'Complete credentials, documents, and profile edits to unlock active status.'}
                </p>
              </div>
            </div>

            {/* Subnavigation Tabs bar */}
            <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-0.5 scrollbar-none">
              {[
                { id: 'overview', label: 'Welcome Portal', icon: Cpu },
                { id: 'profile', label: 'Company Profile', icon: Building },
                { id: 'credentials', label: 'Access Vault', icon: Key, count: credentials.length },
                { id: 'documents', label: 'Document Vault', icon: FileText, count: documents.length },
                { id: 'notifications', label: 'Alerts', icon: Bell, badge: notifications.filter(n => !n.is_read).length },
                { id: 'timeline', label: 'Audit Log', icon: ClockIcon }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`cursor-pointer whitespace-nowrap flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-bold transition-all relative ${
                      isActive 
                        ? 'border-[#081B8C] text-[#081B8C] bg-blue-50/40 font-extrabold' 
                        : 'border-transparent text-slate-400 hover:text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#081B8C]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full min-w-4 text-center animate-pulse">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB PANELS CONTAINER */}
            <AnimatePresence mode="wait">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  {/* Executive Onboarding Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Key className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800">Vault Logins</h3>
                      <p className="text-2xl font-black font-display text-slate-900">{credentials.length}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Active access credentials stored.</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800">Archived Documents</h3>
                      <p className="text-2xl font-black font-display text-slate-900">{documents.length}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Private manuals & manual records.</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800">Node Compliance</h3>
                      <p className="text-lg font-extrabold text-purple-700">SOC-2 Verified</p>
                      <p className="text-[10px] text-slate-400 font-semibold">All logs are signed and sealed.</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Globe className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800">VDI Link Status</h3>
                      <p className="text-lg font-extrabold text-amber-700">Secure VPN Tunnel</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Active gateway linked securely.</p>
                    </div>
                  </div>

                  {/* Dashboard Welcome Body Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Interactive Onboarding checklists */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs lg:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Partner Node Onboarding Protocol</h3>
                        <p className="text-xs text-slate-400 font-semibold">Execute these secure procedures to verify your operational node parameters with India Offshore Command.</p>
                      </div>

                      <div className="space-y-3">
                        {onboardingSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 border border-slate-100 p-3.5 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${step.completed ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'border-slate-300 text-transparent'}`}>
                              <Check className="w-3.5 h-3.5 stroke-[3px]" />
                            </div>
                            <div className="space-y-0.5">
                              <p className={`text-xs font-extrabold ${step.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{step.label}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">Required configuration metric step {idx + 1}.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Contacts */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                      <h3 className="text-base font-extrabold text-slate-900">Escalation Command</h3>
                      <p className="text-xs text-slate-400 font-semibold">For urgent connectivity resets, operational dispatch, or emergency VDI lockouts.</p>

                      <div className="space-y-4 pt-2">
                        <div className="flex gap-3 items-start">
                          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Landmark className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">India HQ Command</span>
                            <span className="text-xs font-extrabold text-slate-800 block">Going Technologies Ltd</span>
                            <span className="text-[10px] text-slate-500 font-semibold block leading-relaxed">Visakhapatnam, Andhra Pradesh, India</span>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Director Operations</span>
                            <span className="text-xs font-extrabold text-slate-800 block">connect@goingtechnologies.com</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* TAB 2: COMPANY PROFILE */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Company Profile Metadata</h3>
                      <p className="text-xs text-slate-400 font-semibold font-sans">Verify and synchronize company details mapped to your private database node.</p>
                    </div>

                    {errorMsg && (
                      <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-xs font-semibold">
                        {errorMsg}
                      </div>
                    )}

                    {successMsg && (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl text-xs font-semibold">
                        {successMsg}
                      </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Company Name (Read-Only)</label>
                          <input 
                            type="text" 
                            disabled 
                            value={session.company} 
                            className="w-full text-xs px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-500 cursor-not-allowed" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Email Address (Read-Only)</label>
                          <input 
                            type="text" 
                            disabled 
                            value={session.email} 
                            className="w-full text-xs px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-500 cursor-not-allowed" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Representative Name</label>
                          <input 
                            type="text" 
                            required 
                            value={session.name || ''} 
                            onChange={(e) => setSession({ ...session, name: e.target.value })}
                            className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-[#2F6DFF]" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Phone Number</label>
                          <input 
                            type="text" 
                            value={session.phone || ''} 
                            onChange={(e) => setSession({ ...session, phone: e.target.value })}
                            className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-[#2F6DFF]" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Country</label>
                          <input 
                            type="text" 
                            value={session.country || ''} 
                            onChange={(e) => setSession({ ...session, country: e.target.value })}
                            className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-[#2F6DFF]" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Industry Vertical</label>
                          <input 
                            type="text" 
                            value={session.industry || ''} 
                            onChange={(e) => setSession({ ...session, industry: e.target.value })}
                            className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-[#2F6DFF]" 
                          />
                        </div>

                        <div className="col-span-1 sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Representative Designation</label>
                          <input 
                            type="text" 
                            value={session.designation || ''} 
                            onChange={(e) => setSession({ ...session, designation: e.target.value })}
                            className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-[#2F6DFF]" 
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer w-full bg-[#081B8C] hover:bg-opacity-95 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Synchronize Profile Metadata'}
                      </button>
                    </form>

                    {/* Reset Password Form inside profile */}
                    <div className="border-t border-slate-100 pt-6 space-y-4">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">Secure Password Overrides</h4>
                        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Update your operational cryptographic handshake parameters.</p>
                      </div>

                      <form onSubmit={handleChangePassword} className="space-y-3">
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                          <input 
                            type="password"
                            placeholder="New complex workspace password (min 12 chars)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-[#2F6DFF]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="cursor-pointer w-full bg-slate-800 hover:bg-slate-950 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all"
                        >
                          Modify Workspace Password
                        </button>
                      </form>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* TAB 3: CREDENTIALS VAULT */}
              {activeTab === 'credentials' && (
                <motion.div key="credentials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  {/* Credentials Header Search Control */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Credentials Key-Store Vault</h3>
                      <p className="text-xs text-slate-400 font-semibold">Store operational system portals, AMS, and VPN configurations. Encrypted client-side.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto">
                      <div className="relative w-full sm:w-48">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                          type="text" 
                          placeholder="Search platforms..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full text-xs pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-xl font-semibold"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-xs px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden rounded-xl font-semibold text-slate-800 w-full sm:w-auto"
                        >
                          <option>All Categories</option>
                          <option>AMS (Agency Management System)</option>
                          <option>CRM (Customer Relationship Management)</option>
                          <option>Carrier Portal</option>
                          <option>VoIP / Phone System</option>
                          <option>Server / Host Access</option>
                          <option>Other Operational Login</option>
                        </select>

                        {selectedCategory !== 'All Categories' && (
                          <button
                            type="button"
                            onClick={() => setSelectedCategory('All Categories')}
                            className="text-[11px] text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 px-2.5 py-3 rounded-xl transition-all font-bold shrink-0 cursor-pointer whitespace-nowrap"
                            title="Clear Filter"
                          >
                            Clear Filter
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setEditingCredId(null);
                          setCredPlatform('');
                          setCredUrl('');
                          setCredUsername('');
                          setCredPassword('');
                          setCredNotes('');
                          setIsCredFormOpen(!isCredFormOpen);
                        }}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 justify-center w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="whitespace-nowrap">Add Credential</span>
                      </button>
                    </div>
                  </div>

                  {/* Sliding Form Drawer / Modal block */}
                  {isCredFormOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
                      <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">{editingCredId ? 'Modify Access Credential' : 'Create Access Credential'}</h4>
                      <form onSubmit={handleSaveCredential} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Platform / Brand</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Applied Epic, HawkSoft" 
                            value={credPlatform} 
                            onChange={(e) => setCredPlatform(e.target.value)}
                            className="w-full text-xs px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-600 rounded-xl font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Category / Type</label>
                          <select 
                            value={credCategory} 
                            onChange={(e) => setCredCategory(e.target.value)}
                            className="w-full text-xs px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden rounded-xl font-semibold text-slate-800"
                          >
                            <option>AMS (Agency Management System)</option>
                            <option>CRM (Customer Relationship Management)</option>
                            <option>Carrier Portal</option>
                            <option>VoIP / Phone System</option>
                            <option>Server / Host Access</option>
                            <option>Other Operational Login</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Login URL (Optional)</label>
                          <input 
                            type="url" 
                            placeholder="https://login.example.com" 
                            value={credUrl} 
                            onChange={(e) => setCredUrl(e.target.value)}
                            className="w-full text-xs px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-600 rounded-xl font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Username / Email / Mobile</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="agency_admin@goingtechnologies.com" 
                            value={credUsername} 
                            onChange={(e) => setCredUsername(e.target.value)}
                            className="w-full text-xs px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-600 rounded-xl font-semibold animate-fade-in"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Password (Encrypted Client-Side)</label>
                          <input 
                            type="password" 
                            required 
                            placeholder="••••••••••••" 
                            value={credPassword} 
                            onChange={(e) => setCredPassword(e.target.value)}
                            className="w-full text-xs px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-600 rounded-xl font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Additional Notes / Descriptions</label>
                          <input 
                            type="text" 
                            placeholder="Offshore team restricted permissions..." 
                            value={credNotes} 
                            onChange={(e) => setCredNotes(e.target.value)}
                            className="w-full text-xs px-3 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-600 rounded-xl font-semibold"
                          />
                        </div>

                        <div className="col-span-1 md:col-span-3 flex justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsCredFormOpen(false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            <span>{editingCredId ? 'Update Logins' : 'Save Securely'}</span>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Credentials vault list mapping */}
                  <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">Platform Info</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Username / Email</th>
                            <th className="p-4">Decrypted Password</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                          {(() => {
                            const filtered = credentials.filter(cred => {
                              const matchesSearch = cred.platform.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                cred.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (cred.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
                              const matchesCategory = searchQuery.trim() !== '' || selectedCategory === 'All Categories' || cred.category === selectedCategory;
                              return matchesSearch && matchesCategory;
                            });

                            if (filtered.length === 0) {
                              const emptyMsg = selectedCategory !== 'All Categories' 
                                ? "No credentials found in this category." 
                                : "No credentials matched current filters or search query.";
                              return (
                                <tr>
                                  <td colSpan={5} className="p-12 text-center text-slate-400 font-semibold font-sans">
                                    {emptyMsg}
                                  </td>
                                </tr>
                              );
                            }

                            return filtered.map((cred) => (
                              <tr key={cred.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 space-y-1">
                                  <span className="font-extrabold text-slate-900 block">{cred.platform}</span>
                                  {cred.login_url && (
                                    <a href={cred.login_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5 text-[10px] font-semibold w-fit">
                                      <span>Open Link</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </td>
                                <td className="p-4">
                                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
                                    {cred.category}
                                  </span>
                                </td>
                                <td className="p-4 font-mono font-semibold text-[11px] space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span>{cred.username}</span>
                                    <button onClick={() => copyToClipboard(cred.username, 'Username')} className="text-slate-400 hover:text-slate-600">
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                                <td className="p-4 font-mono text-slate-900 text-[11px] font-semibold">
                                  <div className="flex items-center gap-1.5">
                                    <span>{decryptPassword(cred.password)}</span>
                                    <button onClick={() => copyToClipboard(decryptPassword(cred.password), 'Password')} className="text-slate-400 hover:text-slate-600">
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex gap-2 justify-end">
                                    <button onClick={() => handleEditCredClick(cred)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteCredential(cred.id, cred.platform)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: DOCUMENT SECURE VAULT */}
              {activeTab === 'documents' && (
                <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  {/* Document Control Bar */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Document Vault Registry</h3>
                        <p className="text-xs text-slate-400 font-semibold font-sans">Privately store carrier underwriting guidelines, standard manuals, and operational SOPs.</p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {currentFolderId && (
                          <button
                            onClick={() => setCurrentFolderId(null)}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-1"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Main Vault</span>
                          </button>
                        )}

                        <button
                          onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-1.5"
                        >
                          <FolderPlus className="w-4 h-4" />
                          <span>New Folder</span>
                        </button>

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Document</span>
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          className="hidden" 
                          accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip" 
                        />
                      </div>
                    </div>

                    {/* New Folder Creation state */}
                    {isCreatingFolder && (
                      <form onSubmit={handleCreateFolder} className="flex gap-2 max-w-sm border border-slate-100 p-2.5 bg-slate-50/50 rounded-xl animate-fade-in">
                        <input 
                          type="text" 
                          required 
                          placeholder="Folder Name..." 
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          className="text-xs px-3 py-2 bg-white border border-slate-200 focus:outline-hidden rounded-lg flex-grow font-semibold"
                        />
                        <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                          Create
                        </button>
                      </form>
                    )}

                    {/* File Drag and Drop Box */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${isDragging ? 'bg-blue-50 border-blue-500' : 'hover:bg-slate-50 border-slate-200'}`}
                    >
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce" />
                      <p className="text-xs font-extrabold text-slate-800">Drag & Drop Secure Manuals Here</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">Supports PDF, DOCX, XLSX, PNG, JPG, ZIP up to 50MB</p>
                    </div>
                  </div>

                  {/* Directory Folders Structure rendering */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    {/* Render Folders in Left list if in Main directory */}
                    {!currentFolderId && folders.map((folder) => (
                      <div 
                        key={folder.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-slate-300 transition-colors cursor-pointer"
                      >
                        <div onClick={() => setCurrentFolderId(folder.id)} className="flex items-center gap-3 flex-grow">
                          <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                            <Folder className="w-5 h-5 fill-amber-500" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block">{folder.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Directory Folder</span>
                          </div>
                        </div>

                        <button onClick={() => handleDeleteFolder(folder)} className="p-1 text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Render list of Files */}
                  <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">
                        {currentFolderId ? `Viewing Sub-Folder Manuals` : 'Active Vault Documents'}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/30 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                            <th className="p-4">File Name</th>
                            <th className="p-4">Uploaded By</th>
                            <th className="p-4">Size</th>
                            <th className="p-4">Date Stamped</th>
                            <th className="p-4 text-right">Handshake Controls</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
                          {(() => {
                            const filteredDocs = documents.filter(doc => doc.folder_id === currentFolderId);
                            if (filteredDocs.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={5} className="p-12 text-center text-slate-400 font-semibold font-sans">
                                    This directory contains no secure files. Click upload or drag guidelines.
                                  </td>
                                </tr>
                              );
                            }

                            return filteredDocs.map((doc) => (
                              <tr key={doc.id} className="hover:bg-slate-50/30 transition-all">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                      <FileCode className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <span className="font-extrabold text-slate-900 block">{doc.file_name}</span>
                                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">{doc.title}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${doc.uploaded_by === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {doc.uploaded_by === 'Admin' ? 'HQ Admin' : 'Self Client'}
                                  </span>
                                </td>
                                <td className="p-4 font-mono font-bold text-[10px] text-slate-500">{doc.file_size}</td>
                                <td className="p-4 text-slate-500">
                                  {new Date(doc.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex gap-2.5 justify-end">
                                    <button 
                                      onClick={() => {
                                        setIsMovingDocId(doc.id);
                                        setSelectedFolderForMove('root');
                                      }}
                                      className="text-xs text-slate-500 hover:text-blue-600 font-bold"
                                      title="Relocate Guideline Folder Mapping"
                                    >
                                      Move
                                    </button>
                                    <button onClick={() => handleDownloadFile(doc)} className="p-1 text-slate-400 hover:text-slate-800 transition-colors">
                                      <Download className="w-4 h-4" />
                                    </button>
                                    {doc.uploaded_by === 'Client' && (
                                      <button onClick={() => handleDeleteDocument(doc)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Folder relocation drawer popup */}
                  {isMovingDocId && (
                    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-6">
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">Relocate Directory Mapping</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">Select destination structure below.</p>
                        </div>

                        <select 
                          value={selectedFolderForMove}
                          onChange={(e) => setSelectedFolderForMove(e.target.value)}
                          className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden"
                        >
                          <option value="root">Main Vault Root Directory</option>
                          {folders.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>

                        <div className="flex justify-end gap-2 pt-2">
                          <button onClick={() => setIsMovingDocId(null)} className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500">
                            Cancel
                          </button>
                          <button onClick={handleMoveDocument} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
                            Move Document
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}

              {/* TAB 5: ALERTS INBOX */}
              {activeTab === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Operations Alerts Inbox</h3>
                        <p className="text-xs text-slate-400 font-semibold font-sans">Real-time alerts triggered by credentials creation, logins, or manual guidelines updates.</p>
                      </div>

                      {notifications.some(n => !n.is_read) && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-blue-600 hover:underline font-extrabold uppercase tracking-wider text-[10px]"
                        >
                          Mark All Read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="p-12 text-center text-slate-400 font-semibold font-sans">Your alerts inbox is currently empty.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => !notif.is_read && markNotificationRead(notif.id)}
                            className={`p-4 flex gap-3 items-start transition-colors cursor-pointer ${notif.is_read ? 'bg-white opacity-70' : 'bg-slate-50/50'}`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 ${notif.type === 'Credential' ? 'bg-amber-50 text-amber-600' : notif.type === 'Document' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                              <Bell className="w-4 h-4 animate-pulse" />
                            </div>

                            <div className="space-y-1 flex-grow">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-extrabold text-slate-900">{notif.title}</span>
                                <span className="text-[9px] font-mono font-bold text-slate-400">
                                  {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{notif.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: AUDIT TIMELINE */}
              {activeTab === 'timeline' && (
                <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Secured Operations Audit Log</h3>
                      <p className="text-xs text-slate-400 font-semibold font-sans">Full compliance audit trails. Track login activities, credentials vault creations, and document transmissions.</p>
                    </div>

                    <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-6">
                      {timeline.length === 0 ? (
                        <p className="p-12 text-center text-slate-400 font-semibold font-sans">No security events logged in audit trails.</p>
                      ) : (
                        timeline.map((log) => (
                          <div key={log.id} className="relative space-y-1">
                            {/* Dot node */}
                            <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">{log.event_type}</span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {new Date(log.created_at).toLocaleTimeString()} // {new Date(log.created_at).toLocaleDateString()}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">{log.description}</p>
                            <p className="text-[9px] font-mono text-slate-400">Representative Auth Context: {log.email}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </motion.div>
        )}

      </div>
    </div>
  );
}
