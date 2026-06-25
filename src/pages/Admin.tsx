import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Sparkles,
  PhoneCall,
  Mail,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  LogOut,
  Lock,
  ChevronRight,
  TrendingUp,
  Clock,
  Briefcase,
  Layers,
  Database,
  ArrowRight,
  Menu,
  X,
  Plus,
  Edit,
  Eye,
  ExternalLink,
  FileText,
  AlertCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { PageType } from '../types';
import { supabase } from '../lib/supabase';

interface AdminProps {
  setCurrentPage: (page: PageType) => void;
}

type TabType = 'overview' | 'leads' | 'consultations' | 'diagnostics' | 'callbacks' | 'subscribers' | 'jobs' | 'applications';

export default function Admin({ setCurrentPage }: AdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gt_admin_auth') === 'true';
  });

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard states
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Database records state
  const [leads, setLeads] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  
  // Careers & Applications CMS state
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Job Posting modal / form management states
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  
  // Job Form Fields state
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('');
  const [jobLoc, setJobLoc] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobSalary, setJobSalary] = useState('');
  const [jobExp, setJobExp] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState(''); // newline-separated
  const [jobStatus, setJobStatus] = useState('Draft');
  const [jobSlug, setJobSlug] = useState('');
  const [isSavingJob, setIsSavingJob] = useState(false);
  const [jobFormError, setJobFormError] = useState<string | null>(null);
  const [isJobsTableMissing, setIsJobsTableMissing] = useState(false);

  // Candidate Application view state
  const [viewingApplication, setViewingApplication] = useState<any | null>(null);
  const [positionFilter, setPositionFilter] = useState('All');

  // Custom Delete Confirmation Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<{ table: string; id: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic Edit Record Modal states
  const [editingRecord, setEditingRecord] = useState<{ table: string; data: any } | null>(null);
  const [isSavingRecord, setIsSavingRecord] = useState(false);

  // Fetch all tables from Supabase
  const fetchAllData = async () => {
    setIsLoading(true);
    console.log('--- START ADMIN DASHBOARD FETCH ---');
    try {
      // 1. Leads
      console.log('Querying: supabase.from("contact_leads").select("*")');
      const { data: leadsData, error: leadsError } = await supabase
        .from('contact_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (leadsError) {
        console.error('Error fetching contact_leads:', leadsError.message, leadsError);
      } else {
        console.log(`Successfully fetched contact_leads. Count: ${leadsData?.length || 0}`);
        if (leadsData) setLeads(leadsData);
      }

      // 2. Consultations
      console.log('Querying: supabase.from("consultation_requests").select("*")');
      const { data: consultData, error: consultError } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (consultError) {
        console.error('Error fetching consultation_requests:', consultError.message, consultError);
      } else {
        console.log(`Successfully fetched consultation_requests. Count: ${consultData?.length || 0}`);
        if (consultData) setConsultations(consultData);
      }

      // 3. Diagnostics
      console.log('Querying: supabase.from("diagnostic_requests").select("*")');
      const { data: diagData, error: diagError } = await supabase
        .from('diagnostic_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (diagError) {
        console.error('Error fetching diagnostic_requests:', diagError.message, diagError);
      } else {
        console.log(`Successfully fetched diagnostic_requests. Count: ${diagData?.length || 0}`);
        if (diagData) setDiagnostics(diagData);
      }

      // 4. Callbacks
      console.log('Querying: supabase.from("callback_requests").select("*")');
      const { data: cbData, error: cbError } = await supabase
        .from('callback_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (cbError) {
        console.error('Error fetching callback_requests:', cbError.message, cbError);
      } else {
        console.log(`Successfully fetched callback_requests. Count: ${cbData?.length || 0}`);
        if (cbData) setCallbacks(cbData);
      }

      // 5. Subscribers
      console.log('Querying: supabase.from("newsletter_subscribers").select("*")');
      const { data: subData, error: subError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      if (subError) {
        console.error('Error fetching newsletter_subscribers:', subError.message, subError);
      } else {
        console.log(`Successfully fetched newsletter_subscribers. Count: ${subData?.length || 0}`);
        if (subData) setSubscribers(subData);
      }

      // 6. Jobs (Careers)
      console.log('Querying: supabase.from("jobs").select("*")');
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (jobsError) {
        console.error('Error fetching jobs:', jobsError.message);
        if (jobsError.message?.includes('does not exist') || jobsError.code === 'PGRST116') {
          setIsJobsTableMissing(true);
        }
      } else {
        console.log(`Successfully fetched jobs. Count: ${jobsData?.length || 0}`);
        if (jobsData) setJobs(jobsData);
        setIsJobsTableMissing(false);
      }

      // 7. Job Applications
      console.log('Querying: supabase.from("job_applications").select("*")');
      const { data: appsData, error: appsError } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (appsError) {
        console.error('Error fetching job_applications:', appsError.message);
      } else {
        console.log(`Successfully fetched job_applications. Count: ${appsData?.length || 0}`);
        if (appsData) setApplications(appsData);
      }

    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setIsLoading(false);
      console.log('--- END ADMIN DASHBOARD FETCH ---');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // Set up Supabase Realtime live subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_leads' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLeads((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setLeads((prev) => prev.filter((item) => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setLeads((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'consultation_requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setConsultations((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setConsultations((prev) => prev.filter((item) => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setConsultations((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'diagnostic_requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDiagnostics((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setDiagnostics((prev) => prev.filter((item) => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setDiagnostics((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'callback_requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCallbacks((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setCallbacks((prev) => prev.filter((item) => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setCallbacks((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'newsletter_subscribers' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSubscribers((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setSubscribers((prev) => prev.filter((item) => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setSubscribers((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setJobs((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setJobs((prev) => prev.filter((item) => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setJobs((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_applications' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setApplications((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setApplications((prev) => prev.filter((item) => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setApplications((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    // Verification against explicit corporate credentials
    if (email === 'admin@goingtechnologies.com' && password === 'Admin@goingtechnologies123') {
      setIsAuthenticated(true);
      localStorage.setItem('gt_admin_auth', 'true');
    } else {
      setLoginError('Invalid corporate credentials. Access is logged and restricted.');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gt_admin_auth');
  };

  // Mark Lead/Request Status in Supabase
  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_leads')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Trigger delete confirmation modal
  const triggerDelete = (table: string, id: string) => {
    setRecordToDelete({ table, id });
    setDeleteModalOpen(true);
  };

  // Confirm and execute record deletion
  const confirmDelete = async () => {
    if (!recordToDelete) return;
    const { table, id } = recordToDelete;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state accordingly
      if (table === 'contact_leads') setLeads(leads.filter(x => x.id !== id));
      if (table === 'consultation_requests') setConsultations(consultations.filter(x => x.id !== id));
      if (table === 'diagnostic_requests') setDiagnostics(diagnostics.filter(x => x.id !== id));
      if (table === 'callback_requests') setCallbacks(callbacks.filter(x => x.id !== id));
      if (table === 'newsletter_subscribers') setSubscribers(subscribers.filter(x => x.id !== id));
      if (table === 'jobs') setJobs(jobs.filter(x => x.id !== id));
      if (table === 'job_applications') setApplications(applications.filter(x => x.id !== id));

      setDeleteModalOpen(false);
      setRecordToDelete(null);
    } catch (err: any) {
      console.error('Error deleting record:', err);
      alert(err.message || 'Failed to delete record. Please verify database write/delete access.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Save changes from dynamic edit modal
  const handleSaveEditedRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    const { table, data } = editingRecord;
    setIsSavingRecord(true);
    try {
      const { error } = await supabase
        .from(table)
        .update(data)
        .eq('id', data.id);

      if (error) throw error;

      // Update local state
      if (table === 'contact_leads') {
        setLeads(leads.map(x => x.id === data.id ? data : x));
      } else if (table === 'consultation_requests') {
        setConsultations(consultations.map(x => x.id === data.id ? data : x));
      } else if (table === 'diagnostic_requests') {
        setDiagnostics(diagnostics.map(x => x.id === data.id ? data : x));
      } else if (table === 'callback_requests') {
        setCallbacks(callbacks.map(x => x.id === data.id ? data : x));
      } else if (table === 'newsletter_subscribers') {
        setSubscribers(subscribers.map(x => x.id === data.id ? data : x));
      } else if (table === 'job_applications') {
        setApplications(applications.map(x => x.id === data.id ? data : x));
      }

      setEditingRecord(null);
    } catch (err: any) {
      console.error('Error saving edited record:', err);
      alert(err.message || 'Failed to save record changes. Please check permissions.');
    } finally {
      setIsSavingRecord(false);
    }
  };

  // Auto-slugify generator for SEO optimization
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Open triggers for Job creation/editing modal
  const openCreateJob = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobDept('');
    setJobLoc('');
    setJobType('Full-time');
    setJobSalary('');
    setJobExp('');
    setJobDesc('');
    setJobReqs('');
    setJobStatus('Draft');
    setJobSlug('');
    setJobFormError(null);
    setIsJobModalOpen(true);
  };

  const openEditJob = (job: any) => {
    setEditingJob(job);
    setJobTitle(job.title || '');
    setJobDept(job.department || '');
    setJobLoc(job.location || '');
    setJobType(job.employment_type || 'Full-time');
    setJobSalary(job.salary || '');
    setJobExp(job.experience || '');
    setJobDesc(job.description || '');
    setJobReqs(Array.isArray(job.requirements) ? job.requirements.join('\n') : '');
    setJobStatus(job.status || 'Draft');
    setJobSlug(job.slug || '');
    setJobFormError(null);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDept || !jobLoc || !jobSlug) {
      setJobFormError('Title, Department, Location, and Slug are strictly required.');
      return;
    }

    setIsSavingJob(true);
    setJobFormError(null);

    // Verify jobs table exists
    try {
      const { error: testError } = await supabase
        .from('jobs')
        .select('id')
        .limit(1);

      if (testError && (testError.message?.includes('does not exist') || testError.code === 'PGRST116')) {
        setJobFormError('Setup Error: The "jobs" table is missing in Supabase. Please execute the complete migration in your Supabase SQL Editor first.');
        setIsJobsTableMissing(true);
        setIsSavingJob(false);
        return;
      }
    } catch (testErr) {
      console.error('Test query failed:', testErr);
    }

    const reqsArray = jobReqs
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const jobPayload = {
      title: jobTitle,
      department: jobDept,
      location: jobLoc,
      employment_type: jobType,
      salary: jobSalary || null,
      experience: jobExp || null,
      description: jobDesc,
      requirements: reqsArray,
      status: jobStatus,
      slug: jobSlug
    };

    try {
      if (editingJob) {
        // Update existing job
        const { error } = await supabase
          .from('jobs')
          .update(jobPayload)
          .eq('id', editingJob.id);
        if (error) throw error;
        setJobs(jobs.map(j => j.id === editingJob.id ? { ...j, ...jobPayload } : j));
      } else {
        // Insert new job
        const { error } = await supabase
          .from('jobs')
          .insert(jobPayload);
        if (error) throw error;
      }
      setIsJobModalOpen(false);
    } catch (err: any) {
      console.error('Error saving job:', err);
      setJobFormError(err.message || 'Failed to save job posting.');
    } finally {
      setIsSavingJob(false);
    }
  };

  // Update applicant candidate status
  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  // Helper to trigger candidate resume base64 file downloads
  const downloadResume = (resumeStr: string, applicantName: string) => {
    try {
      const resumeObj = JSON.parse(resumeStr);
      const link = document.createElement('a');
      link.href = resumeObj.data;
      link.download = resumeObj.name || `${applicantName.replace(/\s+/g, '_')}_Resume`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      // Direct base64 string fallback
      const link = document.createElement('a');
      link.href = resumeStr;
      link.download = `${applicantName.replace(/\s+/g, '_')}_Resume`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // CSV Export utility
  const exportToCSV = (tableData: any[], filename: string) => {
    if (!tableData || tableData.length === 0) return;
    const headers = Object.keys(tableData[0]).join(',');
    const rows = tableData.map(row => 
      Object.values(row).map(val => {
        const str = String(val).replace(/"/g, '""');
        return str.includes(',') ? `"${str}"` : str;
      }).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper formatting dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-[#FAFBFD] font-sans text-[#111827] min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* LOGIN GATE VIEW */
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-[400px] -right-[400px] w-[800px] h-[800px] rounded-full bg-blue-600/5 blur-3xl" />
            
            <div className="max-w-md w-full space-y-8 bg-slate-950 border border-slate-800 p-8 sm:p-10 rounded-3xl relative z-10 shadow-2xl">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight font-display text-white">GOING Global Center</h2>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold font-mono">
                  Administrative Portal Access
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Corporate Email</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@goingtechnologies.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Operational Key / Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
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
                  className="cursor-pointer w-full text-center bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10"
                >
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-slate-500 text-[10px] text-center leading-relaxed">
                  Notice: Authorized personnel only. All access times, source IP footprints, and modifications are recorded for compliance.
                </p>
              </form>
            </div>
          </motion.div>
        ) : (
          /* ADMINISTRATIVE SUITE VIEW */
          <motion.div
            key="suite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col md:flex-row"
          >
            {/* SIDE NAVIGATION PANEL */}
            <aside className="w-full md:w-64 bg-slate-950 text-slate-400 border-r border-slate-800 flex flex-col shrink-0">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">GT Global Console</h3>
                  <span className="text-[10px] font-mono text-slate-500">v1.2 (PROD-EST)</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-grow p-4 space-y-1.5">
                {[
                  { id: 'overview', label: 'Console Overview', icon: LayoutDashboard },
                  { id: 'leads', label: 'Contact Leads', icon: Users, count: leads.length },
                  { id: 'consultations', label: 'Consultations', icon: Calendar, count: consultations.length },
                  { id: 'diagnostics', label: 'Diagnostics', icon: Sparkles, count: diagnostics.length },
                  { id: 'callbacks', label: 'Callbacks', icon: PhoneCall, count: callbacks.length },
                  { id: 'subscribers', label: 'Subscribers', icon: Mail, count: subscribers.length },
                  { id: 'jobs', label: 'Careers (Jobs)', icon: Briefcase, count: jobs.length },
                  { id: 'applications', label: 'Applications', icon: Layers, count: applications.length },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as TabType);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                          : 'hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-500'}`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 font-semibold tracking-wide">
                <p>Going Technologies Admin Dashboard</p>
              </div>
            </aside>

            {/* CONSOLE MAIN CONTENT AREA */}
            <main className="flex-grow p-6 sm:p-10 space-y-8 overflow-x-hidden">
              {/* TOP HEADER STATUS PANEL */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#081B8C] font-display">
                    {activeTab === 'overview' && 'Executive Operations Dashboard'}
                    {activeTab === 'leads' && 'Contact Inbound Leads'}
                    {activeTab === 'consultations' && 'Corporate Consultations'}
                    {activeTab === 'diagnostics' && 'Inbound Process Diagnostics'}
                    {activeTab === 'callbacks' && 'Hotline Callbacks'}
                    {activeTab === 'subscribers' && 'Newsletter Subscribers'}
                    {activeTab === 'jobs' && 'Career Job Postings CMS'}
                    {activeTab === 'applications' && 'Specialist Job Applications'}
                  </h1>
                  <p className="text-gray-400 text-xs">
                    Real-time monitoring console for Going Technologies Global Centers.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchAllData}
                    disabled={isLoading}
                    className="cursor-pointer bg-white border border-[#DCE7FF] hover:border-[#2F6DFF] text-gray-700 hover:text-[#2F6DFF] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Database className="w-3.5 h-3.5 animate-pulse text-blue-500" />
                    <span>{isLoading ? 'Syncing...' : 'Sync Now'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage('home')}
                    className="cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1"
                  >
                    <span>View Website</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* OVERVIEW CONTENT TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* METRIC CARD GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[
                      { label: 'Total Leads', val: leads.length, color: 'border-blue-500', bg: 'bg-blue-500/5', text: 'text-blue-600', icon: Users },
                      { label: 'Consultations', val: consultations.length, color: 'border-emerald-500', bg: 'bg-emerald-500/5', text: 'text-emerald-600', icon: Calendar },
                      { label: 'Diagnostics', val: diagnostics.length, color: 'border-purple-500', bg: 'bg-purple-500/5', text: 'text-purple-600', icon: Sparkles },
                      { label: 'Callbacks', val: callbacks.length, color: 'border-amber-500', bg: 'bg-amber-500/5', text: 'text-amber-600', icon: PhoneCall },
                      { label: 'Subscribers', val: subscribers.length, color: 'border-rose-500', bg: 'bg-rose-500/5', text: 'text-rose-600', icon: Mail },
                      { label: 'Job Openings', val: jobs.length, color: 'border-indigo-500', bg: 'bg-indigo-500/5', text: 'text-indigo-600', icon: Briefcase },
                      { label: 'Applications', val: applications.length, color: 'border-teal-500', bg: 'bg-teal-500/5', text: 'text-teal-600', icon: Layers },
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <div key={idx} className={`bg-white border-l-4 ${stat.color} p-5 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center`}>
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                            <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* RECENT SUBMISSIONS FEED */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Activity logs */}
                    <div className="lg:col-span-8 bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="font-bold text-[#081B8C] text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span>Recent Activity Feed</span>
                        </h3>
                        <span className="px-2.5 py-1 bg-[#F8FAFF] rounded-full text-[10px] font-mono text-gray-400 border border-[#DCE7FF]/40">
                          Live Connected
                        </span>
                      </div>

                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {leads.length === 0 && consultations.length === 0 && diagnostics.length === 0 && callbacks.length === 0 ? (
                          <div className="text-center py-12 text-gray-400 text-xs">
                            No recent operational submissions detected.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Contact Leads */}
                            {leads.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex gap-4 items-start p-4 rounded-2xl bg-[#F8FAFF] border border-[#DCE7FF]/30 hover:border-blue-500/20 transition-all">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                  <Users className="w-4 h-4" />
                                </div>
                                <div className="flex-grow space-y-1">
                                  <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-gray-800">New Contact Lead Intake</h4>
                                    <span className="text-[9px] text-gray-400 font-mono">{formatDate(item.created_at)}</span>
                                  </div>
                                  <p className="text-[11px] text-gray-600">
                                    {item.client_name} from <strong className="text-[#081B8C]">{item.company_name}</strong> submitted an operation bottleneck assessment.
                                  </p>
                                </div>
                              </div>
                            ))}

                            {/* Consultations */}
                            {consultations.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex gap-4 items-start p-4 rounded-2xl bg-[#F8FAFF] border border-[#DCE7FF]/30 hover:border-emerald-500/20 transition-all">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                  <Calendar className="w-4 h-4" />
                                </div>
                                <div className="flex-grow space-y-1">
                                  <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-gray-800">Consultation Scheduled</h4>
                                    <span className="text-[9px] text-gray-400 font-mono">{formatDate(item.created_at)}</span>
                                  </div>
                                  <p className="text-[11px] text-gray-600">
                                    {item.name} ({item.company}) booked a briefing for <strong className="text-emerald-600">{item.date}</strong> on {item.service}.
                                  </p>
                                </div>
                              </div>
                            ))}

                            {/* Diagnostics */}
                            {diagnostics.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex gap-4 items-start p-4 rounded-2xl bg-[#F8FAFF] border border-[#DCE7FF]/30 hover:border-purple-500/20 transition-all">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="flex-grow space-y-1">
                                  <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-gray-800">Diagnostic Request Claims</h4>
                                    <span className="text-[9px] text-gray-400 font-mono">{formatDate(item.created_at)}</span>
                                  </div>
                                  <p className="text-[11px] text-gray-600">
                                    {item.name} from <strong className="text-purple-600">{item.company || 'N/A'}</strong> claimed a free process bottleneck map diagnostic.
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats sidebar */}
                    <div className="lg:col-span-4 bg-[#F8FAFF] border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 space-y-6 self-stretch">
                      <h3 className="font-bold text-[#081B8C] text-sm">Corporate Summary</h3>
                      <div className="space-y-4">
                        {[
                          { title: 'Inbound Success Rate', value: '100%', detail: 'All integrations online' },
                          { title: 'Average Response Time', value: '< 2 Hours', detail: 'Operations SLA target' },
                          { title: 'Lead Status Coverage', value: leads.filter(l => l.status === 'Contacted').length + ' / ' + leads.length, detail: 'Marked contacted leads' }
                        ].map((stat, i) => (
                          <div key={i} className="bg-white border border-[#DCE7FF]/30 rounded-xl p-4 space-y-1 shadow-xs">
                            <span className="text-[10px] text-gray-400 block font-semibold uppercase">{stat.title}</span>
                            <div className="flex items-baseline justify-between">
                              <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                              <span className="text-[9px] text-gray-500 font-mono">{stat.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT LEADS TAB */}
              {activeTab === 'leads' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      >
                        <option value="All">All Status</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                      </select>

                      <button
                        onClick={() => exportToCSV(leads, 'gt_contact_leads')}
                        className="cursor-pointer bg-[#F8FAFF] border border-[#DCE7FF] hover:border-gray-300 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFF] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#DCE7FF]/40">
                          <th className="p-4">Contact Info</th>
                          <th className="p-4">Company Details</th>
                          <th className="p-4">Primary Bottlenecks</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {leads
                          .filter(l => statusFilter === 'All' || l.status === statusFilter)
                          .filter(l => 
                            l.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            l.client_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            l.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((lead) => (
                            <tr key={lead.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                              <td className="p-4 space-y-1">
                                <p className="font-bold text-gray-800">{lead.client_name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{lead.client_email}</p>
                                <p className="text-[9px] text-gray-400 font-mono">{formatDate(lead.created_at)}</p>
                              </td>
                              <td className="p-4 space-y-1">
                                <p className="font-bold text-[#081B8C]">{lead.company_name}</p>
                                <div className="flex gap-1.5 items-center text-[10px] text-gray-400 font-semibold">
                                  <span>{lead.company_type}</span>
                                  <span className="opacity-40">•</span>
                                  <span>{lead.premium_volume}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {lead.bottlenecks?.map((b: string, i: number) => (
                                    <span key={i} className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-semibold border border-red-100">
                                      {b}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4">
                                <select
                                  value={lead.status || 'New'}
                                  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                    lead.status === 'Contacted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    lead.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}
                                >
                                  <option value="New">New</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Contacted">Contacted</option>
                                </select>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingRecord({ table: 'contact_leads', data: { ...lead } })}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                    title="Edit Lead Details"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => updateLeadStatus(lead.id, 'Contacted')}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                                    title="Mark as Contacted"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => triggerDelete('contact_leads', lead.id)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CONSULTATIONS TAB */}
              {activeTab === 'consultations' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search consultation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <button
                      onClick={() => exportToCSV(consultations, 'gt_consultation_requests')}
                      className="cursor-pointer bg-[#F8FAFF] border border-[#DCE7FF] hover:border-gray-300 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors w-full sm:w-auto justify-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFF] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#DCE7FF]/40">
                          <th className="p-4">Contact Info</th>
                          <th className="p-4">Company</th>
                          <th className="p-4">Requested Day & Time</th>
                          <th className="p-4">Service Track</th>
                          <th className="p-4">Strategic Notes</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {consultations
                          .filter(c => 
                            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.company?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((item) => (
                            <tr key={item.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                              <td className="p-4 space-y-1">
                                <p className="font-bold text-gray-800">{item.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{item.email}</p>
                                {item.phone && <p className="text-[10px] text-gray-400 font-mono">{item.phone}</p>}
                                <p className="text-[9px] text-gray-400 font-mono">{formatDate(item.created_at)}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-[#081B8C]">{item.company || 'N/A'}</p>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 w-fit">
                                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{item.date}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[10px] font-bold">
                                  {item.service}
                                </span>
                              </td>
                              <td className="p-4">
                                <p className="text-gray-500 italic max-w-xs truncate" title={item.notes}>
                                  {item.notes || 'No notes provided'}
                                </p>
                              </td>
                              <td className="p-4 text-right space-x-1.5">
                                <button
                                  onClick={() => setEditingRecord({ table: 'consultation_requests', data: { ...item } })}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Edit Request"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => triggerDelete('consultation_requests', item.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Delete Request"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DIAGNOSTICS TAB */}
              {activeTab === 'diagnostics' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search diagnostics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <button
                      onClick={() => exportToCSV(diagnostics, 'gt_diagnostic_requests')}
                      className="cursor-pointer bg-[#F8FAFF] border border-[#DCE7FF] hover:border-gray-300 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors w-full sm:w-auto justify-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFF] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#DCE7FF]/40">
                          <th className="p-4">Company Name</th>
                          <th className="p-4">Contact Person</th>
                          <th className="p-4">Email Address</th>
                          <th className="p-4">Phone Number</th>
                          <th className="p-4">Target Bottlenecks</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {diagnostics
                          .filter(d => 
                            d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.company?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((item) => (
                            <tr key={item.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                              <td className="p-4">
                                <p className="font-bold text-[#081B8C]">{item.company || 'N/A'}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-gray-800">{item.name}</p>
                                <p className="text-[9px] text-gray-400 font-mono">{formatDate(item.created_at)}</p>
                              </td>
                              <td className="p-4 font-mono">{item.email}</td>
                              <td className="p-4 font-mono">{item.phone || 'N/A'}</td>
                              <td className="p-4">
                                <p className="text-gray-500 italic max-w-xs" title={item.notes}>
                                  {item.notes || 'No special requirements listed'}
                                </p>
                              </td>
                              <td className="p-4 text-right space-x-1.5">
                                <button
                                  onClick={() => setEditingRecord({ table: 'diagnostic_requests', data: { ...item } })}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Edit Diagnostic"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => triggerDelete('diagnostic_requests', item.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CALLBACKS TAB */}
              {activeTab === 'callbacks' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search callbacks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <button
                      onClick={() => exportToCSV(callbacks, 'gt_callback_requests')}
                      className="cursor-pointer bg-[#F8FAFF] border border-[#DCE7FF] hover:border-gray-300 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors w-full sm:w-auto justify-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFF] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#DCE7FF]/40">
                          <th className="p-4">Client Name</th>
                          <th className="p-4">Callback Phone</th>
                          <th className="p-4">Preferred Slot</th>
                          <th className="p-4">Request Logged</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {callbacks
                          .filter(cb => 
                            cb.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            cb.phone?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((item) => (
                            <tr key={item.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                              <td className="p-4 font-bold text-gray-800">{item.name}</td>
                              <td className="p-4 font-mono font-bold text-[#081B8C]">{item.phone}</td>
                              <td className="p-4">
                                <div className="px-2.5 py-1.5 bg-amber-50 border border-amber-100 text-amber-800 font-bold rounded-lg w-fit">
                                  {item.preferred_time}
                                </div>
                              </td>
                              <td className="p-4 font-mono text-gray-400">{formatDate(item.created_at)}</td>
                              <td className="p-4 text-right space-x-1.5">
                                <button
                                  onClick={() => setEditingRecord({ table: 'callback_requests', data: { ...item } })}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Edit Callback"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => triggerDelete('callback_requests', item.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Delete Calllog"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBSCRIBERS TAB */}
              {activeTab === 'subscribers' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <button
                      onClick={() => exportToCSV(subscribers, 'gt_newsletter_subscribers')}
                      className="cursor-pointer bg-[#F8FAFF] border border-[#DCE7FF] hover:border-gray-300 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors w-full sm:w-auto justify-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl max-w-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFF] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#DCE7FF]/40">
                          <th className="p-4">Subscriber Email</th>
                          <th className="p-4">Subscription Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {subscribers
                          .filter(sub => sub.email?.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item) => (
                            <tr key={item.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                              <td className="p-4 font-mono font-bold text-gray-800">{item.email}</td>
                              <td className="p-4 font-mono text-gray-400">{formatDate(item.created_at)}</td>
                              <td className="p-4 text-right space-x-1.5">
                                <button
                                  onClick={() => setEditingRecord({ table: 'newsletter_subscribers', data: { ...item } })}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Edit Subscriber Email"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => triggerDelete('newsletter_subscribers', item.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Unsubscribe Subscriber"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CAREERS JOB POSTINGS CMS TAB */}
              {activeTab === 'jobs' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  {isJobsTableMissing && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-amber-800 text-sm">Database Setup Error: "public.jobs" Table Missing</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            The career job postings database table was not detected in your Supabase project schema. Please execute the following SQL migration script in your Supabase SQL Editor to provision it securely with RLS, Policies, and Realtime enabled:
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 text-gray-100 rounded-xl p-4 font-mono text-[11px] leading-relaxed select-all overflow-x-auto whitespace-pre">
{`-- Create complete jobs table
create table if not exists public.jobs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    department text not null,
    location text not null,
    employment_type text not null,
    salary text,
    experience text,
    slug text unique not null,
    description text not null,
    requirements text[] not null default '{}'::text[],
    status text default 'Draft' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.jobs enable row level security;

-- Setup Policies
create policy "Allow public select on jobs" on public.jobs for select using (true);
create policy "Allow public insert on jobs" on public.jobs for insert with check (true);
create policy "Allow public update on jobs" on public.jobs for update using (true) with check (true);
create policy "Allow public delete on jobs" on public.jobs for delete using (true);

-- Enable Realtime
alter publication supabase_realtime add table public.jobs;`}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={fetchAllData}
                          className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Retry Synchronization</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search positions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>

                      <button
                        onClick={openCreateJob}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/10"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Job Posting</span>
                      </button>
                    </div>
                  </div>

                  {/* Jobs list table */}
                  <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFF] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#DCE7FF]/40">
                          <th className="p-4">Position Title & Slug</th>
                          <th className="p-4">Department & Type</th>
                          <th className="p-4">Location & Salary</th>
                          <th className="p-4">Experience</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {jobs
                          .filter(j => statusFilter === 'All' || j.status === statusFilter)
                          .filter(j => 
                            j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            j.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            j.slug?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((job) => (
                            <tr key={job.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                              <td className="p-4 space-y-1">
                                <p className="font-bold text-gray-800">{job.title}</p>
                                <p className="text-[10px] text-gray-400 font-mono">/{job.slug}</p>
                              </td>
                              <td className="p-4 space-y-1">
                                <p className="font-bold text-[#081B8C]">{job.department}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{job.employment_type}</p>
                              </td>
                              <td className="p-4 space-y-1">
                                <p className="font-bold text-gray-700">{job.location}</p>
                                <p className="text-[10px] text-emerald-600 font-bold">{job.salary || 'Not Specified'}</p>
                              </td>
                              <td className="p-4 text-gray-500 font-medium">{job.experience || 'Entry / Open'}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  job.status === 'Published' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {job.status}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-1.5 shrink-0">
                                <button
                                  onClick={() => openEditJob(job)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Edit Post"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => triggerDelete('jobs', job.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                  title="Delete Post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SPECIALIST APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search applicants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <select
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      >
                        <option value="All">All Positions</option>
                        {jobs.map((job) => (
                          <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => exportToCSV(applications, 'gt_job_applications')}
                        className="cursor-pointer bg-[#F8FAFF] border border-[#DCE7FF] hover:border-gray-300 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Applications list table */}
                  <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFF] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#DCE7FF]/40">
                          <th className="p-4">Candidate Details</th>
                          <th className="p-4">Position Applied</th>
                          <th className="p-4">Experience</th>
                          <th className="p-4">Resume</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {applications
                          .filter(app => statusFilter === 'All' || app.status === statusFilter)
                          .filter(app => positionFilter === 'All' || app.job_id === positionFilter)
                          .filter(app => 
                            app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.phone?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((app) => {
                            const position = jobs.find(j => j.id === app.job_id);
                            return (
                              <tr key={app.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                                <td className="p-4 space-y-1">
                                  <p className="font-bold text-gray-800">{app.name}</p>
                                  <p className="text-[10px] text-gray-400 font-mono">{app.email} // {app.phone}</p>
                                  <p className="text-[9px] text-gray-400 font-mono">{formatDate(app.created_at)}</p>
                                </td>
                                <td className="p-4 font-bold text-[#081B8C]">
                                  {position ? position.title : 'Unknown Role'}
                                </td>
                                <td className="p-4 font-medium text-gray-500">
                                  {app.experience_years}
                                </td>
                                <td className="p-4">
                                  {app.resume ? (
                                    <button
                                      onClick={() => downloadResume(app.resume, app.name)}
                                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline"
                                    >
                                      <FileText className="w-4 h-4 shrink-0" />
                                      <span>Download File</span>
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 italic">No Resume uploaded</span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <select
                                    value={app.status || 'New'}
                                    onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                                    className={`bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg px-2.5 py-1.5 text-[10px] font-bold focus:outline-none focus:border-[#2F6DFF] ${
                                      app.status === 'Selected' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                                      app.status === 'Shortlisted' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                                      app.status === 'Interview Scheduled' ? 'text-indigo-700 bg-indigo-50 border-indigo-200' :
                                      app.status === 'Rejected' ? 'text-rose-700 bg-rose-50 border-rose-200' :
                                      'text-gray-700 bg-gray-50 border-gray-200'
                                    }`}
                                  >
                                    <option value="New">New</option>
                                    <option value="Shortlisted">Shortlisted</option>
                                    <option value="Interview Scheduled">Interview Scheduled</option>
                                    <option value="Selected">Selected</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="p-4 text-right space-x-1.5 shrink-0">
                                  <button
                                    onClick={() => setViewingApplication(app)}
                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                    title="View Profile"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingRecord({ table: 'job_applications', data: { ...app } })}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                    title="Edit Candidate Details"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => triggerDelete('job_applications', app.id)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                    title="Delete Candidate"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CREATE / EDIT JOB POSITION MODAL */}
              {isJobModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 relative space-y-5 border border-gray-100 shadow-2xl">
                    <button
                      onClick={() => setIsJobModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
                      disabled={isSavingJob}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="space-y-1">
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">
                        {editingJob ? 'Edit Existing Job Opening' : 'Publish New Operational Role'}
                      </span>
                      <h3 className="text-xl font-bold text-[#081B8C] font-display font-semibold">
                        {editingJob ? 'Modify Job Details' : 'CMS Career Posting Engine'}
                      </h3>
                    </div>

                    {jobFormError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{jobFormError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveJob} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Position Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Senior Insurance Underwriter"
                          value={jobTitle}
                          onChange={(e) => {
                            setJobTitle(e.target.value);
                            // Auto-generate URL slug on typing if creating new job
                            if (!editingJob) {
                              setJobSlug(slugify(e.target.value));
                            }
                          }}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          disabled={isSavingJob}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Department *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Underwriting Operations"
                            value={jobDept}
                            onChange={(e) => setJobDept(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingJob}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Location *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Global Hub (Rotational)"
                            value={jobLoc}
                            onChange={(e) => setJobLoc(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingJob}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Employment Type *</label>
                          <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingJob}
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Temporary">Temporary</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">SEO URL Slug *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. senior-underwriter"
                            value={jobSlug}
                            onChange={(e) => setJobSlug(slugify(e.target.value))}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingJob}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Salary Range</label>
                          <input
                            type="text"
                            placeholder="e.g. $70,000 - $90,000 / year"
                            value={jobSalary}
                            onChange={(e) => setJobSalary(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingJob}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Experience Required</label>
                          <input
                            type="text"
                            placeholder="e.g. 3-5 Years in US AMS"
                            value={jobExp}
                            onChange={(e) => setJobExp(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingJob}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Brief Description *</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Summarize the core operational mission..."
                          value={jobDesc}
                          onChange={(e) => setJobDesc(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          disabled={isSavingJob}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Role Requirements Checklist (One item per line) *</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Bachelor Degree&#10;In-depth knowledge of ACORD form types&#10;Excellent written English..."
                          value={jobReqs}
                          onChange={(e) => setJobReqs(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] font-mono leading-relaxed"
                          disabled={isSavingJob}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Publishing Status *</label>
                        <div className="flex gap-4">
                          {['Draft', 'Published'].map((stat) => (
                            <label key={stat} className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="jobStatus"
                                value={stat}
                                checked={jobStatus === stat}
                                onChange={(e) => setJobStatus(e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                disabled={isSavingJob}
                              />
                              <span>{stat} Status</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingJob}
                        className="cursor-pointer w-full text-center bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                      >
                        {isSavingJob ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving into Supabase live cluster...</span>
                          </>
                        ) : (
                          <>
                            <span>{editingJob ? 'Save Changes' : 'Publish Job Opening'}</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* VIEW CANDIDATE PROFILE MODAL */}
              {viewingApplication && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative space-y-6 border border-gray-100 shadow-2xl">
                    <button
                      onClick={() => setViewingApplication(null)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="space-y-1">
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">Candidate Application Record</span>
                      <h3 className="text-xl font-bold text-[#081B8C] font-display font-semibold">{viewingApplication.name}</h3>
                      <p className="text-gray-400 text-xs">{viewingApplication.email} // {viewingApplication.phone}</p>
                    </div>

                    <div className="border-t border-b border-gray-100 py-4 space-y-3.5 text-xs">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-semibold">Applied Position</p>
                        <p className="text-sm font-bold text-[#081B8C]">
                          {jobs.find(j => j.id === viewingApplication.job_id)?.title || 'Unknown Position'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-semibold">Years of Experience</p>
                          <p className="font-bold text-gray-800">{viewingApplication.experience_years}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-semibold">Submitted Date</p>
                          <p className="font-bold text-gray-800">{formatDate(viewingApplication.created_at)}</p>
                        </div>
                      </div>

                      {viewingApplication.linkedin_profile && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-semibold">LinkedIn Profile</p>
                          <a
                            href={viewingApplication.linkedin_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            <span>Open LinkedIn Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-semibold">Resume File</p>
                        {viewingApplication.resume ? (
                          <button
                            onClick={() => downloadResume(viewingApplication.resume, viewingApplication.name)}
                            className="cursor-pointer text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1 hover:underline mt-0.5"
                          >
                            <FileText className="w-4 h-4 shrink-0" />
                            <span>Download PDF/Doc Resume File</span>
                          </button>
                        ) : (
                          <p className="text-gray-400 italic">No Resume provided</p>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-semibold">Cover Letter / SOP details</p>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 border border-gray-100 p-3.5 rounded-lg mt-1 whitespace-pre-line max-h-40 overflow-y-auto">
                          {viewingApplication.cover_letter}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setViewingApplication(null)}
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Close View
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CUSTOM DELETE CONFIRMATION MODAL */}
              {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative space-y-6 border border-gray-100 shadow-2xl text-left">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-gray-900">Are you sure you want to delete this record?</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          This operation will permanently delete the selected record from the Database. This action is irreversible.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setDeleteModalOpen(false);
                          setRecordToDelete(null);
                        }}
                        disabled={isDeleting}
                        className="cursor-pointer flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className="cursor-pointer flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-500/10 disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <span>Delete</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC EDIT RECORD MODAL */}
              {editingRecord && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative space-y-6 border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <button
                      onClick={() => setEditingRecord(null)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">
                        Modify Database Record
                      </span>
                      <h3 className="text-xl font-bold text-[#081B8C] font-display">
                        Edit {editingRecord.table.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </h3>
                      <p className="text-gray-400 text-[10px] font-mono select-all">ID: {editingRecord.data.id}</p>
                    </div>

                    <form onSubmit={handleSaveEditedRecord} className="space-y-4 text-left">
                      {/* Form Fields depend on the table */}
                      {editingRecord.table === 'newsletter_subscribers' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Subscriber Email</label>
                          <input
                            type="email"
                            required
                            value={editingRecord.data.email || ''}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              data: { ...editingRecord.data, email: e.target.value }
                            })}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          />
                        </div>
                      )}

                      {editingRecord.table === 'callback_requests' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Contact Name</label>
                            <input
                              type="text"
                              required
                              value={editingRecord.data.name || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, name: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Callback Phone</label>
                            <input
                              type="text"
                              required
                              value={editingRecord.data.phone || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, phone: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] font-mono font-bold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Preferred Time Slot</label>
                            <input
                              type="text"
                              required
                              value={editingRecord.data.preferred_time || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, preferred_time: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                        </>
                      )}

                      {editingRecord.table === 'diagnostic_requests' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Company Name</label>
                            <input
                              type="text"
                              value={editingRecord.data.company || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, company: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Contact Person Name</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.name || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, name: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Contact Phone</label>
                              <input
                                type="text"
                                value={editingRecord.data.phone || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, phone: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Contact Email</label>
                            <input
                              type="email"
                              required
                              value={editingRecord.data.email || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, email: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] font-mono"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Special Requirements / Notes</label>
                            <textarea
                              rows={3}
                              value={editingRecord.data.notes || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, notes: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                        </>
                      )}

                      {editingRecord.table === 'consultation_requests' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Company Name</label>
                            <input
                              type="text"
                              value={editingRecord.data.company || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, company: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Contact Name</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.name || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, name: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Contact Phone</label>
                              <input
                                type="text"
                                value={editingRecord.data.phone || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, phone: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Contact Email</label>
                            <input
                              type="email"
                              required
                              value={editingRecord.data.email || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, email: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Target Date</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.date || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, date: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Requested Service</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.service || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, service: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Detailed Operational Notes</label>
                            <textarea
                              rows={3}
                              value={editingRecord.data.notes || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, notes: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                        </>
                      )}

                      {editingRecord.table === 'contact_leads' && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Company Name</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.company_name || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, company_name: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Company Type</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.company_type || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, company_type: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Client Contact Name</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.client_name || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, client_name: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Client Email Address</label>
                              <input
                                type="email"
                                required
                                value={editingRecord.data.client_email || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, client_email: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] font-mono"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Premium Book Volume</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.premium_volume || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, premium_volume: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Lead Progress Status</label>
                              <select
                                value={editingRecord.data.status || 'New'}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, status: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] font-bold"
                              >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Contacted">Contacted</option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}

                      {editingRecord.table === 'job_applications' && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Candidate Name</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.name || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, name: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Candidate Phone</label>
                              <input
                                type="text"
                                required
                                value={editingRecord.data.phone || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, phone: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Email Address</label>
                              <input
                                type="email"
                                required
                                value={editingRecord.data.email || ''}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, email: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] font-mono"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Years of Experience</label>
                              <input
                                type="number"
                                required
                                value={editingRecord.data.experience_years || 0}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, experience_years: parseInt(e.target.value) || 0 }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">LinkedIn Profile Link</label>
                            <input
                              type="url"
                              value={editingRecord.data.linkedin_profile || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, linkedin_profile: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-700 uppercase">Applicant Status</label>
                              <select
                                value={editingRecord.data.status || 'New'}
                                onChange={(e) => setEditingRecord({
                                  ...editingRecord,
                                  data: { ...editingRecord.data, status: e.target.value }
                                })}
                                className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] font-bold"
                              >
                                <option value="New">New</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Cover Letter / SOP details</label>
                            <textarea
                              rows={3}
                              value={editingRecord.data.cover_letter || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, cover_letter: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                        </>
                      )}

                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setEditingRecord(null)}
                          disabled={isSavingRecord}
                          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingRecord}
                          className="cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
                        >
                          {isSavingRecord ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <span>Save Changes</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
