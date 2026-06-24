export type PageType =
  | 'home'
  | 'about'
  | 'services'
  | 'industries'
  | 'case-studies'
  | 'blog'
  | 'contact'
  | 'careers'
  | 'privacy'
  | 'terms'
  | 'admin';

export interface ServiceDetail {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  problem: string;
  solution: string;
  benefits: string[];
  process: { step: string; title: string; desc: string }[];
  results: { metric: string; label: string; context: string }[];
  faqs: { question: string; answer: string }[];
}

export interface IndustryDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  challenges: string[];
  solutions: string[];
  keyMetrics: { label: string; value: string }[];
  seoKeywords: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  metricValue: string;
  metricLabel: string;
  challenge: string;
  solution: string;
  implementation: string[];
  results: string[];
  roi: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  seoKeywords: string[];
}

export interface CareerPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
}
