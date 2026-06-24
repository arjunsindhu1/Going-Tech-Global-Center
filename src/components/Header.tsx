import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, ChevronDown, Shield, CheckCircle2 } from 'lucide-react';
import { PageType } from '../types';

interface HeaderProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  onNavigateToService?: (serviceId: string) => void;
}

export default function Header({ currentPage, setCurrentPage, onNavigateToService }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Industries', page: 'industries' },
    { label: 'Case Studies', page: 'case-studies' },
    { label: 'Insights', page: 'blog' },
    { label: 'Careers', page: 'careers' },
  ];

  const quickServices = [
    { name: 'Insurance Operations', id: 'insurance-ops' },
    { name: 'Business Process Outsourcing', id: 'bpo' },
    { name: 'Digital Transformation', id: 'digital-transform' },
    { name: 'AI & Automation', id: 'ai-automation' }
  ];

  const handleNavClick = (page: PageType) => {
    setCurrentPage(page);
    setIsOpen(false);
    setServicesDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceClick = (serviceId: string) => {
    if (onNavigateToService) {
      onNavigateToService(serviceId);
    } else {
      setCurrentPage('services');
    }
    setIsOpen(false);
    setServicesDropdown(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-[#DCE7FF]'
            : 'bg-[#F8FAFF] border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
              <img
                src="/logo-navbar.png"
                alt="Going Technologies Global Center"
                className="h-10 md:h-[50px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02] [image-rendering:auto]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;

                if (item.page === 'services') {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setServicesDropdown(true)}
                      onMouseLeave={() => setServicesDropdown(false)}
                    >
                      <button
                        onClick={() => handleNavClick('services')}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? 'text-[#081B8C] bg-[#DCE7FF]/40 font-semibold'
                            : 'text-[#111827] hover:text-[#081B8C] hover:bg-[#DCE7FF]/20'
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown menu */}
                      <AnimatePresence>
                        {servicesDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 mt-1 w-64 bg-white border border-[#DCE7FF] rounded-xl shadow-lg py-3 z-50"
                          >
                            <div className="px-4 pb-2 mb-2 border-b border-gray-100 text-[11px] uppercase font-semibold text-gray-400 tracking-wider">
                              Core Operations
                            </div>
                            {quickServices.map((qs) => (
                              <button
                                key={qs.id}
                                onClick={() => handleServiceClick(qs.id)}
                                className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:text-[#081B8C] hover:bg-[#F8FAFF] font-medium flex items-center justify-between group cursor-pointer"
                              >
                                {qs.name}
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#2F6DFF]" />
                              </button>
                            ))}
                            <div className="px-4 pt-2 border-t border-gray-100 mt-2">
                              <button
                                onClick={() => handleNavClick('services')}
                                className="w-full text-center py-1.5 bg-[#F8FAFF] hover:bg-[#DCE7FF]/40 text-[#081B8C] font-semibold text-[11px] rounded-md transition-colors block cursor-pointer"
                              >
                                View All 8 Services
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer relative ${
                      isActive
                        ? 'text-[#081B8C] bg-[#DCE7FF]/40 font-semibold'
                        : 'text-[#111827] hover:text-[#081B8C] hover:bg-[#DCE7FF]/20'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2F6DFF]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Book Strategy Call Button (Right Side) */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => handleNavClick('contact')}
                className="cursor-pointer font-sans bg-linear-to-r from-[#081B8C] to-[#2F6DFF] text-white hover:from-[#2F6DFF] hover:to-[#A93DFF] px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md shadow-[#2F6DFF]/15 hover:shadow-lg hover:shadow-[#A93DFF]/20 flex items-center gap-2 group"
              >
                <span>Book Strategy Call</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-[#081B8C] focus:outline-none p-2 rounded-lg"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-[#DCE7FF] bg-white shadow-lg overflow-hidden"
            >
              <div className="px-4 pt-3 pb-6 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.page)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-base font-semibold ${
                      currentPage === item.page
                        ? 'bg-[#DCE7FF]/40 text-[#081B8C]'
                        : 'text-[#111827] hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 px-4">
                  <button
                    onClick={() => handleNavClick('contact')}
                    className="w-full text-center bg-linear-to-r from-[#081B8C] to-[#2F6DFF] text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <span>Book Strategy Call</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
