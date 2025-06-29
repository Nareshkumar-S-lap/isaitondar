import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingLibraryIcon,
  KeyIcon,
  CameraIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Save, Globe, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import FormField from '../../components/UI/FormField';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  temple: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      temple: user?.temple || '',
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      // Here you would update the user profile
      toast.success(t('profileUpdated'));
    } catch (error) {
      toast.error(t('profileUpdateFailed'));
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      // Here you would update the password
      toast.success(t('passwordUpdated'));
      passwordForm.reset();
    } catch (error) {
      toast.error(t('passwordUpdateFailed'));
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    toast.success(t('languageChanged'));
  };

  const tabs = [
    { id: 'profile', name: t('profileInformation'), icon: UserIcon },
    { id: 'security', name: t('security'), icon: KeyIcon },
    { id: 'settings', name: t('settings'), icon: Globe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          className="mr-4"
        >
          {t('backToDashboard')}
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('profileSettings')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('manageAccountSettings')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{t('profileInformation')}</h2>
          
          {/* Avatar Section */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-white" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <CameraIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('clickCameraToUpdate')}
              </p>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                label={t('fullName')} 
                error={profileForm.formState.errors.name?.message} 
                required
              >
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...profileForm.register('name')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder={t('enterFullName')}
                  />
                </div>
              </FormField>

              <FormField 
                label={t('emailAddress')} 
                error={profileForm.formState.errors.email?.message} 
                required
              >
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...profileForm.register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder={t('enterEmail')}
                  />
                </div>
              </FormField>

              <FormField 
                label={t('phoneNumber')} 
                error={profileForm.formState.errors.phone?.message}
              >
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...profileForm.register('phone')}
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder={t('enterPhoneNumber')}
                  />
                </div>
              </FormField>

              <FormField 
                label={t('primaryTemple')} 
                error={profileForm.formState.errors.temple?.message}
              >
                <div className="relative">
                  <BuildingLibraryIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...profileForm.register('temple')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder={t('enterPrimaryTemple')}
                  />
                </div>
              </FormField>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                icon={<Save className="w-4 h-4" />}
              >
                {t('saveChanges')}
              </Button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{t('securitySettings')}</h2>
          
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
            <FormField 
              label={t('currentPassword')} 
              error={passwordForm.formState.errors.currentPassword?.message} 
              required
            >
              <input
                {...passwordForm.register('currentPassword')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder={t('enterCurrentPassword')}
              />
            </FormField>

            <FormField 
              label={t('newPassword')} 
              error={passwordForm.formState.errors.newPassword?.message} 
              required
            >
              <input
                {...passwordForm.register('newPassword')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder={t('enterNewPassword')}
              />
            </FormField>

            <FormField 
              label={t('confirmNewPassword')} 
              error={passwordForm.formState.errors.confirmPassword?.message} 
              required
            >
              <input
                {...passwordForm.register('confirmPassword')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder={t('confirmNewPassword')}
              />
            </FormField>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">{t('passwordRequirements')}:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                <li>• {t('atLeast6Characters')}</li>
                <li>• {t('includeLettersNumbers')}</li>
                <li>• {t('useUniquePassword')}</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                icon={<Save className="w-4 h-4" />}
              >
                {t('updatePassword')}
              </Button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{t('applicationSettings')}</h2>
          
          <div className="space-y-6">
            {/* Language Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                {t('language')}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { code: 'en', label: 'English', name: 'English' },
                  { code: 'ta', label: 'தமிழ்', name: 'Tamil' },
                  { code: 'hi', label: 'हिंदी', name: 'Hindi' }
                ].map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      i18n.language === lang.code 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                    title={lang.name}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                {isDarkMode ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
                {t('theme')}
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 text-white border border-gray-600'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {isDarkMode ? (
                    <>
                      <Moon className="w-5 h-5" />
                      <span>{t('darkMode')}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-5 h-5" />
                      <span>{t('lightMode')}</span>
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isDarkMode ? t('darkModeEnabled') : t('lightModeEnabled')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}