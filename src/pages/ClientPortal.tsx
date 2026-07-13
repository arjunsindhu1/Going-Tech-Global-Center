import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Mail, Lock, Building, User, Eye, EyeOff, 
  ArrowRight, Key, FileText, Bell, Clock as ClockIcon, 
  Cpu, CheckCircle, AlertTriangle, Upload, Download, Trash2, 
  ExternalLink, LogOut, Check, ArrowLeft, RefreshCw, Loader2, Info,
  Search, Plus, Shield, Globe, Landmark, Award, FolderPlus, Folder, ChevronRight, Edit2, Copy, FileCode, CheckSquare,
  ClipboardCheck
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

// =========================================================================
// PREMIUM ONBOARDING EXPERIENCE COMPONENTS (SaaS-Style)
// =========================================================================

const OnboardingPreloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000; // 4 seconds total
    const intervalTime = 40;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400); // Small delay for smooth exit
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[#F5F8FF] flex items-center justify-center p-6"
    >
      {/* Decorative floating ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      
      {/* Grid Pattern mask overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[32px] p-8 md:p-12 text-center space-y-8 relative z-10"
      >
        <div className="space-y-6">
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="flex justify-center"
          >
            <div className="p-4 bg-white/95 shadow-md border border-slate-100/80 rounded-2xl">
              <img 
                src="/GTGC Logo.png?v=3" 
                alt="Going Technologies Logo" 
                className="h-16 w-auto object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <div className="space-y-3">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xs font-extrabold text-blue-600 uppercase tracking-widest font-sans"
            >
              Welcome to Going Technologies
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl md:text-3xl font-black font-display text-slate-950 tracking-tight leading-tight"
            >
              Your Extended Insurance Operations Team Starts Here.
            </motion.h1>
          </div>
        </div>

        {/* Message Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/85 p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm text-slate-600 text-xs md:text-sm font-medium leading-relaxed max-w-xl mx-auto space-y-4"
        >
          <p className="font-bold text-slate-800">
            Thank you for choosing Going Technologies.
          </p>
          <p className="text-slate-500 font-semibold text-xs leading-relaxed">
            We're excited to become an extension of your agency and help you improve operational efficiency, service quality, and scalability.
          </p>
        </motion.div>

        {/* Dynamic Progress Indicator */}
        <div className="space-y-3 max-w-md mx-auto pt-4">
          <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            <span>Configuring Private Node</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-100/50 p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CEOOnboardingModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#040A21]/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 sm:p-10 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-30 -mr-24 -mt-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-30 -ml-24 -mb-24 pointer-events-none" />

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Stylized Founder Avatar Placeholder */}
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-[#081B8C] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-white text-3xl font-black font-display tracking-tight">S</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-4.5 h-4.5 rounded-full" title="CEO is Online" />
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight leading-tight">Welcome Aboard!</h2>
            <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest">A message from our Founder</p>
          </div>
        </div>

        {/* Welcome message content */}
        <div className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed space-y-4 bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-100">
          <p>
            Thank you for trusting Going Technologies with your insurance operations.
          </p>
          <div className="border-l-2 border-blue-500 pl-3 py-1 space-y-2">
            <p className="font-bold text-slate-800">Our mission is simple:</p>
            <p className="text-slate-600">
              Become a seamless extension of your team while maintaining the same quality, responsiveness, and professionalism your clients expect.
            </p>
          </div>
          <p>
            Through this onboarding portal, we'll gather everything needed to launch your dedicated Virtual Assistant quickly and securely.
          </p>
          <p>
            We look forward to building a long-term partnership.
          </p>
        </div>

        {/* CEO Signature Block */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-5">
          <div className="space-y-0.5">
            <p className="text-sm font-extrabold text-slate-900 font-display">— Shirish</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Founder & CEO</p>
            <p className="text-[9px] text-[#081B8C] font-extrabold tracking-tight">Going Technologies Global Center</p>
          </div>
          <div className="opacity-15 shrink-0 select-none">
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-900">
              <path d="M10 20C15 15 25 10 35 15C45 20 40 30 50 25C60 20 65 15 70 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Action button controls */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer transition-all order-last sm:order-first"
          >
            Dismiss
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-[#081B8C] hover:bg-[#2F6DFF] hover:scale-[1.02] shadow-md hover:shadow-lg text-white text-xs font-extrabold cursor-pointer transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
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
    onboarding_completed?: boolean;
  } | null>(null);

  const [authChecked, setAuthChecked] = useState(false);

  // Authentication Flows: 'login' | 'register' | 'register_success' | 'forgot_password' | 'dashboard'
  const [flow, setFlow] = useState<'login' | 'register' | 'register_success' | 'forgot_password' | 'dashboard'>('login');

  // Premium Onboarding Flow states
  const [isOnboardingPreloaderActive, setIsOnboardingPreloaderActive] = useState(false);
  const [isCeoModalOpen, setIsCeoModalOpen] = useState(false);

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
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'onboarding' | 'credentials' | 'documents' | 'notifications' | 'timeline'>('overview');

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

  // Company Onboarding State variables
  const [onboardingData, setOnboardingData] = useState<any>({
    legalBusinessName: '',
    dba: '',
    ein: '',
    businessLicense: '',
    agencyNpn: '',
    companyType: '',
    industryType: '',
    propertyCasualty: false,
    lifeInsurance: false,
    healthInsurance: false,
    medicare: false,
    employeeBenefits: false,
    commercialInsurance: false,
    personalInsurance: false,
    yearEstablished: '',
    numEmployees: '',
    numLicensedAgents: '',
    companyWebsite: '',
    timeZone: '',
    preferredBusinessHours: '',

    hqAddress: '',
    hqCity: '',
    hqState: '',
    hqZip: '',
    hqCountry: 'United States',
    billingAddress: '',

    primaryName: '',
    primaryTitle: '',
    primaryEmail: '',
    primaryMobile: '',
    primaryOffice: '',
    primaryContactMethod: '',
    primaryContactTime: '',

    execName: '',
    execEmail: '',
    execPhone: '',

    apName: '',
    apEmail: '',
    apPhone: '',
    apBillingEmail: '',
    apPoRequired: '',

    itName: '',
    itTitle: '',
    itEmail: '',
    itPhone: '',
    itEmergencyPhone: '',

    opsPrimaryLines: '',
    opsLicensedStates: '',
    opsActiveClients: '',
    opsMonthlyNewVolume: '',
    opsMonthlyRenewals: '',
    opsMonthlyEndorsements: '',
    opsMonthlyClaims: '',
    opsTeamSize: '',

    sysAms: '',
    sysCrm: '',
    sysVoip: '',
    sysDms: '',
    sysEmail: '',
    sysCollaboration: '',

    secNdaRequired: '',
    secPolicyInPlace: '',
    secMfaEnabled: '',
    secPasswordManager: '',
    secComplianceRequirements: '',

    specPersonalLines: false,
    specCommercialLines: false,
    specLifeInsurance: false,
    specIndividualHealth: false,
    specGroupHealth: false,
    specMedicareAdvantage: false,
    specMedicareSupplement: false,
    specMedicarePartD: false,
    specAcaMarketplace: false,
    specEmployeeBenefits: false,
    specWorkersComp: false,
    specBonds: false,
    specSpecialtyLines: false,

    outsourceCurrently: '',
    outsourceVendor: '',
    outsourceNumStaff: '',
    outsourceReason: '',

    startGoLiveDate: '',
    startNumVas: '',
    startWorkingHours: '',
    startTrialRequired: '',

    docAgencyLicense: '',
    docW9: '',
    docNda: '',
    docMsa: '',
    docSops: '',
    docOrgChart: '',
    docEmployeeDirectory: '',
    docBrandingAssets: '',

    pcAmsPlatform: '',
    pcCarrierAppointments: '',
    pcMix: '',
    pcAcordUsage: '',

    lifeCarrierAppointments: '',
    lifeNewBusinessPlatforms: '',
    lifeIllustrationSoftware: '',
    lifeEAppPlatforms: '',

    healthMix: '',
    healthAcaParticipation: '',
    healthEnrollmentPlatforms: '',
    healthHipaaContact: '',

    medicareCmsContractNum: '',
    medicareProductsOffered: '',
    medicareAepSupport: '',
    medicareComplianceContact: ''
  });

  const [isSavingOnboarding, setIsSavingOnboarding] = useState(false);
  const [lastSavedOnboarding, setLastSavedOnboarding] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ '1': true });
  const hasLoadedInitialOnboarding = useRef(false);

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
          status: 'active',
          onboarding_completed: false
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
            const isCompletedOnboarding = 
              profile.onboarding_completed === true || 
              authSession?.user?.user_metadata?.onboarding_completed === true || 
              localStorage.getItem(`onboarding_completed_${profile.id}`) === 'true';

            setSession(profile);
            if (!isCompletedOnboarding) {
              setIsOnboardingPreloaderActive(true);
            }
            setFlow('dashboard');
          }
        }
      } else {
        setSession(null);
        const hash = window.location.hash.toLowerCase();
        if (hash.includes('register')) {
          setFlow('register');
        } else {
          setFlow('login');
        }
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
          const hash = window.location.hash.toLowerCase();
          if (hash.includes('register')) {
            setFlow('register');
          } else {
            setFlow('login');
          }
          return;
        }

        const profile = await ensureProfileExists(authSession.user);

        if (profile) {
          const isBlocked = profile.status === 'suspended' || profile.status === 'Archived' || profile.status === 'archived';
          if (isBlocked) {
            await supabase.auth.signOut();
            setSession(null);
            const hash = window.location.hash.toLowerCase();
            if (hash.includes('register')) {
              setFlow('register');
            } else {
              setFlow('login');
            }
          } else {
            const isCompletedOnboarding = 
              profile.onboarding_completed === true || 
              authSession?.user?.user_metadata?.onboarding_completed === true || 
              localStorage.getItem(`onboarding_completed_${profile.id}`) === 'true';

            setSession(profile);
            if (!isCompletedOnboarding) {
              setIsOnboardingPreloaderActive(true);
            }
            setFlow('dashboard');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        const hash = window.location.hash.toLowerCase();
        if (hash.includes('register')) {
          setFlow('register');
        } else {
          setFlow('login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Listen to hash shifts for sub-routes
  useEffect(() => {
    const handleHashChange = () => {
      if (!session) {
        const hash = window.location.hash.toLowerCase();
        if (hash.includes('register')) {
          setFlow('register');
        } else if (hash.includes('login')) {
          setFlow('login');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [session]);

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

      // 6. Fetch Onboarding data
      try {
        const { data: onboardingRes, error: onboardingErr } = await supabase
          .from('client_onboarding')
          .select('*')
          .eq('client_id', session.id)
          .maybeSingle();

        if (!onboardingErr && onboardingRes) {
          setOnboardingData(prev => ({
            ...prev,
            ...onboardingRes.data
          }));
          hasLoadedInitialOnboarding.current = true;
        } else {
          // Check local storage fallback
          const localData = localStorage.getItem(`onboarding_data_${session.id}`);
          if (localData) {
            try {
              setOnboardingData(prev => ({
                ...prev,
                ...JSON.parse(localData)
              }));
            } catch (_) {}
          }
          hasLoadedInitialOnboarding.current = true;
        }
      } catch (onboardingCatchErr) {
        console.warn('Could not fetch onboarding from DB, using fallback state:', onboardingCatchErr);
        const localData = localStorage.getItem(`onboarding_data_${session.id}`);
        if (localData) {
          try {
            setOnboardingData(prev => ({
              ...prev,
              ...JSON.parse(localData)
            }));
          } catch (_) {}
        }
        hasLoadedInitialOnboarding.current = true;
      }

    } catch (err) {
      console.error('Failed to load secure database datasets:', err);
    }
  };

  const calculateOnboardingProgress = (data: any) => {
    if (!data) return 0;
    const trackedKeys = [
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
    let filled = 0;
    trackedKeys.forEach(k => {
      if (data[k] !== undefined && data[k] !== null && String(data[k]).trim() !== '') {
        filled++;
      }
    });
    return Math.round((filled / trackedKeys.length) * 100);
  };

  const saveOnboardingData = async (dataToSave: any) => {
    if (!session?.id) return;
    setIsSavingOnboarding(true);
    try {
      const computedProgress = calculateOnboardingProgress(dataToSave);
      
      const { error } = await supabase
        .from('client_onboarding')
        .upsert({
          client_id: session.id,
          data: dataToSave,
          progress: computedProgress,
          updated_at: new Date().toISOString()
        }, { onConflict: 'client_id' });

      if (error) throw error;
      setLastSavedOnboarding(new Date().toLocaleTimeString());
      localStorage.setItem(`onboarding_data_${session.id}`, JSON.stringify(dataToSave));
    } catch (err: any) {
      console.warn('Autosave onboarding to DB failed, saving locally:', err);
      localStorage.setItem(`onboarding_data_${session.id}`, JSON.stringify(dataToSave));
    } finally {
      setIsSavingOnboarding(false);
    }
  };

  // Debounced Autosave Effect
  useEffect(() => {
    if (!session?.id || !hasLoadedInitialOnboarding.current) return;

    const delayDebounceFn = setTimeout(() => {
      saveOnboardingData(onboardingData);
    }, 4000);

    return () => clearTimeout(delayDebounceFn);
  }, [onboardingData, session?.id]);

  const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});

  const handleUploadOnboardingDocument = async (docKey: string, file: File) => {
    if (!session?.id) return;
    setUploadingDocs(prev => ({ ...prev, [docKey]: true }));
    triggerToast('info', 'Uploading Document', `Sending ${file.name} to private secure storage...`);

    try {
      const storagePath = `${session.id}/onboarding_${docKey}_${Date.now()}_${file.name}`;
      
      // Upload physical file in Supabase Storage private bucket
      const { data: storageData, error: storageErr } = await supabase.storage
        .from('client-documents')
        .upload(storagePath, file);

      if (storageErr) throw storageErr;

      // Also save document database schema record in client_documents
      const { error: dbErr } = await supabase
        .from('client_documents')
        .insert([{
          client_id: session.id,
          title: `Onboarding: ${docKey.replace('doc', '').replace(/([A-Z])/g, ' $1').trim()}`,
          file_name: file.name,
          file_size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          uploaded_by: 'Client',
          file_path: storagePath
        }]);

      if (dbErr) {
        console.warn('Could not insert onboarding document record into client_documents:', dbErr);
      }

      // Update onboardingData state
      const newData = {
        ...onboardingData,
        [docKey]: storagePath
      };
      setOnboardingData(newData);
      
      // Save onboardingData with new doc
      await saveOnboardingData(newData);

      // Re-trigger general dashboard data refresh to show the uploaded file immediately in the file vault!
      fetchDashboardData();

      triggerToast('success', 'Document Linked', `${file.name} successfully uploaded and registered.`);
    } catch (err: any) {
      triggerToast('error', 'Upload Failed', err.message || 'Verify storage permissions.');
    } finally {
      setUploadingDocs(prev => ({ ...prev, [docKey]: false }));
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'client_onboarding', filter: `client_id=eq.${session.id}` }, () => {
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

  // Save onboarding completion to Supabase and Local Storage
  const handleOnboardingCompleted = async () => {
    if (!session?.id) return;
    try {
      // 1. Update Supabase Auth user metadata
      await supabase.auth.updateUser({
        data: { onboarding_completed: true }
      });

      // 2. Update client_profiles table (safely in try-catch in case column is missing)
      const { error: dbErr } = await supabase
        .from('client_profiles')
        .update({ onboarding_completed: true })
        .eq('id', session.id);
      
      if (dbErr) {
        console.warn('client_profiles table onboarding_completed field update failed (handled gracefully):', dbErr.message);
      }

      // 3. Set local storage cache
      localStorage.setItem(`onboarding_completed_${session.id}`, 'true');

      // 4. Update local session state
      setSession(prev => prev ? { ...prev, onboarding_completed: true } : null);

    } catch (err) {
      console.error('Failed to save onboarding completion status:', err);
    } finally {
      setIsCeoModalOpen(false);
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
      
      {/* SaaS Welcome Preloader Overlay */}
      <AnimatePresence>
        {isOnboardingPreloaderActive && (
          <OnboardingPreloader 
            onComplete={() => {
              setIsOnboardingPreloaderActive(false);
              setIsCeoModalOpen(true);
            }} 
          />
        )}
      </AnimatePresence>

      {/* CEO Welcome Onboarding Modal Overlay */}
      <AnimatePresence>
        {isCeoModalOpen && (
          <CEOOnboardingModal 
            onClose={handleOnboardingCompleted} 
          />
        )}
      </AnimatePresence>
      
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
                { id: 'onboarding', label: 'Company Onboarding', icon: ClipboardCheck },
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

              {/* TAB 2.5: COMPANY ONBOARDING */}
              {activeTab === 'onboarding' && (
                <motion.div key="onboarding" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  {/* Onboarding Overview & Progress Header Card */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black font-display text-slate-900 tracking-tight">Agency Onboarding Protocol</h3>
                        <p className="text-xs text-slate-400 font-semibold font-sans">
                          Complete your operational metrics, system profiles, and submit compliance records.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-xs shrink-0 font-semibold text-slate-600">
                        {isSavingOnboarding ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span>Saving automatically...</span>
                          </>
                        ) : lastSavedOnboarding ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Last saved: <span className="font-mono font-bold text-slate-800">{lastSavedOnboarding}</span></span>
                          </>
                        ) : (
                          <>
                            <Info className="w-4 h-4 text-blue-500" />
                            <span>Changes saved automatically</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider">
                        <span className="text-slate-400">Onboarding Data Completion</span>
                        <span className="text-[#2F6DFF] font-black text-sm">{calculateOnboardingProgress(onboardingData)}%</span>
                      </div>
                      <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                        <div 
                          className="h-full bg-linear-to-r from-blue-600 to-[#2F6DFF] rounded-full transition-all duration-700 ease-out" 
                          style={{ width: `${calculateOnboardingProgress(onboardingData)}%` }} 
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Every field is optional. Provide as much operational structure as possible to accelerate training of your offshore Virtual Assistants.
                      </p>
                    </div>
                  </div>

                  {/* FORM SECTIONS (ACCORDION STYLE) */}
                  <div className="space-y-4">
                    
                    {/* SECTION 1: Basic Company Information */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '1': !prev['1'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">01</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Basic Company Information</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Legal structures, EINs, established date, and website references.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['1'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['1'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Legal Business Name</label>
                            <input 
                              type="text"
                              value={onboardingData.legalBusinessName || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, legalBusinessName: e.target.value })}
                              placeholder="Acme Insurance Services LLC"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">DBA (Doing Business As)</label>
                            <input 
                              type="text"
                              value={onboardingData.dba || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, dba: e.target.value })}
                              placeholder="Acme Direct"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Federal Tax ID (EIN)</label>
                            <input 
                              type="text"
                              value={onboardingData.ein || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, ein: e.target.value })}
                              placeholder="12-3456789"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Business License Number</label>
                            <input 
                              type="text"
                              value={onboardingData.businessLicense || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, businessLicense: e.target.value })}
                              placeholder="LIC-99887766"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Agency / NPN Number</label>
                            <input 
                              type="text"
                              value={onboardingData.agencyNpn || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, agencyNpn: e.target.value })}
                              placeholder="e.g. 19123456"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Company Type</label>
                            <select
                              value={onboardingData.companyType || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, companyType: e.target.value })}
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            >
                              <option value="">Select Option</option>
                              <option value="Agency">Agency</option>
                              <option value="Brokerage">Brokerage</option>
                              <option value="MGA">MGA</option>
                              <option value="Carrier">Carrier</option>
                              <option value="TPA">TPA</option>
                              <option value="Call Center">Call Center</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Industry Type</label>
                            <input 
                              type="text"
                              value={onboardingData.industryType || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, industryType: e.target.value })}
                              placeholder="e.g. Insurance Agency"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Business Scope (Select All That Apply)</label>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              {[
                                { key: 'propertyCasualty', label: 'Property & Casualty' },
                                { key: 'lifeInsurance', label: 'Life Insurance' },
                                { key: 'healthInsurance', label: 'Health Insurance' },
                                { key: 'medicare', label: 'Medicare' },
                                { key: 'employeeBenefits', label: 'Employee Benefits' },
                                { key: 'commercialInsurance', label: 'Commercial Insurance' },
                                { key: 'personalInsurance', label: 'Personal Insurance' }
                              ].map(spec => (
                                <label key={spec.key} className="flex items-center gap-2 text-xs font-semibold text-slate-600 select-none cursor-pointer">
                                  <input 
                                    type="checkbox"
                                    checked={!!onboardingData[spec.key]}
                                    onChange={(e) => setOnboardingData({ ...onboardingData, [spec.key]: e.target.checked })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                  />
                                  <span>{spec.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Year Established</label>
                            <input 
                              type="text"
                              value={onboardingData.yearEstablished || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, yearEstablished: e.target.value })}
                              placeholder="2015"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Number of Employees</label>
                            <input 
                              type="text"
                              value={onboardingData.numEmployees || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, numEmployees: e.target.value })}
                              placeholder="e.g. 25"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Number of Licensed Agents</label>
                            <input 
                              type="text"
                              value={onboardingData.numLicensedAgents || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, numLicensedAgents: e.target.value })}
                              placeholder="e.g. 12"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Company Website</label>
                            <input 
                              type="url"
                              value={onboardingData.companyWebsite || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, companyWebsite: e.target.value })}
                              placeholder="https://www.acmeinsurance.com"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Time Zone</label>
                            <input 
                              type="text"
                              value={onboardingData.timeZone || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, timeZone: e.target.value })}
                              placeholder="EST (UTC-5) / PST (UTC-8)"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Preferred Business Hours</label>
                            <input 
                              type="text"
                              value={onboardingData.preferredBusinessHours || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, preferredBusinessHours: e.target.value })}
                              placeholder="9:00 AM - 5:00 PM EST"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 2: Corporate Address */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '2': !prev['2'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-[#E8F1FF] text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">02</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Corporate Address</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Headquarters physical parameters and billing locations.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['2'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['2'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Headquarters Address</label>
                            <input 
                              type="text"
                              value={onboardingData.hqAddress || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, hqAddress: e.target.value })}
                              placeholder="123 Corporate Parkway, Suite 500"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">City</label>
                            <input 
                              type="text"
                              value={onboardingData.hqCity || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, hqCity: e.target.value })}
                              placeholder="Atlanta"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">State</label>
                            <input 
                              type="text"
                              value={onboardingData.hqState || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, hqState: e.target.value })}
                              placeholder="Georgia"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ZIP Code</label>
                            <input 
                              type="text"
                              value={onboardingData.hqZip || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, hqZip: e.target.value })}
                              placeholder="30301"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Country</label>
                            <input 
                              type="text"
                              value={onboardingData.hqCountry || 'United States'}
                              onChange={(e) => setOnboardingData({ ...onboardingData, hqCountry: e.target.value })}
                              placeholder="United States"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Billing Address (if different)</label>
                            <input 
                              type="text"
                              value={onboardingData.billingAddress || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, billingAddress: e.target.value })}
                              placeholder="P.O. Box 9999, Atlanta, GA 30302"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 3: Primary Business Contact */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '3': !prev['3'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">03</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Primary Business Contact</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Primary operations officer managing offshore integration.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['3'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['3'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                            <input 
                              type="text"
                              value={onboardingData.primaryName || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, primaryName: e.target.value })}
                              placeholder="John Smith"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Job Title</label>
                            <input 
                              type="text"
                              value={onboardingData.primaryTitle || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, primaryTitle: e.target.value })}
                              placeholder="Operations Director"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                            <input 
                              type="email"
                              value={onboardingData.primaryEmail || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, primaryEmail: e.target.value })}
                              placeholder="john.smith@acmeinsurance.com"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mobile Number</label>
                            <input 
                              type="tel"
                              value={onboardingData.primaryMobile || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, primaryMobile: e.target.value })}
                              placeholder="+1 (404) 555-0199"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Office Number</label>
                            <input 
                              type="tel"
                              value={onboardingData.primaryOffice || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, primaryOffice: e.target.value })}
                              placeholder="+1 (404) 555-0100 ext 12"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Preferred Contact Method</label>
                            <select
                              value={onboardingData.primaryContactMethod || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, primaryContactMethod: e.target.value })}
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            >
                              <option value="">Select Option</option>
                              <option value="Email">Email</option>
                              <option value="Phone">Phone</option>
                              <option value="Mobile">Mobile</option>
                              <option value="SMS">SMS</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Best Time to Contact</label>
                            <input 
                              type="text"
                              value={onboardingData.primaryContactTime || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, primaryContactTime: e.target.value })}
                              placeholder="e.g. Tuesdays & Thursdays after 2:00 PM EST"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 4: Executive Contact */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '4': !prev['4'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-[#E8F1FF] text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">04</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Executive Contact</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Owner/President/CEO details.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['4'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['4'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Owner/President/CEO Name</label>
                            <input 
                              type="text"
                              value={onboardingData.execName || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, execName: e.target.value })}
                              placeholder="Eleanor Vance"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                            <input 
                              type="email"
                              value={onboardingData.execEmail || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, execEmail: e.target.value })}
                              placeholder="eleanor@acmeinsurance.com"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                            <input 
                              type="tel"
                              value={onboardingData.execPhone || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, execPhone: e.target.value })}
                              placeholder="+1 (404) 555-0101"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 5: Accounts Payable Contact */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '5': !prev['5'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">05</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Accounts Payable Contact</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Billing, invoicing, and purchase order controls.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['5'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['5'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contact Name</label>
                            <input 
                              type="text"
                              value={onboardingData.apName || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, apName: e.target.value })}
                              placeholder="Sarah Connor"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email</label>
                            <input 
                              type="email"
                              value={onboardingData.apEmail || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, apEmail: e.target.value })}
                              placeholder="ap@acmeinsurance.com"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone</label>
                            <input 
                              type="tel"
                              value={onboardingData.apPhone || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, apPhone: e.target.value })}
                              placeholder="+1 (404) 555-0122"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Billing Email (Where to send Invoices)</label>
                            <input 
                              type="email"
                              value={onboardingData.apBillingEmail || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, apBillingEmail: e.target.value })}
                              placeholder="invoices@acmeinsurance.com"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Purchase Order Required?</label>
                            <select
                              value={onboardingData.apPoRequired || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, apPoRequired: e.target.value })}
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            >
                              <option value="">Select Option</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 6: IT / Technical Contact */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '6': !prev['6'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-[#E8F1FF] text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">06</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">IT / Technical Contact</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">VDI tunnel management, system administrators, and security.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['6'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['6'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                            <input 
                              type="text"
                              value={onboardingData.itName || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, itName: e.target.value })}
                              placeholder="Miles Dyson"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Job Title</label>
                            <input 
                              type="text"
                              value={onboardingData.itTitle || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, itTitle: e.target.value })}
                              placeholder="Lead Systems Administrator"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email</label>
                            <input 
                              type="email"
                              value={onboardingData.itEmail || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, itEmail: e.target.value })}
                              placeholder="tech@acmeinsurance.com"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone</label>
                            <input 
                              type="tel"
                              value={onboardingData.itPhone || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, itPhone: e.target.value })}
                              placeholder="+1 (404) 555-0144"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Emergency Contact Number (VDI lockouts/Server crash)</label>
                            <input 
                              type="tel"
                              value={onboardingData.itEmergencyPhone || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, itEmergencyPhone: e.target.value })}
                              placeholder="+1 (404) 999-9111"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-rose-600"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 7: Business Operations */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '7': !prev['7'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">07</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Business Operations</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Volume parameters, renewals, claims, and active client metrics.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['7'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['7'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Primary Lines of Business</label>
                            <input 
                              type="text"
                              value={onboardingData.opsPrimaryLines || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, opsPrimaryLines: e.target.value })}
                              placeholder="e.g. Home, Auto, Commercial Fleet"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">States Licensed In (comma-separated)</label>
                            <input 
                              type="text"
                              value={onboardingData.opsLicensedStates || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, opsLicensedStates: e.target.value })}
                              placeholder="GA, FL, AL, NC, SC"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Active Clients</label>
                            <input 
                              type="text"
                              value={onboardingData.opsActiveClients || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, opsActiveClients: e.target.value })}
                              placeholder="e.g. 1500"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average Monthly New Business Volume</label>
                            <input 
                              type="text"
                              value={onboardingData.opsMonthlyNewVolume || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, opsMonthlyNewVolume: e.target.value })}
                              placeholder="e.g. 50 policies"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average Monthly Renewals</label>
                            <input 
                              type="text"
                              value={onboardingData.opsMonthlyRenewals || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, opsMonthlyRenewals: e.target.value })}
                              placeholder="e.g. 120 policies"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average Monthly Endorsements</label>
                            <input 
                              type="text"
                              value={onboardingData.opsMonthlyEndorsements || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, opsMonthlyEndorsements: e.target.value })}
                              placeholder="e.g. 40 requests"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average Monthly Claims</label>
                            <input 
                              type="text"
                              value={onboardingData.opsMonthlyClaims || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, opsMonthlyClaims: e.target.value })}
                              placeholder="e.g. 15 claims"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Team Size (Local Staff)</label>
                            <input 
                              type="text"
                              value={onboardingData.opsTeamSize || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, opsTeamSize: e.target.value })}
                              placeholder="e.g. 5 local staff"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 8: Current Systems */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '8': !prev['8'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-[#E8F1FF] text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">08</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Current Systems</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">AMS, CRM, VoIP, document systems, and collaboration software.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['8'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['8'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Agency Management System (AMS)</label>
                            <input 
                              type="text"
                              value={onboardingData.sysAms || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, sysAms: e.target.value })}
                              placeholder="e.g. Applied Epic, EZlynx, HawkSoft"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CRM</label>
                            <input 
                              type="text"
                              value={onboardingData.sysCrm || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, sysCrm: e.target.value })}
                              placeholder="e.g. Salesforce, HubSpot, AgencyZoom"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">VoIP / Phone System</label>
                            <input 
                              type="text"
                              value={onboardingData.sysVoip || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, sysVoip: e.target.value })}
                              placeholder="e.g. RingCentral, Lightspeed, Dialpad"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Document Management System</label>
                            <input 
                              type="text"
                              value={onboardingData.sysDms || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, sysDms: e.target.value })}
                              placeholder="e.g. Google Drive, SharePoint, Dropbox"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Platform</label>
                            <input 
                              type="text"
                              value={onboardingData.sysEmail || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, sysEmail: e.target.value })}
                              placeholder="e.g. Google Workspace, Microsoft 365"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Team Collaboration Platform</label>
                            <input 
                              type="text"
                              value={onboardingData.sysCollaboration || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, sysCollaboration: e.target.value })}
                              placeholder="e.g. Slack, MS Teams, Google Chat"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 9: Security & Compliance */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '9': !prev['9'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">09</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Security & Compliance</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">NDA demands, cybersecurity structures, MFA status, and password tools.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['9'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['9'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">NDA Required?</label>
                            <select
                              value={onboardingData.secNdaRequired || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, secNdaRequired: e.target.value })}
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            >
                              <option value="">Select Option</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cybersecurity Policy in Place?</label>
                            <select
                              value={onboardingData.secPolicyInPlace || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, secPolicyInPlace: e.target.value })}
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            >
                              <option value="">Select Option</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">MFA Enabled on systems?</label>
                            <select
                              value={onboardingData.secMfaEnabled || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, secMfaEnabled: e.target.value })}
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            >
                              <option value="">Select Option</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Password Manager Used (e.g. 1Password, LastPass)</label>
                            <input 
                              type="text"
                              value={onboardingData.secPasswordManager || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, secPasswordManager: e.target.value })}
                              placeholder="1Password Enterprise"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Compliance Requirements (e.g. HIPAA, SOC 2, GLBA)</label>
                            <input 
                              type="text"
                              value={onboardingData.secComplianceRequirements || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, secComplianceRequirements: e.target.value })}
                              placeholder="e.g. HIPAA compliance for healthcare client profiles; SOC 2 Type II"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 10: Insurance Specialization */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '10': !prev['10'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-[#E8F1FF] text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">10</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Insurance Specialization</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Specific insurance niches serviced.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['10'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['10'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-slate-800">Check All Specializations That Apply</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { key: 'specPersonalLines', label: 'Personal Lines' },
                                { key: 'specCommercialLines', label: 'Commercial Lines' },
                                { key: 'specLifeInsurance', label: 'Life Insurance' },
                                { key: 'specIndividualHealth', label: 'Individual Health' },
                                { key: 'specGroupHealth', label: 'Group Health' },
                                { key: 'specMedicareAdvantage', label: 'Medicare Advantage' },
                                { key: 'specMedicareSupplement', label: 'Medicare Supplement' },
                                { key: 'specMedicarePartD', label: 'Medicare Part D' },
                                { key: 'specAcaMarketplace', label: 'ACA Marketplace' },
                                { key: 'specEmployeeBenefits', label: 'Employee Benefits' },
                                { key: 'specWorkersComp', label: 'Workers\' Compensation' },
                                { key: 'specBonds', label: 'Bonds' },
                                { key: 'specSpecialtyLines', label: 'Specialty Lines' }
                              ].map(spec => (
                                <label key={spec.key} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 select-none cursor-pointer border border-slate-100 bg-slate-50/30 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                  <input 
                                    type="checkbox"
                                    checked={!!onboardingData[spec.key]}
                                    onChange={(e) => setOnboardingData({ ...onboardingData, [spec.key]: e.target.checked })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 cursor-pointer"
                                  />
                                  <span>{spec.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 11: Current Outsourcing Status */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '11': !prev['11'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">11</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Current Outsourcing Status</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Outsourcing history and switching drivers.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['11'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['11'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Do you currently outsource?</label>
                            <select
                              value={onboardingData.outsourceCurrently || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, outsourceCurrently: e.target.value })}
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            >
                              <option value="">Select Option</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Vendor</label>
                            <input 
                              type="text"
                              value={onboardingData.outsourceVendor || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, outsourceVendor: e.target.value })}
                              placeholder="e.g. ShoreAgent, StaffBoom, None"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Number of Offshore Staff</label>
                            <input 
                              type="text"
                              value={onboardingData.outsourceNumStaff || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, outsourceNumStaff: e.target.value })}
                              placeholder="e.g. 3 FTEs"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reason for Switching (Optional)</label>
                            <input 
                              type="text"
                              value={onboardingData.outsourceReason || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, outsourceReason: e.target.value })}
                              placeholder="e.g. Seeking better QA, lower turnover, faster response times"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 12: Preferred Start Information */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '12': !prev['12'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-[#E8F1FF] text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">12</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Preferred Start Information</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Desired go-live dates, offshore VA quantities, and hour schedules.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['12'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['12'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Desired Go-Live Date</label>
                            <input 
                              type="date"
                              value={onboardingData.startGoLiveDate || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, startGoLiveDate: e.target.value })}
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Number of Virtual Assistants Required</label>
                            <input 
                              type="text"
                              value={onboardingData.startNumVas || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, startNumVas: e.target.value })}
                              placeholder="e.g. 2 full-time assistants"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expected Working Hours (in EST/PST)</label>
                            <input 
                              type="text"
                              value={onboardingData.startWorkingHours || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, startWorkingHours: e.target.value })}
                              placeholder="e.g. 9:00 AM - 6:00 PM EST"
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Trial Required?</label>
                            <select
                              value={onboardingData.startTrialRequired || ''}
                              onChange={(e) => setOnboardingData({ ...onboardingData, startTrialRequired: e.target.value })}
                              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                            >
                              <option value="">Select Option</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 13: Required Documents (Upload) */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '13': !prev['13'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">13</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Required Documents Vault</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Securely upload licenses, W-9s, SOP workflow models, branding assets.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['13'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['13'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                          {[
                            { key: 'docAgencyLicense', label: 'Agency License', desc: 'Active physical state operating license.' },
                            { key: 'docW9', label: 'W-9 Form', desc: 'Signed IRS tax verification document.' },
                            { key: 'docNda', label: 'Signed NDA (if applicable)', desc: 'Corporate mutual non-disclosure agreement.' },
                            { key: 'docMsa', label: 'Master Service Agreement', desc: 'Mutual signed operational agreement.' },
                            { key: 'docSops', label: 'SOPs / Workflow Documents', desc: 'Daily procedural step lists.' },
                            { key: 'docOrgChart', label: 'Organizational Chart', desc: 'Team hierarchy structure mapping.' },
                            { key: 'docEmployeeDirectory', label: 'Employee Directory (Optional)', desc: 'Current staff extension list.' },
                            { key: 'docBrandingAssets', label: 'Branding Assets', desc: 'Vector logos, color guides, system guidelines.' }
                          ].map(docItem => {
                            const isUploaded = !!onboardingData[docItem.key];
                            const isDocUploading = !!uploadingDocs[docItem.key];
                            
                            return (
                              <div key={docItem.key} className="border border-slate-100 bg-slate-50/40 p-4 rounded-2xl flex flex-col justify-between gap-3 relative">
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <span className="text-xs font-extrabold text-slate-800 block">{docItem.label}</span>
                                      <span className="text-[10px] text-slate-400 font-semibold block leading-relaxed">{docItem.desc}</span>
                                    </div>
                                    {isUploaded && (
                                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 shrink-0 uppercase tracking-wider">
                                        <Check className="w-3 h-3 stroke-[3px]" />
                                        <span>Linked</span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-2 pt-2 border-t border-slate-100/50">
                                  {isDocUploading ? (
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 py-2">
                                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                      <span>Uploading & encrypting file payload...</span>
                                    </div>
                                  ) : isUploaded ? (
                                    <div className="flex items-center justify-between gap-2 bg-white border border-slate-200/60 p-2.5 rounded-xl text-xs font-bold text-slate-700">
                                      <div className="flex items-center gap-1.5 overflow-hidden">
                                        <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span className="truncate text-[11px] font-mono font-medium max-w-[120px] sm:max-w-[180px]">
                                          {onboardingData[docItem.key].split('/').pop() || 'Attached File'}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            const fileUrl = onboardingData[docItem.key];
                                            handleDownloadFile({ file_name: fileUrl.split('/').pop(), file_path: fileUrl });
                                          }}
                                          className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors font-bold cursor-pointer"
                                        >
                                          Download
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            if (confirm(`Remove this ${docItem.label} attachment?`)) {
                                              const updated = { ...onboardingData, [docItem.key]: '' };
                                              setOnboardingData(updated);
                                              saveOnboardingData(updated);
                                            }
                                          }}
                                          className="text-[10px] text-rose-600 hover:text-white border border-rose-100 hover:bg-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                                          title="Remove attachment"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <label className="cursor-pointer border border-dashed border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/10 p-4 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all">
                                      <Upload className="w-5 h-5 text-slate-400" />
                                      <span className="text-[11px] font-extrabold text-slate-600 block">Select File / Drag-and-drop</span>
                                      <span className="text-[9px] text-slate-400 block font-semibold">PDF, DOCX, XLSX or ZIP (max 15MB)</span>
                                      <input 
                                        type="file"
                                        accept=".pdf,.docx,.xlsx,.xls,.zip,.png,.jpg,.jpeg"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleUploadOnboardingDocument(docItem.key, file);
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* SECTION 14: Sector-Specific Fields */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setOpenSections(prev => ({ ...prev, '14': !prev['14'] }))}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-[#E8F1FF] text-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xs">14</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Sector-Specific Operational Parameters</span>
                            <span className="text-[11px] text-slate-400 font-semibold block">Niche-specific systems: P&C, Life, Health, or Medicare platforms.</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openSections['14'] ? 'rotate-90' : ''}`} />
                      </button>

                      {openSections['14'] && (
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-6 animate-fade-in">
                          
                          {/* Property & Casualty Parameters */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-extrabold text-[#2F6DFF] uppercase tracking-widest border-b border-slate-100 pb-1.5">Property & Casualty Sector</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AMS Platform Details</label>
                                <input 
                                  type="text"
                                  value={onboardingData.pcAmsPlatform || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, pcAmsPlatform: e.target.value })}
                                  placeholder="e.g. Applied Epic, HawkSoft, EZlynx version"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Carrier Appointments</label>
                                <input 
                                  type="text"
                                  value={onboardingData.pcCarrierAppointments || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, pcCarrierAppointments: e.target.value })}
                                  placeholder="e.g. Progressive, Travelers, Liberty Mutual"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Personal vs. Commercial Lines Mix</label>
                                <input 
                                  type="text"
                                  value={onboardingData.pcMix || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, pcMix: e.target.value })}
                                  placeholder="e.g. 70% Personal / 30% Commercial"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ACORD Forms Usage</label>
                                <input 
                                  type="text"
                                  value={onboardingData.pcAcordUsage || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, pcAcordUsage: e.target.value })}
                                  placeholder="e.g. ACORD 125, 126, 140 frequently used"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Life Insurance Parameters */}
                          <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-extrabold text-[#2F6DFF] uppercase tracking-widest border-b border-slate-100 pb-1.5">Life Insurance Sector</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Carrier Appointments (Life)</label>
                                <input 
                                  type="text"
                                  value={onboardingData.lifeCarrierAppointments || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, lifeCarrierAppointments: e.target.value })}
                                  placeholder="e.g. Mutual of Omaha, Transamerica, Prudential"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">New Business Platforms</label>
                                <input 
                                  type="text"
                                  value={onboardingData.lifeNewBusinessPlatforms || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, lifeNewBusinessPlatforms: e.target.value })}
                                  placeholder="e.g. iPipeline, iGO"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Illustration Software Used</label>
                                <input 
                                  type="text"
                                  value={onboardingData.lifeIllustrationSoftware || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, lifeIllustrationSoftware: e.target.value })}
                                  placeholder="e.g. WinFlex Web, carrier portals"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">E-Application Platforms</label>
                                <input 
                                  type="text"
                                  value={onboardingData.lifeEAppPlatforms || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, lifeEAppPlatforms: e.target.value })}
                                  placeholder="e.g. DocuSign, AssureSign, Carrier E-apps"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Health Insurance Parameters */}
                          <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-extrabold text-[#2F6DFF] uppercase tracking-widest border-b border-slate-100 pb-1.5">Health Insurance Sector</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Individual vs. Group Health Mix</label>
                                <input 
                                  type="text"
                                  value={onboardingData.healthMix || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, healthMix: e.target.value })}
                                  placeholder="e.g. 40% Individual / 60% Group"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ACA Marketplace Participation?</label>
                                <input 
                                  type="text"
                                  value={onboardingData.healthAcaParticipation || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, healthAcaParticipation: e.target.value })}
                                  placeholder="e.g. HealthSherpa, Healthcare.gov"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Enrollment Platforms</label>
                                <input 
                                  type="text"
                                  value={onboardingData.healthEnrollmentPlatforms || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, healthEnrollmentPlatforms: e.target.value })}
                                  placeholder="e.g. Ease, Employee Navigator, HealthSherpa"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">HIPAA Compliance Contact</label>
                                <input 
                                  type="text"
                                  value={onboardingData.healthHipaaContact || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, healthHipaaContact: e.target.value })}
                                  placeholder="e.g. HIPAA officer Jane Doe (hipaa@acme.com)"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Medicare Parameters */}
                          <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-extrabold text-[#2F6DFF] uppercase tracking-widest border-b border-slate-100 pb-1.5">Medicare Sector</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CMS Contract Number (if applicable)</label>
                                <input 
                                  type="text"
                                  value={onboardingData.medicareCmsContractNum || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, medicareCmsContractNum: e.target.value })}
                                  placeholder="e.g. H-1234"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Medicare Product Types Offered</label>
                                <input 
                                  type="text"
                                  value={onboardingData.medicareProductsOffered || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, medicareProductsOffered: e.target.value })}
                                  placeholder="e.g. MA, MAPD, MedSup, PDP"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Annual Enrollment Period (AEP) Support Required</label>
                                <input 
                                  type="text"
                                  value={onboardingData.medicareAepSupport || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, medicareAepSupport: e.target.value })}
                                  placeholder="e.g. October 15 - December 7 high-volume support"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Compliance Officer Contact</label>
                                <input 
                                  type="text"
                                  value={onboardingData.medicareComplianceContact || ''}
                                  onChange={(e) => setOnboardingData({ ...onboardingData, medicareComplianceContact: e.target.value })}
                                  placeholder="e.g. Compliance Director Eleanor (compliance@acme.com)"
                                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white focus:border-blue-600 rounded-xl font-semibold text-slate-800"
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      )}
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
