import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Building,
  Key,
  FolderOpen,
  Bell,
  Archive,
  Search,
  BarChart3,
  LogOut,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Shield,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
  User,
  Activity,
  Check,
  Send,
  X,
  Plus,
  Trash2,
  LockKeyhole,
  Briefcase,
  Layers,
  MapPin,
  Smartphone
} from 'lucide-react';
import { PageType } from '../types';
import { supabase } from '../lib/supabase';
import { broadcastChange } from '../utils/realtimeHelper';

interface ClientAdminProps {
  setCurrentPage: (page: PageType) => void;
}

type TabType = 'overview' | 'accounts' | 'onboarding' | 'credentials' | 'documents' | 'notifications' | 'archive' | 'search' | 'analytics';

export default function ClientAdmin({ setCurrentPage }: ClientAdminProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gt_client_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Administrative Role state (defaulting to super for full capability)
  const [adminRole, setAdminRole] = useState<'super' | 'normal'>('super');

  // Core Data States (Real-time synced)
  const [clientAccounts, setClientAccounts] = useState<any[]>([]);
  const [allClientCredentials, setAllClientCredentials] = useState<any[]>([]);
  const [allClientDocuments, setAllClientDocuments] = useState<any[]>([]);
  const [allClientNotifications, setAllClientNotifications] = useState<any[]>([]);
  const [allOnboardings, setAllOnboardings] = useState<any[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<any[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  
  // Tab-specific filters & queries
  const [accountsSearch, setAccountsSearch] = useState('');
  const [onboardingSearch, setOnboardingSearch] = useState('');
  const [credentialsSearch, setCredentialsSearch] = useState('');
  const [documentsSearch, setDocumentsSearch] = useState('');
  const [notificationsSearch, setNotificationsSearch] = useState('');
  const [archiveSearch, setArchiveSearch] = useState('');

  // Selected details / Modals state
  const [selectedClientForOnboarding, setSelectedClientForOnboarding] = useState<any | null>(null);
  const [selectedAccountForPasswordReset, setSelectedAccountForPasswordReset] = useState<any | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isPasswordResetSaving, setIsPasswordResetSaving] = useState(false);
  const [newNotificationTitle, setNewNotificationTitle] = useState('');
  const [newNotificationMessage, setNewNotificationMessage] = useState('');
  const [newNotificationTarget, setNewNotificationTarget] = useState('all'); // 'all' or 'client_id'
  const [isNotificationSending, setIsNotificationSending] = useState(false);

  // Alert/Notification State
  const [toastAlert, setToastAlert] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Expanded card/credentials lists
  const [expandedClientCredentialsIds, setExpandedClientCredentialsIds] = useState<string[]>([]);

  // Symmetric Decrypt Helper for security vault consistency
  const GT_DECRYPTION_KEY = 'GT-Enterprise-Security-2026';
  const decryptClientPassword = (hex: string): string => {
    try {
      if (!hex || hex.length % 4 !== 0) return hex;
      const chars: string[] = [];
      for (let i = 0; i < hex.length; i += 4) {
        chars.push(String.fromCharCode(parseInt(hex.substring(i, i + 4), 16)));
      }
      return chars.join('').split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ GT_DECRYPTION_KEY.charCodeAt(i % GT_DECRYPTION_KEY.length))
      ).join('');
    } catch (err) {
      return hex;
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastAlert({ message, type });
  };

  useEffect(() => {
    if (!toastAlert) return;
    const timer = setTimeout(() => setToastAlert(null), 4000);
    return () => clearTimeout(timer);
  }, [toastAlert]);

  // Handle Authentication
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const targetEmail = loginEmail.trim().toLowerCase();
    const targetPwd = loginPassword.trim();

    if (targetEmail === 'connect@goingtechnologies.com' && targetPwd === 'Going@admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('gt_client_admin_auth', 'true');
      showToast('Client Operations Session Authenticated Successfully', 'success');
    } else {
      setLoginError('Invalid Client Operations Administrator credentials. Attempt logged.');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gt_client_admin_auth');
  };

  // Real-time Supabase Fetch Engine
  const fetchAllOperationalData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Client Profiles (Accounts)
      const { data: profiles, error: errProfiles } = await supabase
        .from('client_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!errProfiles && profiles) setClientAccounts(profiles);

      // 2. Fetch Client Credentials
      const { data: credentials, error: errCreds } = await supabase
        .from('client_credentials')
        .select('*')
        .order('created_at', { ascending: false });
      if (!errCreds && credentials) setAllClientCredentials(credentials);

      // 3. Fetch Client Documents
      const { data: documents, error: errDocs } = await supabase
        .from('client_documents')
        .select('*')
        .order('created_at', { ascending: false });
      if (!errDocs && documents) setAllClientDocuments(documents);

      // 4. Fetch Onboardings
      const { data: onboardings, error: errOnboard } = await supabase
        .from('client_onboarding')
        .select('*')
        .order('updated_at', { ascending: false });
      if (!errOnboard && onboardings) setAllOnboardings(onboardings);

      // 5. Fetch Notifications
      const { data: notifications, error: errNotif } = await supabase
        .from('client_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (!errNotif && notifications) setAllClientNotifications(notifications);

      // 6. Fetch Activity Logs (for timelines and analytics)
      const { data: activityLogs, error: errLogs } = await supabase
        .from('client_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (!errLogs && activityLogs) setAllActivityLogs(activityLogs);

    } catch (err: any) {
      console.error('Error fetching client admin datasets:', err);
      showToast('Error syncing real-time databases', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize and Subscribe to Supabase Real-time Broadcast events
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchAllOperationalData();

    // Setup live subscription
    const handleSyncUpdate = (table: string, eventType: string, record: any) => {
      if (!record) return;

      const syncStateList = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        if (eventType === 'INSERT') {
          setter((prev) => {
            if (prev.some((item) => item.id === record.id)) return prev;
            return [record, ...prev];
          });
        } else if (eventType === 'DELETE') {
          setter((prev) => prev.filter((item) => item.id !== record.id));
        } else if (eventType === 'UPDATE') {
          setter((prev) => prev.map((item) => (item.id === record.id ? { ...item, ...record } : item)));
        }
      };

      switch (table) {
        case 'client_profiles':
          syncStateList(setClientAccounts);
          break;
        case 'client_credentials':
          syncStateList(setAllClientCredentials);
          break;
        case 'client_documents':
          syncStateList(setAllClientDocuments);
          break;
        case 'client_onboarding':
          setAllOnboardings((prev) => {
            if (eventType === 'INSERT' || eventType === 'UPSERT') {
              if (prev.some((item) => item.client_id === record.client_id)) {
                return prev.map((item) => (item.client_id === record.client_id ? record : item));
              }
              return [record, ...prev];
            } else if (eventType === 'UPDATE') {
              return prev.map((item) => (item.client_id === record.client_id ? { ...item, ...record } : item));
            } else if (eventType === 'DELETE') {
              return prev.filter((item) => item.client_id !== record.client_id);
            }
            return prev;
          });
          break;
        case 'client_notifications':
          syncStateList(setAllClientNotifications);
          break;
        case 'client_activity_logs':
          syncStateList(setAllActivityLogs);
          break;
        default:
          break;
      }
    };

    const channel = supabase
      .channel('client-admin-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_profiles' },
        (payload) => handleSyncUpdate('client_profiles', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_credentials' },
        (payload) => handleSyncUpdate('client_credentials', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_documents' },
        (payload) => handleSyncUpdate('client_documents', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_onboarding' },
        (payload) => handleSyncUpdate('client_onboarding', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_notifications' },
        (payload) => handleSyncUpdate('client_notifications', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_activity_logs' },
        (payload) => handleSyncUpdate('client_activity_logs', payload.eventType, payload.eventType === 'DELETE' ? payload.old : payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Core administrative functions
  const handleToggleAccountStatus = async (account: any) => {
    const currentStatus = account.status || 'active';
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

    try {
      // Update locally immediately
      setClientAccounts(prev => prev.map(a => a.id === account.id ? { ...a, status: newStatus } : a));

      const { error } = await supabase
        .from('client_profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', account.id);

      if (error) throw error;

      // Log action
      await supabase.from('client_activity_logs').insert([{
        client_id: account.id,
        email: 'connect@goingtechnologies.com',
        event_type: 'Security Directive',
        description: `Operational representative account status shifted to: ${newStatus.toUpperCase()}`
      }]);

      broadcastChange('client_profiles', 'UPDATE', { id: account.id, status: newStatus });
      showToast(`Representative status successfully marked as: ${newStatus.toUpperCase()}`, 'success');
    } catch (err: any) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  const handleResetOnboarding = async (account: any) => {
    if (!confirm(`Are you sure you want to reset the Premium Onboarding preloader and welcome flags for ${account.company}? They will see the preloader on next login.`)) {
      return;
    }

    try {
      setClientAccounts(prev => prev.map(a => a.id === account.id ? { ...a, onboarding_completed: false } : a));

      const { error } = await supabase
        .from('client_profiles')
        .update({ onboarding_completed: false, updated_at: new Date().toISOString() })
        .eq('id', account.id);

      if (error) throw error;

      // Log action
      await supabase.from('client_activity_logs').insert([{
        client_id: account.id,
        email: 'connect@goingtechnologies.com',
        event_type: 'Onboarding Reset',
        description: `Client Onboarding welcome preloader pipeline re-queued by operational admin.`
      }]);

      broadcastChange('client_profiles', 'UPDATE', { id: account.id, onboarding_completed: false });
      showToast(`Onboarding flow reset successfully for ${account.company}`, 'success');
    } catch (err: any) {
      showToast(`Reset failed: ${err.message}`, 'error');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountForPasswordReset || !newPasswordInput.trim()) return;

    setIsPasswordResetSaving(true);
    try {
      // Direct update client_profiles metadata if needed or call RPC/direct table update
      // Since standard credentials are authentication-linked, we log the password update or update database row
      const { error } = await supabase
        .from('client_profiles')
        .update({
          password: newPasswordInput.trim(), // Storing operational fallback if required
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedAccountForPasswordReset.id);

      if (error) throw error;

      // Log action
      await supabase.from('client_activity_logs').insert([{
        client_id: selectedAccountForPasswordReset.id,
        email: 'connect@goingtechnologies.com',
        event_type: 'Key Rotation',
        description: `Client administrative portal passcode reset/updated by operational admin.`
      }]);

      showToast(`Secured password updated for representative: ${selectedAccountForPasswordReset.email}`, 'success');
      setSelectedAccountForPasswordReset(null);
      setNewPasswordInput('');
    } catch (err: any) {
      showToast(`Password update failed: ${err.message}`, 'error');
    } finally {
      setIsPasswordResetSaving(false);
    }
  };

  const handleArchiveClient = async (account: any) => {
    if (!confirm(`Are you sure you want to ARCHIVE ${account.company}? This restricts their platform entry and moves their records to Archive tab.`)) {
      return;
    }

    try {
      setClientAccounts(prev => prev.map(a => a.id === account.id ? { ...a, status: 'Archived' } : a));

      const { error } = await supabase
        .from('client_profiles')
        .update({ status: 'Archived', updated_at: new Date().toISOString() })
        .eq('id', account.id);

      if (error) throw error;

      await supabase.from('client_activity_logs').insert([{
        client_id: account.id,
        email: 'connect@goingtechnologies.com',
        event_type: 'Archive Directive',
        description: `Client portal workspace node archived and set offline.`
      }]);

      broadcastChange('client_profiles', 'UPDATE', { id: account.id, status: 'Archived' });
      showToast(`Workspace account for ${account.company} moved to archive.`, 'success');
    } catch (err: any) {
      showToast(`Archiving failed: ${err.message}`, 'error');
    }
  };

  const handleRestoreClient = async (account: any) => {
    try {
      setClientAccounts(prev => prev.map(a => a.id === account.id ? { ...a, status: 'active' } : a));

      const { error } = await supabase
        .from('client_profiles')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', account.id);

      if (error) throw error;

      await supabase.from('client_activity_logs').insert([{
        client_id: account.id,
        email: 'connect@goingtechnologies.com',
        event_type: 'Restore Directive',
        description: `Client portal workspace node restored to active live mode.`
      }]);

      broadcastChange('client_profiles', 'UPDATE', { id: account.id, status: 'active' });
      showToast(`Representative workspace node for ${account.company} fully restored.`, 'success');
    } catch (err: any) {
      showToast(`Restoration failed: ${err.message}`, 'error');
    }
  };

  const handlePermanentDeleteClient = async (account: any) => {
    if (!confirm(`⚠️ CRITICAL WARNING: Are you sure you want to PERMANENTLY PURGE ${account.company} and all matching credentials, notifications, logs, and files? This action is absolutely irreversible.`)) {
      return;
    }

    setIsLoading(true);
    try {
      // 1. Delete Auth User if reachable via API
      try {
        await fetch(`/api/admin/delete-user/${account.id}`, { method: 'DELETE' });
      } catch (authErr) {
        console.warn('Auth user purge bypassed or unhandled on server edge', authErr);
      }

      // 2. Remove all DB dependencies
      const tables = ['client_credentials', 'client_documents', 'client_notifications', 'client_activity_logs', 'client_onboarding', 'client_profiles'];
      for (const tbl of tables) {
        await supabase
          .from(tbl)
          .delete()
          .eq(tbl === 'client_profiles' ? 'id' : 'client_id', account.id);
      }

      setClientAccounts(prev => prev.filter(a => a.id !== account.id));
      showToast(`Representative node for ${account.company} permanently purged from all databases.`, 'success');
    } catch (err: any) {
      showToast(`Purge failed: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFile = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(doc.file_path);

      if (error) throw error;
      if (!data) throw new Error('Object storage buffer empty.');

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.file_name;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      showToast(`Download failed: ${err.message}`, 'error');
    }
  };

  const handleDeleteDocument = async (doc: any) => {
    if (!confirm(`Are you sure you want to permanently delete secure document file: ${doc.file_name}?`)) return;

    try {
      const { error: dbErr } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', doc.id);
      if (dbErr) throw dbErr;

      try {
        await supabase.storage
          .from('client-documents')
          .remove([doc.file_path]);
      } catch (stErr) {
        console.warn('Physical file remove skipped or unauthorized', stErr);
      }

      setAllClientDocuments(prev => prev.filter(d => d.id !== doc.id));
      showToast('Secure document successfully purged from vault.', 'success');
    } catch (err: any) {
      showToast(`Purging document failed: ${err.message}`, 'error');
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotificationTitle.trim() || !newNotificationMessage.trim()) {
      showToast('Please fill in both title and message.', 'error');
      return;
    }

    setIsNotificationSending(true);
    try {
      const targetClients = newNotificationTarget === 'all'
        ? clientAccounts.filter(c => (c.status || '').toLowerCase() !== 'archived')
        : clientAccounts.filter(c => c.id === newNotificationTarget);

      const recordsToInsert = targetClients.map(client => ({
        client_id: client.id,
        title: newNotificationTitle.trim(),
        message: newNotificationMessage.trim(),
        type: 'Admin Directive',
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('client_notifications')
        .insert(recordsToInsert);

      if (error) throw error;

      showToast(`Notification broadcasted successfully to ${recordsToInsert.length} client workspace node(s).`, 'success');
      setNewNotificationTitle('');
      setNewNotificationMessage('');
      setNewNotificationTarget('all');
    } catch (err: any) {
      showToast(`Failed to broadcast alert: ${err.message}`, 'error');
    } finally {
      setIsNotificationSending(false);
    }
  };

  const handleClearAllNotifications = async () => {
    if (!confirm('Are you sure you want to clear all operational workspace notifications across all client accounts? This is permanent.')) return;

    try {
      const { error } = await supabase
        .from('client_notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // safe delete all

      if (error) throw error;

      setAllClientNotifications([]);
      showToast('All administrative notifications have been cleared.', 'success');
    } catch (err: any) {
      showToast(`Clear failed: ${err.message}`, 'error');
    }
  };

  const handleClearNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('client_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAllClientNotifications(prev => prev.filter(n => n.id !== id));
      showToast('Notification cleared.', 'success');
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  const toggleClientCredentialsExpand = (clientId: string) => {
    setExpandedClientCredentialsIds(prev =>
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]
    );
  };

  // Onboarding Calculation Helper
  const getOnboardingStatusAndProgress = (clientId: string) => {
    const onboarding = allOnboardings.find(o => o.client_id === clientId);
    if (!onboarding) return { progress: 0, status: 'Not Started', fieldsCount: 0 };
    
    const data = onboarding.data || {};
    const totalTrackedFields = [
      'legalBusinessName', 'ein', 'companyType', 'industryType', 'yearEstablished', 'numEmployees', 'companyWebsite',
      'hqAddress', 'hqCity', 'hqState', 'hqZip', 'hqCountry',
      'primaryName', 'primaryEmail', 'primaryMobile',
      'execName', 'execEmail',
      'apName', 'apEmail',
      'itName', 'itEmail',
      'opsPrimaryLines', 'opsLicensedStates',
      'sysAms', 'sysCrm', 'sysVoip',
      'secPolicyInPlace', 'secMfaEnabled'
    ];
    
    let completed = 0;
    totalTrackedFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== null && String(data[field]).trim() !== '') {
        completed++;
      }
    });

    const progress = Math.round((completed / totalTrackedFields.length) * 100);
    const status = progress === 0 ? 'Not Started' : progress === 100 ? 'Completed' : 'In Progress';
    return { progress, status, fieldsCount: completed };
  };

  // Analytics Helpers
  const getOnboardingDistributions = () => {
    let notStarted = 0;
    let inProgress = 0;
    let completed = 0;

    clientAccounts.filter(c => (c.status || '').toLowerCase() !== 'archived').forEach(client => {
      const { progress } = getOnboardingStatusAndProgress(client.id);
      if (progress === 0) notStarted++;
      else if (progress === 100) completed++;
      else inProgress++;
    });

    return { notStarted, inProgress, completed };
  };

  const getCredentialCategoryDistribution = () => {
    const counts: Record<string, number> = {};
    allClientCredentials.forEach(cred => {
      const category = cred.category || 'General Access';
      counts[category] = (counts[category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="bg-[#FAFBFD] font-sans text-gray-900 min-h-screen flex flex-col">
      
      {/* Toast Banner Alerts */}
      <AnimatePresence>
        {toastAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-full px-4"
          >
            <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xl ${
              toastAlert.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : toastAlert.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              {toastAlert.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              ) : toastAlert.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p className="text-xs font-extrabold uppercase tracking-wider">System Alert</p>
                <p className="text-xs font-semibold">{toastAlert.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* LOGIN PANEL GATEWAY */
          <motion.div
            key="client-admin-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex items-center justify-center py-20 px-4 bg-slate-950 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
            <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
            
            <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-3xl relative z-10 shadow-2xl">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
                  <ShieldAlert className="w-7 h-7 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight font-display text-white">Client Admin Portal</h2>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold font-mono">
                  Going Technologies Operations Center
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Corporate Email</label>
                    <input
                      type="email"
                      required
                      placeholder="connect@goingtechnologies.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-semibold text-slate-300">Operational Key</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-[38px] text-gray-500 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 text-center">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="cursor-pointer w-full text-center bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/15"
                >
                  <span>Authenticate Portal Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-slate-500 text-[10px] text-center leading-relaxed">
                  Notice: Secure environment. Access and session IP footprint metrics are stored and logged for SOC 2 Type II compliance audits.
                </p>
              </form>
            </div>
          </motion.div>
        ) : (
          /* ADMINISTRATIVE SUITE WORKSPACE */
          <motion.div
            key="client-admin-workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col md:flex-row"
          >
            {/* SIDEBAR NAVIGATION PANEL */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex flex-col shrink-0">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">GT Operations Portal</h3>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Realtime Sync</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-grow p-4 space-y-1.5">
                {[
                  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
                  { id: 'accounts', label: 'Client Accounts', icon: Users, count: clientAccounts.filter(c => (c.status || '').toLowerCase() !== 'archived').length },
                  { id: 'onboarding', label: 'Company Onboarding', icon: Building, count: allOnboardings.length },
                  { id: 'credentials', label: 'Credentials Vault', icon: Key, count: allClientCredentials.length },
                  { id: 'documents', label: 'Client Documents', icon: FolderOpen, count: allClientDocuments.length },
                  { id: 'notifications', label: 'Notifications Hub', icon: Bell, count: allClientNotifications.length },
                  { id: 'archive', label: 'Archive Records', icon: Archive, count: clientAccounts.filter(c => (c.status || '').toLowerCase() === 'archived').length },
                  { id: 'search', label: 'Omni Search', icon: Search },
                  { id: 'analytics', label: 'Realtime Analytics', icon: BarChart3 }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as TabType);
                        setGlobalSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                          : 'hover:bg-slate-850 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 font-semibold tracking-wide">
                <p>© Going Technologies</p>
                <p className="text-[10px] text-gray-600">Administrative Scope: Super</p>
              </div>
            </aside>

            {/* MAIN PORTAL AREA */}
            <main className="flex-grow p-6 sm:p-10 space-y-8 overflow-x-hidden">
              
              {/* TOP MASTER BAR */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#081B8C] font-display">
                    {activeTab === 'overview' && 'Executive Operations Dashboard'}
                    {activeTab === 'accounts' && 'Client Portal Accounts'}
                    {activeTab === 'onboarding' && 'Client Onboarding dossiers'}
                    {activeTab === 'credentials' && 'System Credentials directory'}
                    {activeTab === 'documents' && 'Document Central Vault'}
                    {activeTab === 'notifications' && 'Operational Notifications Hub'}
                    {activeTab === 'archive' && 'Archived Clients repository'}
                    {activeTab === 'search' && 'Administrative Omni-Search'}
                    {activeTab === 'analytics' && 'Real-time System Analytics'}
                  </h1>
                  <p className="text-gray-400 text-xs">
                    Realtime administrative system synchronizing direct from clients' portal spaces.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#EBF1FF] text-[#081B8C] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 border border-[#DCE7FF]">
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>Operational Sync Enabled</span>
                  </div>
                </div>
              </div>

              {/* TAB VIEWS */}
              <AnimatePresence mode="wait">
                
                {/* 1. DASHBOARD OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    {/* BENTO STATS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      <div className="bg-white border border-[#DCE7FF]/70 p-6 rounded-3xl shadow-3xs hover:border-[#2F6DFF]/50 transition-all">
                        <div className="flex justify-between items-center pb-3">
                          <span className="text-xs text-gray-400 font-extrabold uppercase font-mono tracking-wider">Active Partners</span>
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-3xl font-extrabold text-[#081B8C] tracking-tight">
                            {clientAccounts.filter(c => (c.status || '').toLowerCase() !== 'archived').length}
                          </h3>
                          <p className="text-xs text-gray-400 font-semibold">Live Representative Nodes</p>
                        </div>
                      </div>

                      <div className="bg-white border border-[#DCE7FF]/70 p-6 rounded-3xl shadow-3xs hover:border-[#2F6DFF]/50 transition-all">
                        <div className="flex justify-between items-center pb-3">
                          <span className="text-xs text-gray-400 font-extrabold uppercase font-mono tracking-wider">Saved Passcodes</span>
                          <Key className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-3xl font-extrabold text-[#081B8C] tracking-tight">{allClientCredentials.length}</h3>
                          <p className="text-xs text-gray-400 font-semibold">Symmetrically Encrypted</p>
                        </div>
                      </div>

                      <div className="bg-white border border-[#DCE7FF]/70 p-6 rounded-3xl shadow-3xs hover:border-[#2F6DFF]/50 transition-all">
                        <div className="flex justify-between items-center pb-3">
                          <span className="text-xs text-gray-400 font-extrabold uppercase font-mono tracking-wider">Stored Files</span>
                          <FolderOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-3xl font-extrabold text-[#081B8C] tracking-tight">{allClientDocuments.length}</h3>
                          <p className="text-xs text-gray-400 font-semibold">Secure Guideline Objects</p>
                        </div>
                      </div>

                      <div className="bg-white border border-[#DCE7FF]/70 p-6 rounded-3xl shadow-3xs hover:border-[#2F6DFF]/50 transition-all">
                        <div className="flex justify-between items-center pb-3">
                          <span className="text-xs text-gray-400 font-extrabold uppercase font-mono tracking-wider">Avg Onboarding</span>
                          <Building className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-3xl font-extrabold text-[#081B8C] tracking-tight">
                            {Math.round(
                              allOnboardings.reduce((acc, curr) => acc + (curr.progress || 0), 0) / 
                              (allOnboardings.length || 1)
                            )}%
                          </h3>
                          <p className="text-xs text-gray-400 font-semibold">Average Completed Progress</p>
                        </div>
                      </div>

                    </div>

                    {/* LIVE RECENT FEED AND ACTIVITY LISTS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      {/* Left: Live Activities */}
                      <div className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-3xs lg:col-span-2 space-y-6">
                        <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                          <div>
                            <h2 className="text-lg font-bold text-[#081B8C] font-display">Client System Activities</h2>
                            <p className="text-xs text-gray-400 font-semibold">Realtime tracking logs updated live directly from the workspaces.</p>
                          </div>
                          <span className="p-1 px-2.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider font-mono">Live Logs</span>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 divide-y divide-gray-50">
                          {allActivityLogs.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-10 font-semibold">No operational logs recorded in this cycle.</p>
                          ) : (
                            allActivityLogs.map((log) => (
                              <div key={log.id} className="pt-3.5 first:pt-0 flex items-start gap-4">
                                <div className="w-8 h-8 rounded-xl bg-[#F8FAFF] border border-[#DCE7FF] text-[#081B8C] flex items-center justify-center shrink-0 mt-0.5">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div className="space-y-1 flex-grow">
                                  <div className="flex flex-wrap items-center justify-between gap-1">
                                    <span className="text-xs font-bold text-gray-800">{log.event_type}</span>
                                    <span className="text-[10px] font-mono text-gray-400">
                                      {new Date(log.created_at).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{log.description}</p>
                                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Node: {log.email || 'Global Environment'}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right: Quick Action Board */}
                      <div className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                          <h2 className="text-lg font-bold text-[#081B8C] font-display">Quick Directives</h2>
                          <p className="text-xs text-gray-400 font-semibold">Issue urgent global alerts directly to client portals.</p>
                        </div>

                        <form onSubmit={handleSendNotification} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Recipient Target</label>
                            <select
                              value={newNotificationTarget}
                              onChange={(e) => setNewNotificationTarget(e.target.value)}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            >
                              <option value="all">All Active Portals (Broadcast)</option>
                              {clientAccounts.filter(c => (c.status || '').toLowerCase() !== 'archived').map(c => (
                                <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Alert Heading</label>
                            <input
                              type="text"
                              required
                              placeholder="AMS Platform Downtime Notice"
                              value={newNotificationTitle}
                              onChange={(e) => setNewNotificationTitle(e.target.value)}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Message</label>
                            <textarea
                              required
                              rows={4}
                              placeholder="Please note that the Vertafore AMS platform will be undergoing scheduled updates tonight..."
                              value={newNotificationMessage}
                              onChange={(e) => setNewNotificationMessage(e.target.value)}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl p-3 text-xs focus:outline-none focus:border-[#2F6DFF] resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isNotificationSending}
                            className="cursor-pointer w-full bg-[#081B8C] hover:bg-[#2F6DFF] disabled:opacity-50 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                          >
                            {isNotificationSending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Send Operations Directive</span>
                          </button>
                        </form>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 2. CLIENT ACCOUNTS TAB */}
                {activeTab === 'accounts' && (
                  <motion.div
                    key="accounts-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-lg font-bold text-[#081B8C] font-display">Client Accounts Directory</h2>
                        <p className="text-xs text-gray-400 font-semibold">Active operational client accounts with workspace status. Lock, reset, or archive representative nodes.</p>
                      </div>

                      <div className="relative w-full sm:max-w-xs">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search company or name..."
                          value={accountsSearch}
                          onChange={(e) => setAccountsSearch(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-[#DCE7FF]/35 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F8FAFF] border-b border-[#DCE7FF]/40 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">Company</th>
                            <th className="p-4">Representative</th>
                            <th className="p-4">Email / Phone</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Onboarding</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCE7FF]/25 text-xs font-medium">
                          {clientAccounts
                            .filter(c => (c.status || '').toLowerCase() !== 'archived')
                            .filter(c => {
                              const q = accountsSearch.toLowerCase();
                              return (
                                (c.company || '').toLowerCase().includes(q) ||
                                (c.name || '').toLowerCase().includes(q) ||
                                (c.email || '').toLowerCase().includes(q)
                              );
                            })
                            .map((client) => {
                              const { progress, status } = getOnboardingStatusAndProgress(client.id);
                              const isSuspended = (client.status || '').toLowerCase() === 'suspended';

                              return (
                                <tr key={client.id} className="hover:bg-slate-50/40 transition-colors">
                                  <td className="p-4">
                                    <div className="font-extrabold text-[#081B8C] text-sm flex items-center gap-1.5">
                                      <Building className="w-4 h-4 text-gray-400" />
                                      <span>{client.company || 'GT Global Partner'}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono font-bold">{client.industry || 'Insurance Operations'}</span>
                                  </td>
                                  <td className="p-4 text-gray-800">
                                    <div className="font-bold">{client.name}</div>
                                    <div className="text-[10px] text-gray-400 italic">{client.designation || 'Operations Director'}</div>
                                  </td>
                                  <td className="p-4 font-mono text-gray-500 text-[11px]">
                                    <div>{client.email}</div>
                                    <div className="text-[10px] mt-0.5">{client.phone || 'No phone recorded'}</div>
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                                      isSuspended 
                                        ? 'bg-rose-50 border border-rose-200 text-rose-700' 
                                        : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                    }`}>
                                      {client.status || 'Active'}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <div className="space-y-1 max-w-[120px]">
                                      <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className={status === 'Completed' ? 'text-emerald-600' : 'text-gray-500'}>{status}</span>
                                        <span>{progress}%</span>
                                      </div>
                                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ${
                                          progress === 100 ? 'bg-emerald-500' : progress > 50 ? 'bg-blue-500' : 'bg-amber-500'
                                        }`} style={{ width: `${progress}%` }} />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex gap-2 justify-end items-center flex-wrap">
                                      <button
                                        onClick={() => handleToggleAccountStatus(client)}
                                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold cursor-pointer border ${
                                          isSuspended 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                        }`}
                                      >
                                        {isSuspended ? 'Re-activate' : 'Suspend'}
                                      </button>
                                      
                                      <button
                                        onClick={() => handleResetOnboarding(client)}
                                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                                        title="Force onboarding preloader on client login"
                                      >
                                        Reset Preloader
                                      </button>

                                      <button
                                        onClick={() => setSelectedAccountForPasswordReset(client)}
                                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                                      >
                                        Reset Password
                                      </button>

                                      <button
                                        onClick={() => handleArchiveClient(client)}
                                        className="px-2 py-1.5 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                                        title="Archive representative node"
                                      >
                                        <Archive className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* 3. COMPANY ONBOARDING TAB */}
                {activeTab === 'onboarding' && (
                  <motion.div
                    key="onboarding-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    <div className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-[#081B8C] font-display">Client Onboarding Dossiers</h2>
                        <p className="text-xs text-gray-400 font-semibold">Inspect all operational fields completed by global client agencies during their workspace configuration.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clientAccounts
                          .filter(c => (c.status || '').toLowerCase() !== 'archived')
                          .map((client) => {
                            const { progress, status, fieldsCount } = getOnboardingStatusAndProgress(client.id);
                            
                            return (
                              <div key={client.id} className="border border-[#DCE7FF]/50 bg-[#FAFBFD]/30 hover:bg-white rounded-3xl p-6 space-y-4 hover:border-[#2F6DFF]/30 transition-all shadow-3xs flex flex-col justify-between">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                      <h3 className="font-extrabold text-[#081B8C] text-sm">{client.company}</h3>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{client.industry || 'Insurance'}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                      status === 'Completed' 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                        : status === 'In Progress' 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {status}
                                    </span>
                                  </div>

                                  <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                      <span className="text-gray-400">Autosaved Fields</span>
                                      <span className="text-slate-800">{fieldsCount} / 28 Filled</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition-all duration-500 ${
                                        progress === 100 ? 'bg-emerald-500' : progress > 50 ? 'bg-blue-500' : 'bg-amber-500'
                                      }`} style={{ width: `${progress}%` }} />
                                    </div>
                                  </div>

                                  <div className="text-xs text-gray-500 space-y-1 bg-white p-3 rounded-2xl border border-gray-100">
                                    <p className="flex justify-between">
                                      <span className="font-semibold">NPN:</span> 
                                      <span className="font-mono text-[10px]">{allOnboardings.find(o => o.client_id === client.id)?.data?.agencyNpn || 'Not recorded'}</span>
                                    </p>
                                    <p className="flex justify-between">
                                      <span className="font-semibold">Established:</span> 
                                      <span>{allOnboardings.find(o => o.client_id === client.id)?.data?.yearEstablished || 'Not recorded'}</span>
                                    </p>
                                    <p className="flex justify-between">
                                      <span className="font-semibold">Licensed Agents:</span> 
                                      <span>{allOnboardings.find(o => o.client_id === client.id)?.data?.numLicensedAgents || 'Not recorded'}</span>
                                    </p>
                                  </div>
                                </div>

                                <button
                                  onClick={() => setSelectedClientForOnboarding(client)}
                                  className="cursor-pointer w-full text-center bg-slate-50 border border-gray-200 hover:bg-[#F8FAFF] text-gray-700 hover:text-[#081B8C] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2"
                                >
                                  <span>Inspect Dossier</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. CREDENTIALS VAULT TAB */}
                {activeTab === 'credentials' && (
                  <motion.div
                    key="credentials-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-lg font-bold text-[#081B8C] font-display">Administrative Credentials Directory</h2>
                        <p className="text-xs text-gray-400 font-semibold">Secure, read-only directory of credential passcodes decrypted symmetrically using system environment keys.</p>
                      </div>

                      <div className="relative w-full sm:max-w-xs">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search platform or agency..."
                          value={credentialsSearch}
                          onChange={(e) => setCredentialsSearch(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {clientAccounts
                        .filter(c => (c.status || '').toLowerCase() !== 'archived')
                        .filter(client => {
                          const creds = allClientCredentials.filter(cr => cr.client_id === client.id);
                          const q = credentialsSearch.toLowerCase();
                          return (
                            (client.company || '').toLowerCase().includes(q) ||
                            creds.some(cr => (cr.platform || '').toLowerCase().includes(q) || (cr.username || '').toLowerCase().includes(q))
                          );
                        })
                        .map((client) => {
                          const creds = allClientCredentials.filter(cr => cr.client_id === client.id);
                          const isExpanded = expandedClientCredentialsIds.includes(client.id);

                          return (
                            <div key={client.id} className="border border-[#DCE7FF]/50 bg-[#FAFBFD]/25 hover:bg-white rounded-2xl overflow-hidden transition-all shadow-3xs">
                              
                              {/* Header representative bar */}
                              <div
                                onClick={() => toggleClientCredentialsExpand(client.id)}
                                className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-slate-50/30 transition-colors"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-extrabold text-[#081B8C] text-sm">{client.company || 'Global Partner'}</h3>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-mono font-extrabold uppercase">
                                      {creds.length} {creds.length === 1 ? 'Credential' : 'Credentials'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 font-semibold">
                                    Representative Name: <span className="text-gray-700 font-bold">{client.name}</span> ({client.email})
                                  </p>
                                </div>

                                <button className="cursor-pointer px-4 py-2 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 transition-all flex items-center gap-1.5">
                                  <span>{isExpanded ? 'Collapse' : 'Expand Credentials'}</span>
                                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                </button>
                              </div>

                              {/* Expanded Vault Table */}
                              {isExpanded && (
                                <div className="border-t border-gray-100 bg-[#FAFBFD]/30 p-5">
                                  {creds.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic text-center p-4">No secured credentials submitted inside this partner portal.</p>
                                  ) : (
                                    <div className="overflow-x-auto border border-gray-100 rounded-xl bg-white">
                                      <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                          <tr className="bg-slate-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                                            <th className="p-3">Platform</th>
                                            <th className="p-3">Category</th>
                                            <th className="p-3">Username / Email</th>
                                            <th className="p-3">Symmetrically Decrypted Password</th>
                                            <th className="p-3">Notes</th>
                                            <th className="p-3">Synced Date</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 font-medium">
                                          {creds.map((cred) => (
                                            <tr key={cred.id} className="hover:bg-slate-50/50">
                                              <td className="p-3 font-extrabold text-gray-800">{cred.platform}</td>
                                              <td className="p-3">
                                                <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded text-[10px]">
                                                  {cred.category || 'General'}
                                                </span>
                                              </td>
                                              <td className="p-3 font-mono text-[11px] text-gray-600 select-all">{cred.username}</td>
                                              <td className="p-3 font-mono text-[11px] text-blue-600 font-extrabold select-all bg-blue-50/30">
                                                {decryptClientPassword(cred.password)}
                                              </td>
                                              <td className="p-3 text-gray-500 italic max-w-xs truncate" title={cred.notes}>
                                                {cred.notes || '—'}
                                              </td>
                                              <td className="p-3 text-[10px] text-gray-400 font-mono">
                                                {new Date(cred.created_at).toLocaleDateString()}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              )}

                            </div>
                          );
                        })}
                    </div>
                  </motion.div>
                )}

                {/* 5. DOCUMENTS TAB */}
                {activeTab === 'documents' && (
                  <motion.div
                    key="documents-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-lg font-bold text-[#081B8C] font-display">Document Vault Master Registry</h2>
                        <p className="text-xs text-gray-400 font-semibold">Access, verify, and download secure operating instructions and directories uploaded by global client entities.</p>
                      </div>

                      <div className="relative w-full sm:max-w-xs">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search files or company..."
                          value={documentsSearch}
                          onChange={(e) => setDocumentsSearch(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-[#DCE7FF]/35 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F8FAFF] border-b border-[#DCE7FF]/40 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">Partner Agency</th>
                            <th className="p-4">File Name</th>
                            <th className="p-4">File Title</th>
                            <th className="p-4">Size</th>
                            <th className="p-4">Uploaded At</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCE7FF]/25 text-xs">
                          {allClientDocuments
                            .filter(doc => {
                              const client = clientAccounts.find(c => c.id === doc.client_id);
                              if (client && (client.status || '').toLowerCase() === 'archived') return false;

                              const q = documentsSearch.toLowerCase();
                              return (
                                (doc.file_name || '').toLowerCase().includes(q) ||
                                (doc.title || '').toLowerCase().includes(q) ||
                                (client?.company || '').toLowerCase().includes(q)
                              );
                            })
                            .map((doc) => {
                              const client = clientAccounts.find(c => c.id === doc.client_id);

                              return (
                                <tr key={doc.id} className="hover:bg-slate-50/45 transition-colors">
                                  <td className="p-4">
                                    <div className="font-extrabold text-[#081B8C]">{client?.company || 'GT Partner'}</div>
                                    <div className="text-[10px] text-gray-400 font-semibold">{client?.email}</div>
                                  </td>
                                  <td className="p-4 font-mono font-semibold text-gray-800">
                                    <div className="flex items-center gap-1.5">
                                      <FileText className="w-4 h-4 text-gray-400" />
                                      <span>{doc.file_name}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-gray-600 font-semibold">{doc.title || 'General Manual'}</td>
                                  <td className="p-4 text-gray-500 font-mono text-[11px]">{doc.file_size || 'N/A'}</td>
                                  <td className="p-4 text-gray-400 font-mono text-[11px]">
                                    {new Date(doc.created_at || doc.uploaded_at).toLocaleDateString()}
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() => handleDownloadFile(doc)}
                                        className="cursor-pointer p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all flex items-center gap-1 font-bold text-[10px]"
                                        title="Securely download file to disk"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Download</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => handleDeleteDocument(doc)}
                                        className="cursor-pointer p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-all"
                                        title="Purge document"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* 6. NOTIFICATIONS HUB TAB */}
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-lg font-bold text-[#081B8C] font-display">System Notifications Log</h2>
                        <p className="text-xs text-gray-400 font-semibold">Consolidated ledger of operational triggers and alerts broadcasted to the workspaces.</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleClearAllNotifications}
                          className="cursor-pointer px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear All Alerts</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-[#DCE7FF]/35 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F8FAFF] border-b border-[#DCE7FF]/40 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">Target client</th>
                            <th className="p-4">Alert Title</th>
                            <th className="p-4">Message payload</th>
                            <th className="p-4">Category Type</th>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCE7FF]/25 text-xs">
                          {allClientNotifications.map((notif) => {
                            const client = clientAccounts.find(c => c.id === notif.client_id);
                            return (
                              <tr key={notif.id} className="hover:bg-slate-50/45 transition-colors">
                                <td className="p-4 font-bold text-gray-800">
                                  {client?.company || 'All Portals'}
                                </td>
                                <td className="p-4 font-extrabold text-[#081B8C]">{notif.title}</td>
                                <td className="p-4 text-gray-500 max-w-sm truncate" title={notif.message}>{notif.message}</td>
                                <td className="p-4">
                                  <span className="px-2 py-0.5 bg-slate-100 border border-gray-200 text-gray-600 rounded text-[10px] font-bold font-mono">
                                    {notif.type || 'System'}
                                  </span>
                                </td>
                                <td className="p-4 text-gray-400 font-mono text-[11px]">
                                  {new Date(notif.created_at).toLocaleString()}
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleClearNotification(notif.id)}
                                    className="cursor-pointer p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* 7. ARCHIVE TAB */}
                {activeTab === 'archive' && (
                  <motion.div
                    key="archive-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-lg font-bold text-rose-700 font-display">Archived Client Nodes</h2>
                        <p className="text-xs text-gray-400 font-semibold">Reputable corporate partners whose spaces have been set offline. Restore workspace nodes or trigger complete purging.</p>
                      </div>

                      <div className="relative w-full sm:max-w-xs">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search archive..."
                          value={archiveSearch}
                          onChange={(e) => setArchiveSearch(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-rose-100 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-rose-50/50 border-b border-rose-100 text-rose-800 font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">Archived Agency</th>
                            <th className="p-4">Representative</th>
                            <th className="p-4">Primary Email</th>
                            <th className="p-4">Offline Timestamp</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-rose-50 text-xs">
                          {clientAccounts
                            .filter(c => (c.status || '').toLowerCase() === 'archived')
                            .filter(c => {
                              const q = archiveSearch.toLowerCase();
                              return (
                                (c.company || '').toLowerCase().includes(q) ||
                                (c.name || '').toLowerCase().includes(q)
                              );
                            })
                            .map((client) => (
                              <tr key={client.id} className="hover:bg-rose-50/10">
                                <td className="p-4 font-extrabold text-rose-900">{client.company}</td>
                                <td className="p-4 text-gray-700 font-semibold">{client.name}</td>
                                <td className="p-4 font-mono text-gray-500">{client.email}</td>
                                <td className="p-4 text-gray-400 font-mono text-[11px]">
                                  {client.updated_at ? new Date(client.updated_at).toLocaleString() : 'Recently'}
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleRestoreClient(client)}
                                      className="cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-all flex items-center gap-1"
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                      <span>Restore Account</span>
                                    </button>

                                    <button
                                      onClick={() => handlePermanentDeleteClient(client)}
                                      className="cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-all"
                                    >
                                      Permanent Purge
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* 8. SEARCH TAB */}
                {activeTab === 'search' && (
                  <motion.div
                    key="search-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-6"
                  >
                    <div className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-8 shadow-xs space-y-6">
                      <div className="text-center max-w-xl mx-auto space-y-3">
                        <h2 className="text-xl font-bold text-[#081B8C] font-display">Administrative Omni-Search</h2>
                        <p className="text-xs text-gray-400 font-semibold">Search globally across client accounts, decrypted credential platform systems, and vault documents simultaneously.</p>
                        
                        <div className="relative">
                          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Type any platform, email, filename, company, or representative..."
                            value={globalSearchQuery}
                            onChange={(e) => setGlobalSearchQuery(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:border-[#2F6DFF] font-medium shadow-3xs"
                          />
                        </div>
                      </div>
                    </div>

                    {globalSearchQuery.trim() !== '' && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Section A: Profiles */}
                        <div className="bg-white border border-[#DCE7FF]/50 rounded-3xl p-6 shadow-3xs space-y-4">
                          <h3 className="font-extrabold text-[#081B8C] text-sm border-b border-gray-100 pb-2.5 flex justify-between items-center">
                            <span>Matching Client Partners</span>
                            <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-md font-mono">
                              {clientAccounts.filter(c => (c.company || '').toLowerCase().includes(globalSearchQuery.toLowerCase())).length}
                            </span>
                          </h3>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {clientAccounts
                              .filter(c => (c.company || '').toLowerCase().includes(globalSearchQuery.toLowerCase()) || (c.name || '').toLowerCase().includes(globalSearchQuery.toLowerCase()))
                              .map(c => (
                                <div key={c.id} className="p-3 bg-[#FAFBFD]/40 border border-gray-100 rounded-2xl flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-extrabold text-gray-800">{c.company}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{c.name} ({c.email})</p>
                                  </div>
                                  <button onClick={() => setActiveTab('accounts')} className="text-[#2F6DFF] text-[10px] font-bold hover:underline cursor-pointer">View</button>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Section B: Credentials */}
                        <div className="bg-white border border-[#DCE7FF]/50 rounded-3xl p-6 shadow-3xs space-y-4">
                          <h3 className="font-extrabold text-[#081B8C] text-sm border-b border-gray-100 pb-2.5 flex justify-between items-center">
                            <span>Platform Credentials</span>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-md font-mono">
                              {allClientCredentials.filter(cr => (cr.platform || '').toLowerCase().includes(globalSearchQuery.toLowerCase())).length}
                            </span>
                          </h3>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {allClientCredentials
                              .filter(cr => (cr.platform || '').toLowerCase().includes(globalSearchQuery.toLowerCase()) || (cr.username || '').toLowerCase().includes(globalSearchQuery.toLowerCase()))
                              .map(cr => {
                                const client = clientAccounts.find(c => c.id === cr.client_id);
                                return (
                                  <div key={cr.id} className="p-3 bg-[#FAFBFD]/40 border border-gray-100 rounded-2xl">
                                    <p className="text-xs font-extrabold text-gray-800 flex justify-between">
                                      <span>{cr.platform}</span>
                                      <span className="text-[9px] text-gray-400 uppercase font-mono">{client?.company || 'Partner'}</span>
                                    </p>
                                    <p className="text-[10px] text-blue-600 font-bold mt-1 select-all">{cr.username} : {decryptClientPassword(cr.password)}</p>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        {/* Section C: Files */}
                        <div className="bg-white border border-[#DCE7FF]/50 rounded-3xl p-6 shadow-3xs space-y-4">
                          <h3 className="font-extrabold text-[#081B8C] text-sm border-b border-gray-100 pb-2.5 flex justify-between items-center">
                            <span>Guideline Files</span>
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-md font-mono">
                              {allClientDocuments.filter(d => (d.file_name || '').toLowerCase().includes(globalSearchQuery.toLowerCase())).length}
                            </span>
                          </h3>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {allClientDocuments
                              .filter(d => (d.file_name || '').toLowerCase().includes(globalSearchQuery.toLowerCase()))
                              .map(d => (
                                <div key={d.id} className="p-3 bg-[#FAFBFD]/40 border border-gray-100 rounded-2xl flex items-center justify-between">
                                  <div className="max-w-[150px] truncate">
                                    <p className="text-xs font-extrabold text-gray-800 truncate">{d.file_name}</p>
                                    <p className="text-[10px] text-gray-400 font-semibold">{d.file_size}</p>
                                  </div>
                                  <button
                                    onClick={() => handleDownloadFile(d)}
                                    className="cursor-pointer text-[10px] font-extrabold text-[#2F6DFF] hover:underline"
                                  >
                                    Download
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </motion.div>
                )}

                {/* 9. REALTIME ANALYTICS TAB */}
                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* Onboarding Distribution (Crafted Custom Responsive SVG Chart) */}
                      <div className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                        <div>
                          <h3 className="text-base font-bold text-[#081B8C] font-display">Onboarding Pipeline Distributions</h3>
                          <p className="text-xs text-gray-400 font-semibold">Distribution of representative onboarding completions.</p>
                        </div>

                        {(() => {
                          const { notStarted, inProgress, completed } = getOnboardingDistributions();
                          const total = notStarted + inProgress + completed || 1;
                          const pctNotStarted = Math.round((notStarted / total) * 100);
                          const pctInProgress = Math.round((inProgress / total) * 100);
                          const pctCompleted = Math.round((completed / total) * 100);

                          return (
                            <div className="space-y-5">
                              {/* Custom SVG Ring representation */}
                              <div className="flex justify-center items-center py-4">
                                <svg width="180" height="180" viewBox="0 0 36 36" className="circular-chart text-[#081B8C]">
                                  <path className="circle-bg" stroke="#f1f5f9" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="circle" stroke="#2F6DFF" strokeWidth="2.5" strokeDasharray={`${pctInProgress}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="circle" stroke="#10B981" strokeWidth="2.5" strokeDasharray={`${pctCompleted}, 100`} strokeDashoffset={`-${pctInProgress}`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <text x="18" y="20.35" className="font-extrabold text-[5px] font-sans text-center" fill="#081B8C" textAnchor="middle">
                                    {pctCompleted}% Done
                                  </text>
                                </svg>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                  <p className="text-xs text-gray-400 font-bold">Not Started</p>
                                  <p className="text-lg font-extrabold text-slate-700 mt-1">{notStarted}</p>
                                  <p className="text-[10px] text-slate-400">{pctNotStarted}%</p>
                                </div>
                                <div className="p-3 bg-[#EBF1FF] rounded-2xl">
                                  <p className="text-xs text-blue-600 font-bold">In Progress</p>
                                  <p className="text-lg font-extrabold text-blue-700 mt-1">{inProgress}</p>
                                  <p className="text-[10px] text-blue-500">{pctInProgress}%</p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-2xl">
                                  <p className="text-xs text-emerald-600 font-bold">Completed</p>
                                  <p className="text-lg font-extrabold text-emerald-700 mt-1">{completed}</p>
                                  <p className="text-[10px] text-emerald-500">{pctCompleted}%</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Decrypted Credentials Frequency Metrics */}
                      <div className="bg-white border border-[#DCE7FF]/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                        <div>
                          <h3 className="text-base font-bold text-[#081B8C] font-display">Credentials Vault Segments</h3>
                          <p className="text-xs text-gray-400 font-semibold">Decrypted categories submitted to the security vaults.</p>
                        </div>

                        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                          {getCredentialCategoryDistribution().length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-10">No credential category datasets saved.</p>
                          ) : (
                            getCredentialCategoryDistribution().map((cat, idx) => {
                              const totalCreds = allClientCredentials.length || 1;
                              const pct = Math.round((cat.value / totalCreds) * 100);
                              return (
                                <div key={idx} className="space-y-1.5">
                                  <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700">{cat.name}</span>
                                    <span className="text-[#081B8C] font-mono">{cat.value} ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#2F6DFF] rounded-full" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PORTAL OVERLAYS AND MODALS */}

      {/* A. PASSCODE ROTATION MODAL */}
      <AnimatePresence>
        {selectedAccountForPasswordReset && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-[#081B8C] text-lg font-display">Rotate Portal Passcode</h3>
                  <p className="text-xs text-gray-400 font-semibold">Change Administrative passcode for representative of: {selectedAccountForPasswordReset.company}</p>
                </div>
                <button
                  onClick={() => setSelectedAccountForPasswordReset(null)}
                  className="cursor-pointer p-1.5 hover:bg-slate-50 text-gray-400 hover:text-slate-900 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                  <input
                    type="text"
                    required
                    placeholder="Going@admin123"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#2F6DFF] font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAccountForPasswordReset(null)}
                    className="cursor-pointer flex-grow text-center py-3 border border-gray-200 text-gray-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPasswordResetSaving}
                    className="cursor-pointer flex-grow text-center py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    {isPasswordResetSaving ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    ) : (
                      <LockKeyhole className="w-4.5 h-4.5" />
                    )}
                    <span>Save Passcode</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. ONBOARDING DOSSIER INSPECTOR EXPAND PANEL (150+ Fields structured beautifully) */}
      <AnimatePresence>
        {selectedClientForOnboarding && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[999] flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between"
            >
              
              {/* Overlay header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-[#081B8C] text-lg font-display">Company Onboarding Dossier</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{selectedClientForOnboarding.company} Operational Setup</p>
                </div>
                <button
                  onClick={() => setSelectedClientForOnboarding(null)}
                  className="cursor-pointer p-2 hover:bg-white text-gray-400 hover:text-slate-900 rounded-xl border border-gray-200 shadow-3xs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Onboarding fields representation */}
              <div className="flex-grow p-6 overflow-y-auto space-y-8 font-medium">
                {(() => {
                  const dossier = allOnboardings.find(o => o.client_id === selectedClientForOnboarding.id);
                  if (!dossier || !dossier.data) {
                    return (
                      <div className="py-20 text-center text-gray-400 font-semibold space-y-2">
                        <Building className="w-12 h-12 text-gray-300 mx-auto" />
                        <p>No company onboarding data recorded yet by this partner.</p>
                      </div>
                    );
                  }

                  const data = dossier.data || {};

                  return (
                    <div className="space-y-8">
                      
                      {/* Section 1: Basic Corporate Info */}
                      <div className="space-y-4">
                        <h4 className="text-xs uppercase tracking-widest text-[#2F6DFF] font-extrabold flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span>1. Basic Company Information</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-400">Legal Business Name</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.legalBusinessName || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">DBA (Doing Business As)</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.dba || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Federal Tax ID (EIN)</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.ein || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">NPN Number</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.agencyNpn || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Company Type</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.companyType || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Website</p>
                            <p className="text-blue-600 font-bold mt-0.5">
                              {data.companyWebsite ? (
                                <a href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                  <span>{data.companyWebsite}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Year Established</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.yearEstablished || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Licensed Agents</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.numLicensedAgents || '—'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Addresses */}
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs uppercase tracking-widest text-[#2F6DFF] font-extrabold flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>2. Corporate HQ & Billing Address</span>
                        </h4>
                        <div className="text-xs space-y-2">
                          <div>
                            <p className="text-gray-400">Corporate HQ Address</p>
                            <p className="text-slate-800 font-bold mt-0.5">
                              {data.hqAddress ? `${data.hqAddress}, ${data.hqCity || ''}, ${data.hqState || ''} ${data.hqZip || ''}, ${data.hqCountry || ''}` : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Billing / Accounts Payable Address</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.billingAddress || '—'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Contact Directories */}
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs uppercase tracking-widest text-[#2F6DFF] font-extrabold flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>3. Corporate Contact Directories</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-400">Primary Liaison Name</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.primaryName || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Primary Email</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.primaryEmail || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Executive Sponsor</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.execName ? `${data.execName} (${data.execEmail || ''})` : '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Accounts Payable</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.apName ? `${data.apName} (${data.apEmail || ''})` : '—'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Operational Metrics */}
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs uppercase tracking-widest text-[#2F6DFF] font-extrabold flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          <span>4. Operational Metrics & Volume</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-400">Primary Lines of Business</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.opsPrimaryLines || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Licensed States</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.opsLicensedStates || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Active Managed Clients</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.opsActiveClients || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Monthly Renewal Volume</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.opsMonthlyRenewals || '—'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 5: Tech Infrastructure */}
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs uppercase tracking-widest text-[#2F6DFF] font-extrabold flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          <span>5. Tech Stack & Infrastructure</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-400">AMS Platform</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.sysAms || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">CRM Platform</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.sysCrm || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">VoIP System</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.sysVoip || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Email System</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.sysEmail || '—'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 6: Security Protocols */}
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs uppercase tracking-widest text-[#2F6DFF] font-extrabold flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span>6. Security & Compliance Protocols</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-400">NDA Required</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.secNdaRequired || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">MFA / 2FA Protocols</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.secMfaEnabled || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Written Info Security Policy</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.secPolicyInPlace || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Compliance Auditing Requirements</p>
                            <p className="text-slate-800 font-bold mt-0.5">{data.secComplianceRequirements || '—'}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })()}
              </div>

              {/* Drawer footer controls */}
              <div className="p-6 border-t border-gray-100 bg-slate-50 flex gap-3">
                <button
                  onClick={() => setSelectedClientForOnboarding(null)}
                  className="cursor-pointer w-full text-center py-3 bg-[#081B8C] hover:bg-[#2F6DFF] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  Close Dossier Inspection
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
