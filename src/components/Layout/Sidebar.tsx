import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, DollarSign, BookOpen, Settings, User, LogOut, X, ChevronDown, Sparkles, LibraryIcon as BuildingLibraryIcon, MusicIcon as MusicalNoteIcon, Users, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout, hasRole } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const navigationItems = [
    { 
      section: 'main',
      title: t('mainNavigation'),
      items: [
        { path: '/', icon: Home, label: t('dashboard'), roles: ['admin', 'organizer', 'member'] },
        { path: '/events', icon: Calendar, label: t('events'), roles: ['admin', 'organizer', 'member', 'guest'] },
        { path: '/expenses', icon: DollarSign, label: t('expenses'), roles: ['admin', 'organizer', 'member'] },
        { path: '/thevaram', icon: BookOpen, label: t('thevaram'), roles: ['admin', 'organizer', 'member', 'guest'] },
      ]
    },
    {
      section: 'temples',
      title: t('templeManagement'),
      items: [
        { path: '/temples', icon: BuildingLibraryIcon, label: t('temples'), roles: ['admin'] },
      ]
    },
    {
      section: 'instruments',
      title: t('instrumentManagement'),
      items: [
        { path: '/instruments', icon: MusicalNoteIcon, label: t('instruments'), roles: ['admin'] },
      ]
    },
    {
      section: 'admin',
      title: t('administration'),
      items: [
        { path: '/users', icon: Users, label: t('userManagement'), roles: ['admin'] },
        { path: '/access-control', icon: Shield, label: t('accessControl'), roles: ['admin'] },
        { path: '/maintenance', icon: Settings, label: t('maintenance'), roles: ['admin'] }
      ]
    }
  ];

  const toggleSection = (section: string) => {
    if (collapsed) return;
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Mobile overlay
  const MobileOverlay = () => (
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
    </AnimatePresence>
  );

  // Sidebar content
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full dark:bg-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-3" 
              onClick={isMobile ? onMobileClose : undefined}
            >
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              {(!collapsed || isMobile) && (
                <div>
                  <span className="text-white text-lg font-bold">IsaiThondar</span>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs text-indigo-200">{t('ancientMusic')}</span>
                  </div>
                </div>
              )}
            </Link>
            
            {isMobile && (
              <button
                onClick={onMobileClose}
                className="text-white hover:text-purple-200 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 dark:bg-gray-900">
        <nav className="space-y-1">
          {navigationItems.map((section) => {
            const visibleItems = section.items.filter(item => hasRole(item.roles));
            if (visibleItems.length === 0) return null;

            const isExpanded = expandedSections.includes(section.section);

            return (
              <div key={section.section} className="space-y-1">
                {!collapsed && (
                  <button
                    onClick={() => toggleSection(section.section)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                  >
                    <span>{section.title}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>
                )}

                <AnimatePresence>
                  {(isExpanded || collapsed) && (
                    <motion.div
                      initial={collapsed ? {} : { height: 0, opacity: 0 }}
                      animate={collapsed ? {} : { height: "auto", opacity: 1 }}
                      exit={collapsed ? {} : { height: 0, opacity: 0 }}
                      transition={{ duration: collapsed ? 0 : 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={`space-y-1 ${collapsed ? '' : 'ml-2'}`}>
                        {visibleItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={isMobile ? onMobileClose : undefined}
                              className={`group flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                              }`}
                              title={collapsed ? item.label : undefined}
                            >
                              <div className={`p-2 rounded-lg ${
                                isActive 
                                  ? 'bg-white/20' 
                                  : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-sm'
                              }`}>
                                <Icon className={`w-4 h-4 ${
                                  isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                }`} />
                              </div>
                              {(!collapsed || isMobile) && (
                                <>
                                  <span className="truncate">{item.label}</span>
                                  {isActive && (
                                    <motion.div
                                      layoutId="activeIndicator"
                                      className="ml-auto w-2 h-2 bg-white rounded-full"
                                    />
                                  )}
                                </>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* User Actions */}
        <div className="space-y-1">
          <Link
            to="/profile"
            onClick={isMobile ? onMobileClose : undefined}
            className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-xl transition-all duration-200 group"
            title={collapsed ? t('profile') : undefined}
          >
            <div className="p-1.5 bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800 rounded-lg transition-colors">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            </div>
            {(!collapsed || isMobile) && (
              <span className="text-sm font-medium">{t('profile')}</span>
            )}
          </Link>
          <button 
            onClick={() => {
              logout();
              if (isMobile) onMobileClose();
            }}
            className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 group"
            title={collapsed ? t('logout') : undefined}
          >
            <div className="p-1.5 bg-gray-100 dark:bg-gray-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 rounded-lg transition-colors">
              <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
            </div>
            {(!collapsed || isMobile) && (
              <span className="text-sm font-medium">{t('logout')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <MobileOverlay />
      
      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: mobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden"
      >
        <SidebarContent isMobile={true} />
      </motion.div>

      {/* Desktop Sidebar - Always Open */}
      <div className="hidden lg:flex flex-col bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700 w-80">
        <SidebarContent />
      </div>
    </>
  );
}