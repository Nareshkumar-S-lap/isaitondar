import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', icon: Home, label: t('dashboard'), roles: ['admin', 'organizer', 'member'] },
    { path: '/events', icon: Calendar, label: t('events'), roles: ['admin', 'organizer', 'member', 'guest'] },
    { path: '/expenses', icon: DollarSign, label: t('expenses'), roles: ['admin', 'organizer', 'member'] },
    { path: '/thevaram', icon: BookOpen, label: t('thevaram'), roles: ['admin', 'organizer', 'member', 'guest'] },
    { path: '/maintenance', icon: Settings, label: t('maintenance'), roles: ['admin'] }
  ];

  const visibleItems = navigationItems.filter(item => hasRole(item.roles));

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-white text-xl font-bold">IsaiThondar</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-white hover:text-purple-200 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-sm">{i18n.language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-t-xl">English</button>
                <button onClick={() => changeLanguage('ta')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">தமிழ்</button>
                <button onClick={() => changeLanguage('hi')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-b-xl">हिंदी</button>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-white hover:text-purple-200 transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm">{user?.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link to="/profile" className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 rounded-t-xl">
                  <User className="w-4 h-4" />
                  <span>{t('profile')}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 rounded-b-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-purple-200 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-700/90 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-indigo-600'
                      : 'text-white hover:bg-white/20'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-indigo-600 pt-3">
              <button 
                onClick={logout}
                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-white hover:bg-white/20 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}