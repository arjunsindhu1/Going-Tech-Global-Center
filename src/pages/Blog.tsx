import React, { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  BookOpen,
  User,
  Calendar,
  Clock,
  Send,
  CheckCircle,
  FileCode,
  ArrowLeft,
  ArrowRight,
  Share2,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Building
} from 'lucide-react';
import { PageType, BlogPost } from '../types';
import { BLOG_POSTS } from '../data';
import { supabase } from '../lib/supabase';

interface BlogProps {
  setCurrentPage: (page: PageType) => void;
}

export default function Blog({ setCurrentPage }: BlogProps) {
  // Database states
  const [supabaseBlogs, setSupabaseBlogs] = useState<BlogPost[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch blogs from Supabase with dynamic fallback to static list
  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: BlogPost[] = data.map((b: any) => ({
          id: b.id,
          title: b.title,
          excerpt: b.meta_description || b.short_description || b.content.slice(0, 160) + '...',
          content: b.content,
          category: b.category,
          readTime: b.reading_time || '5 Min Read',
          publishDate: new Date(b.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          author: {
            name: 'Going Technologies Team',
            role: 'Operations Strategist',
            avatar: '/Going tech icon-1.png'
          },
          seoKeywords: b.meta_title ? [b.meta_title] : []
        }));
        setSupabaseBlogs(mapped);
      } else {
        setSupabaseBlogs([]);
      }
    } catch (err) {
      console.warn('Using initial static blogs (Supabase blogs table empty or unprovisioned).', err);
      setSupabaseBlogs([]);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();

    // Subscribe to realtime changes in case blogs are created/deleted in Admin
    const subscription = supabase
      .channel('public:blogs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => {
        fetchBlogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Effective blogs list - Combine custom database blogs with pre-written static insights
  const getDeletedStaticBlogs = (): string[] => {
    try {
      const saved = localStorage.getItem('deleted_static_blogs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const deletedList = getDeletedStaticBlogs();

  const blogs = [
    ...supabaseBlogs,
    ...BLOG_POSTS
      .filter(b => !deletedList.includes(b.id))
      .filter(b => !supabaseBlogs.some(sb => sb.title.toLowerCase() === b.title.toLowerCase()))
  ].map(b => ({
    ...b,
    author: {
      name: 'Going Technologies Team',
      role: 'Operations Strategist',
      avatar: '/Going tech icon-1.png'
    }
  }));

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalHeight = target.scrollHeight - target.clientHeight;
    if (totalHeight > 0) {
      const progress = (target.scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    setScrollProgress(0);
  }, [activeArticle]);

  // Dynamically calculate category counts based on complete blogs array
  const categories = [
    'All',
    'Insurance Operations',
    'Digital Transformation',
    'Business Process Outsourcing',
    'AI & Automation'
  ];

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return blogs.length;
    return blogs.filter(b => b.category === cat).length;
  };

  // Reset pagination when filter or search changes
  useEffect(() => {
    setCurrentPageNum(1);
  }, [selectedCategory, searchQuery]);

  const filteredPosts = blogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination definitions
  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const paginatedPosts = filteredPosts.slice(
    (currentPageNum - 1) * postsPerPage,
    currentPageNum * postsPerPage
  );

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([{ email: email.trim() }]);
        
        if (error) throw error;
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      } catch (err) {
        console.error('Error subscribing:', err);
        alert('Subscription currently offline. Please try again later.');
      }
    }
  };

  // Update dynamic SEO Head Tags
  const updateSEOTags = (post: BlogPost | null) => {
    const getOrCreateMeta = (attrName: string, attrVal: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      return element;
    };

    const getOrCreateLink = (relVal: string) => {
      let element = document.querySelector(`link[rel="${relVal}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', relVal);
        document.head.appendChild(element);
      }
      return element;
    };

    if (post) {
      document.title = `${post.title} | Going Technologies Strategic Digest`;
      const desc = post.excerpt || post.title;
      getOrCreateMeta('name', 'description').setAttribute('content', desc);

      getOrCreateMeta('property', 'og:title').setAttribute('content', post.title);
      getOrCreateMeta('property', 'og:description').setAttribute('content', desc);
      getOrCreateMeta('property', 'og:type').setAttribute('content', 'article');
      getOrCreateMeta('property', 'og:url').setAttribute('content', `${window.location.origin}/blogs/${post.id}`);
      getOrCreateMeta('property', 'og:image').setAttribute('content', post.author.avatar);

      getOrCreateMeta('name', 'twitter:card').setAttribute('content', 'summary_large_image');
      getOrCreateMeta('name', 'twitter:title').setAttribute('content', post.title);
      getOrCreateMeta('name', 'twitter:description').setAttribute('content', desc);
      getOrCreateMeta('name', 'twitter:image').setAttribute('content', post.author.avatar);

      getOrCreateLink('canonical').setAttribute('href', `${window.location.origin}/blogs/${post.id}`);
    } else {
      document.title = 'Going Technologies Strategic Digest | Insurance Operations, BPO & AI';
      getOrCreateMeta('name', 'description').setAttribute('content', 'Quarterly briefings, system audits, and regulatory analysis covering BPO, secure offshore operations, and AI workflows.');
      
      getOrCreateMeta('property', 'og:title').setAttribute('content', 'Going Technologies Strategic Digest');
      getOrCreateMeta('property', 'og:description').setAttribute('content', 'Quarterly briefings, system audits, and regulatory analysis.');
      getOrCreateMeta('property', 'og:type').setAttribute('content', 'website');
      getOrCreateMeta('property', 'og:url').setAttribute('content', `${window.location.origin}/blogs`);
      
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `${window.location.origin}/blogs`);
    }
  };

  // Generate dynamic SEO schema string to display
  const getJsonLdSchema = (post: BlogPost) => {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": post.title,
      "datePublished": post.publishDate,
      "description": post.excerpt,
      "author": {
        "@type": "Person",
        "name": post.author.name,
        "jobTitle": post.author.role
      },
      "publisher": {
        "@type": "Organization",
        "name": "Going Technologies Global Center",
        "logo": {
          "@type": "ImageObject",
          "url": "https://goingtechnologies.com/GTGC Logo.png?v=3"
        }
      }
    };

    const breadcrumbsSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Insights & Intelligence",
          "item": `${window.location.origin}/blogs`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": `${window.location.origin}/blogs/${post.id}`
        }
      ]
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What are the core findings in "${post.title}"?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": post.excerpt
          }
        },
        {
          "@type": "Question",
          "name": "How is Going Technologies positioned to support this?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Going Technologies bridges the gap between domestic insurance expertise and robust global center operations to drive down costs while ensuring carrier-grade compliance."
          }
        }
      ]
    };

    return JSON.stringify([articleSchema, breadcrumbsSchema, faqSchema], null, 2);
  };

  useEffect(() => {
    updateSEOTags(activeArticle);
    
    if (activeArticle) {
      let script = document.getElementById('blog-ld-json') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'blog-ld-json';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = getJsonLdSchema(activeArticle);
    } else {
      const script = document.getElementById('blog-ld-json');
      if (script) script.remove();
    }

    return () => {
      const script = document.getElementById('blog-ld-json');
      if (script) script.remove();
    };
  }, [activeArticle]);

  return (
    <div className="bg-[#F8FAFF] font-sans text-[#111827] min-h-screen">
      
      {/* Blog Article Reader Panel Overlay */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onScroll={handleScroll}
            className="fixed inset-0 bg-[#F8FAFF] z-50 overflow-y-auto"
          >
            {/* Top Navigation Row */}
            <div className="sticky top-0 bg-white border-b border-[#DCE7FF] px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center z-50 shadow-xs">
              <button
                onClick={() => setActiveArticle(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#081B8C] hover:text-[#2F6DFF] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Insights Board</span>
              </button>
              <div className="flex gap-4">
                <span className="text-[10px] bg-[#DCE7FF]/40 text-[#081B8C] font-bold px-2.5 py-1 rounded">
                  {activeArticle.category}
                </span>
              </div>
            </div>

            {/* Reading progress indicator */}
            <div className="sticky top-[57px] left-0 right-0 h-1 bg-gray-100/40 z-50">
              <div 
                className="h-full bg-[#2F6DFF] transition-all duration-75 ease-out" 
                style={{ width: `${scrollProgress}%` }} 
              />
            </div>

            {/* Article Content Area */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              {/* Dynamic Visual Breadcrumbs */}
              <nav className="flex items-center gap-2 text-[10px] text-gray-400 font-mono font-bold uppercase mb-8">
                <span className="hover:text-[#2F6DFF] cursor-pointer" onClick={() => setActiveArticle(null)}>Home</span>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:text-[#2F6DFF] cursor-pointer" onClick={() => setActiveArticle(null)}>Briefings</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-500">{activeArticle.category}</span>
              </nav>

              <motion.div
                key={activeArticle.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-10"
              >
                {/* Header meta */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeArticle.publishDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#081B8C] leading-tight tracking-tight">
                    {activeArticle.title}
                  </h1>

                  {/* Author card */}
                  <div className="flex items-center gap-3 border-y border-gray-100 py-4">
                    <img
                      src={activeArticle.author.avatar}
                      alt={activeArticle.author.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#DCE7FF]"
                    />
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">{activeArticle.author.name}</span>
                      <span className="text-xs text-gray-400 font-medium">{activeArticle.author.role}</span>
                    </div>
                  </div>
                </div>

                {/* Main Text Content */}
                <article className="prose prose-blue text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-wrap max-w-none text-left font-sans">
                  {activeArticle.content}
                </article>

                {/* FAQ section dynamically rendered to satisfy FAQ schema */}
                <div className="bg-[#F8FAFF] border border-[#DCE7FF]/80 rounded-2xl p-6 sm:p-8 space-y-6 text-left">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Strategic Briefing FAQ</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#081B8C]">What are the core findings in this briefing?</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{activeArticle.excerpt}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#081B8C]">How does Going Technologies position its global operations to align with these trends?</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        We deploy custom corporate structures, security architectures, and advanced AI automation pipelines (like Google Gemini engines) directly into client AMS workflows with robust SOC2 validation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Related Articles Section */}
                {(() => {
                  const related = blogs.filter((p) => p.id !== activeArticle.id).slice(0, 2);
                  if (related.length === 0) return null;
                  return (
                    <div className="border-t border-gray-100 pt-10 space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Related Strategic Insights</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {related.map((post) => (
                          <div
                            key={post.id}
                            onClick={() => {
                              setActiveArticle(post);
                              const modal = document.querySelector('.fixed.inset-0.overflow-y-auto');
                              if (modal) {
                                modal.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className="bg-white border border-[#DCE7FF]/80 rounded-xl p-6 cursor-pointer hover:shadow-md hover:border-[#2F6DFF]/50 transition-all duration-200 group text-left"
                          >
                            <span className="text-[9px] font-bold text-[#2F6DFF] uppercase tracking-wider block mb-2">{post.category}</span>
                            <h4 className="text-sm font-bold text-[#081B8C] group-hover:text-[#2F6DFF] transition-colors leading-snug line-clamp-2">{post.title}</h4>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#081B8C] mt-4">
                              <span>Read Article</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Closing banner */}
                <div className="border-t border-gray-100 pt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="bg-gray-100 text-[#081B8C] hover:bg-[#DCE7FF]/40 text-xs font-bold px-6 py-3 rounded-full cursor-pointer"
                  >
                    Close Article
                  </button>
                  <button
                    onClick={() => {
                      setActiveArticle(null);
                      setCurrentPage('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-[#081B8C] text-white hover:bg-[#2F6DFF] text-xs font-bold px-6 py-3 rounded-full cursor-pointer"
                  >
                    Discuss Scale Strategies With Authors
                  </button>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Main Page Header */}
      <section className="bg-white border-b border-[#DCE7FF]/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F6DFF]">Insights & Intelligence</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#081B8C] tracking-tight">
            Going Technologies Executive Digest
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Quarterly briefings, system audits, and regulatory analysis covering BPO, secure offshore operations, and AI workflows for US organizations.
          </p>
        </div>
      </section>

      {/* Main Interactive Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Search and Category Filter Toolbar */}
        <div className="flex flex-col xl:flex-row justify-between items-center gap-6 bg-white border border-[#DCE7FF] rounded-2xl p-6 shadow-xs">
          {/* Categories with Counts */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 ${
                  selectedCategory === cat
                    ? 'bg-[#081B8C] text-white shadow-xs'
                    : 'bg-[#F8FAFF] text-gray-500 hover:bg-[#DCE7FF]/40'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {getCategoryCount(cat)}
                </span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full xl:w-80">
            <input
              type="text"
              placeholder="Search intelligence files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFF] border border-[#DCE7FF] rounded-lg py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:border-[#2F6DFF]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* FEATURED / LATEST SPOTLIGHT COGNITIVE ANALYSIS CARD (Only on Page 1 & No filters active) */}
        {currentPageNum === 1 && filteredPosts.length > 0 && (
          <div className="bg-white border border-[#DCE7FF] rounded-3xl overflow-hidden shadow-xs hover:border-[#2F6DFF] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
            <div className="p-8 sm:p-12 lg:col-span-8 space-y-6 flex flex-col justify-center text-left">
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-red-50 text-red-600 font-extrabold uppercase tracking-widest px-2.5 py-1 rounded">
                  Featured Intelligence
                </span>
                <span className="text-gray-400 text-xs font-mono">{filteredPosts[0].readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#081B8C] font-display hover:text-[#2F6DFF] transition-colors leading-tight tracking-tight">
                {filteredPosts[0].title}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {filteredPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={filteredPosts[0].author.avatar}
                  alt={filteredPosts[0].author.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#DCE7FF]"
                />
                <div>
                  <span className="font-bold text-gray-900 text-xs block">{filteredPosts[0].author.name}</span>
                  <span className="text-[10px] text-gray-400">{filteredPosts[0].author.role}</span>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setActiveArticle(filteredPosts[0]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cursor-pointer inline-flex items-center gap-2 bg-[#081B8C] hover:bg-[#2F6DFF] text-white text-xs font-bold px-6 py-3 rounded-full transition-colors group shadow-md shadow-blue-500/5"
                >
                  <span>Examine Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#081B8C]/10 via-[#2F6DFF]/5 to-transparent lg:col-span-4 p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#DCE7FF] relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="space-y-4 relative z-10 text-left">
                <Bookmark className="w-8 h-8 text-[#2F6DFF] opacity-80" />
                <h4 className="font-bold text-[#081B8C] text-sm">Key Takeaway</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Offshore operations are no longer purely about cheap labor. Leading insurance structures use physical isolation chambers, full encryption, and direct US accountability metrics.
                </p>
              </div>
              <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest mt-8 relative z-10">
                GOING INTEL // BRIEFING_01
              </div>
            </div>
          </div>
        )}

        {/* Article Cards Grid */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts
              // Skip the first one if we are showing spotlight, page 1, and no specific category/query filters
              .filter((_, idx) => currentPageNum !== 1 || idx !== 0 || searchQuery !== '' || selectedCategory !== 'All')
              .map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setActiveArticle(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white border border-[#DCE7FF] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#2F6DFF] hover:translate-y-[-4px] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="p-6 sm:p-8 space-y-5 text-left">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono font-bold uppercase">
                      <span>{post.category}</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#081B8C] font-display hover:text-[#2F6DFF] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* mini Author bar */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#DCE7FF]"
                      />
                      <div>
                        <span className="font-bold text-gray-800 text-xs block">{post.author.name}</span>
                        <span className="text-[10px] text-gray-400">{post.author.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* trigger link footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#081B8C] hover:bg-white transition-colors">
                    <span>Read Full Operational Briefing</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}

            {paginatedPosts.length === 0 && (
              <div className="col-span-full bg-white border border-dashed border-[#DCE7FF] rounded-xl p-12 text-center text-gray-400 text-sm">
                No briefings matching search query found. Let's try another category or search query.
              </div>
            )}
          </div>

          {/* PAGINATION PANEL */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 px-4">
              <button
                onClick={() => setCurrentPageNum(prev => Math.max(prev - 1, 1))}
                disabled={currentPageNum === 1}
                className="cursor-pointer inline-flex items-center gap-1 bg-white border border-[#DCE7FF] hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Page</span>
              </button>

              <div className="text-xs text-gray-400 font-mono font-bold uppercase">
                Page <span className="text-gray-900">{currentPageNum}</span> of <span className="text-gray-900">{totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPageNum(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPageNum === totalPages}
                className="cursor-pointer inline-flex items-center gap-1 bg-white border border-[#DCE7FF] hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Newsletter widget */}
        <div className="bg-[#081B8C] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F6DFF]/15 blur-2xl rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold font-display">Get Strategic Reports Delivered Quarterly</h3>
            <p className="text-white/80 text-xs leading-relaxed">
              Join 500+ insurance underwriters, CEOs, and Operations Executives subscribing to the Going Technologies strategic digest.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="executive@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-white flex-1"
              />
              <button
                type="submit"
                className="cursor-pointer bg-white text-[#081B8C] hover:bg-[#F8FAFF] px-6 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <span>Subscribe Now</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 font-bold text-xs animate-pulse">
                ✓ Success! Check your email to confirm membership.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
