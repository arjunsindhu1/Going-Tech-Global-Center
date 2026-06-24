import { useState, useEffect, FormEvent, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Award,
  Send,
  X,
  FileText,
  DollarSign,
  Upload,
  AlertCircle
} from 'lucide-react';
import { PageType } from '../types';
import { supabase } from '../lib/supabase';

interface CareersProps {
  setCurrentPage: (page: PageType) => void;
}

export interface SupabaseJob {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  salary: string | null;
  experience: string | null;
  description: string;
  requirements: string[];
  benefits: string[];
  status: string;
  slug: string;
  created_at: string;
}

export default function Careers({ setCurrentPage }: CareersProps) {
  // DB state
  const [jobs, setJobs] = useState<SupabaseJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState<SupabaseJob | null>(null);
  
  // Application form fields
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateLinkedin, setCandidateLinkedin] = useState('');
  const [candidateExperience, setCandidateExperience] = useState('');
  const [candidateCover, setCandidateCover] = useState('');
  
  // Resume File details
  const [candidateResumeBase64, setCandidateResumeBase64] = useState<string | null>(null);
  const [candidateResumeName, setCandidateResumeName] = useState<string>('');
  const [isFileDragging, setIsFileDragging] = useState(false);

  // Status indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySubmitted, setApplySubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const benefits = [
    { title: 'Global Compensation', desc: 'Highly competitive baseline salaries with premium night-shift differential subsidies.' },
    { title: 'Continuous Upskilling', desc: 'Paid access to certified Carrier training, AML compliance credentials, and tech courses.' },
    { title: 'HIPAA Secure Workspaces', desc: 'Rotational team structures in high-comfort, physical keycard secure delivery facilities.' },
    { title: 'Private Family Healthcare', desc: 'Comprehensive medical benefits with inpatient, outpatient, and optical coverages.' },
    { title: 'Fast-Track Promotion Paths', desc: 'Direct operations supervision promotions and lateral transfers to technical AI team squads.' },
    { title: 'Modern Tech Gear', desc: 'High-end ergonomic chairs, quiet workstations, and double multi-screen monitor rigs.' }
  ];

  const hiringTimeline = [
    { step: '01', title: 'Resume Review', desc: 'Our corporate talent heads evaluate academic records and specialized insurance AMS platform history.' },
    { step: '02', title: 'Cognitive & SOP Screen', desc: 'A quick computer-literacy and diagnostic audit assessing analytical capability and procedural accuracy.' },
    { step: '03', title: 'Specialist Case Interview', desc: 'Underwriters or senior architects evaluate custom ACORD form indexing, claims logic, or API coding challenges.' },
    { step: '04', title: 'Direct Verbal Offer', desc: 'Agreement on shift rotations, baseline salary structures, and immediate enrollment in training pilots.' }
  ];

  // Fetch jobs from Supabase
  const fetchJobs = async () => {
    try {
      // Temporarily log all jobs as requested by user
      const { data: testData, error: testError } = await supabase
        .from('jobs')
        .select('*');

      console.log('JOBS DATA:', testData);
      console.log('JOBS ERROR:', testError);

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .in('status', ['Published', 'published'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error.message);
      } else if (data) {
        // Map requirements to array if it is stored as a string
        const mappedData = data.map((job: any) => {
          let requirementsArray: string[] = [];
          if (Array.isArray(job.requirements)) {
            requirementsArray = job.requirements;
          } else if (typeof job.requirements === 'string') {
            requirementsArray = job.requirements
              .split('\n')
              .map((r: string) => r.trim())
              .filter(Boolean);
          }
          return {
            ...job,
            requirements: requirementsArray
          };
        });
        setJobs(mappedData as SupabaseJob[]);
      }
    } catch (err) {
      console.error('Unexpected error fetching jobs:', err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Real-time listener for jobs
  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('careers-realtime-jobs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper to convert files to base64
  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Resume file is too large. Max limit is 5MB.');
      return;
    }
    setCandidateResumeName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCandidateResumeBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // File Upload Handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Submit Application Form to Supabase
  const handleApplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!candidateResumeBase64) {
      setErrorMessage('Please upload your resume to complete the application.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: selectedJob.id,
          name: candidateName,
          email: candidateEmail,
          phone: candidatePhone,
          resume: JSON.stringify({
            name: candidateResumeName,
            data: candidateResumeBase64
          }),
          linkedin_profile: candidateLinkedin,
          experience_years: candidateExperience,
          cover_letter: candidateCover,
          status: 'New'
        });

      if (error) {
        throw new Error(error.message);
      }

      setApplySubmitted(true);
      
      // Reset form on success
      setTimeout(() => {
        setApplySubmitted(false);
        setSelectedJob(null);
        setCandidateName('');
        setCandidateEmail('');
        setCandidatePhone('');
        setCandidateLinkedin('');
        setCandidateExperience('');
        setCandidateCover('');
        setCandidateResumeBase64(null);
        setCandidateResumeName('');
      }, 4500);

    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen">
      
      {/* Careers Header */}
      <section className="bg-white border-b border-[#DCE7FF]/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Join Our Global Center</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#081B8C] tracking-tight">
            Build Your Operational Career
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Grow alongside industry-leading US brokers, InsurTech startups, and advanced Generative AI architectures in a highly secure, high-integrity governance workspace.
          </p>
        </div>
      </section>

      {/* Main Careers Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Core Job Board */}
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-[#081B8C] font-display">Active Specialized Openings</h3>
            <span className="text-xs font-semibold text-gray-400 font-mono">LOCATION: GLOBAL HUB</span>
          </div>

          {isLoadingJobs ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white border border-[#DCE7FF] rounded-2xl">
              <div className="w-10 h-10 border-4 border-[#081B8C] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-xs font-medium">Synchronizing live career database...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#DCE7FF] rounded-2xl space-y-3">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
              <h4 className="text-base font-bold text-[#081B8C] font-display">All Positions Filled</h4>
              <p className="text-gray-400 text-xs max-w-sm mx-auto">
                We are currently at full capacity! Please check back soon or register for our newsletter to receive notification updates on immediate expansion cycles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#DCE7FF] rounded-2xl p-6 sm:p-8 hover:shadow-lg hover:border-[#2F6DFF] transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] bg-[#DCE7FF]/40 text-[#081B8C] font-bold px-2.5 py-1 rounded">
                        {job.department}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {job.employment_type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                      {job.salary && (
                        <span className="text-[10px] text-[#2F6DFF] font-bold flex items-center gap-0.5">
                          <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-[#081B8C] font-display">{job.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{job.description}</p>
                    {job.experience && (
                      <p className="text-[11px] text-gray-400 font-medium">
                        <strong>Required Experience:</strong> {job.experience}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="cursor-pointer bg-[#081B8C] hover:bg-[#2F6DFF] text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-1 shrink-0"
                  >
                    <span>Examine Opening & Apply</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Job Application Drawer Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative space-y-6 shadow-2xl border border-gray-100"
              >
                {/* Close Trigger */}
                <button
                  onClick={() => {
                    if (!isSubmitting) setSelectedJob(null);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>

                {!applySubmitted ? (
                  <form onSubmit={handleApplySubmit} className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#2F6DFF] font-bold uppercase tracking-wide">Applying For Open Position</span>
                      <h3 className="text-xl font-bold text-[#081B8C] font-display">{selectedJob.title}</h3>
                      <p className="text-gray-400 text-xs">Department: {selectedJob.department} // {selectedJob.location}</p>
                    </div>

                    {/* Job Details Info */}
                    <div className="bg-[#F8FAFF] border border-[#DCE7FF]/60 rounded-xl p-5 text-xs text-gray-500 space-y-3 max-h-48 overflow-y-auto">
                      <p className="font-bold text-gray-700">Requirements Checksheet:</p>
                      {selectedJob.requirements && selectedJob.requirements.length > 0 ? (
                        <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                          {selectedJob.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 italic">Please review general role requirements during your onboarding conversation.</p>
                      )}
                    </div>

                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Candidate Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Your Complete Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Arthur Pendelton"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Contact Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. arthur@gmail.com"
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +1 555-019-2834"
                          value={candidatePhone}
                          onChange={(e) => setCandidatePhone(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">LinkedIn Profile</label>
                        <input
                          type="url"
                          placeholder="e.g. linkedin.com/in/username"
                          value={candidateLinkedin}
                          onChange={(e) => setCandidateLinkedin(e.target.value)}
                          className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase">Years of Relevant Experience *</label>
                      <select
                        required
                        value={candidateExperience}
                        onChange={(e) => setCandidateExperience(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        disabled={isSubmitting}
                      >
                        <option value="">-- Select Experience Level --</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-8 years">5-8 years</option>
                        <option value="8+ years">8+ years</option>
                      </select>
                    </div>

                    {/* Resume Upload Box with Drag & Drop */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase">Upload Professional Resume (PDF, DOC, DOCX up to 5MB) *</label>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                          isFileDragging ? 'border-[#2F6DFF] bg-[#2F6DFF]/5' : 'border-[#DCE7FF] bg-[#F8FAFF]'
                        }`}
                        onClick={() => document.getElementById('resume-file-input')?.click()}
                      >
                        <Upload className={`w-8 h-8 ${candidateResumeBase64 ? 'text-emerald-500' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold text-gray-600">
                          {candidateResumeName ? candidateResumeName : 'Drag and Drop your resume file here or click to browse'}
                        </span>
                        <span className="text-[10px] text-gray-400">PDF, DOC, or DOCX up to 5MB limit</span>
                        <input
                          id="resume-file-input"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase">Cover Letter / Professional Summary *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Detail your experience with US AMS systems, underwriter checks, or tech pipelines..."
                        value={candidateCover}
                        onChange={(e) => setCandidateCover(e.target.value)}
                        className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg p-3 text-xs focus:outline-none focus:border-[#2F6DFF]"
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer w-full text-center bg-[#081B8C] hover:bg-[#2F6DFF] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading Resume & Logging Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Official Application</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                      <CheckCircle2 className="w-6 h-6 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold text-[#081B8C] font-display">Application Logged!</h3>
                    <p className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed">
                      Thank you, {candidateName}. Your academic profile, background details, and custom SOP responses have been securely logged for <strong>{selectedJob.title}</strong>. Our human resources directors will coordinate shortly.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Enterprise Culture Benefits Grids */}
        <div className="bg-white border border-[#DCE7FF] rounded-2xl p-8 lg:p-12 shadow-sm space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Why Work with Us</h2>
            <h3 className="text-2xl font-bold font-display text-[#081B8C]">Our Workplace Assets</h3>
            <p className="text-gray-400 text-xs">We protect, support, and upskill our specialists under global standards.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <div key={idx} className="space-y-3 border border-gray-100 p-5 rounded-xl bg-[#F8FAFF]">
                <div className="p-2 bg-white border border-gray-200/60 rounded-lg w-fit text-[#2F6DFF]">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#081B8C] text-sm">{b.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Timeline checklist */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">The Selection Loop</h2>
            <h3 className="text-2xl font-bold font-display text-[#081B8C]">Chronological Hiring Process</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hiringTimeline.map((time, idx) => (
              <div key={idx} className="bg-white border border-[#DCE7FF] p-6 rounded-xl relative overflow-hidden">
                <span className="absolute top-2 right-4 text-4xl font-extrabold text-[#DCE7FF]/40 font-mono">{time.step}</span>
                <div className="space-y-2 relative z-10">
                  <h4 className="font-bold text-[#081B8C] text-xs uppercase tracking-wide">{time.title}</h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed">{time.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
