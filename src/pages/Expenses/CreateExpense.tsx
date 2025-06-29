import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/UI/Button';
import FormField from '../../components/UI/FormField';

const expenseSchema = z.object({
  eventId: z.string().min(1, 'Event is required'),
  type: z.string().min(1, 'Expense type is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const EXPENSE_TYPES = [
  'Food & Catering',
  'Transportation',
  'Instruments Rental',
  'Decorations',
  'Sound System',
  'Venue Charges',
  'Printing & Materials',
  'Miscellaneous'
];

export default function CreateExpense() {
  const { user } = useAuth();
  const { events, addExpense } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const preselectedEventId = location.state?.eventId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      eventId: preselectedEventId || '',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const selectedEventId = watch('eventId');
  const selectedEvent = events.find(e => e.id === selectedEventId);

  const onSubmit = async (data: ExpenseFormData) => {
    if (!user) return;

    try {
      addExpense({
        ...data,
        paidBy: user.id,
        reimbursed: false
      });
      toast.success('Expense added successfully!');
      navigate('/expenses');
    } catch (error) {
      toast.error('Failed to add expense');
    }
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
          onClick={() => navigate('/expenses')}
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          className="mr-4"
        >
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Expense</h1>
          <p className="text-gray-600">Record a new event expense</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Expense Information */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <ReceiptPercentIcon className="w-6 h-6 text-orange-600 mr-2" />
            Expense Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Event" error={errors.eventId?.message} required>
              <select
                {...register('eventId')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="">Select an event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {event.templeName}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Expense Type" error={errors.type?.message} required>
              <select
                {...register('type')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="">Select expense type</option>
                {EXPENSE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Amount (₹)" error={errors.amount?.message} required>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="0.00"
              />
            </FormField>

            <FormField label="Date" error={errors.date?.message} required>
              <input
                {...register('date')}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Description" error={errors.description?.message}>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Additional details about this expense..."
                />
              </FormField>
            </div>
          </div>

          {/* Event Preview */}
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg"
            >
              <h3 className="font-semibold text-orange-900 mb-2">Selected Event</h3>
              <div className="text-sm text-orange-800">
                <p><strong>Name:</strong> {selectedEvent.name}</p>
                <p><strong>Temple:</strong> {selectedEvent.templeName}</p>
                <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/expenses')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={<Save className="w-4 h-4" />}
          >
            Add Expense
          </Button>
        </div>
      </form>
    </motion.div>
  );
}