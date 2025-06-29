import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/UI/Button';
import FormField from '../../components/UI/FormField';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  location: z.string().min(1, 'Location is required'),
  locationUrl: z.string().url().optional().or(z.literal('')),
  templeName: z.string().min(1, 'Temple name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  membersNeeded: z.number().min(1, 'At least 1 member is required'),
  foodRequired: z.boolean(),
  foodType: z.string().optional(),
  notes: z.string().optional(),
  guru: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const COMMON_INSTRUMENTS = [
  'Mridangam', 'Violin', 'Veena', 'Flute', 'Thavil', 'Nadaswaram', 
  'Ghatam', 'Kanjira', 'Tabla', 'Harmonium', 'Sitar', 'Tambura'
];

const TEMPLES = [
  'Kapaleeshwarar Temple', 'Parthasarathy Temple', 'Vadapalani Murugan Temple',
  'Santhome Cathedral', 'Ashtalakshmi Temple', 'Mundakakanni Amman Temple'
];

const GURUS = [
  'Thirugnana Sambandar', 'Appar', 'Sundarar', 'Manikkavacakar'
];

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { events, updateEvent } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [instruments, setInstruments] = useState<string[]>([]);
  const [customInstrument, setCustomInstrument] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const event = events.find(e => e.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      name: event.name,
      location: event.location,
      locationUrl: event.locationUrl || '',
      templeName: event.templeName,
      date: event.date,
      time: event.time,
      membersNeeded: event.membersNeeded,
      foodRequired: event.foodRequired,
      foodType: event.foodType || '',
      notes: event.notes || '',
      guru: event.guru || '',
    } : undefined
  });

  const watchFoodRequired = watch('foodRequired');

  useEffect(() => {
    if (event) {
      setInstruments(event.instruments);
    }
  }, [event]);

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

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/events')}
            className="mt-4"
          >
            Back to Events
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

  const onSubmit = async (data: EventFormData) => {
    try {
      updateEvent(event.id, {
        ...data,
        instruments,
      });
      toast.success('Event updated successfully!');
      navigate('/events');
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const handleInstrumentToggle = (instrument: string) => {
    setInstruments(prev => 
      prev.includes(instrument)
        ? prev.filter(i => i !== instrument)
        : [...prev, instrument]
    );
  };

  const handleAddCustomInstrument = () => {
    if (customInstrument.trim() && !instruments.includes(customInstrument.trim())) {
      setInstruments(prev => [...prev, customInstrument.trim()]);
      setCustomInstrument('');
    }
  };

  const handleRemoveInstrument = (instrument: string) => {
    setInstruments(prev => prev.filter(i => i !== instrument));
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
          onClick={() => handleNavigation('/events')}
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          className="mr-4"
        >
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600">Update event details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Event Name" error={errors.name?.message} required>
              <input
                {...register('name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="e.g., Shivaratri Celebration"
              />
            </FormField>

            <FormField label="Temple Name" error={errors.templeName?.message} required>
              <select
                {...register('templeName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="">Select a temple</option>
                {TEMPLES.map(temple => (
                  <option key={temple} value={temple}>{temple}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Location" error={errors.location?.message} required>
              <input
                {...register('location')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Full address"
              />
            </FormField>

            <FormField label="Location URL" error={errors.locationUrl?.message}>
              <input
                {...register('locationUrl')}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="https://maps.google.com/..."
              />
            </FormField>

            <FormField label="Date" error={errors.date?.message} required>
              <input
                {...register('date')}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </FormField>

            <FormField label="Time" error={errors.time?.message} required>
              <input
                {...register('time')}
                type="time"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </FormField>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Details</h2>
          
          <div className="space-y-6">
            <FormField label="Members Needed" error={errors.membersNeeded?.message} required>
              <input
                {...register('membersNeeded', { valueAsNumber: true })}
                type="number"
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </FormField>

            <FormField label="Guru/Saint">
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

            {/* Instruments */}
            <FormField label="Instruments">
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {COMMON_INSTRUMENTS.map(instrument => (
                    <label key={instrument} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={instruments.includes(instrument)}
                        onChange={() => handleInstrumentToggle(instrument)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{instrument}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInstrument}
                    onChange={(e) => setCustomInstrument(e.target.value)}
                    placeholder="Add custom instrument"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomInstrument())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCustomInstrument}
                    icon={<PlusIcon className="w-4 h-4" />}
                    disabled={!customInstrument.trim()}
                  >
                    Add
                  </Button>
                </div>

                {instruments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Selected instruments:</p>
                    <div className="flex flex-wrap gap-2">
                      {instruments.map(instrument => (
                        <motion.span
                          key={instrument}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                        >
                          {instrument}
                          <button
                            type="button"
                            onClick={() => handleRemoveInstrument(instrument)}
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
            </FormField>

            {/* Food Requirements */}
            <FormField label="Food Requirements">
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    {...register('foodRequired')}
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Food required for this event</span>
                </label>
                
                {watchFoodRequired && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <input
                      {...register('foodType')}
                      placeholder="e.g., Prasadam, Breakfast, Lunch"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </motion.div>
                )}
              </div>
            </FormField>

            <FormField label="Notes">
              <textarea
                {...register('notes')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Additional notes, dress code, special instructions..."
              />
            </FormField>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleNavigation('/events')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={<Save className="w-4 h-4" />}
          >
            Update Event
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