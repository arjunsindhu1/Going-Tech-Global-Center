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
  RefreshCw,
  Key,
  Bell,
  Folder,
  Shield,
  Check,
  Loader2,
  Upload,
  Archive
} from 'lucide-react';
import { PageType } from '../types';
import { supabase } from '../lib/supabase';
import { getLocalLeads, saveLocalLead, deleteLocalLead, updateLocalLead } from '../utils/localLeadsFallback';
import { broadcastChange } from '../utils/realtimeHelper';
import { BLOG_POSTS } from '../data';

interface AdminProps {
  setCurrentPage: (page: PageType) => void;
}

type TabType = 'overview' | 'leads' | 'consultations' | 'diagnostics' | 'callbacks' | 'subscribers' | 'jobs' | 'applications' | 'blogs' | 'whatsapp_leads' | 'business_tool_leads' | 'business_proposal_leads' | 'client_portal_access' | 'client_accounts' | 'client_credentials' | 'client_documents' | 'client_notifications' | 'auth_logs' | 'archived_clients';

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

  // New Lead Category Specific Filters & Sorting & Pagination
  const [whatsappStatusFilter, setWhatsappStatusFilter] = useState('All');
  const [whatsappSortField, setWhatsappSortField] = useState('created_at');
  const [whatsappSortOrder, setWhatsappSortOrder] = useState<'asc' | 'desc'>('desc');
  const [whatsappPage, setWhatsappPage] = useState(1);

  const [toolsStatusFilter, setToolsStatusFilter] = useState('All');
  const [toolsSortField, setToolsSortField] = useState('created_at');
  const [toolsSortOrder, setToolsSortOrder] = useState<'asc' | 'desc'>('desc');
  const [toolsPage, setToolsPage] = useState(1);

  const [proposalStatusFilter, setProposalStatusFilter] = useState('All');
  const [proposalSortField, setProposalSortField] = useState('created_at');
  const [proposalSortOrder, setProposalSortOrder] = useState<'asc' | 'desc'>('desc');
  const [proposalPage, setProposalPage] = useState(1);

  const itemsPerPage = 10;

  // Database records state
  const [leads, setLeads] = useState<any[]>([]);
  const [whatsappLeads, setWhatsappLeads] = useState<any[]>([]);
  const [businessToolLeads, setBusinessToolLeads] = useState<any[]>([]);
  const [businessProposalLeads, setBusinessProposalLeads] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // Blog Management CMS state
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [deletedStaticBlogs, setDeletedStaticBlogs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deleted_static_blogs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('deleted_static_blogs', JSON.stringify(deletedStaticBlogs));
  }, [deletedStaticBlogs]);

  const [blogCategoriesList, setBlogCategoriesList] = useState<any[]>([]);
  const [isBlogsTableMissing, setIsBlogsTableMissing] = useState(false);
  const [isSavingBlog, setIsSavingBlog] = useState(false);
  const [blogFormError, setBlogFormError] = useState<string | null>(null);

  // Blog Add Modal Fields
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogShortDesc, setBlogShortDesc] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Insurance Operations');
  const [blogAuthor, setBlogAuthor] = useState('Going Technologies Team');
  const [blogReadTime, setBlogReadTime] = useState('5 Min Read');
  const [blogMetaTitle, setBlogMetaTitle] = useState('');
  
  // Careers & Applications CMS state
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [clientAccounts, setClientAccounts] = useState<any[]>([]);
  
  // High-Security Client Workspace Admin states
  const [allClientCredentials, setAllClientCredentials] = useState<any[]>([]);
  const [allClientDocuments, setAllClientDocuments] = useState<any[]>([]);
  const [allClientNotifications, setAllClientNotifications] = useState<any[]>([]);
  const [credentialsSearchQuery, setCredentialsSearchQuery] = useState('');
  const [expandedClientIds, setExpandedClientIds] = useState<string[]>([]);
  const [documentsSearchQuery, setDocumentsSearchQuery] = useState('');
  const [notificationsSearchQuery, setNotificationsSearchQuery] = useState('');

  const [selectedClientWorkspace, setSelectedClientWorkspace] = useState<any | null>(null);
  const [workspaceCredentials, setWorkspaceCredentials] = useState<any[]>([]);
  const [workspaceDocuments, setWorkspaceDocuments] = useState<any[]>([]);
  const [workspaceActivity, setWorkspaceActivity] = useState<any[]>([]);
  const [workspaceTab, setWorkspaceTab] = useState<'credentials' | 'documents' | 'activity'>('credentials');
  const [isUploadingToClient, setIsUploadingToClient] = useState(false);
  const [authLogs, setAuthLogs] = useState<any[]>([]);
  const [accountSearchQuery, setAccountSearchQuery] = useState('');
  const [selectedAccountForReset, setSelectedAccountForReset] = useState<any | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);
  const [authLogsSearchQuery, setAuthLogsSearchQuery] = useState('');
  const [authLogTypeFilter, setAuthLogTypeFilter] = useState('All');
  const [adminAlert, setAdminAlert] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // RBAC State and Preview States
  const [adminRole, setAdminRole] = useState<'super' | 'normal'>(() => {
    return (localStorage.getItem('gt_admin_role') as 'super' | 'normal') || 'super';
  });
  const [previewingDoc, setPreviewingDoc] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleToggleRole = () => {
    const newRole = adminRole === 'super' ? 'normal' : 'super';
    setAdminRole(newRole);
    localStorage.setItem('gt_admin_role', newRole);
    setAdminAlert({
      message: `Switched administrative scope to: ${newRole === 'super' ? 'Super Admin (Full CRUD permissions)' : 'Normal Admin (Read-Only/View permissions)'}`,
      type: 'info'
    });
  };

  useEffect(() => {
    if (!adminAlert) return;
    const timer = setTimeout(() => {
      setAdminAlert(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [adminAlert]);

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

      // 8. Background Migration of Legacy Proposal Downloads to Business Proposal Leads (One-time, non-blocking)
      try {
        console.log('Checking for legacy proposal_downloads to migrate...');
        const { data: legacyDownloads, error: legacyError } = await supabase
          .from('proposal_downloads')
          .select('*');
        
        if (!legacyError && legacyDownloads && legacyDownloads.length > 0) {
          console.log(`Found ${legacyDownloads.length} legacy downloads. Starting migration...`);
          
          // Get the current list of business_proposal_leads to avoid duplicates
          const { data: existingLeads } = await supabase
            .from('business_proposal_leads')
            .select('agency_name, company_email, created_at');
          
          const currentLeads = existingLeads || [];
          const migratedToInsert: any[] = [];
          
          for (const old of legacyDownloads) {
            const email = (old.email || '').trim().toLowerCase();
            const domain = (old.company_domain || '').trim();
            const derivedAgency = domain 
              ? domain.split('.')[0].toUpperCase() 
              : (old.email ? old.email.split('@')[0].toUpperCase() : 'UNKNOWN AGENCY');
            const createdAt = old.created_at || old.download_time;
            const createdDateStr = createdAt ? new Date(createdAt).toISOString().split('T')[0] : '';
            
            // Check if duplicate exists in existingLeads
            const isDuplicateInCurrent = currentLeads.some(lead => {
              const leadEmail = (lead.company_email || '').trim().toLowerCase();
              const leadAgency = (lead.agency_name || '').trim().toLowerCase();
              const leadDateStr = lead.created_at ? new Date(lead.created_at).toISOString().split('T')[0] : '';
              
              return leadEmail === email && 
                     (leadAgency === derivedAgency.toLowerCase() || leadDateStr === createdDateStr);
            });
            
            // Check if already in the batch to insert
            const isDuplicateInBatch = migratedToInsert.some(item => {
              const batchEmail = (item.company_email || '').trim().toLowerCase();
              const batchAgency = (item.agency_name || '').trim().toLowerCase();
              const batchDateStr = item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '';
              
              return batchEmail === email && 
                     (batchAgency === derivedAgency.toLowerCase() || batchDateStr === createdDateStr);
            });
            
            if (!isDuplicateInCurrent && !isDuplicateInBatch) {
              migratedToInsert.push({
                agency_name: derivedAgency,
                company_email: email,
                sector: 'Technology',
                proposal_name: old.downloaded_file || 'Going Technologies Insurance operations proposal.pdf',
                status: 'Downloaded',
                source: old.source || 'Legacy Download',
                created_at: createdAt || new Date().toISOString()
              });
            }
          }
          
          if (migratedToInsert.length > 0) {
            console.log(`Inserting ${migratedToInsert.length} non-duplicate migrated rows into business_proposal_leads...`);
            const { error: insertError } = await supabase
              .from('business_proposal_leads')
              .insert(migratedToInsert);
            
            if (insertError) {
              console.warn('Migration insert warning (RLS or database constraint):', insertError.message);
              // Save to local storage fallback so these records are not lost to the admin
              migratedToInsert.forEach(item => {
                const localItem = {
                  ...item,
                  id: item.id || `mig-${Math.random().toString(36).substr(2, 9)}`,
                  business_email: item.company_email,
                  business_sector: item.sector
                };
                saveLocalLead('business_proposal_leads', localItem);
              });
              // Attempt to clean up legacy proposal_downloads to prevent repeated failing migration attempts
              const idsToDelete = legacyDownloads.map(x => x.id);
              if (idsToDelete.length > 0) {
                try {
                  await supabase.from('proposal_downloads').delete().in('id', idsToDelete);
                } catch (delErr) {
                  console.warn('Could not delete old proposal_downloads after fallback:', delErr);
                }
              }
            } else {
              console.log('Migration successfully completed!');
              // Clean up or delete migrated rows from proposal_downloads to prevent repeated checks
              const idsToDelete = legacyDownloads.map(x => x.id);
              if (idsToDelete.length > 0) {
                try {
                  await supabase.from('proposal_downloads').delete().in('id', idsToDelete);
                } catch (delErr) {
                  console.warn('Could not delete old proposal_downloads:', delErr);
                }
              }
            }
          } else {
            console.log('All legacy downloads were already migrated (duplicates skipped). Cleaning up old records.');
            const idsToDelete = legacyDownloads.map(x => x.id);
            if (idsToDelete.length > 0) {
              try {
                await supabase.from('proposal_downloads').delete().in('id', idsToDelete);
              } catch (delErr) {
                console.warn('Could not delete old proposal_downloads:', delErr);
              }
            }
          }
        } else if (legacyError) {
          // Table probably doesn't exist anymore or was dropped, which is fine
          console.log('Legacy proposal_downloads table not found or inaccessible. Skipping migration.');
        } else {
          console.log('No legacy downloads to migrate.');
        }
      } catch (migrationErr) {
        console.warn('Exception during legacy proposal_downloads migration:', migrationErr);
      }

      // 9. Blogs
      console.log('Querying: supabase.from("blogs").select("*")');
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      if (blogsError) {
        console.error('Error fetching blogs:', blogsError.message);
        if (blogsError.message?.includes('does not exist') || blogsError.code === 'PGRST116') {
          setIsBlogsTableMissing(true);
        }
      } else {
        console.log(`Successfully fetched blogs. Count: ${blogsData?.length || 0}`);
        if (blogsData) setBlogsList(blogsData);
        setIsBlogsTableMissing(false);
      }

      // 10. Blog Categories
      console.log('Querying: supabase.from("blog_categories").select("*")');
      const { data: catsData, error: catsError } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true });
      if (catsError) {
        console.error('Error fetching blog_categories:', catsError.message);
      } else {
        console.log(`Successfully fetched blog_categories. Count: ${catsData?.length || 0}`);
        if (catsData) setBlogCategoriesList(catsData);
      }

      // 11. WhatsApp Contact Leads
      console.log('Querying: supabase.from("whatsapp_contact_leads").select("*")');
      try {
        const { data: waData, error: waError } = await supabase
          .from('whatsapp_contact_leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (waError) {
          const isMissingTable = waError.code === 'PGRST205' || waError.message?.includes('schema cache') || waError.message?.includes('does not exist');
          if (isMissingTable) {
            console.warn('whatsapp_contact_leads table missing in Supabase. Using localStorage fallback.');
          } else {
            console.warn('Error fetching whatsapp_contact_leads from database:', waError.message);
          }
          setWhatsappLeads(getLocalLeads('whatsapp_contact_leads'));
        } else {
          console.log(`Successfully fetched whatsapp_contact_leads. Count: ${waData?.length || 0}`);
          const localLeads = getLocalLeads('whatsapp_contact_leads');
          const merged = [...(waData || [])];
          localLeads.forEach(loc => {
            if (!merged.some(m => m.id === loc.id)) {
              merged.push(loc);
            }
          });
          setWhatsappLeads(merged);
        }
      } catch (err) {
        console.warn('Exception fetching whatsapp_contact_leads:', err);
        setWhatsappLeads(getLocalLeads('whatsapp_contact_leads'));
      }

      // 12. Business Tool Leads
      console.log('Querying: supabase.from("business_tool_leads").select("*")');
      try {
        const { data: toolLeadsData, error: toolLeadsError } = await supabase
          .from('business_tool_leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (toolLeadsError) {
          const isMissingTable = toolLeadsError.code === 'PGRST205' || toolLeadsError.message?.includes('schema cache') || toolLeadsError.message?.includes('does not exist');
          if (isMissingTable) {
            console.warn('business_tool_leads table missing in Supabase. Using localStorage fallback.');
          } else {
            console.warn('Error fetching business_tool_leads from database:', toolLeadsError.message);
          }
          setBusinessToolLeads(getLocalLeads('business_tool_leads'));
        } else {
          console.log(`Successfully fetched business_tool_leads. Count: ${toolLeadsData?.length || 0}`);
          const localLeads = getLocalLeads('business_tool_leads');
          const mappedDbLeads = (toolLeadsData || []).map((lead: any) => ({
            ...lead,
            business_email: lead.business_email || lead.company_email,
            business_sector: lead.business_sector || lead.sector
          }));
          const merged = [...mappedDbLeads];
          localLeads.forEach(loc => {
            if (!merged.some(m => m.id === loc.id)) {
              merged.push({
                ...loc,
                business_email: loc.business_email || loc.company_email,
                business_sector: loc.business_sector || loc.sector
              });
            }
          });
          setBusinessToolLeads(merged);
        }
      } catch (err) {
        console.warn('Exception fetching business_tool_leads:', err);
        setBusinessToolLeads(getLocalLeads('business_tool_leads'));
      }

      // 13. Business Proposal Leads
      console.log('Querying: supabase.from("business_proposal_leads").select("*")');
      try {
        const { data: propLeadsData, error: propLeadsError } = await supabase
          .from('business_proposal_leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (propLeadsError) {
          const isMissingTable = propLeadsError.code === 'PGRST205' || propLeadsError.message?.includes('schema cache') || propLeadsError.message?.includes('does not exist');
          if (isMissingTable) {
            console.warn('business_proposal_leads table missing in Supabase. Using localStorage fallback.');
          } else {
            console.warn('Error fetching business_proposal_leads from database:', propLeadsError.message);
          }
          setBusinessProposalLeads(getLocalLeads('business_proposal_leads'));
        } else {
          console.log(`Successfully fetched business_proposal_leads. Count: ${propLeadsData?.length || 0}`);
          const localLeads = getLocalLeads('business_proposal_leads');
          const mappedDbLeads = (propLeadsData || []).map((lead: any) => ({
            ...lead,
            business_email: lead.business_email || lead.company_email,
            business_sector: lead.business_sector || lead.sector
          }));
          const merged = [...mappedDbLeads];
          localLeads.forEach(loc => {
            if (!merged.some(m => m.id === loc.id)) {
              merged.push({
                ...loc,
                business_email: loc.business_email || loc.company_email,
                business_sector: loc.business_sector || loc.sector
              });
            }
          });
          setBusinessProposalLeads(merged);
        }
      } catch (err) {
        console.warn('Exception fetching business_proposal_leads:', err);
        setBusinessProposalLeads(getLocalLeads('business_proposal_leads'));
      }

      // 14. Client Accounts (Real-Time Client Profiles sync)
      console.log('Querying: supabase.from("client_profiles").select("*")');
      try {
        const { data: accountsData, error: accountsError } = await supabase
          .from('client_profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (accountsError) {
          console.warn('Error fetching client_profiles from database:', accountsError.message);
          setClientAccounts([]);
        } else {
          console.log(`Successfully fetched client_profiles. Count: ${accountsData?.length || 0}`);
          setClientAccounts(accountsData || []);
        }
      } catch (err) {
        console.warn('Exception fetching client_profiles:', err);
        setClientAccounts([]);
      }

      // 14.b Global Client Credentials (for view-only Admin page)
      try {
        const { data: credsData } = await supabase
          .from('client_credentials')
          .select('*')
          .order('created_at', { ascending: false });
        setAllClientCredentials(credsData || []);
      } catch (err) {
        console.warn('Exception fetching all client_credentials:', err);
      }

      // 14.c Global Client Documents (for view-only Admin page)
      try {
        const { data: docsData } = await supabase
          .from('client_documents')
          .select('*')
          .order('created_at', { ascending: false });
        setAllClientDocuments(docsData || []);
      } catch (err) {
        console.warn('Exception fetching all client_documents:', err);
      }

      // 14.d Global Client Notifications (for Activity notifications log)
      try {
        const { data: notifData } = await supabase
          .from('client_notifications')
          .select('*')
          .order('created_at', { ascending: false });
        setAllClientNotifications(notifData || []);
      } catch (err) {
        console.warn('Exception fetching all client_notifications:', err);
      }

      // 15. Authentication Audit Logs
      console.log('Querying: supabase.from("auth_logs").select("*")');
      try {
        const { data: logsData, error: logsError } = await supabase
          .from('auth_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (logsError) {
          const isMissingTable = logsError.code === 'PGRST205' || logsError.message?.includes('schema cache') || logsError.message?.includes('does not exist');
          if (isMissingTable) {
            console.warn('auth_logs table missing in Supabase. Using localStorage fallback.');
          } else {
            console.warn('Error fetching auth_logs from database:', logsError.message);
          }
          setAuthLogs(getLocalLeads('auth_logs'));
        } else {
          console.log(`Successfully fetched auth_logs. Count: ${logsData?.length || 0}`);
          const localLogs = getLocalLeads('auth_logs');
          const merged = [...(logsData || [])];
          localLogs.forEach(loc => {
            if (!merged.some(m => m.id === loc.id)) {
              merged.push(loc);
            }
          });
          setAuthLogs(merged);
        }
      } catch (err) {
        console.warn('Exception fetching auth_logs:', err);
        setAuthLogs(getLocalLeads('auth_logs'));
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

    const handleRealtimeEvent = (table: string, eventType: string, record: any) => {
      if (!record) return;
      console.log(`[Realtime Sync] ${eventType} event on table "${table}":`, record);
      
      const enrichedRecord = { ...record };
      if (table === 'business_tool_leads' || table === 'business_proposal_leads') {
        enrichedRecord.business_email = record.business_email || record.company_email;
        enrichedRecord.business_sector = record.business_sector || record.sector;
      }
      
      const updateState = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        if (eventType === 'INSERT') {
          setter((prev) => {
            if (prev.some((x) => x.id === enrichedRecord.id || (x.email && x.email === enrichedRecord.email && table === 'newsletter_subscribers'))) return prev;
            return [enrichedRecord, ...prev];
          });
        } else if (eventType === 'DELETE') {
          setter((prev) => prev.filter((item) => item.id !== enrichedRecord.id));
        } else if (eventType === 'UPDATE') {
          setter((prev) => prev.map((item) => (item.id === enrichedRecord.id ? { ...item, ...enrichedRecord } : item)));
        }
      };

      switch (table) {
        case 'contact_leads':
          updateState(setLeads);
          break;
        case 'consultation_requests':
          updateState(setConsultations);
          break;
        case 'diagnostic_requests':
          updateState(setDiagnostics);
          break;
        case 'callback_requests':
          updateState(setCallbacks);
          break;
        case 'newsletter_subscribers':
          updateState(setSubscribers);
          break;
        case 'jobs':
          updateState(setJobs);
          break;
        case 'job_applications':
          updateState(setApplications);
          break;
        case 'blogs':
          updateState(setBlogsList);
          break;
        case 'whatsapp_contact_leads':
          updateState(setWhatsappLeads);
          break;
        case 'business_tool_leads':
          updateState(setBusinessToolLeads);
          break;
        case 'business_proposal_leads':
          updateState(setBusinessProposalLeads);
          break;
        case 'client_credentials':
          updateState(setAllClientCredentials);
          if (selectedClientWorkspace && enrichedRecord.client_id === selectedClientWorkspace.id) {
            updateState(setWorkspaceCredentials);
          }
          break;
        case 'client_documents':
          updateState(setAllClientDocuments);
          if (selectedClientWorkspace && enrichedRecord.client_id === selectedClientWorkspace.id) {
            updateState(setWorkspaceDocuments);
          }
          break;
        case 'client_activity_logs':
          if (selectedClientWorkspace && enrichedRecord.client_id === selectedClientWorkspace.id) {
            updateState(setWorkspaceActivity);
          }
          break;
        case 'client_notifications':
          updateState(setAllClientNotifications);
          break;
        case 'client_profiles':
          updateState(setClientAccounts);
          break;
        default:
          break;
      }
    };

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_leads' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('contact_leads', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'consultation_requests' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('consultation_requests', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'diagnostic_requests' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('diagnostic_requests', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'callback_requests' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('callback_requests', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'newsletter_subscribers' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('newsletter_subscribers', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('jobs', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_applications' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('job_applications', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blogs' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('blogs', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'whatsapp_contact_leads' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('whatsapp_contact_leads', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'business_tool_leads' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('business_tool_leads', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'business_proposal_leads' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('business_proposal_leads', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_credentials' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('client_credentials', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_documents' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('client_documents', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_notifications' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('client_notifications', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_profiles' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('client_profiles', payload.eventType, record);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_activity_logs' },
        (payload) => {
          const record = payload.eventType === 'DELETE' ? payload.old : payload.new;
          handleRealtimeEvent('client_activity_logs', payload.eventType, record);
        }
      )
      .on(
        'broadcast',
        { event: 'db_change' },
        (payload) => {
          console.log('[Realtime Broadcast Event Received]:', payload);
          if (payload && payload.payload) {
            const { table, eventType, record } = payload.payload;
            handleRealtimeEvent(table, eventType, record);
          }
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime Channel Subscribed]: Status is "${status}"`);
      });

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
    if (email === 'admin@goingtechnologies.com' && password === 'Going@123') {
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

  // Log admin audit actions
  const logAdminAuditEvent = async (userEmail: string, eventType: string) => {
    const logId = `log-${Math.random().toString(36).substr(2, 9)}`;
    const payload = {
      id: logId,
      business_email: userEmail,
      event_type: eventType,
      created_at: new Date().toISOString()
    };
    setAuthLogs(prev => [payload, ...prev]);
    try {
      const { error } = await supabase.from('auth_logs').insert([payload]);
      if (error) throw error;
      broadcastChange('auth_logs', 'INSERT', payload);
    } catch (err) {
      saveLocalLead('auth_logs', payload);
    }
  };

  // Toggle Client Account status (Active <-> Disabled)
  // Toggle Client Account status (Active <-> Suspended) on the real profiles table
  const handleToggleAccountStatus = async (account: any) => {
    const currentStatus = account.status || account.account_status || 'active';
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    console.log(`Toggling profile status for ${account.email || account.business_email} to ${newStatus}`);
    
    // Update local React state immediately
    setClientAccounts(prev => prev.map(acc => acc.id === account.id ? { ...acc, status: newStatus, account_status: newStatus } : acc));

    // Persist changes
    try {
      const { error } = await supabase
        .from('client_profiles')
        .update({ status: newStatus })
        .eq('id', account.id);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error toggling profile status:', err);
    }

    // Log the event
    await logAdminAuditEvent(account.email || account.business_email, `Account ${newStatus === 'active' ? 'Re-activated' : 'Suspended'} by Admin`);
    setAdminAlert({
      message: `Account status for ${account.email || account.business_email} successfully updated to ${newStatus}.`,
      type: 'success'
    });
  };

  // High-Security Symmetric Decrypt Algorithm
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

  const toggleClientCredentialsExpand = (clientId: string) => {
    setExpandedClientIds(prev =>
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]
    );
  };

  // Select Client Workspace Handler
  const selectClientForWorkspace = async (client: any) => {
    setSelectedClientWorkspace(client);
    setWorkspaceTab('credentials');
    
    try {
      // 1. Fetch credentials
      const { data: creds } = await supabase
        .from('client_credentials')
        .select('*')
        .eq('client_id', client.id);
      setWorkspaceCredentials(creds || []);

      // 2. Fetch documents
      const { data: docs } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', client.id);
      setWorkspaceDocuments(docs || []);

      // 3. Fetch activity logs
      const { data: logs } = await supabase
        .from('client_activity_logs')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });
      setWorkspaceActivity(logs || []);
    } catch (err) {
      console.error('Error fetching client workspace datasets:', err);
    }
  };

  // Upload Manual Guideline to Client Private Folder
  const handleAdminUploadToClient = async (file: File) => {
    if (!selectedClientWorkspace) return;
    setIsUploadingToClient(true);

    try {
      const storagePath = `${selectedClientWorkspace.id}/${Date.now()}_${file.name}`;
      
      // Upload physical file to private bucket
      const { error: storageErr } = await supabase.storage
        .from('client-documents')
        .upload(storagePath, file);

      if (storageErr) throw storageErr;

      // Insert record in client_documents
      const { error: dbErr } = await supabase
        .from('client_documents')
        .insert([{
          client_id: selectedClientWorkspace.id,
          title: file.name.split('.')[0],
          file_name: file.name,
          file_size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          uploaded_by: 'Admin',
          file_path: storagePath
        }]);

      if (dbErr) throw dbErr;

      // Log activity
      await supabase.from('client_activity_logs').insert([{
        client_id: selectedClientWorkspace.id,
        email: 'admin@goingtechnologies.com',
        event_type: 'Admin Upload',
        description: `Admin uploaded guideline file: ${file.name}`
      }]);

      // Add Notification for client
      await supabase.from('client_notifications').insert([{
        client_id: selectedClientWorkspace.id,
        title: 'New Admin Document',
        message: `Going Technologies admin has uploaded a secure operational file: ${file.name}`,
        type: 'Document'
      }]);

      // Re-fetch
      const { data: docs } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', selectedClientWorkspace.id);
      setWorkspaceDocuments(docs || []);

      setAdminAlert({
        message: `Successfully uploaded ${file.name} to client folder.`,
        type: 'success'
      });
    } catch (err: any) {
      setAdminAlert({
        message: `Failed to upload document: ${err.message}`,
        type: 'error' as any
      });
    } finally {
      setIsUploadingToClient(false);
    }
  };

  // Download client document securely from private storage bucket
  const handleAdminDownloadFile = async (doc: any) => {
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
    } catch (err: any) {
      console.error('[Download error]', err);
    }
  };

  // Document Preview Handler
  const handleAdminPreviewFile = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(doc.file_path);

      if (error) throw error;
      if (!data) throw new Error('File buffer is empty.');

      const url = URL.createObjectURL(data);
      setPreviewUrl(url);
      setPreviewingDoc(doc);
    } catch (err: any) {
      alert(`Could not preview file: ${err.message}`);
    }
  };

  // Delete client document
  const handleAdminDeleteDocument = async (doc: any) => {
    if (adminRole !== 'super') {
      alert('Access Denied: Only Super Admins can permanently delete documents. Normal Admins have view-only access.');
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete this document?`)) return;

    try {
      // 1. Delete DB row
      const { error: dbErr } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', doc.id);

      if (dbErr) throw dbErr;

      // 2. Delete storage object
      await supabase.storage
        .from('client-documents')
        .remove([doc.file_path]);

      // Update state
      setAllClientDocuments(prev => prev.filter(d => d.id !== doc.id));
      if (selectedClientWorkspace) {
        const { data: docs } = await supabase
          .from('client_documents')
          .select('*')
          .eq('client_id', selectedClientWorkspace.id);
        setWorkspaceDocuments(docs || []);
      }

      setAdminAlert({
        message: 'Document successfully purged.',
        type: 'success'
      });
    } catch (err: any) {
      setAdminAlert({
        message: `Purge failed: ${err.message}`,
        type: 'error' as any
      });
    }
  };

  // Delete Client Credential
  const handleAdminDeleteCredential = async (cred: any) => {
    if (adminRole !== 'super') {
      alert('Access Denied: Only Super Admins can permanently delete credentials. Normal Admins have view-only access.');
      return;
    }

    if (!confirm('Are you sure you want to permanently delete this credential? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('client_credentials')
        .delete()
        .eq('id', cred.id);

      if (error) throw error;

      // Update local state
      setAllClientCredentials(prev => prev.filter(c => c.id !== cred.id));
      if (selectedClientWorkspace) {
        setWorkspaceCredentials(prev => prev.filter(c => c.id !== cred.id));
      }

      setAdminAlert({
        message: 'Credential successfully deleted.',
        type: 'success'
      });
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  // Notification Management - Clear individual notification
  const handleClearNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('client_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAllClientNotifications(prev => prev.filter(n => n.id !== id));
      setAdminAlert({
        message: 'Notification removed successfully.',
        type: 'success'
      });
    } catch (err: any) {
      alert(`Failed to remove notification: ${err.message}`);
    }
  };

  // Notification Management - Clear all notifications
  const handleClearAllNotifications = async () => {
    if (!confirm('Are you sure you want to clear all operational notifications? This cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('client_notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all records safely

      if (error) throw error;

      setAllClientNotifications([]);
      setAdminAlert({
        message: 'All notifications cleared successfully.',
        type: 'success'
      });
    } catch (err: any) {
      alert(`Failed to clear notifications: ${err.message}`);
    }
  };

  // Archive Client Account
  const handleArchiveClient = async (account: any) => {
    const confirmed = window.confirm(
      "Archive this client?\n\nThe client will no longer be able to access the portal and will be moved to Archived Clients.\nAll data will be preserved and can be restored later."
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      // Set client status to Archived in database
      const { error } = await supabase
        .from('client_profiles')
        .update({ status: 'Archived', updated_at: new Date().toISOString() })
        .eq('id', account.id);

      if (error) throw error;

      // Log activity
      await supabase.from('client_activity_logs').insert([{
        client_id: account.id,
        email: account.email || account.business_email || '',
        event_type: 'Client Archived',
        description: `Client representative ${account.name || account.client_name} has been archived by operational admin.`
      }]);

      setAdminAlert({
        message: `Client ${account.name || account.client_name} has been archived successfully.`,
        type: 'success'
      });

      // Update local state immediately for instant feedback
      setClientAccounts(prev => prev.map(x => x.id === account.id ? { ...x, status: 'Archived', updated_at: new Date().toISOString() } : x));
      
      if (selectedClientWorkspace && selectedClientWorkspace.id === account.id) {
        setSelectedClientWorkspace(null);
      }

      // Broadcast changes for realtime sync
      broadcastChange('client_profiles', 'UPDATE', { id: account.id, status: 'Archived' });

      // Refresh master listings to ensure all related data is synchronized
      fetchAllData();
    } catch (err: any) {
      alert(`Archiving failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Restore Archived Client Account
  const handleRestoreClient = async (account: any) => {
    const confirmed = window.confirm(
      "Restore this client?\n\nThe client will regain portal access, and all credentials, documents, and notifications will be fully restored."
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      // Set client status back to Active in database
      const { error } = await supabase
        .from('client_profiles')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', account.id);

      if (error) throw error;

      // Log activity
      await supabase.from('client_activity_logs').insert([{
        client_id: account.id,
        email: account.email || account.business_email || '',
        event_type: 'Client Restored',
        description: `Client representative ${account.name || account.client_name} has been restored to active status by operational admin.`
      }]);

      setAdminAlert({
        message: `Client ${account.name || account.client_name} has been restored successfully.`,
        type: 'success'
      });

      // Update local state immediately for instant feedback
      setClientAccounts(prev => prev.map(x => x.id === account.id ? { ...x, status: 'active', updated_at: new Date().toISOString() } : x));

      // Broadcast changes for realtime sync
      broadcastChange('client_profiles', 'UPDATE', { id: account.id, status: 'active' });

      // Refresh master listings to ensure all related data is synchronized
      fetchAllData();
    } catch (err: any) {
      alert(`Restoration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Permanently purge client account, auth user, and all related database records cascadingly
  const handlePermanentDeleteClient = async (account: any) => {
    if (adminRole !== 'super') {
      alert('Access Denied: Only Super Admins can permanently delete client records. Normal Admins have view-only access.');
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this client? This action is IRREVERSIBLE and will permanently delete their Supabase Auth account and purge all documents, credentials, activity logs, and notifications."
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      console.log(`Starting permanent purge of client ID: ${account.id}`);

      // 1. Delete the Auth user via backend endpoint
      console.log(`Calling backend API to delete Auth user ID: ${account.id}`);
      const response = await fetch(`/api/admin/delete-user/${account.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const deleteResult = await response.json();
      if (!response.ok) {
        throw new Error(deleteResult.error || 'Failed to delete Auth user on backend.');
      }
      if (deleteResult.warning) {
        console.warn('Backend warning:', deleteResult.warning);
      }

      // 2. Delete uploaded files from storage for this client
      const { data: files, error: filesErr } = await supabase
        .from('client_documents')
        .select('file_path')
        .eq('client_id', account.id);

      if (!filesErr && files && files.length > 0) {
        const paths = files.map(f => f.file_path);
        console.log(`Removing ${paths.length} files from Supabase Storage...`, paths);
        const { error: storageErr } = await supabase.storage
          .from('client-documents')
          .remove(paths);
        if (storageErr) {
          console.warn('Could not remove some files from storage:', storageErr.message);
        }
      }

      // 3. Transactional-like clean-up of public tables
      const tablesToDelete = [
        'client_credentials',
        'client_documents',
        'client_notifications',
        'client_activity_logs',
        'client_profiles'
      ];

      for (const tbl of tablesToDelete) {
        console.log(`Deleting entries from table: ${tbl}`);
        const { error: tblErr } = await supabase
          .from(tbl)
          .delete()
          .eq(tbl === 'client_profiles' ? 'id' : 'client_id', account.id);
        
        if (tblErr) {
          console.warn(`Non-blocking delete issue on table "${tbl}":`, tblErr.message);
        }
      }

      setAdminAlert({
        message: `Client ${account.email || account.business_email || 'Representative'} has been permanently purged from the system.`,
        type: 'success'
      });

      // Update local state immediately
      setClientAccounts(prev => prev.filter(x => x.id !== account.id));
      
      if (selectedClientWorkspace && selectedClientWorkspace.id === account.id) {
        setSelectedClientWorkspace(null);
      }

      // Broadcast changes for realtime sync
      broadcastChange('client_profiles', 'DELETE', { id: account.id });

      // Refresh master listings automatically to ensure synchronization
      fetchAllData();

    } catch (err: any) {
      alert(`Purge failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Client Account Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountForReset || !newPasswordInput.trim()) return;

    const account = selectedAccountForReset;
    const newPwd = newPasswordInput.trim();
    console.log(`Resetting password for ${account.business_email}`);

    // Update local React state
    setClientAccounts(prev => prev.map(acc => acc.id === account.id ? { ...acc, password: newPwd } : acc));

    // Persist changes
    try {
      const { error } = await supabase
        .from('client_accounts')
        .update({ password: newPwd })
        .eq('id', account.id);
      
      if (error) throw error;
      broadcastChange('client_accounts', 'UPDATE', { id: account.id, password: newPwd });
    } catch (err) {
      updateLocalLead('client_accounts', account.id, { password: newPwd });
    }

    // Log the event
    await logAdminAuditEvent(account.business_email, 'Password reset by Admin');

    setAdminAlert({
      message: `Password for ${account.business_email} successfully updated.`,
      type: 'success'
    });

    // Clean up
    setSelectedAccountForReset(null);
    setNewPasswordInput('');
  };

  // Trigger simulated resend verification OTP
  const handleResendVerification = async (account: any) => {
    console.log(`Simulating resend verification for ${account.business_email}`);
    
    // Log audit event
    await logAdminAuditEvent(account.business_email, 'Verification resent by Admin');

    setAdminAlert({
      message: `Simulated registration verification email successfully resent to: ${account.business_email}`,
      type: 'info'
    });
  };

  // Mark Lead/Request Status in Supabase (generic across tables)
  const updateStatusInTable = async (table: string, id: string, newStatus: string) => {
    // Always mirror to localStorage fallback first for the custom tables
    if (['whatsapp_contact_leads', 'business_tool_leads', 'business_proposal_leads'].includes(table)) {
      updateLocalLead(table, id, { status: newStatus });
    }

    try {
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        const isMissingTable = error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist');
        if (!isMissingTable) {
          throw error;
        }
      }
    } catch (err: any) {
      console.warn('Error updating status in remote database, proceeding with local state update:', err.message || err);
    }

    // Always update local React state and broadcast changes
    let updatedRecord: any = null;
    const updateState = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
      setter(prev => prev.map(item => {
        if (item.id === id) {
          updatedRecord = { ...item, status: newStatus };
          return updatedRecord;
        }
        return item;
      }));
    };

    if (table === 'contact_leads') updateState(setLeads);
    else if (table === 'whatsapp_contact_leads') updateState(setWhatsappLeads);
    else if (table === 'business_tool_leads') updateState(setBusinessToolLeads);
    else if (table === 'business_proposal_leads') updateState(setBusinessProposalLeads);
    else if (table === 'consultation_requests') updateState(setConsultations);
    else if (table === 'diagnostic_requests') updateState(setDiagnostics);
    else if (table === 'callback_requests') updateState(setCallbacks);
    else if (table === 'newsletter_subscribers') updateState(setSubscribers);
    else if (table === 'jobs') updateState(setJobs);
    else if (table === 'job_applications') updateState(setApplications);
    else if (table === 'blogs') updateState(setBlogsList);

    if (updatedRecord) {
      broadcastChange(table, 'UPDATE', updatedRecord);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    await updateStatusInTable('contact_leads', id, newStatus);
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

    if (table === 'blogs' && BLOG_POSTS.some(b => b.id === id)) {
      setDeletedStaticBlogs(prev => [...prev, id]);
      setDeleteModalOpen(false);
      setRecordToDelete(null);
      setIsDeleting(false);
      return;
    }

    console.log(`%c=== DELETION INITIATED ===`, 'color: #EF4444; font-weight: bold;');
    console.log(`Record ID: ${id}`);
    console.log(`Delete Query: await supabase.from("${table}").delete().eq("id", "${id}");`);

    // Intercept deletions for custom leads tables to handle missing tables gracefully
    if (['whatsapp_contact_leads', 'business_tool_leads', 'business_proposal_leads'].includes(table)) {
      deleteLocalLead(table, id);
      try {
        await supabase.from(table).delete().eq('id', id);
      } catch (dbErr) {
        console.warn('Database delete bypass for local fallback table:', dbErr);
      }
      
      if (table === 'whatsapp_contact_leads') setWhatsappLeads(prev => prev.filter(x => x.id !== id));
      if (table === 'business_tool_leads') setBusinessToolLeads(prev => prev.filter(x => x.id !== id));
      if (table === 'business_proposal_leads') setBusinessProposalLeads(prev => prev.filter(x => x.id !== id));

      setDeleteModalOpen(false);
      setRecordToDelete(null);
      setIsDeleting(false);
      return;
    }

    try {
      // Step 6 & 2: Delete from table, waiting for the promise, and log the results
      const { data, error, count } = await supabase
        .from(table)
        .delete({ count: 'exact' })
        .eq('id', id)
        .select();

      console.log('Supabase Response Data:', data);
      console.log('Supabase Response Error:', error);
      console.log('Supabase Response Count:', count);

      if (error) {
        console.log('Delete Request:', {
          ID: id,
          Success: false,
          Error: {
            message: error.message || 'Unknown error',
            code: error.code || 'UNKNOWN',
            details: error.details || '',
            hint: error.hint || ''
          }
        });
        throw error;
      }

      // Step 7: Verification Check via a fresh SELECT query to check if the row still exists
      console.log(`Verifying deletion: SELECT id FROM ${table} WHERE id = '${id}'`);
      const { data: verifyData, error: verifyError } = await supabase
        .from(table)
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (verifyError) {
        console.warn('Verification select query encountered an error:', verifyError);
      }

      if (verifyData) {
        // The record still exists in the database. Deletion failed (likely silently blocked by RLS policies).
        const errMsg = `The record still exists in table "${table}". Deletion was likely silently blocked by database Row Level Security (RLS) or missing DELETE policies.`;
        console.error(`%c✗ DELETION FAILED: ${errMsg}`, 'color: #DC2626; font-weight: bold;');
        
        console.log('Delete Request:', {
          ID: id,
          Success: false,
          Error: {
            message: errMsg,
            code: 'RLS_DELETE_BLOCKED',
            details: 'Postgres Row Level Security (RLS) is enabled but no matching DELETE policy permits this operation for the current role.',
            hint: `Run the required SQL to enable DELETE on this table:
            
  CREATE POLICY "Allow public delete on ${table}" ON public.${table} FOR DELETE TO anon, authenticated, public USING (true);`
          }
        });

        alert(`Deletion Failed!\n\n${errMsg}\n\nPlease verify your Supabase Row Level Security (RLS) policies for table "${table}".`);
        setDeleteModalOpen(false);
        setRecordToDelete(null);
        return;
      }

      // If we reach here, verification confirms the record is actually deleted
      const rowsDeleted = data ? data.length : (count !== null ? count : 1);
      console.log(`%c✓ DELETION SUCCESSFUL. ID ${id} is no longer present in the database.`, 'color: #10B981; font-weight: bold;');
      console.log('Delete Request:', {
        ID: id,
        Success: true,
        RowsDeleted: rowsDeleted
      });

      // Step 4: Immediately remove the row from local state. Do NOT wait for realtime sync.
      if (table === 'contact_leads') setLeads(prev => prev.filter(x => x.id !== id));
      if (table === 'whatsapp_contact_leads') setWhatsappLeads(prev => prev.filter(x => x.id !== id));
      if (table === 'business_tool_leads') setBusinessToolLeads(prev => prev.filter(x => x.id !== id));
      if (table === 'business_proposal_leads') setBusinessProposalLeads(prev => prev.filter(x => x.id !== id));
      if (table === 'consultation_requests') setConsultations(prev => prev.filter(x => x.id !== id));
      if (table === 'diagnostic_requests') setDiagnostics(prev => prev.filter(x => x.id !== id));
      if (table === 'callback_requests') setCallbacks(prev => prev.filter(x => x.id !== id));
      if (table === 'newsletter_subscribers') setSubscribers(prev => prev.filter(x => x.id !== id));
      if (table === 'jobs') setJobs(prev => prev.filter(x => x.id !== id));
      if (table === 'job_applications') setApplications(prev => prev.filter(x => x.id !== id));
      if (table === 'blogs') setBlogsList(prev => prev.filter(x => x.id !== id));

      // Broadcast delete to other connected admin dashboards
      broadcastChange(table, 'DELETE', { id });

      setDeleteModalOpen(false);
      setRecordToDelete(null);

      // Local state is now updated in real-time, avoiding consistency race conditions on full table select.
      console.log('State updated successfully. Bypassing raw table SELECT refetches to ensure clean eventual consistency.');

    } catch (err: any) {
      console.error('Error deleting record:', err);
      console.log('Delete Request:', {
        ID: id,
        Success: false,
        Error: {
          message: err.message || 'Unknown error',
          code: err.code || 'UNKNOWN',
          details: err.details || '',
          hint: err.hint || ''
        }
      });
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

    if (['whatsapp_contact_leads', 'business_tool_leads', 'business_proposal_leads'].includes(table)) {
      saveLocalLead(table, data);
    }

    try {
      const { error } = await supabase
        .from(table)
        .update(data)
        .eq('id', data.id);

      if (error) {
        const isMissingTable = error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist');
        if (!isMissingTable) {
          throw error;
        }
      }

      // Update local state
      if (table === 'contact_leads') {
        setLeads(leads.map(x => x.id === data.id ? data : x));
      } else if (table === 'whatsapp_contact_leads') {
        setWhatsappLeads(whatsappLeads.map(x => x.id === data.id ? data : x));
      } else if (table === 'business_tool_leads') {
        setBusinessToolLeads(businessToolLeads.map(x => x.id === data.id ? data : x));
      } else if (table === 'business_proposal_leads') {
        setBusinessProposalLeads(businessProposalLeads.map(x => x.id === data.id ? data : x));
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

      // Broadcast manual updates in real-time
      broadcastChange(table, 'UPDATE', data);

      setEditingRecord(null);
    } catch (err: any) {
      console.warn('Error saving edited record in database, falling back to local state:', err);
      
      // Still update local React state if it's one of the custom tables
      if (['whatsapp_contact_leads', 'business_tool_leads', 'business_proposal_leads'].includes(table)) {
        if (table === 'whatsapp_contact_leads') {
          setWhatsappLeads(whatsappLeads.map(x => x.id === data.id ? data : x));
        } else if (table === 'business_tool_leads') {
          setBusinessToolLeads(businessToolLeads.map(x => x.id === data.id ? data : x));
        } else if (table === 'business_proposal_leads') {
          setBusinessProposalLeads(businessProposalLeads.map(x => x.id === data.id ? data : x));
        }

        // Broadcast manual updates in real-time even on database fallback
        broadcastChange(table, 'UPDATE', data);

        setEditingRecord(null);
      } else {
        alert(err.message || 'Failed to save record changes. Please check permissions.');
      }
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
        
        const updatedRecord = { ...editingJob, ...jobPayload };
        setJobs(jobs.map(j => j.id === editingJob.id ? updatedRecord : j));
        
        // Broadcast update
        broadcastChange('jobs', 'UPDATE', updatedRecord);
      } else {
        // Insert new job and select the returned record to get the database id
        const { data, error } = await supabase
          .from('jobs')
          .insert(jobPayload)
          .select()
          .single();
        if (error) throw error;
        
        if (data) {
          setJobs(prev => [data, ...prev]);
          
          // Broadcast insertion
          broadcastChange('jobs', 'INSERT', data);
        }
      }
      setIsJobModalOpen(false);
    } catch (err: any) {
      console.error('Error saving job:', err);
      setJobFormError(err.message || 'Failed to save job posting.');
    } finally {
      setIsSavingJob(false);
    }
  };

  // Save new blog post CMS handler
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent || !blogCategory) {
      setBlogFormError('Title, Category, and Content are strictly required.');
      return;
    }

    setIsSavingBlog(true);
    setBlogFormError(null);

    const generatedSlug = slugify(blogTitle);

    const blogPayload = {
      title: blogTitle,
      slug: generatedSlug,
      category: blogCategory,
      author: blogAuthor || 'Going Technologies Team',
      reading_time: blogReadTime || '5 Min Read',
      short_description: blogExcerpt || blogShortDesc || blogContent.slice(0, 160) + '...',
      content: blogContent,
      meta_title: blogMetaTitle || blogTitle,
      meta_description: blogExcerpt || blogShortDesc || blogContent.slice(0, 160) + '...',
      featured_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80', // default nice team image
      faq: []
    };

    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([blogPayload])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        broadcastChange('blogs', 'INSERT', data);
      }

      setIsBlogModalOpen(false);
      // Clear form
      setBlogTitle('');
      setBlogContent('');
      setBlogCategory('Insurance Operations');
      setBlogAuthor('Going Technologies Team');
      setBlogReadTime('5 Min Read');
      setBlogShortDesc('');
      setBlogExcerpt('');
      setBlogMetaTitle('');
      
      // Reload blog data
      const { data: fresh } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (fresh) setBlogsList(fresh);
    } catch (err: any) {
      console.error('Error saving blog:', err);
      setBlogFormError(err.message || 'Failed to save blog post.');
    } finally {
      setIsSavingBlog(false);
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
                  { id: 'whatsapp_leads', label: 'WhatsApp Leads', icon: Users, count: whatsappLeads.length },
                  { id: 'business_tool_leads', label: 'Business Tool Leads', icon: Briefcase, count: businessToolLeads.length },
                  { id: 'business_proposal_leads', label: 'Business Proposal Leads', icon: FileText, count: businessProposalLeads.length },
                  { id: 'consultations', label: 'Consultations', icon: Calendar, count: consultations.length },
                  { id: 'diagnostics', label: 'Diagnostics', icon: Sparkles, count: diagnostics.length },
                  { id: 'callbacks', label: 'Callbacks', icon: PhoneCall, count: callbacks.length },
                  { id: 'subscribers', label: 'Subscribers', icon: Mail, count: subscribers.length },
                  { id: 'jobs', label: 'Careers (Jobs)', icon: Briefcase, count: jobs.length },
                  { id: 'applications', label: 'Applications', icon: Layers, count: applications.length },
                  { id: 'blogs', label: 'Blog Articles', icon: FileText, count: blogsList.length + BLOG_POSTS.filter(b => !deletedStaticBlogs.includes(b.id)).filter(b => !blogsList.some(sb => sb.title.toLowerCase() === b.title.toLowerCase())).length },
                  { id: 'client_portal_access', label: 'Client Portal Links', icon: Key },
                  { id: 'client_accounts', label: 'Client Accounts', icon: Shield, count: clientAccounts.filter(acc => (acc.status || '').toLowerCase() !== 'archived').length },
                  { id: 'archived_clients', label: 'Archived Clients', icon: Archive, count: clientAccounts.filter(acc => (acc.status || '').toLowerCase() === 'archived').length },
                  { id: 'client_credentials', label: 'Client Credentials', icon: Key, count: allClientCredentials.filter(cred => { const client = clientAccounts.find(c => c.id === cred.client_id); return !client || (client.status || '').toLowerCase() !== 'archived'; }).length },
                  { id: 'client_documents', label: 'Client Documents', icon: Folder, count: allClientDocuments.filter(doc => { const client = clientAccounts.find(c => c.id === doc.client_id); return !client || (client.status || '').toLowerCase() !== 'archived'; }).length },
                  { id: 'client_notifications', label: 'Client Notifications', icon: Bell, count: allClientNotifications.filter(notif => { const client = clientAccounts.find(c => c.id === notif.client_id); return !client || (client.status || '').toLowerCase() !== 'archived'; }).length },
                  { id: 'auth_logs', label: 'Auth Audit Logs', icon: Clock, count: authLogs.length },
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
                    {activeTab === 'whatsapp_leads' && 'WhatsApp Conversational Leads'}
                    {activeTab === 'business_tool_leads' && 'Business Tool Lead Captures'}
                    {activeTab === 'business_proposal_leads' && 'Proposal Download Lead Captures'}
                    {activeTab === 'consultations' && 'Corporate Consultations'}
                    {activeTab === 'diagnostics' && 'Inbound Process Diagnostics'}
                    {activeTab === 'callbacks' && 'Hotline Callbacks'}
                    {activeTab === 'subscribers' && 'Newsletter Subscribers'}
                    {activeTab === 'jobs' && 'Career Job Postings CMS'}
                    {activeTab === 'applications' && 'Specialist Job Applications'}
                    {activeTab === 'blogs' && 'Blog Intelligence Briefings CMS'}
                    {activeTab === 'client_portal_access' && 'Client Portal Access Link Generator'}
                    {activeTab === 'client_accounts' && 'Client Portal Account Management'}
                    {activeTab === 'archived_clients' && 'Archived Clients'}
                    {activeTab === 'client_credentials' && 'Client Credentials Master Directory'}
                    {activeTab === 'client_documents' && 'Client Documents Central Vault'}
                    {activeTab === 'client_notifications' && 'Client Workspace Operations Notifications'}
                    {activeTab === 'auth_logs' && 'Authentication Audit Logs'}
                  </h1>
                  <p className="text-gray-400 text-xs">
                    Real-time monitoring console for Going Technologies Global Centers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* RBAC ROLE SWITCHER */}
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-3xs">
                    <span className="text-[9px] uppercase font-mono text-slate-500 font-extrabold">Active Scope:</span>
                    <button
                      onClick={handleToggleRole}
                      className={`cursor-pointer px-2 py-0.5 rounded text-[10px] font-extrabold transition-all uppercase ${
                        adminRole === 'super' 
                          ? 'bg-rose-600 text-white shadow-xs hover:bg-rose-500' 
                          : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                      }`}
                      title="Toggle role to test view-only Normal Admin restrictions versus full permanent Deletes"
                    >
                      {adminRole === 'super' ? '🛡️ Super Admin' : '👤 Normal Admin'}
                    </button>
                  </div>

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[
                      { label: 'Total Leads', val: leads.length, color: 'border-blue-500', bg: 'bg-blue-500/5', text: 'text-blue-600', icon: Users },
                      { label: 'WhatsApp Leads', val: whatsappLeads.length, color: 'border-teal-500', bg: 'bg-teal-500/5', text: 'text-teal-600', icon: Users },
                      { label: 'Business Tool Leads', val: businessToolLeads.length, color: 'border-cyan-500', bg: 'bg-cyan-500/5', text: 'text-cyan-600', icon: Briefcase },
                      { label: 'Business Proposal Leads', val: businessProposalLeads.length, color: 'border-violet-500', bg: 'bg-violet-500/5', text: 'text-violet-600', icon: FileText },
                      { label: 'Consultations', val: consultations.length, color: 'border-emerald-500', bg: 'bg-emerald-500/5', text: 'text-emerald-600', icon: Calendar },
                      { label: 'Diagnostics', val: diagnostics.length, color: 'border-purple-500', bg: 'bg-purple-500/5', text: 'text-purple-600', icon: Sparkles },
                      { label: 'Callbacks', val: callbacks.length, color: 'border-amber-500', bg: 'bg-amber-500/5', text: 'text-amber-600', icon: PhoneCall },
                      { label: 'Subscribers', val: subscribers.length, color: 'border-rose-500', bg: 'bg-rose-500/5', text: 'text-rose-600', icon: Mail },
                      { label: 'Job Openings', val: jobs.length, color: 'border-indigo-500', bg: 'bg-indigo-500/5', text: 'text-indigo-600', icon: Briefcase },
                      { label: 'Applications', val: applications.length, color: 'border-slate-500', bg: 'bg-slate-500/5', text: 'text-slate-600', icon: Layers },
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

              {/* WHATSAPP LEADS TAB */}
              {activeTab === 'whatsapp_leads' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search WhatsApp leads..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setWhatsappPage(1);
                        }}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                      <select
                        value={whatsappStatusFilter}
                        onChange={(e) => {
                          setWhatsappStatusFilter(e.target.value);
                          setWhatsappPage(1);
                        }}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF] font-semibold text-gray-600"
                      >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>

                      <select
                        value={`${whatsappSortField}-${whatsappSortOrder}`}
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-');
                          setWhatsappSortField(field);
                          setWhatsappSortOrder(order as 'asc' | 'desc');
                          setWhatsappPage(1);
                        }}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF] font-semibold text-gray-600"
                      >
                        <option value="created_at-desc">Newest First</option>
                        <option value="created_at-asc">Oldest First</option>
                      </select>

                      <button
                        onClick={() => exportToCSV(whatsappLeads, 'gt_whatsapp_leads')}
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
                          <th className="p-4">Full Name</th>
                          <th className="p-4">Business Email</th>
                          <th className="p-4">Captured At</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {(() => {
                           const filtered = whatsappLeads
                            .filter(l => whatsappStatusFilter === 'All' || l.status === whatsappStatusFilter)
                            .filter(l => 
                              !searchQuery ||
                              l.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              l.email?.toLowerCase().includes(searchQuery.toLowerCase())
                            );
                          
                          const sorted = [...filtered].sort((a, b) => {
                            const valA = a[whatsappSortField] || '';
                            const valB = b[whatsappSortField] || '';
                            if (valA < valB) return whatsappSortOrder === 'asc' ? -1 : 1;
                            if (valA > valB) return whatsappSortOrder === 'asc' ? 1 : -1;
                            return 0;
                          });

                          const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
                          const paginated = sorted.slice((whatsappPage - 1) * itemsPerPage, whatsappPage * itemsPerPage);

                          return (
                            <>
                              {paginated.map((lead) => (
                                <tr key={lead.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                                  <td className="p-4 font-bold text-[#081B8C] text-sm">
                                    {lead.full_name}
                                  </td>
                                  <td className="p-4 text-gray-700 font-medium">
                                    {lead.email}
                                  </td>
                                  <td className="p-4 font-mono text-gray-400">
                                    {formatDate(lead.created_at)}
                                  </td>
                                  <td className="p-4">
                                    <select
                                      value={lead.status || 'New'}
                                      onChange={(e) => updateStatusInTable('whatsapp_contact_leads', lead.id, e.target.value)}
                                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                        lead.status === 'New' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        lead.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        lead.status === 'Contacted' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                                        lead.status === 'Qualified' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        lead.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        'bg-gray-50 text-gray-500 border-gray-200'
                                      }`}
                                    >
                                      <option value="New">New</option>
                                      <option value="In Progress">In Progress</option>
                                      <option value="Contacted">Contacted</option>
                                      <option value="Qualified">Qualified</option>
                                      <option value="Converted">Converted</option>
                                      <option value="Closed">Closed</option>
                                    </select>
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => setEditingRecord({ table: 'whatsapp_contact_leads', data: { ...lead } })}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                        title="Edit Lead Details"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => triggerDelete('whatsapp_contact_leads', lead.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                        title="Delete Lead"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {sorted.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                                    No WhatsApp leads matching current filters.
                                  </td>
                                </tr>
                              )}
                              {sorted.length > 0 && (
                                <tr>
                                  <td colSpan={5} className="p-4 bg-[#F8FAFF] border-t border-[#DCE7FF]/40">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-400 font-medium">
                                        Showing {((whatsappPage - 1) * itemsPerPage) + 1} - {Math.min(whatsappPage * itemsPerPage, sorted.length)} of {sorted.length} records
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          disabled={whatsappPage === 1}
                                          onClick={() => setWhatsappPage(prev => Math.max(prev - 1, 1))}
                                          className="px-3 py-1.5 bg-white border border-[#DCE7FF] rounded-lg text-xs font-bold text-gray-600 hover:border-gray-300 disabled:opacity-40 transition-all cursor-pointer"
                                        >
                                          &larr; Prev
                                        </button>
                                        <span className="text-xs font-bold text-gray-700">
                                          {whatsappPage} / {totalPages}
                                        </span>
                                        <button
                                          disabled={whatsappPage === totalPages}
                                          onClick={() => setWhatsappPage(prev => Math.min(prev + 1, totalPages))}
                                          className="px-3 py-1.5 bg-white border border-[#DCE7FF] rounded-lg text-xs font-bold text-gray-600 hover:border-gray-300 disabled:opacity-40 transition-all cursor-pointer"
                                        >
                                          Next &rarr;
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* BUSINESS TOOL LEADS TAB */}
              {activeTab === 'business_tool_leads' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search Business Tool leads..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setToolsPage(1);
                        }}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                      <select
                        value={toolsStatusFilter}
                        onChange={(e) => {
                          setToolsStatusFilter(e.target.value);
                          setToolsPage(1);
                        }}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF] font-semibold text-gray-600"
                      >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>

                      <select
                        value={`${toolsSortField}-${toolsSortOrder}`}
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-');
                          setToolsSortField(field);
                          setToolsSortOrder(order as 'asc' | 'desc');
                          setToolsPage(1);
                        }}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF] font-semibold text-gray-600"
                      >
                        <option value="created_at-desc">Newest First</option>
                        <option value="created_at-asc">Oldest First</option>
                        <option value="agency_name-asc">Agency Name (A-Z)</option>
                        <option value="business_email-asc">Business Email (A-Z)</option>
                      </select>

                      <button
                        onClick={() => exportToCSV(businessToolLeads, 'gt_business_tool_leads')}
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
                          <th className="p-4">Agency / Company Name</th>
                          <th className="p-4">Business Email</th>
                          <th className="p-4">Business Sector</th>
                          <th className="p-4">Unlock Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {(() => {
                          const filtered = businessToolLeads
                            .filter(l => toolsStatusFilter === 'All' || l.status === toolsStatusFilter)
                            .filter(l => 
                              !searchQuery ||
                              l.agency_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              l.business_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              l.business_sector?.toLowerCase().includes(searchQuery.toLowerCase())
                            );
                          
                          const sorted = [...filtered].sort((a, b) => {
                            const valA = a[toolsSortField] || '';
                            const valB = b[toolsSortField] || '';
                            if (valA < valB) return toolsSortOrder === 'asc' ? -1 : 1;
                            if (valA > valB) return toolsSortOrder === 'asc' ? 1 : -1;
                            return 0;
                          });

                          const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
                          const paginated = sorted.slice((toolsPage - 1) * itemsPerPage, toolsPage * itemsPerPage);

                          return (
                            <>
                              {paginated.map((lead) => (
                                <tr key={lead.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                                  <td className="p-4 font-bold text-gray-800">
                                    {lead.agency_name}
                                  </td>
                                  <td className="p-4 font-mono font-bold text-[#081B8C]">
                                    {lead.business_email}
                                  </td>
                                  <td className="p-4 font-semibold text-gray-600">
                                    <span className="px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-[10px]">
                                      {lead.business_sector}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono text-gray-400">
                                    {formatDate(lead.created_at)}
                                  </td>
                                  <td className="p-4">
                                    <select
                                      value={lead.status || 'New'}
                                      onChange={(e) => updateStatusInTable('business_tool_leads', lead.id, e.target.value)}
                                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                        lead.status === 'New' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        lead.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        lead.status === 'Contacted' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                                        lead.status === 'Qualified' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        lead.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        'bg-gray-50 text-gray-500 border-gray-200'
                                      }`}
                                    >
                                      <option value="New">New</option>
                                      <option value="In Progress">In Progress</option>
                                      <option value="Contacted">Contacted</option>
                                      <option value="Qualified">Qualified</option>
                                      <option value="Converted">Converted</option>
                                      <option value="Closed">Closed</option>
                                    </select>
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => setEditingRecord({ table: 'business_tool_leads', data: { ...lead } })}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                        title="Edit Lead Details"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => triggerDelete('business_tool_leads', lead.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                        title="Delete Lead"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {sorted.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                                    No Business Tool lead records matching current filters.
                                  </td>
                                </tr>
                              )}
                              {sorted.length > 0 && (
                                <tr>
                                  <td colSpan={6} className="p-4 bg-[#F8FAFF] border-t border-[#DCE7FF]/40">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-400 font-medium">
                                        Showing {((toolsPage - 1) * itemsPerPage) + 1} - {Math.min(toolsPage * itemsPerPage, sorted.length)} of {sorted.length} records
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          disabled={toolsPage === 1}
                                          onClick={() => setToolsPage(prev => Math.max(prev - 1, 1))}
                                          className="px-3 py-1.5 bg-white border border-[#DCE7FF] rounded-lg text-xs font-bold text-gray-600 hover:border-gray-300 disabled:opacity-40 transition-all cursor-pointer"
                                        >
                                          &larr; Prev
                                        </button>
                                        <span className="text-xs font-bold text-gray-700">
                                          {toolsPage} / {totalPages}
                                        </span>
                                        <button
                                          disabled={toolsPage === totalPages}
                                          onClick={() => setToolsPage(prev => Math.min(prev + 1, totalPages))}
                                          className="px-3 py-1.5 bg-white border border-[#DCE7FF] rounded-lg text-xs font-bold text-gray-600 hover:border-gray-300 disabled:opacity-40 transition-all cursor-pointer"
                                        >
                                          Next &rarr;
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* BUSINESS PROPOSAL LEADS TAB */}
              {activeTab === 'business_proposal_leads' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search Proposal download leads..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setProposalPage(1);
                        }}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                      <select
                        value={proposalStatusFilter}
                        onChange={(e) => {
                          setProposalStatusFilter(e.target.value);
                          setProposalPage(1);
                        }}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF] font-semibold text-gray-600"
                      >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>

                      <select
                        value={`${proposalSortField}-${proposalSortOrder}`}
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-');
                          setProposalSortField(field);
                          setProposalSortOrder(order as 'asc' | 'desc');
                          setProposalPage(1);
                        }}
                        className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF] font-semibold text-gray-600"
                      >
                        <option value="created_at-desc">Newest First</option>
                        <option value="created_at-asc">Oldest First</option>
                        <option value="agency_name-asc">Agency Name (A-Z)</option>
                        <option value="business_email-asc">Business Email (A-Z)</option>
                      </select>

                      <button
                        onClick={() => exportToCSV(businessProposalLeads, 'gt_business_proposal_leads')}
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
                          <th className="p-4">Agency / Company Name</th>
                          <th className="p-4">Business Email</th>
                          <th className="p-4">Business Sector</th>
                          <th className="p-4">Download Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {(() => {
                          const filtered = businessProposalLeads
                            .filter(l => proposalStatusFilter === 'All' || l.status === proposalStatusFilter)
                            .filter(l => 
                              !searchQuery ||
                              l.agency_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              l.business_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              l.business_sector?.toLowerCase().includes(searchQuery.toLowerCase())
                            );
                          
                          const sorted = [...filtered].sort((a, b) => {
                            const valA = a[proposalSortField] || '';
                            const valB = b[proposalSortField] || '';
                            if (valA < valB) return proposalSortOrder === 'asc' ? -1 : 1;
                            if (valA > valB) return proposalSortOrder === 'asc' ? 1 : -1;
                            return 0;
                          });

                          const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
                          const paginated = sorted.slice((proposalPage - 1) * itemsPerPage, proposalPage * itemsPerPage);

                          return (
                            <>
                              {paginated.map((lead) => (
                                <tr key={lead.id} className="hover:bg-[#FAFBFD]/60 transition-colors">
                                  <td className="p-4 font-bold text-gray-800">
                                    {lead.agency_name}
                                  </td>
                                  <td className="p-4 font-mono font-bold text-[#081B8C]">
                                    {lead.business_email}
                                  </td>
                                  <td className="p-4 font-semibold text-gray-600">
                                    <span className="px-2 py-1 bg-violet-50 border border-violet-100 rounded-lg text-violet-800 text-[10px]">
                                      {lead.business_sector}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono text-gray-400">
                                    {formatDate(lead.created_at)}
                                  </td>
                                  <td className="p-4">
                                    <select
                                      value={lead.status || 'New'}
                                      onChange={(e) => updateStatusInTable('business_proposal_leads', lead.id, e.target.value)}
                                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                        lead.status === 'New' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        lead.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        lead.status === 'Contacted' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                                        lead.status === 'Qualified' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        lead.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        'bg-gray-50 text-gray-500 border-gray-200'
                                      }`}
                                    >
                                      <option value="New">New</option>
                                      <option value="In Progress">In Progress</option>
                                      <option value="Contacted">Contacted</option>
                                      <option value="Qualified">Qualified</option>
                                      <option value="Converted">Converted</option>
                                      <option value="Closed">Closed</option>
                                    </select>
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => setEditingRecord({ table: 'business_proposal_leads', data: { ...lead } })}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                        title="Edit Lead Details"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => triggerDelete('business_proposal_leads', lead.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                        title="Delete Lead"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {sorted.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                                    No Business Proposal lead records matching current filters.
                                  </td>
                                </tr>
                              )}
                              {sorted.length > 0 && (
                                <tr>
                                  <td colSpan={6} className="p-4 bg-[#F8FAFF] border-t border-[#DCE7FF]/40">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-400 font-medium">
                                        Showing {((proposalPage - 1) * itemsPerPage) + 1} - {Math.min(proposalPage * itemsPerPage, sorted.length)} of {sorted.length} records
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          disabled={proposalPage === 1}
                                          onClick={() => setProposalPage(prev => Math.max(prev - 1, 1))}
                                          className="px-3 py-1.5 bg-white border border-[#DCE7FF] rounded-lg text-xs font-bold text-gray-600 hover:border-gray-300 disabled:opacity-40 transition-all cursor-pointer"
                                        >
                                          &larr; Prev
                                        </button>
                                        <span className="text-xs font-bold text-gray-700">
                                          {proposalPage} / {totalPages}
                                        </span>
                                        <button
                                          disabled={proposalPage === totalPages}
                                          onClick={() => setProposalPage(prev => Math.min(prev + 1, totalPages))}
                                          className="px-3 py-1.5 bg-white border border-[#DCE7FF] rounded-lg text-xs font-bold text-gray-600 hover:border-gray-300 disabled:opacity-40 transition-all cursor-pointer"
                                        >
                                          Next &rarr;
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* BLOG ARTICLES CMS PANEL */}
              {activeTab === 'blogs' && (
                <div className="space-y-8 text-left">
                  {isBlogsTableMissing && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-amber-800 text-sm">Database Setup Error: "public.blogs" Table Missing</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            The blogs database table was not detected in your Supabase project schema cache. Please execute the following SQL migration script in your Supabase SQL Editor (under the SQL Editor tab) to provision it securely:
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 text-gray-100 rounded-xl p-4 font-mono text-[11px] leading-relaxed select-all overflow-x-auto whitespace-pre">
{`-- Create complete blogs and blog_categories tables
create table if not exists public.blog_categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blog_categories disable row level security;

drop policy if exists "Allow public select on blog_categories" on public.blog_categories;
create policy "Allow public select on blog_categories" on public.blog_categories for select to anon, authenticated, public using (true);

drop policy if exists "Allow public insert on blog_categories" on public.blog_categories;
create policy "Allow public insert on blog_categories" on public.blog_categories for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow public delete on blog_categories" on public.blog_categories;
create policy "Allow public delete on blog_categories" on public.blog_categories for delete to anon, authenticated, public using (true);

create table if not exists public.blogs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text not null unique,
    category text not null,
    featured_image text,
    meta_title text,
    meta_description text,
    author text not null,
    short_description text,
    reading_time text,
    content text not null,
    faq jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blogs disable row level security;

drop policy if exists "Allow public select on blogs" on public.blogs;
create policy "Allow public select on blogs" on public.blogs for select to anon, authenticated, public using (true);

drop policy if exists "Allow public insert on blogs" on public.blogs;
create policy "Allow public insert on blogs" on public.blogs for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow public update on blogs" on public.blogs;
create policy "Allow public update on blogs" on public.blogs for update to anon, authenticated, public using (true) with check (true);

drop policy if exists "Allow public delete on blogs" on public.blogs;
create policy "Allow public delete on blogs" on public.blogs for delete to anon, authenticated, public using (true);`}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={fetchAllData}
                          className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Retry Schema Synchronization</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-[#081B8C] font-display">Going Technologies Strategic Insights</h2>
                      <p className="text-xs text-gray-400 font-semibold">View, publish and remove articles on the public corporate Blog stream.</p>
                    </div>
                    <button
                      onClick={() => {
                        setBlogFormError(null);
                        setIsBlogModalOpen(true);
                      }}
                      className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4.5 py-3 rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-500/15"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Intelligence Article</span>
                    </button>
                  </div>

                  {/* Blogs Table Card */}
                  {(() => {
                    const combinedAdminBlogs = [
                      ...blogsList.map(b => ({
                        ...b,
                        author: 'Going Technologies Team',
                        author_image: '/Going tech icon-1.png'
                      })),
                      ...BLOG_POSTS
                        .filter(b => !deletedStaticBlogs.includes(b.id))
                        .filter(b => !blogsList.some(sb => sb.title.toLowerCase() === b.title.toLowerCase()))
                        .map(b => ({
                          ...b,
                          author: 'Going Technologies Team',
                          author_image: '/Going tech icon-1.png',
                          created_at: b.publishDate
                        }))
                    ];
                    const filteredBlogs = combinedAdminBlogs.filter(b => !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.category.toLowerCase().includes(searchQuery.toLowerCase()));

                    return (
                      <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                          <div className="relative w-full sm:max-w-xs">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Search articles by title or category..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border border-[#DCE7FF] focus:border-[#2F6DFF] focus:bg-white focus:outline-hidden rounded-lg transition-all"
                            />
                          </div>
                          <div className="text-gray-400 text-xs font-semibold">
                            Total Articles: <strong className="text-gray-700">{combinedAdminBlogs.length}</strong> (including pre-written insights)
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                                <th className="p-4">Title & Slug</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Reading Time</th>
                                <th className="p-4">Published Date</th>
                                <th className="p-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {filteredBlogs.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 font-bold text-[#081B8C] max-w-[300px]">
                                    <div className="font-bold text-sm text-gray-800 leading-snug line-clamp-2">{item.title}</div>
                                    <div className="text-[10px] font-mono text-gray-400 mt-1">/{item.slug || item.id}</div>
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#DCE7FF]/40 text-[#081B8C]">
                                      {item.category}
                                    </span>
                                  </td>
                                  <td className="p-4 font-semibold text-gray-600">
                                    {item.author}
                                  </td>
                                  <td className="p-4 font-mono text-gray-500">
                                    {item.reading_time || item.readTime || '5 Min Read'}
                                  </td>
                                  <td className="p-4 text-gray-500 font-medium">
                                    {new Date(item.created_at || item.download_time || Date.now()).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </td>
                                  <td className="p-4 text-right">
                                    <button
                                      onClick={() => triggerDelete('blogs', item.id)}
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer inline-flex items-center"
                                      title="Delete Article"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {filteredBlogs.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                                    No articles match your search filters.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* CLIENT PORTAL ACCESS GENERATOR TAB */}
              {activeTab === 'client_portal_access' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-[#081B8C] font-display">Enterprise Private URLs</h2>
                      <p className="text-xs text-gray-400 font-semibold">Copy and securely distribute direct portal endpoints to authorized client representatives.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          type: 'reg',
                          title: 'Portal Registration Endpoint',
                          desc: 'Exclusively for onboarding new client representatives.',
                          url: `${window.location.origin}/#client-portal`,
                        },
                        {
                          type: 'login',
                          title: 'Portal Secure Login Gateway',
                          desc: 'Direct sign-in gate for existing verified workspaces.',
                          url: `${window.location.origin}/#client-portal`,
                        },
                        {
                          type: 'direct',
                          title: 'Direct Private Workspace',
                          desc: 'Redirects active authenticated client sessions.',
                          url: `${window.location.origin}/#workspace`,
                        }
                      ].map((link) => (
                        <div key={link.type} className="border border-[#DCE7FF]/50 hover:border-blue-500/20 bg-[#F8FAFF] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-xs transition-all">
                          <div className="space-y-1.5">
                            <span className="px-2 py-0.5 bg-[#DCE7FF]/40 text-[#081B8C] text-[10px] font-extrabold uppercase rounded-full">
                              {link.type === 'reg' ? 'Onboarding' : link.type === 'login' ? 'Authentication' : 'Session Access'}
                            </span>
                            <h4 className="text-xs font-bold text-gray-800">{link.title}</h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed">{link.desc}</p>
                          </div>

                          <div className="space-y-2 pt-2">
                            <div className="bg-white border border-[#DCE7FF]/60 p-2.5 rounded-lg select-all font-mono text-[10px] text-gray-600 truncate">
                              {link.url}
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(link.url);
                                setCopiedLinkType(link.type);
                                setTimeout(() => setCopiedLinkType(null), 2000);
                              }}
                              className="cursor-pointer w-full bg-[#081B8C] hover:bg-[#2F6DFF] text-white text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                            >
                              {copiedLinkType === link.type ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Key className="w-3.5 h-3.5" />
                                  <span>Copy Secure Link</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#F8FAFF] border border-[#DCE7FF]/50 rounded-2xl p-5 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#081B8C]/5 text-[#081B8C] flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <h4 className="font-bold text-[#081B8C]">Search Indexing & Discovery Protection</h4>
                        <p className="leading-relaxed text-[11px]">
                          As an enterprise security protocol, the Client Portal remains completely isolated from the main website navigation and search indexes. 
                          The robots exclusion header (<code className="bg-white px-1.5 py-0.5 border border-gray-100 rounded text-red-500 font-mono">noindex, nofollow</code>) and 
                          crawler instructions (<code className="bg-white px-1.5 py-0.5 border border-gray-100 rounded text-red-500 font-mono">robots.txt</code>) are fully active.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIENT PORTAL ACCOUNTS MANAGEMENT TAB */}
              {activeTab === 'client_accounts' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-lg font-bold text-[#081B8C] font-display">Client Workspace Registrations</h2>
                        <p className="text-xs text-gray-400 font-semibold">Monitor, toggle, reset credentials, and resend onboarding alerts for client logins.</p>
                      </div>

                      <div className="relative w-full sm:max-w-xs">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search representatives or companies..."
                          value={accountSearchQuery}
                          onChange={(e) => setAccountSearchQuery(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>
                    </div>

                    {/* Table of Accounts */}
                    <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F8FAFF] border-b border-[#DCE7FF]/40 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">Representative</th>
                            <th className="p-4">Company Name</th>
                            <th className="p-4">Created Date</th>
                            <th className="p-4">Last Active</th>
                            <th className="p-4">Account Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                          {(() => {
                            const filteredAccounts = clientAccounts
                              .filter(acc => (acc.status || '').toLowerCase() !== 'archived')
                              .filter(acc => 
                                !accountSearchQuery || 
                                (acc.client_name || acc.name || '').toLowerCase().includes(accountSearchQuery.toLowerCase()) ||
                                (acc.business_email || acc.email || '').toLowerCase().includes(accountSearchQuery.toLowerCase()) ||
                                (acc.company_name || acc.company || '').toLowerCase().includes(accountSearchQuery.toLowerCase())
                              );

                            if (filteredAccounts.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                                    No registered client accounts detected.
                                  </td>
                                </tr>
                              );
                            }

                            return filteredAccounts.map((acc) => {
                              const emailAddr = acc.email || acc.business_email || '';
                              const repName = acc.name || acc.client_name || 'Representative';
                              const compName = acc.company || acc.company_name || 'Going Technologies Partner';
                              const currentStatus = acc.status || acc.account_status || 'active';

                              return (
                                <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 space-y-0.5">
                                    <div className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                                      <Users className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{repName}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-mono pl-5">{emailAddr}</div>
                                  </td>
                                  <td className="p-4">
                                    <span className="font-semibold text-gray-800">{compName}</span>
                                  </td>
                                  <td className="p-4 text-gray-500">
                                    {new Date(acc.created_at || Date.now()).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </td>
                                  <td className="p-4 text-gray-500 font-mono text-[10px]">
                                    {acc.last_login ? new Date(acc.last_login).toLocaleTimeString(undefined, {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) + ' // ' + new Date(acc.last_login).toLocaleDateString() : 'Never'}
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${currentStatus === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                      {currentStatus === 'active' ? 'Active Access' : 'Suspended'}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex flex-wrap gap-2 justify-end items-center">
                                      <button
                                        onClick={() => selectClientForWorkspace(acc)}
                                        className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                                        title="Inspect Client Workspace logins, docs & activity logs"
                                      >
                                        View
                                      </button>

                                      <button
                                        onClick={() => handleToggleAccountStatus(acc)}
                                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                          currentStatus === 'active' 
                                            ? 'border-red-200 hover:bg-red-50 text-red-600' 
                                            : 'border-emerald-200 hover:bg-emerald-50 text-emerald-600'
                                        }`}
                                        title={currentStatus === 'active' ? 'Suspend client login access' : 'Activate client access'}
                                      >
                                        {currentStatus === 'active' ? 'Suspend' : 'Activate'}
                                      </button>

                                      <button
                                        onClick={() => setSelectedAccountForReset(acc)}
                                        className="px-2 py-1 rounded text-[10px] font-bold border border-[#DCE7FF] hover:bg-[#F8FAFF] text-[#081B8C] cursor-pointer"
                                        title="Override secret password"
                                      >
                                        Reset Password
                                      </button>

                                      <button
                                        onClick={() => handleArchiveClient(acc)}
                                        className="px-2 py-1 rounded text-[10px] font-extrabold bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer inline-flex items-center gap-1 border border-amber-200"
                                        title="Archive Client"
                                      >
                                        <Archive className="w-3.5 h-3.5" />
                                        <span>Archive</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* SELECTED CLIENT WORKSPACE PANEL (Credentials, Documents & Timeline) */}
                    {selectedClientWorkspace && (
                      <div className="mt-8 border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 bg-slate-50/50 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                          <div>
                            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider mb-2">
                              <span>Active Workspace Link</span>
                            </div>
                            <h3 className="text-base font-bold text-[#081B8C] font-display">
                              {selectedClientWorkspace.company || selectedClientWorkspace.company_name} Console
                            </h3>
                            <p className="text-xs text-gray-400 font-semibold">
                              Inspecting credentials, private manual SOPs, and system activities for representative <span className="text-gray-800 font-bold">{selectedClientWorkspace.name || selectedClientWorkspace.client_name}</span>.
                            </p>
                          </div>

                          <div className="flex gap-2.5">
                            {['credentials', 'documents', 'activity'].map((t) => (
                              <button
                                key={t}
                                onClick={() => setWorkspaceTab(t as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  workspaceTab === t 
                                    ? 'bg-[#081B8C] text-white shadow-xs' 
                                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                                }`}
                              >
                                {t === 'credentials' ? 'Credentials (View-Only)' : t === 'documents' ? 'Documents Vault' : 'Operational Logs'}
                              </button>
                            ))}
                            <button
                              onClick={() => setSelectedClientWorkspace(null)}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 hover:bg-rose-50 border border-rose-200"
                            >
                              Close
                            </button>
                          </div>
                        </div>

                        {/* SUB-TAB 1: CREDENTIALS (VIEW ONLY) */}
                        {workspaceTab === 'credentials' && (
                          <div className="bg-white border border-[#DCE7FF]/30 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-[#F8FAFF] border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                                  <th className="p-4">Platform Info</th>
                                  <th className="p-4">Category</th>
                                  <th className="p-4">Username / Email</th>
                                  <th className="p-4">Decrypted Secret</th>
                                  <th className="p-4">Notes</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-xs">
                                {workspaceCredentials.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                                      Client representative has not created any vault credentials yet.
                                    </td>
                                  </tr>
                                ) : (
                                  workspaceCredentials.map((cred) => (
                                    <tr key={cred.id} className="hover:bg-slate-50/50">
                                      <td className="p-4">
                                        <span className="font-extrabold text-gray-800 block">{cred.platform}</span>
                                        {cred.login_url && (
                                          <a href={cred.login_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px] font-semibold">
                                            {cred.login_url}
                                          </a>
                                        )}
                                      </td>
                                      <td className="p-4">
                                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
                                          {cred.category}
                                        </span>
                                      </td>
                                      <td className="p-4 font-mono text-gray-700 font-semibold">{cred.username}</td>
                                      <td className="p-4 font-mono text-emerald-700 font-bold tracking-wider">
                                        {decryptClientPassword(cred.password)}
                                      </td>
                                      <td className="p-4 text-gray-500 font-medium max-w-xs truncate">{cred.notes || '-'}</td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* SUB-TAB 2: DOCUMENTS (VIEW/DOWNLOAD/UPLOAD) */}
                        {workspaceTab === 'documents' && (
                          <div className="space-y-4">
                            {/* Upload tool */}
                            <div className="bg-white border border-[#DCE7FF]/30 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <h4 className="text-xs font-bold text-gray-800">Transmit Secure Manual SOP</h4>
                                <p className="text-[11px] text-gray-400 font-semibold">Upload underwriting manuals or client guidelines directly to this workspace folder.</p>
                              </div>
                              
                              <div>
                                <input 
                                  type="file" 
                                  id="admin-to-client-upload"
                                  className="hidden" 
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleAdminUploadToClient(e.target.files[0]);
                                    }
                                  }} 
                                />
                                <button
                                  onClick={() => document.getElementById('admin-to-client-upload')?.click()}
                                  disabled={isUploadingToClient}
                                  className="bg-[#081B8C] hover:bg-[#2F6DFF] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  {isUploadingToClient ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Uploading File...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Upload SOP Document</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Documents list */}
                            <div className="bg-white border border-[#DCE7FF]/30 rounded-2xl overflow-hidden">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-[#F8FAFF] border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="p-4">File Name</th>
                                    <th className="p-4">Uploaded By</th>
                                    <th className="p-4">Size</th>
                                    <th className="p-4">Uploaded At</th>
                                    <th className="p-4 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-xs">
                                  {workspaceDocuments.length === 0 ? (
                                    <tr>
                                      <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                                        No files archived in this workspace directory folder.
                                      </td>
                                    </tr>
                                  ) : (
                                    workspaceDocuments.map((doc) => (
                                      <tr key={doc.id} className="hover:bg-slate-50/50">
                                        <td className="p-4">
                                          <span className="font-extrabold text-gray-800 block">{doc.file_name}</span>
                                          <span className="text-[10px] text-gray-400 block font-semibold uppercase">{doc.title}</span>
                                        </td>
                                        <td className="p-4">
                                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${doc.uploaded_by === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                            {doc.uploaded_by === 'Admin' ? 'HQ Admin' : 'Client self'}
                                          </span>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-[10px] text-gray-500">{doc.file_size}</td>
                                        <td className="p-4 text-gray-500 font-medium">
                                          {new Date(doc.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                          <div className="flex justify-end gap-2">
                                            <button 
                                              onClick={() => handleAdminDownloadFile(doc)}
                                              className="p-1 text-gray-400 hover:text-slate-800 animate-fade-in"
                                            >
                                              <Download className="w-4 h-4" />
                                            </button>
                                            <button 
                                              onClick={() => handleAdminDeleteDocument(doc)}
                                              className="p-1 text-gray-400 hover:text-rose-600"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* SUB-TAB 3: ACTIVITY TIMELINE */}
                        {workspaceTab === 'activity' && (
                          <div className="bg-white border border-[#DCE7FF]/30 rounded-2xl p-6 space-y-4">
                            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Historical Audit Timeline Logs</h4>
                            
                            <div className="relative border-l border-gray-100 pl-6 ml-3 space-y-5">
                              {workspaceActivity.length === 0 ? (
                                <p className="p-8 text-center text-gray-400 font-medium">No system activity logged under this partner node.</p>
                              ) : (
                                workspaceActivity.map((log) => (
                                  <div key={log.id} className="relative space-y-1">
                                    <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-extrabold text-gray-800">{log.event_type}</span>
                                      <span className="text-[10px] text-gray-400 font-mono">
                                        {new Date(log.created_at).toLocaleTimeString()} - {new Date(log.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{log.description}</p>
                                    <p className="text-[9px] font-mono text-gray-400">Handshake representative: {log.email}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ARCHIVED CLIENTS TAB */}
              {activeTab === 'archived_clients' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-lg font-bold text-[#081B8C] font-display">Archived Clients Directory</h2>
                        <p className="text-xs text-gray-400 font-semibold">View, restore, or permanently purge archived client portal records.</p>
                      </div>

                      <div className="relative w-full sm:max-w-xs">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search archived clients..."
                          value={accountSearchQuery}
                          onChange={(e) => setAccountSearchQuery(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>
                    </div>

                    {/* Table of Archived Accounts */}
                    <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F8FAFF] border-b border-[#DCE7FF]/40 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">Client Name</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Email Address</th>
                            <th className="p-4">Archived Date</th>
                            <th className="p-4">Archived By</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                          {(() => {
                            const archivedAccounts = clientAccounts
                              .filter(acc => (acc.status || '').toLowerCase() === 'archived')
                              .filter(acc => 
                                !accountSearchQuery || 
                                (acc.client_name || acc.name || '').toLowerCase().includes(accountSearchQuery.toLowerCase()) ||
                                (acc.business_email || acc.email || '').toLowerCase().includes(accountSearchQuery.toLowerCase()) ||
                                (acc.company_name || acc.company || '').toLowerCase().includes(accountSearchQuery.toLowerCase())
                              );

                            if (archivedAccounts.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={6} className="p-12 text-center text-gray-400 font-medium text-slate-500">
                                    No archived client accounts found.
                                  </td>
                                </tr>
                              );
                            }

                            return archivedAccounts.map((acc) => {
                              const emailAddr = acc.email || acc.business_email || '';
                              const repName = acc.name || acc.client_name || 'Representative';
                              const compName = acc.company || acc.company_name || 'Going Technologies Partner';
                              const archivedDate = acc.updated_at ? new Date(acc.updated_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }) : 'Recently';

                              return (
                                <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4">
                                    <div className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                                      <Users className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{repName}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 font-semibold text-gray-800">
                                    {compName}
                                  </td>
                                  <td className="p-4 text-gray-500 font-mono text-[11px]">
                                    {emailAddr}
                                  </td>
                                  <td className="p-4 text-gray-500">
                                    {archivedDate}
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold font-mono">
                                      admin@goingtechnologies.com
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex flex-wrap gap-2 justify-end items-center">
                                      <button
                                        onClick={() => handleRestoreClient(acc)}
                                        className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer inline-flex items-center gap-1"
                                        title="Restore client workspace and login access"
                                      >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Restore</span>
                                      </button>

                                      <button
                                        onClick={() => handlePermanentDeleteClient(acc)}
                                        className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer inline-flex items-center gap-1"
                                        title="Permanently delete auth user and all documents"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Permanently Delete</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIENT CREDENTIALS CONSOLE TAB (VIEW ONLY) */}
              {activeTab === 'client_credentials' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                    <div>
                      <h2 className="text-lg font-bold text-[#081B8C] font-display">System Client Credentials Directory</h2>
                      <p className="text-xs text-gray-400 font-semibold">Consolidated view of all client credentials. Credentials are read-only and updated in real-time.</p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by company or client..."
                        value={credentialsSearchQuery}
                        onChange={(e) => setCredentialsSearchQuery(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>
                  </div>

                  {/* List of Clients with expanded credentials */}
                  <div className="space-y-4">
                    {(() => {
                      const filteredClients = clientAccounts
                        .filter(client => (client.status || '').toLowerCase() !== 'archived')
                        .filter(client => {
                          const compName = (client.company || client.company_name || '').toLowerCase();
                          const clientName = (client.name || client.client_name || '').toLowerCase();
                          const clientEmail = (client.email || client.business_email || '').toLowerCase();
                          const query = credentialsSearchQuery.toLowerCase();
                          
                          // Check if client info matches query
                          if (compName.includes(query) || clientName.includes(query) || clientEmail.includes(query)) {
                            return true;
                          }

                          // Check if any credential matches the query
                          const clientCreds = allClientCredentials.filter(c => c.client_id === client.id);
                          return clientCreds.some(c => 
                            (c.platform || '').toLowerCase().includes(query) ||
                            (c.category || '').toLowerCase().includes(query) ||
                            (c.username || '').toLowerCase().includes(query)
                          );
                        });

                      if (filteredClients.length === 0) {
                        return (
                          <div className="p-12 text-center text-gray-400 font-medium border border-dashed border-[#DCE7FF] rounded-2xl">
                            No clients or credentials match your search criteria.
                          </div>
                        );
                      }

                      return filteredClients.map((client) => {
                        const clientCreds = allClientCredentials.filter(c => c.client_id === client.id);
                        const isExpanded = expandedClientIds.includes(client.id);

                        return (
                          <div key={client.id} className="border border-[#DCE7FF]/60 rounded-2xl overflow-hidden transition-all bg-white shadow-xs">
                            {/* Client Row Header */}
                            <div 
                              onClick={() => toggleClientCredentialsExpand(client.id)}
                              className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-[#081B8C] text-sm">{client.company || client.company_name || 'Going Technologies Partner'}</h3>
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-extrabold uppercase font-mono">
                                    {clientCreds.length} {clientCreds.length === 1 ? 'Credential' : 'Credentials'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Representative: <strong className="text-gray-700">{client.name || client.client_name}</strong> ({client.email || client.business_email})
                                </p>
                              </div>

                              <button 
                                className="cursor-pointer px-4 py-2 bg-slate-50 hover:bg-[#F8FAFF] border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 transition-colors flex items-center gap-1.5"
                              >
                                <span>{isExpanded ? 'Collapse' : 'Expand Credentials'}</span>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </button>
                            </div>

                            {/* Expanded Credentials Table */}
                            {isExpanded && (
                              <div className="border-t border-gray-100 bg-[#FAFBFD]/30 p-5 space-y-4">
                                {clientCreds.length === 0 ? (
                                  <p className="text-xs text-gray-400 italic font-medium p-4 text-center">No credentials saved for this client workspace node.</p>
                                ) : (
                                  <div className="overflow-x-auto border border-gray-100 rounded-xl bg-white">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                                          <th className="p-3">Platform</th>
                                          <th className="p-3">Category</th>
                                          <th className="p-3">Username / Email</th>
                                          <th className="p-3">Decrypted Password</th>
                                          <th className="p-3">Notes</th>
                                          <th className="p-3">Last Synced</th>
                                          <th className="p-3 text-right">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100 text-xs font-medium">
                                        {clientCreds.map((cred) => (
                                          <tr key={cred.id} className="hover:bg-slate-50/50">
                                            <td className="p-3 font-bold text-gray-800">{cred.platform}</td>
                                            <td className="p-3">
                                              <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded text-[10px]">
                                                {cred.category || 'General'}
                                              </span>
                                            </td>
                                            <td className="p-3 font-mono text-[11px] text-gray-600 select-all">{cred.username}</td>
                                            <td className="p-3 font-mono text-[11px] text-[#2F6DFF] font-extrabold select-all">
                                              {decryptClientPassword(cred.password)}
                                            </td>
                                            <td className="p-3 text-gray-500 italic max-w-xs truncate" title={cred.notes}>
                                              {cred.notes || '—'}
                                            </td>
                                            <td className="p-3 text-[10px] text-gray-400 font-mono">
                                              {new Date(cred.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-right">
                                              <button
                                                onClick={() => handleAdminDeleteCredential(cred)}
                                                className="cursor-pointer p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                                                title="Permanently Delete Credential"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
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
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* CLIENT DOCUMENTS MASTER DIRECTORY TAB */}
              {activeTab === 'client_documents' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                    <div>
                      <h2 className="text-lg font-bold text-[#081B8C] font-display">Client Documents Central Vault</h2>
                      <p className="text-xs text-gray-400 font-semibold">Access and download all documents uploaded inside various client workspace environments.</p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search file name, title, or client..."
                        value={documentsSearchQuery}
                        onChange={(e) => setDocumentsSearchQuery(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                      />
                    </div>
                  </div>

                  {/* Documents Directory Grid / Table */}
                  <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFF] border-b border-[#DCE7FF]/40 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Partner Workspace</th>
                          <th className="p-4">File Name</th>
                          <th className="p-4">Source Category / Title</th>
                          <th className="p-4">Uploaded By</th>
                          <th className="p-4">File Size</th>
                          <th className="p-4">Uploaded At</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE7FF]/20 text-xs">
                        {(() => {
                          const filteredDocs = allClientDocuments.filter(doc => {
                            // Find matching client
                            const client = clientAccounts.find(c => c.id === doc.client_id);
                            if (client && (client.status || '').toLowerCase() === 'archived') {
                              return false;
                            }
                            
                            const fileName = (doc.file_name || '').toLowerCase();
                            const title = (doc.title || '').toLowerCase();
                            const query = documentsSearchQuery.toLowerCase();
                            
                            const compName = (client?.company || client?.company_name || '').toLowerCase();
                            const clientName = (client?.name || client?.client_name || '').toLowerCase();

                            return (
                              fileName.includes(query) ||
                              title.includes(query) ||
                              compName.includes(query) ||
                              clientName.includes(query)
                            );
                          });

                          if (filteredDocs.length === 0) {
                            return (
                              <tr>
                                <td colSpan={7} className="p-12 text-center text-gray-400 font-medium">
                                  No client documents match your search query.
                                </td>
                              </tr>
                            );
                          }

                          return filteredDocs.map((doc) => {
                            const client = clientAccounts.find(c => c.id === doc.client_id);
                            const compName = client?.company || client?.company_name || 'Going Technologies Partner';
                            const clientRep = client?.name || client?.client_name || 'Representative';

                            return (
                              <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 space-y-0.5">
                                  <div className="font-bold text-[#081B8C]">{compName}</div>
                                  <div className="text-[10px] text-gray-400 font-medium">Node Representative: {clientRep}</div>
                                </td>
                                <td className="p-4">
                                  <span className="font-extrabold text-gray-800 block select-all">{doc.file_name}</span>
                                </td>
                                <td className="p-4 uppercase tracking-wider text-[9px] font-mono font-extrabold text-slate-500">
                                  {doc.title || 'General'}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${doc.uploaded_by === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {doc.uploaded_by === 'Admin' ? 'HQ Admin' : 'Client self'}
                                  </span>
                                </td>
                                <td className="p-4 font-mono font-bold text-[10px] text-gray-500">{doc.file_size}</td>
                                <td className="p-4 text-gray-400 font-mono text-[10px]">
                                  {new Date(doc.created_at).toLocaleString()}
                                </td>
                                <td className="p-4 text-right space-x-1.5">
                                  <button 
                                    onClick={() => handleAdminPreviewFile(doc)}
                                    className="cursor-pointer p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors inline-flex items-center gap-1 font-bold text-[10px]"
                                    title="Preview Document Inline"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Preview</span>
                                  </button>

                                  <button 
                                    onClick={() => handleAdminDownloadFile(doc)}
                                    className="cursor-pointer p-2 text-[#081B8C] hover:bg-blue-50 rounded-xl transition-colors inline-flex items-center gap-1 font-bold text-[10px]"
                                    title="Securely Download Document"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download</span>
                                  </button>

                                  <button 
                                    onClick={() => handleAdminDeleteDocument(doc)}
                                    className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors inline-flex items-center gap-1 font-bold text-[10px]"
                                    title="Permanently Delete Document"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CLIENT WORKSPACE ACTIVITIES & NOTIFICATIONS TAB */}
              {activeTab === 'client_notifications' && (
                <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                    <div>
                      <h2 className="text-lg font-bold text-[#081B8C] font-display">Client Workspace Operations Notifications</h2>
                      <p className="text-xs text-gray-400 font-semibold">Continuous live audit stream tracking file uploads, profile modifications, credentials changes, and workflow logs.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <div className="relative w-full sm:max-w-xs">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Filter by company or message..."
                          value={notificationsSearchQuery}
                          onChange={(e) => setNotificationsSearchQuery(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>

                      {allClientNotifications.length > 0 && (
                        <button
                          onClick={handleClearAllNotifications}
                          className="cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                          title="Permanently clear all notification history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear All</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Operational Timeline Notifications list */}
                  <div className="relative border-l-2 border-[#DCE7FF]/50 pl-6 ml-4 space-y-6">
                    {(() => {
                      const filteredNotifications = allClientNotifications.filter(notif => {
                        // Find matching client
                        const client = clientAccounts.find(c => c.id === notif.client_id);
                        if (client && (client.status || '').toLowerCase() === 'archived') {
                          return false;
                        }
                        
                        const title = (notif.title || '').toLowerCase();
                        const msg = (notif.message || '').toLowerCase();
                        const query = notificationsSearchQuery.toLowerCase();
                        
                        const compName = (client?.company || client?.company_name || '').toLowerCase();

                        return (
                          title.includes(query) ||
                          msg.includes(query) ||
                          compName.includes(query)
                        );
                      });

                      if (filteredNotifications.length === 0) {
                        return (
                          <div className="p-12 text-center text-gray-400 font-medium border border-dashed border-[#DCE7FF] rounded-2xl">
                            No notifications match your search query.
                          </div>
                        );
                      }

                      return filteredNotifications.map((notif) => {
                        const client = clientAccounts.find(c => c.id === notif.client_id);
                        const compName = client?.company || client?.company_name || 'Going Technologies Partner';
                        const repEmail = client?.email || client?.business_email || 'unknown@client.com';

                        let iconBg = 'bg-blue-50 text-blue-600 border border-blue-100';
                        let IconComponent = Bell;

                        if (notif.title?.toLowerCase().includes('credential')) {
                          iconBg = 'bg-amber-50 text-amber-600 border border-amber-100';
                          IconComponent = Key;
                        } else if (notif.title?.toLowerCase().includes('file') || notif.title?.toLowerCase().includes('document')) {
                          iconBg = 'bg-purple-50 text-purple-600 border border-purple-100';
                          IconComponent = Folder;
                        }

                        return (
                          <div key={notif.id} className="relative space-y-1.5 p-4 bg-[#F8FAFF]/40 border border-[#DCE7FF]/30 rounded-2xl hover:border-[#2F6DFF]/30 hover:bg-[#FAFBFD] transition-all">
                            {/* Marker circle */}
                            <span className="absolute -left-[35px] top-6 w-4.5 h-4.5 rounded-full bg-white border-2 border-[#2F6DFF] flex items-center justify-center shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6DFF]" />
                            </span>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`p-1 rounded-lg ${iconBg}`}>
                                  <IconComponent className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-xs font-extrabold text-gray-900">{notif.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-mono font-semibold">
                                  {new Date(notif.created_at).toLocaleString()}
                                </span>
                                <button
                                  onClick={() => handleClearNotification(notif.id)}
                                  className="cursor-pointer p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Clear this notification"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                              {notif.message}
                            </p>

                            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-gray-400">
                              <span className="font-bold text-[#081B8C] bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5">
                                {compName}
                              </span>
                              <span className="font-mono">{repEmail}</span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* AUDIT LOGS VIEW TAB */}
              {activeTab === 'auth_logs' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#DCE7FF]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-lg font-bold text-[#081B8C] font-display">Auth Security Audit Trail</h2>
                        <p className="text-xs text-gray-400 font-semibold">Track historical authentication transactions, OTP verifications, registrations, and administrative changes.</p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                          value={authLogTypeFilter}
                          onChange={(e) => setAuthLogTypeFilter(e.target.value)}
                          className="bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        >
                          <option value="All">All Events</option>
                          <option value="Registration">Registration</option>
                          <option value="verified">Verification</option>
                          <option value="Login">Login</option>
                          <option value="Logout">Logout</option>
                          <option value="Failed">Failed logins</option>
                          <option value="Reset">Resets</option>
                          <option value="Disabled">Disables</option>
                        </select>

                        <div className="relative w-full sm:max-w-xs">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Filter by business email..."
                            value={authLogsSearchQuery}
                            onChange={(e) => setAuthLogsSearchQuery(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          />
                        </div>

                        <button
                          onClick={() => exportToCSV(authLogs, 'gt_auth_audit_trail')}
                          className="cursor-pointer bg-[#F8FAFF] border border-[#DCE7FF] hover:border-gray-300 text-gray-600 px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>

                    {/* Table of Audit Logs */}
                    <div className="overflow-x-auto border border-[#DCE7FF]/30 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F8FAFF] border-b border-[#DCE7FF]/40 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">Audit Transaction ID</th>
                            <th className="p-4">Target Business Email</th>
                            <th className="p-4">Recorded Event Activity</th>
                            <th className="p-4">Simulated Network IP</th>
                            <th className="p-4">Timestamp (UTC)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCE7FF]/20 text-xs font-mono">
                          {(() => {
                            const filteredLogs = authLogs.filter(log => {
                              const matchesSearch = !authLogsSearchQuery || (log.business_email || '').toLowerCase().includes(authLogsSearchQuery.toLowerCase());
                              const matchesFilter = authLogTypeFilter === 'All' || (log.event_type || '').toLowerCase().includes(authLogTypeFilter.toLowerCase());
                              return matchesSearch && matchesFilter;
                            });

                            if (filteredLogs.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                                    No auth logs match your current search filters.
                                  </td>
                                </tr>
                              );
                            }

                            return filteredLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-gray-400 select-all font-mono">
                                  #{log.id}
                                </td>
                                <td className="p-4 font-bold text-gray-800">
                                  {log.business_email}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    log.event_type.toLowerCase().includes('failed') || log.event_type.toLowerCase().includes('disable')
                                      ? 'bg-red-50 text-red-600 border border-red-100'
                                      : log.event_type.toLowerCase().includes('login') || log.event_type.toLowerCase().includes('verify')
                                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                      : 'bg-blue-50 text-[#081B8C] border border-blue-100'
                                  }`}>
                                    {log.event_type}
                                  </span>
                                </td>
                                <td className="p-4 text-gray-500 font-semibold">
                                  {log.ip_address || '192.168.10.12'}
                                </td>
                                <td className="p-4 text-gray-400">
                                  {new Date(log.created_at || Date.now()).toISOString().replace('T', ' ').substring(0, 19)}
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* CREATE NEW BLOG MODAL */}
              {isBlogModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 relative space-y-5 border border-gray-100 shadow-2xl text-left">
                    <button
                      onClick={() => setIsBlogModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
                      disabled={isSavingBlog}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="space-y-1">
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">
                        Publish Strategic Briefing
                      </span>
                      <h3 className="text-xl font-bold text-[#081B8C] font-display">
                        Create Intelligence Article
                      </h3>
                    </div>

                    {blogFormError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{blogFormError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveBlog} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Article Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Scaling Insurance Broker Operations Under SOC2 Guidelines"
                          value={blogTitle}
                          onChange={(e) => {
                            setBlogTitle(e.target.value);
                            setBlogMetaTitle(e.target.value);
                          }}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          disabled={isSavingBlog}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Category *</label>
                          <select
                            value={blogCategory}
                            onChange={(e) => setBlogCategory(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingBlog}
                          >
                            <option value="Insurance Operations">Insurance Operations</option>
                            <option value="Digital Transformation">Digital Transformation</option>
                            <option value="Business Process Outsourcing">Business Process Outsourcing</option>
                            <option value="AI & Automation">AI & Automation</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Author Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Going Technologies Team"
                            value={blogAuthor}
                            onChange={(e) => setBlogAuthor(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingBlog}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Reading Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 5 Min Read"
                            value={blogReadTime}
                            onChange={(e) => setBlogReadTime(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingBlog}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">SEO Meta Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Secure Offshore Scaling Guide"
                            value={blogMetaTitle}
                            onChange={(e) => setBlogMetaTitle(e.target.value)}
                            className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            disabled={isSavingBlog}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Short Excerpt / Description</label>
                        <textarea
                          placeholder="Provide a brief summary for blog feeds and search engine result descriptions..."
                          value={blogExcerpt}
                          onChange={(e) => setBlogExcerpt(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] min-h-[60px]"
                          disabled={isSavingBlog}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Article Content (Markdown or Text) *</label>
                        <textarea
                          required
                          placeholder="Type or paste the full body of your corporate article..."
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF] min-h-[160px] font-mono"
                          disabled={isSavingBlog}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setIsBlogModalOpen(false)}
                          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-3 rounded-xl transition-colors"
                          disabled={isSavingBlog}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingBlog}
                          className="cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-500/10"
                        >
                          {isSavingBlog ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Publish Article</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
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

                      {editingRecord.table === 'whatsapp_contact_leads' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Full Name</label>
                            <input
                              type="text"
                              required
                              value={editingRecord.data.full_name || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, full_name: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Business Email</label>
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
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Lead Status</label>
                            <select
                              value={editingRecord.data.status || 'New'}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, status: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            >
                              <option value="New">New</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Converted">Converted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                        </>
                      )}

                      {(editingRecord.table === 'business_tool_leads' || editingRecord.table === 'business_proposal_leads') && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Agency / Company Name</label>
                            <input
                              type="text"
                              required
                              value={editingRecord.data.agency_name || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, agency_name: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Business Email</label>
                            <input
                              type="email"
                              required
                              value={editingRecord.data.business_email || ''}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, business_email: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Business Sector</label>
                            <select
                              value={editingRecord.data.business_sector || 'Property & Casualty Insurance'}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, business_sector: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            >
                              <option value="Property & Casualty Insurance">Property & Casualty Insurance</option>
                              <option value="Health Insurance">Health Insurance</option>
                              <option value="Life Insurance">Life Insurance</option>
                              <option value="Medicare">Medicare</option>
                              <option value="Insurance Brokerage">Insurance Brokerage</option>
                              <option value="MGA">MGA</option>
                              <option value="Insurance Carrier">Insurance Carrier</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-700 uppercase">Lead Status</label>
                            <select
                              value={editingRecord.data.status || 'New'}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                data: { ...editingRecord.data, status: e.target.value }
                              })}
                              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                            >
                              <option value="New">New</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Converted">Converted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                        </>
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

              {/* PASSWORD RESET OVERLAY MODAL */}
              {selectedAccountForReset && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-sm w-full p-8 relative space-y-6 border border-gray-100 shadow-2xl text-left">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wide">Secure Override</span>
                      <h3 className="text-lg font-bold text-gray-900">Reset Client Password</h3>
                      <p className="text-xs text-gray-400">Account: <strong className="text-[#081B8C] font-mono select-all">{selectedAccountForReset.business_email}</strong></p>
                    </div>

                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase">New Override Password</label>
                        <input
                          type="text"
                          required
                          placeholder="Min 12 chars, uppercase, symbol, number"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccountForReset(null);
                            setNewPasswordInput('');
                          }}
                          className="cursor-pointer flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* PREVIEW MODAL */}
              {previewingDoc && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 text-left">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                      <div>
                        <h3 className="font-bold text-gray-900 font-display">{previewingDoc.file_name}</h3>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{previewingDoc.file_size} // {previewingDoc.title || 'General'}</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setPreviewingDoc(null);
                          setPreviewUrl(null);
                        }}
                        className="cursor-pointer p-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-grow p-6 bg-slate-900 flex items-center justify-center overflow-auto min-h-[400px]">
                      {previewUrl && (
                        previewingDoc.file_name.toLowerCase().endsWith('.pdf') ? (
                          <iframe src={previewUrl} className="w-full h-[60vh] rounded-xl border border-slate-800" />
                        ) : (previewingDoc.file_name.toLowerCase().endsWith('.png') || 
                             previewingDoc.file_name.toLowerCase().endsWith('.jpg') || 
                             previewingDoc.file_name.toLowerCase().endsWith('.jpeg') || 
                             previewingDoc.file_name.toLowerCase().endsWith('.gif') || 
                             previewingDoc.file_name.toLowerCase().endsWith('.webp')) ? (
                          <img src={previewUrl} alt={previewingDoc.file_name} className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="text-center p-8 text-slate-400 max-w-md">
                            <Folder className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <h4 className="font-bold text-slate-200">Preview Not Supported Inline</h4>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">
                              Preview is only supported for standard PDF files and common web images. Please download this Microsoft Office or binary document to view its contents securely on your local device.
                            </p>
                            <button
                              onClick={() => handleAdminDownloadFile(previewingDoc)}
                              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Document</span>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM ADMINISTRATIVE TOAST ALERT */}
              {adminAlert && (
                <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl p-4.5 shadow-2xl flex items-start gap-3.5 animate-bounce">
                  <div className={`p-1.5 rounded-lg shrink-0 ${adminAlert.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-extrabold text-white">System Security Log</p>
                    <p className="text-[11px] text-slate-300 leading-normal">{adminAlert.message}</p>
                  </div>
                  <button onClick={() => setAdminAlert(null)} className="text-slate-500 hover:text-slate-300 shrink-0 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
