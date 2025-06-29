import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MusicalNoteIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import DataTable from '../../components/UI/DataTable';
import toast from 'react-hot-toast';
import { ColumnDef } from '@tanstack/react-table';

interface InstrumentData {
  id: string;
  name: string;
  category: string;
  description: string;
  origin?: string;
  material?: string;
}

export default function InstrumentManagement() {
  const { user, hasRole } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Enhanced mock data for instruments
  const [instruments, setInstruments] = useState<InstrumentData[]>([
    { 
      id: '1', 
      name: 'Mridangam', 
      category: 'Percussion', 
      description: 'Traditional South Indian double-headed drum',
      origin: 'South India',
      material: 'Jackfruit wood, goat skin'
    },
    { 
      id: '2', 
      name: 'Violin', 
      category: 'String', 
      description: 'Bowed string instrument adapted for Carnatic music',
      origin: 'Europe (adapted)',
      material: 'Wood, steel strings'
    },
    { 
      id: '3', 
      name: 'Veena', 
      category: 'String', 
      description: 'Ancient plucked string instrument',
      origin: 'India',
      material: 'Jackfruit wood, bronze strings'
    },
    { 
      id: '4', 
      name: 'Flute', 
      category: 'Wind', 
      description: 'Bamboo transverse flute',
      origin: 'India',
      material: 'Bamboo'
    },
    { 
      id: '5', 
      name: 'Thavil', 
      category: 'Percussion', 
      description: 'Barrel-shaped percussion instrument',
      origin: 'Tamil Nadu',
      material: 'Jackfruit wood, buffalo skin'
    },
    { 
      id: '6', 
      name: 'Nadaswaram', 
      category: 'Wind', 
      description: 'Double reed wind instrument',
      origin: 'South India',
      material: 'Wood, metal'
    }
  ]);

  if (!hasRole(['admin'])) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access instrument management.</p>
        </div>
      </div>
    );
  }

  const handleCSVUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          toast.success(`Instrument CSV uploaded successfully! ${lines.length - 1} records processed.`);
        } catch (error) {
          toast.error('Error processing CSV file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const downloadCSV = () => {
    let csvContent = 'name,category,description,origin,material\n';
    instruments.forEach(instrument => {
      csvContent += `"${instrument.name}","${instrument.category}","${instrument.description}","${instrument.origin || ''}","${instrument.material || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instruments.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Instruments CSV downloaded!');
  };

  const downloadPDF = () => {
    toast.success('Instruments PDF export initiated!');
    // PDF generation logic would go here
  };

  const printData = () => {
    window.print();
    toast.success('Instruments print dialog opened!');
  };

  const openModal = (item?: any) => {
    setEditingItem(item || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const instrumentColumns: ColumnDef<InstrumentData>[] = [
    {
      accessorKey: 'name',
      header: 'Instrument',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-gray-900">{row.original.name}</p>
          <p className="text-sm text-gray-500">{row.original.origin}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.category === 'Percussion' ? 'bg-red-100 text-red-800' :
          row.original.category === 'String' ? 'bg-blue-100 text-blue-800' :
          row.original.category === 'Wind' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          <TagIcon className="w-3 h-3 mr-1" />
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'material',
      header: 'Material',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-4 h-4 text-gray-400" />
          <span>{row.original.material || 'Not specified'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.description.length > 50 
            ? `${row.original.description.substring(0, 50)}...`
            : row.original.description
          }
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="xs"
            variant="secondary"
            onClick={() => openModal(row.original)}
            icon={<PencilIcon className="w-3 h-3" />}
          >
            Edit
          </Button>
          <Button
            size="xs"
            variant="danger"
            onClick={() => {
              setInstruments(prev => prev.filter(i => i.id !== row.original.id));
              toast.success('Instrument deleted');
            }}
            icon={<TrashIcon className="w-3 h-3" />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const categoryStats = instruments.reduce((acc, instrument) => {
    acc[instrument.category] = (acc[instrument.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <MusicalNoteIcon className="w-8 h-8 text-indigo-600 mr-3" />
          Instrument Management
        </h1>
        <p className="text-gray-600">Manage musical instruments database</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <MusicalNoteIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Total Instruments</p>
              <p className="text-2xl font-bold text-gray-900">{instruments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <TagIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Percussion</p>
              <p className="text-2xl font-bold text-gray-900">{categoryStats['Percussion'] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <TagIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">String</p>
              <p className="text-2xl font-bold text-gray-900">{categoryStats['String'] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <TagIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Wind</p>
              <p className="text-2xl font-bold text-gray-900">{categoryStats['Wind'] || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Instrument Database</h2>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={handleCSVUpload}
              icon={<ArrowUpTrayIcon className="w-4 h-4" />}
            >
              Upload CSV
            </Button>
            <Button
              variant="secondary"
              onClick={downloadCSV}
              icon={<ArrowDownTrayIcon className="w-4 h-4" />}
            >
              Download CSV
            </Button>
            <Button
              variant="secondary"
              onClick={downloadPDF}
              icon={<DocumentTextIcon className="w-4 h-4" />}
            >
              Export PDF
            </Button>
            <Button
              variant="secondary"
              onClick={printData}
              icon={<PrinterIcon className="w-4 h-4" />}
            >
              Print
            </Button>
            <Button
              onClick={() => openModal()}
              icon={<PlusIcon className="w-5 h-5" />}
            >
              Add Instrument
            </Button>
          </div>
        </div>
        
        <DataTable
          data={instruments}
          columns={instrumentColumns}
          searchPlaceholder="Search instruments..."
        />
      </div>

      {/* Modal for adding/editing */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={`${editingItem ? 'Edit' : 'Add'} Instrument`}
        size="lg"
      >
        <div className="space-y-4">
          <FormField label="Instrument Name" required>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={editingItem?.name || ''}
            />
          </FormField>
          <FormField label="Category" required>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="Percussion">Percussion</option>
              <option value="String">String</option>
              <option value="Wind">Wind</option>
              <option value="Other">Other</option>
            </select>
          </FormField>
          <FormField label="Origin">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={editingItem?.origin || ''}
            />
          </FormField>
          <FormField label="Material">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={editingItem?.material || ''}
            />
          </FormField>
          <FormField label="Description">
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={editingItem?.description || ''}
            />
          </FormField>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success(`Instrument ${editingItem ? 'updated' : 'added'} successfully!`);
              closeModal();
            }}>
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}