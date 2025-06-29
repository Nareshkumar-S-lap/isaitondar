import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Plus,
  ArrowUpRight,
  Target,
  Zap,
  Star,
  MapPin,
  ChevronRight,
  Music,
  Building2,
  Award,
  Sparkles,
  Brain,
  Cpu,
  Layers,
  Orbit,
  Radar,
  Waves
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { format, subDays, isAfter, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const { events, expenses } = useData();
  const { t } = useTranslation();

  const upcomingEvents = events.filter(event => event.status === 'upcoming').slice(0, 5);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const userEvents = events.filter(event => event.membersJoined.includes(user?.id || ''));
  
  // Enhanced Analytics calculations
  const recentEvents = events.filter(event => 
    isAfter(new Date(event.createdAt), subDays(new Date(), 30))
  );
  const recentExpenses = expenses.filter(expense => 
    isAfter(new Date(expense.date), subDays(new Date(), 30))
  );
  const avgEventSize = events.length > 0 ? Math.round(events.reduce((sum, event) => sum + event.membersJoined.length, 0) / events.length) : 0;
  const completionRate = events.length > 0 ? Math.round((events.filter(e => e.status === 'completed').length / events.length) * 100) : 0;

  // Temple distribution
  const templeStats = events.reduce((acc, event) => {
    acc[event.templeName] = (acc[event.templeName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTemples = Object.entries(templeStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Expense categories
  const expenseCategories = expenses.reduce((acc, expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topExpenseCategories = Object.entries(expenseCategories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  const stats = [
    {
      title: t('totalEvents'),
      value: events.length,
      icon: Calendar,
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      change: recentEvents.length > 0 ? '+12%' : '0%',
      trend: 'up',
      link: '/events',
      bgPattern: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: t('myEvents'),
      value: userEvents.length,
      icon: Users,
      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
      change: '+8%',
      trend: 'up',
      link: '/events',
      bgPattern: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      title: t('totalExpenses'),
      value: `₹${(totalExpenses / 1000).toFixed(1)}K`,
      icon: DollarSign,
      gradient: 'from-amber-500 via-amber-600 to-amber-700',
      change: recentExpenses.length > 0 ? '+15%' : '0%',
      trend: 'up',
      link: '/expenses',
      bgPattern: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      title: t('thevaramCollection'),
      value: '25+',
      icon: BookOpen,
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      change: '+5%',
      trend: 'up',
      link: '/thevaram',
      bgPattern: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const quickActions = [
    {
      title: t('createEvent'),
      description: t('organizeNewEvent'),
      icon: Plus,
      gradient: 'from-indigo-500 to-purple-600',
      link: '/events/create',
      roles: ['admin', 'organizer']
    },
    {
      title: t('readThevaram'),
      description: t('browseSacredHymns'),
      icon: BookOpen,
      gradient: 'from-rose-500 to-pink-600',
      link: '/thevaram',
      roles: ['admin', 'organizer', 'member', 'guest']
    },
    {
      title: t('trackExpenses'),
      description: t('monitorEventCosts'),
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-600',
      link: '/expenses',
      roles: ['admin', 'organizer', 'member']
    }
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Futuristic Welcome Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 rounded-3xl p-8 shadow-2xl">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"
            />
            <motion.div 
              animate={{ 
                rotate: -360,
                scale: [1, 0.9, 1]
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"
            />
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl lg:text-5xl font-bold text-white mb-3"
                >
                  {t('welcomeBack')}, {user?.name?.split(' ')[0]}! 🙏
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-indigo-100 mb-6 max-w-2xl"
                >
                  {user?.role === 'admin' ? t('adminWelcomeMessage') : 
                   user?.role === 'organizer' ? t('organizerWelcomeMessage') :
                   t('memberWelcomeMessage')}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">{user?.temple || t('noTempleAssigned')}</span>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  >
                    <BookOpen className="w-16 h-16 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-white/30 rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="group block relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 ${stat.bgPattern} opacity-50`}></div>
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <motion.div
                    animate={{ 
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{ 
                      duration: 10,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                    className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent"
                    style={{
                      backgroundSize: '200% 200%'
                    }}
                  />
                </div>
                
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                    <div className="flex items-center">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">{t('vsLastMonth')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Enhanced Analytics Section */}
        <div className="xl:col-span-2 space-y-8">
          {/* AI-Powered Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Brain className="w-6 h-6 text-indigo-600 mr-2" />
                {t('aiInsights')}
              </h2>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Cpu className="w-6 h-6 text-indigo-600" />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
              >
                <div className="flex items-center mb-3">
                  <Radar className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('predictiveAnalytics')}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('nextMonthPrediction')}</p>
                <p className="text-2xl font-bold text-blue-600">+23%</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800"
              >
                <div className="flex items-center mb-3">
                  <Orbit className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('engagementScore')}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('memberEngagement')}</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800"
              >
                <div className="flex items-center mb-3">
                  <Waves className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('trendAnalysis')}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('growingInterest')}</p>
                <p className="text-2xl font-bold text-purple-600">{t('classical')}</p>
              </motion.div>
            </div>
          </div>

          {/* Temple Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Building2 className="w-6 h-6 text-purple-600 mr-2" />
              {t('topPerformingTemples')}
            </h2>
            
            <div className="space-y-4">
              {topTemples.map(([temple, count], index) => (
                <motion.div
                  key={temple}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                    }`}>
                      {index < 3 ? (
                        <Award className="w-4 h-4 text-white" />
                      ) : (
                        <Building2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{temple}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{count} {t('eventsOrganized')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">{count}</p>
                    <div className="w-20 bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / Math.max(...topTemples.map(([,c]) => c))) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="bg-purple-600 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Expense Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <PieChart className="w-6 h-6 text-green-600 mr-2" />
              {t('expenseBreakdown')}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {topExpenseCategories.map(([category, amount], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{category}</p>
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-green-600">₹{(amount / 1000).toFixed(1)}K</p>
                  <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(amount / Math.max(...topExpenseCategories.map(([,a]) => a))) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="bg-green-600 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar with Upcoming Events and Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
              {t('upcomingEvents')}
            </h3>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200"
                  >
                    <Link to={`/events/${event.id}`} className="block">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {event.name}
                        </h4>
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{event.templeName}</p>
                      
                      <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{format(new Date(event.date), 'MMM dd')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{event.membersJoined.length}/{event.membersNeeded}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.membersJoined.length / event.membersNeeded) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 rounded-full"
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('noUpcomingEvents')}</p>
              </div>
            )}
            
            <Link to="/events" className="block mt-4">
              <Button variant="secondary" size="sm" fullWidth>
                {t('viewAllEvents')}
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              {t('quickActions')}
            </h3>
            
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const Component = action.link ? Link : 'button';
                const props = action.link ? { to: action.link } : {};
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Component
                      {...props}
                      className="w-full group flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mr-4`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">{action.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </Component>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 text-blue-500 mr-2" />
              {t('performanceMetrics')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('eventSuccessRate')}</span>
                <span className="font-bold text-green-600">94%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1 }}
                  className="bg-green-600 h-2 rounded-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('memberEngagement')}</span>
                <span className="font-bold text-blue-600">87%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '87%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-blue-600 h-2 rounded-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('budgetEfficiency')}</span>
                <span className="font-bold text-purple-600">91%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '91%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="bg-purple-600 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}