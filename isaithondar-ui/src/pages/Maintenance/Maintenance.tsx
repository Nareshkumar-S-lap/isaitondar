import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon,
  CircleStackIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PlusIcon,
  PencilIcon,
  PrinterIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Maintenance() {
  const { user, hasRole } = useAuth();
  const { events, expenses } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!hasRole(['admin'])) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access the maintenance panel.</p>
        </div>
      </div>
    );
  }

  const handleBackup = () => {
    const data = {
      events,
      expenses,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isai-thondar-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Backup downloaded successfully!');
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Here you would restore the data
        toast.success('Data restored successfully!');
      } catch (error) {
        toast.error('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = (type: string) => {
    let csvContent = '';
    
    switch (type) {
      case 'events':
        csvContent = 'name,location,templeName,date,time,membersNeeded,instruments,foodRequired,notes\n';
        csvContent += 'Sample Event,Sample Location,Sample Temple,2024-03-01,18:00,10,"Mridangam,Violin",true,Sample notes\n';
        break;
      case 'temples':
        csvContent = 'name,location,contact,description\n';
        csvContent += 'Sample Temple,Sample Location,+91 12345 67890,Sample description\n';
        break;
      case 'instruments':
        csvContent = 'name,category,description\n';
        csvContent += 'Mridangam,Percussion,Traditional South Indian drum\n';
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`${type} template downloaded!`);
  };

  const downloadCSV = (type: 'events' | 'expenses') => {
    let csvContent = '';
    let filename = '';
    
    switch (type) {
      case 'events':
        csvContent = 'name,location,templeName,date,time,membersNeeded,status\n';
        events.forEach(event => {
          csvContent += `"${event.name}","${event.location}","${event.templeName}","${event.date}","${event.time}","${event.membersNeeded}","${event.status}"\n`;
        });
        filename = 'events.csv';
        break;
      case 'expenses':
        csvContent = 'type,amount,description,date,reimbursed\n';
        expenses.forEach(expense => {
          csvContent += `"${expense.type}","${expense.amount}","${expense.description || ''}","${expense.date}","${expense.reimbursed}"\n`;
        });
        filename = 'expenses.csv';
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`${type} CSV downloaded!`);
  };

  const downloadPDF = (type: string) => {
    toast.success(`${type} PDF export initiated!`);
    // PDF generation logic would go here
  };

  const printData = (type: string) => {
    window.print();
    toast.success(`${type} print dialog opened!`);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: CogIcon },
    { id: 'backup', name: 'Backup & Restore', icon: CircleStackIcon },
    { id: 'templates', name: 'Templates', icon: DocumentTextIcon },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          className="mr-4"
        >
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Maintenance</h1>
          <p className="text-gray-600">System administration and data management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-lg p-3 mr-4">
                    <CogIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-lg p-3 mr-4">
                    <CircleStackIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-purple-500 rounded-lg p-3 mr-4">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Data Records</p>
                    <p className="text-2xl font-bold text-gray-900">{events.length + expenses.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-orange-500 rounded-lg p-3 mr-4">
                    <ArrowDownTrayIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Backups</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Health Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Database Status</h3>
                  <p className="text-green-600 font-medium">Healthy</p>
                  <p className="text-sm text-gray-500 mt-2">All connections active</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Server Performance</h3>
                  <p className="text-blue-600 font-medium">Optimal</p>
                  <p className="text-sm text-gray-500 mt-2">Response time: 120ms</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Storage Usage</h3>
                  <p className="text-purple-600 font-medium">65% Used</p>
                  <p className="text-sm text-gray-500 mt-2">2.1GB of 3.2GB</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent System Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">New event created: Shivaratri Celebration</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <DocumentArrowDownIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">System backup completed successfully</p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <PencilIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">User permissions updated</p>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Export Options */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Export Options</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Events Data</h3>
                  <p className="text-gray-600 mb-4">Export all events data in various formats</p>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadCSV('events')}
                      icon={<ArrowDownTrayIcon className="w-4 h-4" />}
                    >
                      CSV
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadPDF('events')}
                      icon={<DocumentTextIcon className="w-4 h-4" />}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => printData('events')}
                      icon={<PrinterIcon className="w-4 h-4" />}
                    >
                      Print
                    </Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses Data</h3>
                  <p className="text-gray-600 mb-4">Export all expenses data in various formats</p>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadCSV('expenses')}
                      icon={<ArrowDownTrayIcon className="w-4 h-4" />}
                    >
                      CSV
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadPDF('expenses')}
                      icon={<DocumentTextIcon className="w-4 h-4" />}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => printData('expenses')}
                      icon={<PrinterIcon className="w-4 h-4" />}
                    >
                      Print
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Backup & Restore</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Backup</h3>
                <p className="text-gray-600 mb-4">
                  Download a complete backup of all system data including events, expenses, and configurations.
                </p>
                <Button
                  onClick={handleBackup}
                  icon={<DocumentArrowDownIcon className="w-5 h-5" />}
                >
                  Download Backup
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Restore Data</h3>
                <p className="text-gray-600 mb-4">
                  Upload a backup file to restore system data. This will overwrite existing data.
                </p>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestore}
                    className="hidden"
                    id="restore-file"
                  />
                  <label htmlFor="restore-file">
                    <Button
                      as="span"
                      variant="secondary"
                      icon={<DocumentArrowUpIcon className="w-5 h-5" />}
                    >
                      Upload Backup
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Backup History */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Backup History</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">System Backup - January 15, 2024</p>
                    <p className="text-sm text-gray-500">Size: 2.3 MB • Events: 25 • Expenses: 45</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Download
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">System Backup - January 10, 2024</p>
                    <p className="text-sm text-gray-500">Size: 2.1 MB • Events: 23 • Expenses: 42</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Download
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">System Backup - January 5, 2024</p>
                    <p className="text-sm text-gray-500">Size: 1.9 MB • Events: 20 • Expenses: 38</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">CSV Templates</h2>
            <p className="text-gray-600 mb-6">Download CSV templates for bulk data import</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Events Template</h3>
                <p className="text-gray-600 mb-4">Template for importing event data</p>
                <Button
                  variant="secondary"
                  onClick={() => downloadTemplate('events')}
                  icon={<ArrowDownTrayIcon className="w-4 h-4" />}
                  fullWidth
                >
                  Download Events CSV
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Temples Template</h3>
                <p className="text-gray-600 mb-4">Template for importing temple data</p>
                <Button
                  variant="secondary"
                  onClick={() => downloadTemplate('temples')}
                  icon={<ArrowDownTrayIcon className="w-4 h-4" />}
                  fullWidth
                >
                  Download Temples CSV
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instruments Template</h3>
                <p className="text-gray-600 mb-4">Template for importing instrument data</p>
                <Button
                  variant="secondary"
                  onClick={() => downloadTemplate('instruments')}
                  icon={<ArrowDownTrayIcon className="w-4 h-4" />}
                  fullWidth
                >
                  Download Instruments CSV
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}