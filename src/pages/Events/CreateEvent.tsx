import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Event } from '../../types';
import RichTextEditor from '../../components/UI/RichTextEditor';

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

export default function CreateEvent() {
  const { user } = useAuth();
  const { addEvent } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    locationUrl: '',
    templeName: '',
    date: '',
    time: '',
    membersNeeded: 10,
    instruments: [] as string[],
    customInstrument: '',
    foodRequired: false,
    foodType: '',
    notes: '',
    guru: '',
    thevaramPathigam: [] as string[]
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const eventData: Omit<Event, 'id' | 'createdAt'> = {
        ...formData,
        membersJoined: [user.id],
        createdBy: user.id,
        status: 'upcoming'
      };
      
      addEvent(eventData);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstrumentToggle = (instrument: string) => {
    setFormData(prev => ({
      ...prev,
      instruments: prev.instruments.includes(instrument)
        ? prev.instruments.filter(i => i !== instrument)
        : [...prev.instruments, instrument]
    }));
  };

  const handleAddCustomInstrument = () => {
    if (formData.customInstrument.trim()) {
      setFormData(prev => ({
        ...prev,
        instruments: [...prev.instruments, prev.customInstrument.trim()],
        customInstrument: ''
      }));
    }
  };

  const handleRemoveInstrument = (instrument: string) => {
    setFormData(prev => ({
      ...prev,
      instruments: prev.instruments.filter(i => i !== instrument)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/events')}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('createEvent')}</h1>
          <p className="text-gray-600">Create a new temple event for the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('eventName')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Shivaratri Celebration"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('templeName')} *
              </label>
              <select
                required
                value={formData.templeName}
                onChange={(e) => setFormData(prev => ({ ...prev, templeName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select a temple</option>
                {TEMPLES.map(temple => (
                  <option key={temple} value={temple}>{temple}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('location')} *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Full address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location URL (Google Maps)
              </label>
              <input
                type="url"
                value={formData.locationUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, locationUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('membersNeeded')} *
              </label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={formData.membersNeeded}
                onChange={(e) => setFormData(prev => ({ ...prev, membersNeeded: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guru/Saint
              </label>
              <select
                value={formData.guru}
                onChange={(e) => setFormData(prev => ({ ...prev, guru: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select a guru</option>
                {GURUS.map(guru => (
                  <option key={guru} value={guru}>{guru}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('instruments')}
              </label>
              
              {/* Common Instruments */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {COMMON_INSTRUMENTS.map(instrument => (
                  <label key={instrument} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.instruments.includes(instrument)}
                      onChange={() => handleInstrumentToggle(instrument)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{instrument}</span>
                  </label>
                ))}
              </div>

              {/* Custom Instrument */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.customInstrument}
                  onChange={(e) => setFormData(prev => ({ ...prev, customInstrument: e.target.value }))}
                  placeholder="Add custom instrument"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomInstrument}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Selected Instruments */}
              {formData.instruments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Selected instruments:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.instruments.map(instrument => (
                      <span
                        key={instrument}
                        className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                      >
                        {instrument}
                        <button
                          type="button"
                          onClick={() => handleRemoveInstrument(instrument)}
                          className="ml-2 text-orange-600 hover:text-orange-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Food Requirements */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.foodRequired}
                  onChange={(e) => setFormData(prev => ({ ...prev, foodRequired: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">{t('foodRequired')}</span>
              </label>
              
              {formData.foodRequired && (
                <input
                  type="text"
                  value={formData.foodType}
                  onChange={(e) => setFormData(prev => ({ ...prev, foodType: e.target.value }))}
                  placeholder="e.g., Prasadam, Breakfast, Lunch"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('notes')}
              </label>
              <RichTextEditor
                value={formData.notes}
                onChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
                placeholder="Additional notes, dress code, special instructions..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? t('loading') : t('createEvent')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}