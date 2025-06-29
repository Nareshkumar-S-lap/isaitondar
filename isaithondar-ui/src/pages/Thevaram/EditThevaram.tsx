import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, BookOpenIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/UI/Button';
import FormField from '../../components/UI/FormField';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

const thevaramSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleTamil: z.string().min(1, 'Tamil title is required'),
  content: z.string().min(1, 'English content is required'),
  contentTamil: z.string().min(1, 'Tamil content is required'),
  transliteration: z.string().min(1, 'Transliteration is required'),
  guru: z.string().optional(),
  category: z.enum(['thevaram', 'guru-pathigam']),
  audioUrl: z.string().url().optional().or(z.literal('')),
});

type ThevaramFormData = z.infer<typeof thevaramSchema>;

const GURUS = [
  'Thirugnana Sambandar',
  'Appar',
  'Sundarar',
  'Manikkavacakar'
];

const COMMON_TAGS = [
  'devotional',
  'shiva',
  'classical',
  'temple',
  'prayer',
  'meditation',
  'festival',
  'morning',
  'evening'
];

export default function EditThevaram() {
  const { id } = useParams<{ id: string }>();
  const { user, hasRole } = useAuth();
  const { pathigams, updatePathigam } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const pathigam = pathigams.find(p => p.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset
  } = useForm<ThevaramFormData>({
    resolver: zodResolver(thevaramSchema),
    defaultValues: pathigam ? {
      title: pathigam.title,
      titleTamil: pathigam.titleTamil,
      content: pathigam.content,
      contentTamil: pathigam.contentTamil,
      transliteration: pathigam.transliteration,
      guru: pathigam.guru || '',
      category: pathigam.category,
      audioUrl: pathigam.audioUrl || '',
    } : undefined
  });

  const watchCategory = watch('category');

  useEffect(() => {
    if (pathigam) {
      setTags(pathigam.tags || []);
    }
  }, [pathigam]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (!pathigam) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Thevaram entry not found</h1>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/thevaram')}
            className="mt-4"
          >
            Back to Thevaram
          </Button>
        </div>
      </div>
    );
  }

  // Check permissions
  if (!hasRole(['admin', 'organizer'])) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to edit Thevaram entries.</p>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/thevaram')}
            className="mt-4"
          >
            Back to Thevaram
          </Button>
        </div>
      </div>
    );
  }

  const handleNavigation = (path: string) => {
    if (isDirty) {
      setPendingNavigation(path);
      setShowConfirmDialog(true);
    } else {
      navigate(path);
    }
  };

  const confirmNavigation = () => {
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setShowConfirmDialog(false);
    setPendingNavigation(null);
  };

  const onSubmit = async (data: ThevaramFormData) => {
    try {
      const updatedPathigam = {
        ...data,
        tags,
        audioUrl: data.audioUrl || undefined
      };
      
      updatePathigam(pathigam.id, updatedPathigam);
      toast.success('Thevaram entry updated successfully!');
      navigate('/thevaram');
    } catch (error) {
      toast.error('Failed to update Thevaram entry');
    }
  };

  const handleTagToggle = (tag: string) => {
    setTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/thevaram')}
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          className="mr-4"
        >
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Thevaram Entry</h1>
          <p className="text-gray-600">Update sacred hymn or pathigam details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <BookOpenIcon className="w-6 h-6 text-orange-600 mr-2" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Title (English)" error={errors.title?.message} required>
              <input
                {...register('title')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="e.g., Thiruvasagam - First Pathigam"
              />
            </FormField>

            <FormField label="Title (Tamil)" error={errors.titleTamil?.message} required>
              <input
                {...register('titleTamil')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="e.g., திருவாசகம் - முதல் பதிகம்"
                style={{ fontFamily: 'serif' }}
              />
            </FormField>

            <FormField label="Category" error={errors.category?.message} required>
              <select
                {...register('category')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="thevaram">Thevaram</option>
                <option value="guru-pathigam">Guru Pathigam</option>
              </select>
            </FormField>

            <FormField label="Guru/Saint" error={errors.guru?.message}>
              <select
                {...register('guru')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="">Select a guru</option>
                {GURUS.map(guru => (
                  <option key={guru} value={guru}>{guru}</option>
                ))}
              </select>
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Audio URL" error={errors.audioUrl?.message}>
                <input
                  {...register('audioUrl')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="https://example.com/audio.mp3"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Content</h2>
          
          <div className="space-y-6">
            <FormField label="Tamil Content" error={errors.contentTamil?.message} required>
              <textarea
                {...register('contentTamil')}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Enter the Tamil text of the pathigam..."
                style={{ fontFamily: 'serif' }}
              />
            </FormField>

            <FormField label="Transliteration" error={errors.transliteration?.message} required>
              <textarea
                {...register('transliteration')}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Enter the transliteration in English..."
              />
            </FormField>

            <FormField label="English Translation" error={errors.content?.message} required>
              <textarea
                {...register('content')}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Enter the English translation..."
              />
            </FormField>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tags</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {COMMON_TAGS.map(tag => (
                <label key={tag} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{tag}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add custom tag"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
              />
              <Button
                type="button"
                onClick={handleAddCustomTag}
                icon={<PlusIcon className="w-4 h-4" />}
                disabled={!customTag.trim()}
              >
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleNavigation('/thevaram')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={<Save className="w-4 h-4" />}
          >
            Update Entry
          </Button>
        </div>
      </form>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmNavigation}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        type="warning"
      />
    </motion.div>
  );
}