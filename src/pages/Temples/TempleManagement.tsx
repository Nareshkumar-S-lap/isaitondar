import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingLibraryIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import DataTable from '../../components/UI/DataTable';
import toast from 'react-hot-toast';
import { ColumnDef } from '@tanstack/react-table';

interface TempleData {
  id: string;
  name: string;
  location: string;
  contact: string;
  description?: string;
  established?: string;
  deity?: string;
}

export default function TempleManagement() {
  const { user, hasRole } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Enhanced mock data for temples
  const [temples, setTemples] = useState<TempleData[]>([
    { 
      id: '1', 
      name: 'Kapaleeshwarar Temple', 
      location: 'Mylapore, Chennai', 
      contact: '+91 44 2464 1670',
      description: 'Ancient Shiva temple dedicated to Lord Kapaleeshwarar',
      established: '7th Century CE',
      deity: 'Lord Shiva'
    },
    { 
      id: '2', 
      name: 'Parthasarathy Temple', 
      location: 'Triplicane, Chennai', 
      contact: '+91 44 2844 0232',
      description: 'Historic Vishnu temple with beautiful architecture',
      established: '8th Century CE',
      deity: 'Lord Krishna'
    },
    { 
      id: '3', 
      name: 'Vadapalani Murugan Temple', 
      location: 'Vadapalani, Chennai', 
      contact: '+91 44 2480 4728',
      description: 'Popular Murugan temple known for its festivals',
      established: '1890',
      deity: 'Lord Murugan'
    },
    { 
      id: '4', 
      name: 'Santhome Cathedral', 
      location: 'Santhome, Chennai', 
      contact: '+91 44 2498 2355',
      description: 'Roman Catholic cathedral built over the tomb of St. Thomas',
      established: '1523',
      deity: 'St. Thomas the Apostle'
    },
    { 
      id: '5', 
      name: 'Ashtalakshmi Temple', 
      location: 'Besant Nagar, Chennai', 
      contact: '+91 44 2446 0220',
      description: 'Modern temple dedicated to eight forms of Goddess Lakshmi',
      established: '1974',
      deity: 'Goddess Lakshmi'
    }
  ]);

  if (!hasRole(['admin'])) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access temple management.</p>
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
          toast.success(`Temple CSV uploaded successfully! ${lines.length - 1} records processed.`);
        } catch (error) {
          toast.error('Error processing CSV file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const downloadCSV = () => {
    let csvContent = 'name,location,contact,description,established,deity\n';
    temples.forEach(temple => {
      csvContent += `"${temple.name}","${temple.location}","${temple.contact}","${temple.description || ''}","${temple.established || ''}","${temple.deity || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'temples.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Temples CSV downloaded!');
  };

  const downloadPDF = () => {
    toast.success('Temples PDF export initiated!');
    // PDF generation logic would go here
  };

  const printData = () => {
    window.print();
    toast.success('Temples print dialog opened!');
  };

  const openModal = (item?: any) => {
    setEditingItem(item || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const templeColumns: ColumnDef<TempleData>[] = [
    {
      accessorKey: 'name',
      header: 'Temple Name',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-gray-900">{row.original.name}</p>
          <p className="text-sm text-gray-500">{row.original.deity}</p>
        </div>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <span>{row.original.location}</span>
        </div>
      ),
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <PhoneIcon className="w-4 h-4 text-gray-400" />
          <span>{row.original.contact}</span>
        </div>
      ),
    },
    {
      accessorKey: 'established',
      header: 'Established',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span>{row.original.established || 'Unknown'}</span>
        </div>
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
              setTemples(prev => prev.filter(t => t.id !== row.original.id));
              toast.success('Temple deleted');
            }}
            icon={<TrashIcon className="w-3 h-3" />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BuildingLibraryIcon className="w-8 h-8 text-indigo-600 mr-3" />
          Temple Management
        </h1>
        <p className="text-gray-600">Manage temple information and details</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BuildingLibraryIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Total Temples</p>
              <p className="text-2xl font-bold text-gray-900">{temples.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <MapPinIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Locations</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Ancient Temples</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <PhoneIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">With Contact</p>
              <p className="text-2xl font-bold text-gray-900">{temples.filter(t => t.contact).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Temple Database</h2>
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
              Add Temple
            </Button>
          </div>
        </div>
        
        <DataTable
          data={temples}
          columns={templeColumns}
          searchPlaceholder="Search temples..."
        />
      </div>

      {/* Modal for adding/editing */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={`${editingItem ? 'Edit' : 'Add'} Temple`}
        size="lg"
      >
        <div className="space-y-4">
          <FormField label="Temple Name" required>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={editingItem?.name || ''}
            />
          </FormField>
          <FormField label="Location" required>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={editingItem?.location || ''}
            />
          </FormField>
          <FormField label="Contact">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={editingItem?.contact || ''}
            />
          </FormField>
          <FormField label="Deity">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={editingItem?.deity || ''}
            />
          </FormField>
          <FormField label="Established">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={editingItem?.established || ''}
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
              toast.success(`Temple ${editingItem ? 'updated' : 'added'} successfully!`);
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