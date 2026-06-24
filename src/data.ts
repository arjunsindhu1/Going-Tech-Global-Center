import { ServiceDetail, IndustryDetail, CaseStudy, BlogPost, CareerPosition } from './types';

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'insurance-ops',
    title: 'Insurance Operations Support',
    shortDesc: 'End-to-end operational enablement for MGAs, carriers, and agencies to accelerate policy life cycle and eliminate compliance friction.',
    iconName: 'FileText',
    problem: 'US insurance firms are buried under manual application volume, renewal backlogs, and multi-state licensing friction, forcing highly compensated underwriters and producers to waste over 40% of their day on administrative data entry.',
    solution: 'We deploy specialized insurance operational teams that integrate into your Agency Management Systems (AMS) to manage submission processing, index underwriting documentation, issue binders, and handle post-bind audits with 99.9% accuracy.',
    benefits: [
      'Overcome backlogs within 48 hours of onboarding',
      'Unshackle licensed agents and underwriters to focus on premium growth',
      'Maintain continuous compliance across state lines and Carrier guidelines',
      'Extend operating hours to 24/7 with zero overnight premium cost'
    ],
    process: [
      { step: '01', title: 'AMS Integration & Mapping', desc: 'Secure connection to Applied Epic, Vertafore, EZLynx or custom proprietary portal with strict SOC2 isolation.' },
      { step: '02', title: 'Standard Operating Procedure Mapping', desc: 'Drafting deterministic process playbooks covering carrier appetite checks, quote comparisons, and binder issuance rules.' },
      { step: '03', title: 'Pilot Activation & QA', desc: 'A dedicated team executes real-time submission indexing under a dual-oversight Quality Assurance loop.' },
      { step: '04', title: 'SLA-Driven Steady State', desc: 'Full-scale operations with sub-2-hour turnarounds on urgent certificate issuances and overnight endorsements.' }
    ],
    results: [
      { metric: '40%', label: 'Underwriter Productivity Gain', context: 'Refocusing high-cost personnel on risk evaluation rather than administrative entry.' },
      { metric: '10 Min', label: 'Average Certificate Turnaround', context: 'Eliminating the classic 24-48 hour delay that risks losing wholesale broker business.' },
      { metric: '99.9%', label: 'Data Input Accuracy', context: 'Rigorous dual-verification process matching data points across ACORD forms.' }
    ],
    faqs: [
      { question: 'Which agency management systems do your teams support?', answer: 'Our specialists are highly trained across all industry standard portals including Vertafore (AMS360, Sagitta), Applied Systems (Epic, TAM), EZLynx, HawkSoft, and proprietary Salesforce InsurTech backends.' },
      { question: 'How do you guarantee data privacy for carrier systems?', answer: 'We operate under strict SOC2 compliance frameworks. Our team accesses systems exclusively via audited virtual desktops (VDI) with copy/paste disabled and zero local data storage.' }
    ]
  },
  {
    id: 'bpo',
    title: 'Business Process Outsourcing',
    shortDesc: 'High-performance outsourced back-office and front-office scaling designed to fit seamlessly into enterprise workflows.',
    iconName: 'Briefcase',
    problem: 'Scaling internal customer support and heavy-duty back-office administration in the US is prohibitively expensive, limited by local talent shortages, and experiences high agent turnover.',
    solution: 'We provide specialized teams trained in complex enterprise processes, customer lifecycle support, and financial administration acting as a seamless extension of your domestic office.',
    benefits: [
      'Up to 60% operational cost savings compared to US on-shore hiring',
      'Bilingual capabilities to support diverse demographic markets',
      'Scalable staffing capacity that flexes instantly during seasonal peaks (e.g. AEP, OEP)',
      'Highly professional workspace with reliable enterprise fiber pipelines'
    ],
    process: [
      { step: '01', title: 'Talent Profile Alignment', desc: 'Sourcing university-educated professionals matching your exact technical profile and domain requirements.' },
      { step: '02', title: 'Cultural & Product Immersion', desc: 'Intensive brand voice training to master specific localized US nuances and product values.' },
      { step: '03', title: 'SLA Dashboard Setup', desc: 'Establishing transparent real-time metrics tracking First Contact Resolution (FCR) and Average Handle Time.' },
      { step: '04', title: 'Continuous Upskilling', desc: 'Ongoing certification courses to ensure compliance with updated regulatory standards.' }
    ],
    results: [
      { metric: '60%', label: 'Total Resource Cost Reduction', context: 'Enabling capital reallocation into marketing, product development, and acquisition.' },
      { metric: '88%', label: 'Employee Retention Rate', context: 'Significantly higher than standard call-center averages, ensuring stable long-term account knowledge.' },
      { metric: '4.8/5', label: 'Average Customer CSAT Score', context: 'Unlocking white-glove customer journeys that protect and grow customer lifetime value.' }
    ],
    faqs: [
      { question: 'What is your typical onboarding timeline for BPO teams?', answer: 'For standard administration, we can deploy pilot teams of 3-5 staff in 14-21 days. Larger, highly specialized teams requiring complex system certifications typically take 30-45 days.' },
      { question: 'How are team members managed on a daily basis?', answer: 'Each client team is assigned a dedicated Operations Supervisor at our global center. They provide real-time monitoring, conduct QA reviews, and deliver weekly performance metrics to you.' }
    ]
  },
  {
    id: 'digital-transform',
    title: 'Digital Transformation',
    shortDesc: 'Legacy system modernization, cloud migrations, and custom enterprise architecture tailored to eliminate legacy bottlenecks.',
    iconName: 'Cpu',
    problem: 'Enterprises remain chained to brittle legacy core systems and disjointed spreadsheets that create massive organizational silos, delay decision making, and block automation.',
    solution: 'We modernize your technology stack from legacy platforms to API-driven cloud architectures, integrating Salesforce, customized ERPs, and secure web application frameworks.',
    benefits: [
      'Eliminate high maintenance costs of ancient legacy servers',
      'Create single sources of truth across finance, sales, and operations',
      'Enable rapid go-to-market speed for new digital products',
      'Ensure high-grade cybersecurity standards are baked into all custom applications'
    ],
    process: [
      { step: '01', title: 'Infrastructure Audit', desc: 'Deep-dive analysis of your current systems, data flows, and technological dependencies.' },
      { step: '02', title: 'Architecture Blueprinting', desc: 'Designing modern cloud-native topologies utilizing microservices and API-first protocols.' },
      { step: '03', title: 'Agile Implementation', desc: 'Iterative, zero-downtime migration of data systems and custom software deployments.' },
      { step: '04', title: 'Post-Migration Support', desc: 'Comprehensive staff training and 24/7 technical monitoring to ensure seamless operational adoption.' }
    ],
    results: [
      { metric: '99.99%', label: 'Cloud System Uptime', context: 'Ensuring your client portals and tools are always online for brokers and customers.' },
      { metric: '3.5x', label: 'Data Processing Speed', context: 'Shrinking complex database query and report times from hours to instantaneous seconds.' },
      { metric: 'SOC2', label: 'Security Alignment', context: 'Protecting highly sensitive customer demographic and financial records.' }
    ],
    faqs: [
      { question: 'Will digital transformation require shutting down our daily business?', answer: 'Never. We specialize in parallel migrations where legacy systems remain active alongside new environments, with database syncing ensuring a smooth, zero-downtime cutover.' },
      { question: 'Do you build custom portals for insurance agents or policyholders?', answer: 'Yes, we design and build secure, modern self-service portals that integrate directly with core systems, giving brokers, agents, and policyholders instant access to document retrieval and payments.' }
    ]
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    shortDesc: 'Leveraging Generative AI, LLMs, Intelligent Document Processing (IDP), and RPA to orchestrate frictionless, automated operations.',
    iconName: 'Sparkles',
    problem: 'Firms waste millions paying humans to extract information from thousands of unstructured PDFs, claims, and emails, creating a slow, error-prone bottle-neck that degrades customer satisfaction.',
    solution: 'We integrate advanced Generative AI and Intelligent Document Processing models that read, extract, analyze, and structure unstructured data with high confidence, pushing data directly into core databases.',
    benefits: [
      'Automate up to 85% of manual, repetitive entry tasks',
      'Extract data from multi-page documents (ACORD, medical records, financial statements) in seconds',
      'Dramatically improve claims and quote response times to secure higher conversion rates',
      'Deploy intelligent AI agents to automate basic client and broker intake triage'
    ],
    process: [
      { step: '01', title: 'Cognitive Task Discovery', desc: 'Identifying tasks that consume heavy manual effort and mapping where automated logic or LLMs fit.' },
      { step: '02', title: 'Model Training & Prompt Tuning', desc: 'Training specialized models on your custom datasets under secure, enterprise-isolated cloud clusters.' },
      { step: '03', title: 'Human-in-the-Loop Integration', desc: 'Designing elegant verification interfaces where staff confirm low-confidence extractions.' },
      { step: '04', title: 'Continuous Model Training', desc: 'Systematically feeding edge-cases back into the learning model to scale extraction confidence.' }
    ],
    results: [
      { metric: '90%', label: 'Reduction in Processing Time', context: 'Compressing invoice, quote, or claim extraction from 30 minutes to under 20 seconds.' },
      { metric: '85%', label: 'Straight-Through Processing', context: 'Achieving complete automation for standard, well-structured administrative documentation.' },
      { metric: '10x', label: 'Scalability Factor', context: 'Handling sudden 10x spikes in document processing volumes with zero additional headcount.' }
    ],
    faqs: [
      { question: 'Is our sensitive company or client data used to train public AI models?', answer: 'Absolutely not. We deploy dedicated, isolated models within private virtual clouds (AWS VPC, Azure or Google Cloud) ensuring your data is never leaked or used to train public models.' },
      { question: 'What is a "Human-in-the-Loop" workflow?', answer: 'It is a security mechanism where the AI assigns a confidence score to each extracted field. If a hand-written signature or blurry scan scores below 95%, the document is routed to an operations specialist to verify, ensuring 100% data integrity.' }
    ]
  },
  {
    id: 'back-office',
    title: 'Back Office Operations',
    shortDesc: 'Frictionless data processing, document indexing, accounting reconciliation, and administrative support to keep organizations running.',
    iconName: 'Layers',
    problem: 'High administrative overhead from billing management, data reconciliation, record updates, and general documentation slows down executive decision-making and limits operational agility.',
    solution: 'We build high-capacity back-office centers focused entirely on precise data processing, billing reconciliation, database maintenance, and administrative orchestration.',
    benefits: [
      'Guaranteed 100% database updates within designated SLAs',
      'Continuous daily bookkeeping and accounting reconciliation cycles',
      'Organized document storage with advanced modern tagging and folder hierarchies',
      'A predictable, scalable cost structure tied strictly to transaction volumes'
    ],
    process: [
      { step: '01', title: 'Workflow Audit', desc: 'Step-by-step mapping of back-office data pipelines, file structures, and administrative protocols.' },
      { step: '02', title: 'Secure Environment Handshake', desc: 'Setting up audited remote environments with active credential management and zero-trust policies.' },
      { step: '03', title: 'SOP Standardization', desc: 'Refining complex workflow steps into bulletproof, repeatable instruction manuals.' },
      { step: '04', title: 'Operational Launch', desc: 'Deploying dedicated back-office teams with active daily supervision and QA checks.' }
    ],
    results: [
      { metric: '24 Hr', label: 'Guaranteed Update SLA', context: 'Ensuring all ledger entries and database updates are executed overnight.' },
      { metric: '100%', label: 'Compliance Audit Trailing', context: 'Comprehensive session logging and user action audits for every executed file update.' },
      { metric: '55%', label: 'Back Office Cost Savings', context: 'Drastically cutting accounting, payroll, and record management administrative costs.' }
    ],
    faqs: [
      { question: 'How do you handle accounting or bookkeeping security?', answer: 'Our financial and back-office team members access accounting software via strict multi-factor authentication, using read-only or restricted-role credentials with zero payment-execution capabilities.' },
      { question: 'Can you work overnight to process data for our start-of-day?', answer: 'Yes, our global operations center supports overlapping and 24/7 rotational shifts. We can execute data entries while your US offices are closed, so your team wakes up to pristine, fully updated dashboards.' }
    ]
  },
  {
    id: 'consulting',
    title: 'Business Consulting',
    shortDesc: 'Strategic operational planning, workflow optimization, and performance benchmarking to unlock rapid enterprise growth.',
    iconName: 'Users',
    problem: 'Fast-growing enterprises scale haphazardly, resulting in fragmented workflows, overlapping software subscriptions, redundant payroll overhead, and highly fragile operational systems.',
    solution: 'Our expert consulting team conducts deep-dive operations audits, identifies hidden bottlenecks, benchmarks performance metrics, and redesigns your organizational architecture.',
    benefits: [
      'Unbiased, data-driven analysis of operational leakages and resource waste',
      'Clear, actionable step-by-step operational improvement roadmaps',
      'Software stack consolidation recommendations that slash subscription bloat',
      'Direct, continuous advisory support from seasoned enterprise operational experts'
    ],
    process: [
      { step: '01', title: 'Discovery & Stakeholder Interviews', desc: 'Deep-dive interviews across executive leadership and frontline teams to identify friction.' },
      { step: '02', title: 'Data-Driven Friction Analysis', desc: 'Evaluating processing logs, response times, and software utilization metrics to locate leakages.' },
      { step: '03', title: 'Blueprint Presentation', desc: 'Delivering a detailed operational redesign strategy with concrete ROI calculations.' },
      { step: '04', title: 'Implementation Coaching', desc: 'Guiding your leadership through change management and team alignment during operational rollouts.' }
    ],
    results: [
      { metric: '30%', label: 'Efficiency Improvement', context: 'Streamlining cross-departmental tasks and automated hand-offs.' },
      { metric: '15%', label: 'Software Spend Consolation', context: 'Locating and terminating redundant, expensive SaaS licenses.' },
      { metric: '90 Days', label: 'Average ROI Realization', context: 'Rapid return on consulting advisory costs through unlocked capacity.' }
    ],
    faqs: [
      { question: 'How do your consultants interact with our existing internal teams?', answer: 'We act as collaborative partners. We work alongside your department heads, collecting insight and feedback to ensure all operational recommendations are highly realistic and enthusiastically adopted.' },
      { question: 'Do you assist with the actual execution of the consulting roadmap?', answer: 'Yes! Unlike standard firms that just deliver a PDF report, we can actively deploy our own technology and BPO teams to execute the recommended integrations and operational expansions.' }
    ]
  },
  {
    id: 'excellence',
    title: 'Operational Excellence',
    shortDesc: 'Continuous improvement frameworks (Six Sigma, Lean) mapped directly to your processes to maximize output quality.',
    iconName: 'Shield',
    problem: 'Even modern organizations suffer from persistent variation in product or service quality, high error rates in processing, and general waste from unstandardized procedures.',
    solution: 'We inject Lean Six Sigma certified operational managers into your workflows to implement systematic error-reduction frameworks and continuous QA cycles.',
    benefits: [
      'Drive defect rates down to near-zero statistical margins',
      'Standardize employee training protocols to guarantee uniform service quality',
      'Optimize cycle times to outpace market competitors',
      'Instill a data-driven, self-correcting operational culture'
    ],
    process: [
      { step: '01', title: 'Define & Measure Key Metrics', desc: 'Establishing precise baselines for error rates, cycle speeds, and process variation.' },
      { step: '02', title: 'Root Cause Analysis', desc: 'Using continuous audits and diagnostic tools to isolate the exact drivers of defects.' },
      { step: '03', title: 'Systematic Redesign', desc: 'Redesigning workflows, checklist structures, and approval barriers to eliminate human error.' },
      { step: '04', title: 'Control Loop Establishment', desc: 'Deploying continuous statistical controls and real-time dashboards to catch and fix deviation early.' }
    ],
    results: [
      { metric: '99.98%', label: 'Process Precision Level', context: 'Achieving institutional excellence on heavy transaction sets.' },
      { metric: '45%', label: 'Cycle Time Compression', context: 'Removing wasteful wait-states and redundant multi-layered approvals.' },
      { metric: 'Zero', label: 'Unchecked Deviations', context: 'Every single customer experience or claim is audited against the same quality standard.' }
    ],
    faqs: [
      { question: 'What operational frameworks do you utilize?', answer: 'We leverage a combination of Lean methodology (waste reduction), Six Sigma (defect reduction), and agile management to keep your business operating at maximum peak performance.' },
      { question: 'Does this apply only to heavy manufacturing, or to digital offices?', answer: 'These principles apply beautifully to digital office environments. Processing an insurance policy, reconciling a general ledger, or responding to support tickets are all digital pipelines ripe for optimization.' }
    ]
  },
  {
    id: 'managed-services',
    title: 'Managed Services',
    shortDesc: 'Comprehensive technology, operations, and platform management under strict enterprise SLA agreements.',
    iconName: 'Server',
    problem: 'Managing complex digital platforms, multi-cloud hosting, database backups, and secure system operations internally distracts companies from core sales and relationship building.',
    solution: 'We assume comprehensive, 24/7 operational responsibility for your cloud databases, agent portals, data extraction engines, and core internal tools under contract-backed SLAs.',
    benefits: [
      'Peace of mind with guaranteed response times and around-the-clock incident management',
      'Routine, automated system security patching, audits, and cloud backups',
      'Predictable monthly flat-rate IT and platform operating budgets',
      'Instant access to senior cloud engineers, developers, and systems administrators'
    ],
    process: [
      { step: '01', title: 'Platform Discovery', desc: 'Comprehensive mapping of server configurations, APIs, databases, and third-party SaaS pipelines.' },
      { step: '02', title: 'Security Hardening', desc: 'Implementing zero-trust access management, encryption-at-rest, and active DDoS shielding.' },
      { step: '03', title: 'SLA Contract Alignment', desc: 'Signing clear performance contracts specifying uptime, recovery times, and reaction speeds.' },
      { step: '04', title: '24/7/365 Monitoring', desc: 'Activating continuous digital tracking loops with direct paging to our on-call operations engineers.' }
    ],
    results: [
      { metric: '24/7/365', label: 'Continuous Active Shield', context: 'Never leaving your critical digital infrastructure unmonitored.' },
      { metric: '<15 Min', label: 'Average Critical Incident Response', context: 'Direct, rapid resolution of unexpected server or platform blockages.' },
      { metric: '100%', label: 'Routine Data Backups Verified', context: 'Automated off-site database mirrors to ensure complete business continuity.' }
    ],
    faqs: [
      { question: 'How do you handle emergency platform failures at 2 AM?', answer: 'We maintain fully staffed, overlapping engineering teams across multiple time zones. If an alert fires, our active engineers respond immediately and coordinate resolution before your US team opens.' },
      { question: 'Do you support custom-built applications, or only off-the-shelf software?', answer: 'We support both! We specialize in managing complex, bespoke cloud platforms, custom-coded web portals, database clusters, and specialized server-side APIs.' }
    ]
  }
];

export const INDUSTRIES_DATA: IndustryDetail[] = [
  {
    id: 'pc-insurance',
    title: 'Property & Casualty Insurance',
    tagline: 'Supercharge submission volume and slash turnaround times for P&C agencies, brokers, and carriers.',
    description: 'The Property & Casualty landscape is fiercely competitive. Brokers and underwriters must move at lightning speed to capture premium. Our specialized P&C operations teams handle the heavy manual burden of ACORD data entry, carrier appetite checks, and quote comparisons, enabling your team to bind business ahead of competitors.',
    challenges: [
      'Inconsistent formatting across commercial client submission sheets',
      'Entering hundreds of vehicles, properties, or employee lists into carrier quote portals',
      'Massive certificate of insurance (COI) backlogs during seasonal renewal windows'
    ],
    solutions: [
      'Dedicated ACORD extraction experts to digitize paper forms instantly',
      'Bulk spreadsheet transformation pipelines to standard carrier upload formats',
      'Overnight processing teams to clear certificates and endorsements before your office opens'
    ],
    keyMetrics: [
      { label: 'Cycle Time Reduction', value: '45%' },
      { label: 'Quote Turnaround Speed', value: 'Under 1 Hr' },
      { label: 'AMS Input Accuracy', value: '99.9%' }
    ],
    seoKeywords: ['Property and Casualty operations', 'P&C commercial submissions', 'ACORD data extraction', 'insurance agency outsourcing']
  },
  {
    id: 'homeowners',
    title: 'Homeowners Insurance',
    tagline: 'Frictionless underwriting intake and automated quote routing for residential lines.',
    description: 'Homeowners insurance requires massive transaction speeds and high-accuracy risk data verification. We help residential agencies and InsurTech platforms manage catastrophic risk checks, flood zone lookups, property tax history pulling, and immediate quote preparation.',
    challenges: [
      'High volumes of consumer quote requests during real-estate seasonal peaks',
      'Verifying outdated roof ages, home building materials, and physical hazard records manually',
      'Routing leads across multiple carrier sites to secure competitive rates'
    ],
    solutions: [
      'Automated API lookups combined with specialized human verification for hazard checking',
      'Real-time comparative rater updates and application indexing',
      'Immediate trigger alerts to follow up on abandoned consumer quote carts'
    ],
    keyMetrics: [
      { label: 'Average Quote Cycle', value: '15 Mins' },
      { label: 'Aged Submission Clearing', value: '100%' },
      { label: 'Support Team Cost Savings', value: '55%' }
    ],
    seoKeywords: ['Homeowners insurance underwriting support', 'residential policy processing', 'personal lines insurance outsourcing']
  },
  {
    id: 'life',
    title: 'Life Insurance',
    tagline: 'Rigorous medical record indexing and high-security customer case file administration.',
    description: 'Life insurance processing requires the highest levels of data security and medical record indexing precision. Our operational professionals assist case managers in organizing multi-page medical records, requesting physician statements, and ensuring absolute privacy under HIPAA standards.',
    challenges: [
      'Hours spent reading and categorizing voluminous Attending Physician Statements (APS)',
      'High policy drop-off rates due to long underwriting and medical review wait times',
      'Strict HIPAA compliance audits required across all administrative pipelines'
    ],
    solutions: [
      'Intelligent medical record indexing to organize pages by doctor specialty and chronology',
      'Rigorous case file tracking to proactively prompt physicians for missing records',
      'Secure, virtual-desktop environments that prevent localized patient record storage'
    ],
    keyMetrics: [
      { label: 'APS Indexing Time Saved', value: '70%' },
      { label: 'Case Cycle Time Shrinkage', value: '12 Days' },
      { label: 'Security Compliance Auditing', value: '100%' }
    ],
    seoKeywords: ['Life insurance case management support', 'medical records indexing', 'HIPAA compliant back office', 'APS collection outsourcing']
  },
  {
    id: 'health',
    title: 'Health Insurance',
    tagline: 'Streamlining group health submissions and annual enrollment peak staffing operations.',
    description: 'We enable health insurance organizations to scale operations rapidly, managing individual and group enrollment processing, claim documentation indexing, and agent-of-record updates. Our talent pool scales smoothly to support you during intense Open Enrollment Periods (OEP).',
    challenges: [
      'Inundation of applications during the annual Open Enrollment Period (OEP)',
      'Manually verifying employee eligibility rosters across diverse employer benefit formats',
      'Slow response times in carrier portal uploads that risk premium loss'
    ],
    solutions: [
      'A flexible "on-demand" team model that expands 3x to handle Q4 enrollment surges',
      'Roster matching services that clean, verify, and structure group census data',
      'Automated verification pipelines to confirm carrier commission eligibility'
    ],
    keyMetrics: [
      { label: 'Peak Capacity Scaling Factor', value: '3.5x' },
      { label: 'Group Census Processing Speed', value: '90% Faster' },
      { label: 'Commission Recovery Auditing', value: '$25k+/yr' }
    ],
    seoKeywords: ['Health insurance group census', 'OEP enrollment support', 'health insurance operations outsourcing']
  },
  {
    id: 'medicare',
    title: 'Medicare Insurance',
    tagline: 'Compliance-centric CMS-aligned support for Medicare Advantage and Supplement brokers.',
    description: 'Medicare enrollment is governed by some of the strictest CMS marketing guidelines and operational timelines. Our teams are rigorously trained in Medicare compliance, helping Medicare agencies manage scope-of-appointment forms, call recording indexing, and application processing.',
    challenges: [
      'Navigating complex CMS regulations with zero margin for operational error',
      'Heavy clerical burdens during the brief, high-stakes Annual Enrollment Period (AEP)',
      'Matching customer prescription lists across countless drug formulary schedules'
    ],
    solutions: [
      'Rigorous, continuous CMS compliance training for all dedicated Medicare agents',
      'Overnight data entry of scopes-of-appointment (SOA) and paper applications',
      'Advanced formulary verification tools managed by trained operational specialists'
    ],
    keyMetrics: [
      { label: 'AEP Submission Accuracy', value: '100%' },
      { label: 'Compliance Audit Pass Rate', value: '100%' },
      { label: 'Carrier Submission Turnaround', value: '<4 Hrs' }
    ],
    seoKeywords: ['Medicare broker back office', 'AEP Medicare support services', 'CMS compliant outsourcing']
  },
  {
    id: 'agencies',
    title: 'Insurance Agencies',
    tagline: 'Liberating licensed retail agents from clerical data entry to focus on writing policies.',
    description: 'Retail insurance agencies grow by building client relationships, not by completing data entry. We assume full responsibility for your standard administrative burdens, including certificate generation, policy checking, billing tracking, and general client database updates.',
    challenges: [
      'Producers wasting prime sales hours chasing document signatures and payment records',
      'Delayed policy checking that allows carrier coverage mismatches to slip through',
      'High turnover of customer service representatives (CSR) due to heavy administrative burnout'
    ],
    solutions: [
      'Virtual administrative assistance to draft renewal letters and collect client details',
      'Rigorous policy checking matching bound quotes directly against issued carrier contracts',
      'Low-cost, high-performance offshore CSR extensions to field first-level queries'
    ],
    keyMetrics: [
      { label: 'Producer Sales Hours Unlocked', value: '+15 Hr/wk' },
      { label: 'Errors & Omissions Mitigation', value: 'Significant' },
      { label: 'Agency Headcount ROI', value: '3.2x' }
    ],
    seoKeywords: ['Retail agency back office help', 'insurance agency CSR virtual assistant', 'policy checking services']
  },
  {
    id: 'carriers',
    title: 'Insurance Carriers',
    tagline: 'High-scale risk screening, claims indexing, and back-office policy life cycle management.',
    description: 'We partner with enterprise insurance carriers to manage high-volume back-office processes, including policy issuing, loss run indexing, claim documentation intake, and premium audit orchestration. Our operational teams provide contract-backed throughput and strict data processing SLAs.',
    challenges: [
      'Manual, high-volume processing of property loss run reports',
      'Severe administrative overhead in checking physical inspector property photos and risk reports',
      'Backlogs in processing customer-initiated policy cancellations and name changes'
    ],
    solutions: [
      'Intelligent OCR pipelines coupled with human verification to structure loss run histories',
      'Dedicated property risk underwriters assistants to flag obvious underwriting violations',
      'Fast, automated overnight queue clearing for policy maintenance workflows'
    ],
    keyMetrics: [
      { label: 'Loss Run Processing Speed', value: '80% Faster' },
      { label: 'Underwriting Queue Cleared', value: 'Daily' },
      { label: 'Carrier Operating Expense Ratio', value: '-12%' }
    ],
    seoKeywords: ['Carrier policy lifecycle outsourcing', 'loss run processing', 'carrier risk screening assistants']
  },
  {
    id: 'mgas',
    title: 'Managing General Agents (MGAs)',
    tagline: 'Underwriting assistance and quote prep services to maximize your binding capacity.',
    description: 'Managing General Agents bridge the gap between brokers and carriers, requiring both rapid quote speeds and absolute risk integrity. We deploy dedicated underwriting assistants who screen incoming broker submissions, verify risk information, pull credit score records, and draft binder contracts.',
    challenges: [
      'Broker submissions arriving with incomplete risk data or missing ACORD forms',
      'MGA underwriters spending high-cost hours weeding out out-of-appetite submissions',
      'Tight binding authorities requiring meticulous compliance with varying carrier treaties'
    ],
    solutions: [
      'Frontline intake teams that follow up with brokers for missing documentation instantly',
      'Aged submission triaging matching incoming risks to specific carrier guidelines',
      'Pre-underwriting support including distance-to-coast, high-fire-risk, and credit score pulling'
    ],
    keyMetrics: [
      { label: 'Underwriting Time Saved', value: '4 Hours/day' },
      { label: 'Broker Response Speed', value: 'Top 10% of Market' },
      { label: 'Binder Compliance Level', value: '100%' }
    ],
    seoKeywords: ['MGA underwriting virtual assistants', 'binding authority support', 'MGA operations outsourcing']
  },
  {
    id: 'wholesale-brokers',
    title: 'Wholesale Brokers',
    tagline: 'High-volume market-routing support to place difficult risks at premium speeds.',
    description: 'Wholesale brokers operate under massive pressure, routing hard-to-place risks across hundreds of markets. Our operational teams support wholesale operations by managing high-volume submission indexing, building market comparative files, and coordinating policy issuance with MGAs.',
    challenges: [
      'Managing massive data spreads across specialized multi-market programs',
      'Inability to clear heavy submission backlogs leading retail agents to seek other channels',
      'Slow policy delivery times that damage retail agency trust'
    ],
    solutions: [
      'Trained submission specialists who organize and route risk profiles to carriers',
      'Real-time spreadsheet consolidation of multiple carrier quotes for easy comparison',
      'Overnight document preparation to issue policies and endorsements to retail agents'
    ],
    keyMetrics: [
      { label: 'Broker Capacity Unlocked', value: '2x' },
      { label: 'Submission Backlog Clearance', value: 'Within 24 Hours' },
      { label: 'Retail Broker CSAT', value: '95%' }
    ],
    seoKeywords: ['Wholesale broker submissions support', 'commercial market routing outsourcing', 'wholesale insurance operations']
  },
  {
    id: 'insurtech',
    title: 'InsurTech Companies',
    tagline: 'Blending human verification with digital tools to maximize technology margins.',
    description: 'InsurTechs promise instantaneous digital insurance binding. However, complete automation is often an illusion, with complex edge cases requiring rapid human oversight. We provide the "Human-in-the-Loop" operational teams that verify automated extracts, process complex claims, and support custom APIs.',
    challenges: [
      'System-breaking API errors or extraction failures on unstandardized documents',
      'Escalating engineering costs spent trying to write code for rare data edge cases',
      'High transaction dropouts when consumer inquiries require manual review'
    ],
    solutions: [
      'Instant human-in-the-loop operational backups responding to low-confidence extracts',
      'Rapid, cost-effective manual processing of complex edge cases that aren\'t worth coding',
      'Integration into your internal Slack or custom APIs for near-instant ticket resolution'
    ],
    keyMetrics: [
      { label: 'API Edge Case Processing', value: '<2 Mins' },
      { label: 'Engineering Overhead Saved', value: '45%' },
      { label: 'Platform Straight-Through Rate', value: '98%+' }
    ],
    seoKeywords: ['InsurTech human in the loop', 'automated extraction verification', 'InsurTech backend operations']
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'mga-transformation',
    title: 'Accelerating Binder Speeds and Scaling Underwriting Capacity for a Leading Commercial MGA',
    client: 'Apex Specialty Insurance Managers',
    industry: 'Managing General Agent (MGA)',
    metricValue: '4.5 Hours',
    metricLabel: 'Underwriting Time Unlocked Daily',
    challenge: 'Apex was inundated with hundreds of commercial multi-line submissions daily. Their high-cost underwriters spent over half their day screening out-of-appetite risks, chasing brokers for missing loss run histories, and manually entering property details into multiple carrier systems. Turnaround times stretched to 48 hours, causing wholesale brokers to bind business elsewhere.',
    solution: 'Going Technologies deployed a dedicated team of 8 certified Underwriting Assistants. We established a secure workspace utilizing Apex\'s Applied Epic AMS via audited VDIs. Our team assumed full responsibility for frontline submission screening, missing documentation chasing, distance-to-coast pulling, and comparative rater data entry.',
    implementation: [
      'Secure, isolated SOC2 compliant VDI network setup with Apex Applied Epic AMS.',
      'SOP codification detailing Apex\'s exact carrier appetite matrices and credit scoring requirements.',
      'Frontline submission queue management, sorting out-of-appetite files within 30 minutes of receipt.',
      'Overnight comparative rate compilation, presenting pristine risk summaries to underwriters by 8:00 AM EST daily.'
    ],
    results: [
      'Underwriters now spend 100% of their day evaluating high-value risk and binding business.',
      'Average broker response times fell from 48 hours to under 3 hours, putting Apex in the top 1% tier.',
      'MGA bound premium grew by 38% in year one with zero expansion of domestic underwriting headcount.'
    ],
    roi: '340% Year-One ROI based on increased bound premium and reduced operational costs.'
  },
  {
    id: 'agency-clerical-liberation',
    title: 'Unshackling Retail Agency Producers from Clerical Overload to Drive 42% Premium Growth',
    client: 'Summit Group Insurance Partners',
    industry: 'Retail Insurance Agency',
    metricValue: '18 Hrs/Wk',
    metricLabel: 'Sales Time Unlocked per Agent',
    challenge: 'Summit Group had 15 highly successful producers writing commercial property, auto, and benefits. However, each producer spent nearly 20 hours a week on heavy administrative data entry, filing certificates of insurance, checking policy contracts, and following up on billing issues. Headcount costs were rising and agent burnout was causing retail client attrition.',
    solution: 'We deployed a high-performance Customer Service Representative (CSR) offshore extension team of 5 operations specialists. This team assumed complete, overnight ownership of policy contract checking, certificate of insurance generation, client database maintenance (EZLynx), and billing audit reports.',
    implementation: [
      'EZLynx database integration and setting up strict, role-based, multi-factor logins.',
      'Creating structured digital request forms for producers to instantly hand off certificates and endorsement tasks.',
      'Deploying a dual-operator quality assurance checklist to eliminate data input errors on policy checking.',
      'Setting up a dedicated overnight shift to ensure all client certificate requests are fully issued before morning.'
    ],
    results: [
      'Producers recovered 18+ hours a week, which was immediately redirected to prospect meetings and sales outreach.',
      'Certificate processing time dropped from 24 hours to an average of just 12 minutes.',
      'Summit Group achieved a 42% increase in new written premium over 12 months with a 60% reduction in support costs.'
    ],
    roi: 'Summit Group saved over $180,000 in support staff payroll while driving record sales.'
  },
  {
    id: 'insurtech-human-in-the-loop',
    title: 'Enabling 99% Straight-Through Claims Processing for a High-Growth Digital InsurTech',
    client: 'CoverQuick Technologies',
    industry: 'InsurTech Startup',
    metricValue: '<90 Secs',
    metricLabel: 'Average Edge-Case Validation Speed',
    challenge: 'CoverQuick utilized advanced machine learning models to automatically parse ACORD forms and invoice receipts for rapid claims processing. However, unstandardized scans, blurry photos, and handwritten notes led to a 25% automated extraction failure rate. Their software engineers were bogged down writing custom code for endless data exceptions, destroying their operational margins.',
    solution: 'Going Technologies built a 24/7 "Human-in-the-Loop" operational micro-team. Operating via CoverQuick\'s secure proprietary administrative API, our team receives low-confidence extractions, manually validates fields within seconds, and pushes structured data back into the system.',
    implementation: [
      'Secure developer API integration allowing real-time, isolated delivery of low-confidence fields.',
      'Intensive training on ACORD document variations, handwritten font recognition, and policy rules.',
      'Deploying overlapping 24/7 shifts to guarantee continuous, sub-2-minute human response times.',
      'Setting up continuous feedback loops to feed corrected edge cases back to CoverQuick\'s ML training sets.'
    ],
    results: [
      'Platform straight-through processing rates reached 99.8% from a previous baseline of 75%.',
      'CoverQuick\'s engineering team saved 45% of their development hours previously wasted on parsing code.',
      'User customer satisfaction (CSAT) scores increased to 4.9/5 due to instantaneous claims payouts.'
    ],
    roi: 'Cut software support costs by 50% while scaling transaction capacity by 400%.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'modernizing-insurance-ops',
    title: 'Modernizing Insurance Operations: How to Overcome Underwriter Administrative Burnout',
    excerpt: 'High-performing underwriters spend over half their day on administrative data entry. Discover how leading MGAs are unlocking binding capacity without domestic headcount expansion.',
    content: 'The insurance market is facing a silent crisis: underwriter burnout. Despite millions invested in software systems, underwriters spend an average of 4.5 hours a day typing property addresses, searching for loss runs, and filling carrier comparative raters. When highly compensated technical risks specialists spend half their day on clerical entry, growth stalls, broker relationships suffer, and profit margins shrink.\n\nIn this comprehensive guide, we map the exact strategy leading Managing General Agents (MGAs) and carriers are using to scale operations through specialized virtual underwriting assistants. By integrating SOC2-compliant operational teams into core Agency Management Systems, enterprises can delegate submission screening, missing record chasing, and rater entries to dedicated experts. This enables underwriters to focus exclusively on risk evaluation and broker negotiations, slashing turnaround times from 48 hours to under 3 hours and driving double-digit premium growth.',
    category: 'Insurance Operations',
    readTime: '6 Min Read',
    publishDate: 'June 18, 2026',
    author: {
      name: 'James McCarter',
      role: 'VP of Insurance Solutions',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80'
    },
    seoKeywords: ['underwriter burnout', 'insurance operations support', 'MGA scaling support', 'agency management systems']
  },
  {
    id: 'ai-human-in-loop-survival',
    title: 'The Illusion of Total Automation: Why InsurTechs Fail Without Human-in-the-Loop Operations',
    excerpt: 'Pure-software solutions often crash on unstructured real-world documents. Learn why human-in-the-loop operational design is the secret to scaling digital platforms.',
    content: 'InsurTech startups launch with a shared promise: complete, instant automation driven by Artificial Intelligence. However, real-world operations quickly reveal the limits of pure-software approaches. From blurry smartphone photos of policy pages to handwritten ACORD forms, unstructured data causes automated optical character recognition (OCR) systems to fail up to 25% of the time.\n\nWhen these failures occur, the user experience halts, or expensive software developers must waste hours writing custom parsers for rare document edge cases. The solution utilized by the world\'s fastest-growing digital platforms is "Human-in-the-Loop" (HITL) operational design. By routing low-confidence automated extractions to a secure, 24/7 human-validation team, platforms maintain an instantaneous straight-through experience for users while drastically reducing engineering overhead and protecting platform margins.',
    category: 'AI & Automation',
    readTime: '8 Min Read',
    publishDate: 'May 24, 2026',
    author: {
      name: 'Elena Rostova',
      role: 'Director of AI & Automation',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80'
    },
    seoKeywords: ['InsurTech automation', 'human in the loop AI', 'document extraction failures', 'RPA insurance services']
  },
  {
    id: 'slashing-bpo-costs-safely',
    title: 'Slashing BPO Operating Costs by 60%: A Retail Broker Guide to Secure Offshore Scaling',
    excerpt: 'Many agencies fear offshore scaling due to security and quality concerns. This article details the SOC2 framework needed to scale support teams safely.',
    content: 'For mid-market and large retail insurance brokers, operational overhead from support staff is a major drain on profitability. Standard customer service representative (CSR) and back-office payroll costs in the US continue to climb, while local talent pools remain constrained. While Business Process Outsourcing (BPO) promises up to 60% savings, many executives hesitate due to valid fears surrounding data security, AMS system compliance, and customer experience quality.\n\nTo scale safely, enterprises must transition from outdated, unmonitored "freelancer" models to secure, dedicated global delivery centers operating under strict SOC2 guidelines. This involves accessing systems solely via audited, read-only Virtual Desktop Interfaces (VDIs), implementing continuous operational supervision, and codifying precise Standard Operating Procedures (SOPs). Done right, offshore CSR teams act as a seamless, high-accuracy extension of your domestic office, liberating retail producers to focus on clients and drive high-growth sales pipelines.',
    category: 'Business Process Outsourcing',
    readTime: '5 Min Read',
    publishDate: 'April 11, 2026',
    author: {
      name: 'Michael Chen',
      role: 'Managing Partner, BPO Operations',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
    },
    seoKeywords: ['insurance broker BPO', 'secure offshore outsourcing', 'SOC2 data security', 'retail agency cost savings']
  }
];

export const CAREER_POSITIONS: CareerPosition[] = [
  {
    id: 'sr-insurance-ops-analyst',
    title: 'Senior Insurance Operations Analyst',
    department: 'Insurance Operations',
    location: 'Global Delivery Center (Rotational Shifts)',
    type: 'Full-time',
    experience: '3+ Years in US Commercial Insurance P&C',
    description: 'We are seeking a highly detailed, experienced commercial insurance operations specialist to lead a team of submission indexers and underwriting assistants. You will assume direct responsibility for reviewing carrier appetite matches, verifying ACORD documentation, and auditing team data entry inside client Agency Management Systems.',
    requirements: [
      'Deep, working understanding of US Property & Casualty (P&C) lines of business.',
      'Hands-on experience operating Applied Epic, Vertafore AMS360, Sagitta, or EZLynx.',
      'Familiarity with carrier quote guidelines, commercial appetite matrices, and ACORD structural fields.',
      'Exceptional written and spoken English communication skills with highly professional computer literacy.'
    ],
    benefits: [
      'Highly competitive premium base salary with performance-linked monthly bonuses.',
      'Comprehensive family private health insurance with inpatient and dental coverage.',
      'Paid continuous education programs and official US carrier/agency system certifications.',
      'Modern, high-comfort workspace with state-of-the-art workstations and career fast-track paths.'
    ]
  },
  {
    id: 'ai-workflow-integrator',
    title: 'AI Workflow & Automation Engineer',
    department: 'AI & Automation Services',
    location: 'Hybrid / Global Center',
    type: 'Full-time',
    experience: '2+ Years in Python, OCR, LLM APIs & RPA Platforms',
    description: 'Join our Digital Transformation team to build and implement cutting-edge Intelligent Document Processing (IDP) and Robotic Process Automation (RPA) workflows. You will design "Human-in-the-Loop" pipelines that route failed data extractions to our operations specialists, ensuring complete, structured data delivery to client portals.',
    requirements: [
      'Proficiency in building automated extraction scripts using Python, OpenCV, and leading OCR libraries.',
      'Hands-on experience integrating LLM APIs (e.g., Google Gemini Pro) with structured, reliable JSON schema parsing.',
      'Familiarity with RPA tools (UiPath, Automation Anywhere, Microsoft Power Automate) is a major plus.',
      'Strong problem-solving skills and ability to design clean, secure RESTful APIs.'
    ],
    benefits: [
      'Top-tier technology builder compensation package with annual performance review.',
      'Flexible hybrid work arrangements with high-end development gear provided.',
      'Unlimited access to advanced training courses in Generative AI and Cloud Architecture.',
      'Collaborative, fast-paced environment working alongside seasoned enterprise architects.'
    ]
  },
  {
    id: 'bpo-team-lead',
    title: 'BPO Operations Supervisor',
    department: 'Business Process Outsourcing',
    location: 'Global Center (US Shift)',
    type: 'Full-time',
    experience: '4+ Years leading BPO / Call Center teams (US Retail Broker accounts preferred)',
    description: 'We are looking for an energetic, metrics-driven Operations Supervisor to lead a customer support and back-office team representing a prominent US insurance retail broker. You will monitor daily First Contact Resolution (FCR) rates, lead QA reviews, handle escalation tickets, and coordinate weekly performance reports with US account executives.',
    requirements: [
      'Proven experience managing teams of 10+ agents in high-volume customer service or back-office pipelines.',
      'Excellent organizational, metrics-tracking, and team motivational leadership skills.',
      'Expert level fluency in localized US cultural idioms, professional telephone etiquette, and client reporting.',
      'Ability to work US business hours (EST/CST shifts) in our physical Global Center.'
    ],
    benefits: [
      'Premium US shift differential allowance and generous transportation subsidies.',
      'Direct executive mentorship with opportunities to coordinate major multi-million accounts.',
      'Annual company-sponsored wellness programs and high-fidelity team building events.',
      'Full corporate benefits package including retirement fund contributions.'
    ]
  }
];

export const OFFICE_LOCATIONS = [
  {
    city: 'Going Technologies Global Center',
    country: 'India',
    role: 'Global Operations, Specialized BPO & Insurance Support Services',
    address: 'Visakhapatnam, Andhra Pradesh 530041, India',
    phone: '706-383-0888',
    email: 'connect@goingtechnologies.com'
  }
];

export const FAQ_GENERAL = [
  {
    question: 'Are your operations SOC2 and HIPAA compliant?',
    answer: 'Absolutely. Security is our absolute highest priority. We operate under strict SOC2 Type II security guidelines and ensure comprehensive HIPAA compliance for health and life insurance clients. Our delivery teams operate in secure, physical keycard-isolated rooms. Under custom client protocols, our staff can work exclusively inside secure Citrix or Microsoft Virtual Desktop Interfaces (VDIs) with copy/paste, file downloads, and printing entirely disabled, ensuring zero localized storage of client data.'
  },
  {
    question: 'How do you guarantee quality and prevent operational errors?',
    answer: 'We implement a systematic dual-verification operational structure governed by Lean Six Sigma methodologies. Every critical transaction or data input (e.g., binding quote comparisons, certificate issuances, or medical indexing) undergoes immediate review by a dedicated Quality Assurance Supervisor before submission. This dual-checking process allows us to maintain an industry-leading accuracy rate of 99.98% across heavy data pipelines.'
  },
  {
    question: 'What is the onboarding process and timeline?',
    answer: 'We have built a frictionless four-stage onboarding system. First, we audit your process and capture your exact workflows into highly structured Standard Operating Procedures (SOPs). Second, we align a secure network handshake. Third, we source or allocate specialized talent from our trained pool to conduct a 2-week pilot phase under full supervisor oversight. Lastly, we scale to contract-guaranteed steady state. Standard pilot teams are usually up and running in 14-21 days.'
  },
  {
    question: 'Can you work overnight to process US queues?',
    answer: 'Yes! Our Global Delivery Center operates on a continuous 24/7/365 schedule. We specialize in overnight queues. While your US underwriters, brokers, or administrative staff are closed, our team clears data backlogs, processes endorsements, and updates CRM databases. Your domestic team opens their offices to fully completed, pristine queues, accelerating transaction velocity and saving hours of local delays.'
  }
];
