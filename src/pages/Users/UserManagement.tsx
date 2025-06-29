import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import DataTable from '../../components/UI/DataTable';
import toast from 'react-hot-toast';
import { ColumnDef } from '@tanstack/react-table';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'member' | 'guest';
  phone?: string;
  temple?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
}

export default function UserManagement() {
  const { user: currentUser, hasRole } = useAuth();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ravi Kumar',
      email: 'admin@isai.com',
      role: 'admin',
      phone: '+91 98765 43210',
      temple: 'Kapaleeshwarar Temple',
      status: 'active',
      lastLogin: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Priya Devi',
      email: 'organizer@isai.com',
      role: 'organizer',
      phone: '+91 98765 43211',
      temple: 'Parthasarathy Temple',
      status: 'active',
      lastLogin: '2024-01-14T15:30:00Z',
      createdAt: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },

     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
     {
      id: '3',
      name: 'Murugan Bala',
      email: 'member@isai.com',
      role: 'member',
      phone: '+91 98765 43212',
      temple: 'Vadapalani Murugan Temple',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '4',
      name: 'Lakshmi Priya',
      email: 'lakshmi@example.com',
      role: 'member',
      phone: '+91 98765 43213',
      temple: 'Kapaleeshwarar Temple',
      status: 'pending',
      createdAt: '2024-01-14T00:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; userId?: string }>({ isOpen: false });

  if (!hasRole(['admin'])) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access user management.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'member',
      phone: userData.phone,
      temple: userData.temple,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    toast.success('User created successfully!');
    setShowUserModal(false);
  };

  const handleUpdateUser = (userId: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    toast.success('User updated successfully!');
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success('User deleted successfully!');
    setDeleteConfirm({ isOpen: false });
  };

  const handleStatusChange = (userId: string, status: User['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
    toast.success(`User status updated to ${status}!`);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.original.name}</p>
            <p className="text-sm text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.role === 'admin' ? 'bg-red-100 text-red-800' :
          row.original.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
          row.original.role === 'member' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          <Shield className="w-3 h-3 mr-1" />
          {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.status === 'active' ? 'bg-green-100 text-green-800' :
          row.original.status === 'inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </span>
      ),
    },
    {
      accessorKey: 'temple',
      header: 'Temple',
      cell: ({ row }) => row.original.temple || '-',
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => row.original.lastLogin 
        ? new Date(row.original.lastLogin).toLocaleDateString()
        : 'Never',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            size="xs"
            variant="secondary"
            onClick={() => {
              setEditingUser(row.original);
              setShowUserModal(true);
            }}
            icon={<Edit className="w-3 h-3" />}
          >
            Edit
          </Button>
          {row.original.status === 'pending' && (
            <Button
              size="xs"
              variant="success"
              onClick={() => handleStatusChange(row.original.id, 'active')}
              icon={<UserPlus className="w-3 h-3" />}
            >
              Approve
            </Button>
          )}
          {row.original.status === 'active' && (
            <Button
              size="xs"
              variant="warning"
              onClick={() => handleStatusChange(row.original.id, 'inactive')}
              icon={<UserMinus className="w-3 h-3" />}
            >
              Deactivate
            </Button>
          )}
          <Button
            size="xs"
            variant="danger"
            onClick={() => setDeleteConfirm({ isOpen: true, userId: row.original.id })}
            icon={<Trash2 className="w-3 h-3" />}
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="w-8 h-8 text-indigo-600 mr-3" />
            User Management
          </h1>
          <p className="text-gray-600 mt-2">Manage users, roles, and permissions</p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setShowUserModal(true);
          }}
          icon={<Plus className="w-5 h-5" />}
          className="mt-4 sm:mt-0"
        >
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
            <option value="member">Member</option>
            <option value="guest">Guest</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <DataTable
          data={filteredUsers}
          columns={columns}
          searchPlaceholder="Search users..."
        />
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={editingUser ? 
          (userData) => handleUpdateUser(editingUser.id, userData) :
          handleCreateUser
        }
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={() => deleteConfirm.userId && handleDeleteUser(deleteConfirm.userId)}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        type="danger"
      />
    </motion.div>
  );
}

// User Modal Component
interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userData: Partial<User>) => void;
}

function UserModal({ isOpen, onClose, user, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member' as User['role'],
    phone: '',
    temple: ''
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        temple: user.temple || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'member',
        phone: '',
        temple: ''
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add New User'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Full Name" required>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </FormField>

          <FormField label="Email Address" required>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </FormField>

          <FormField label="Role" required>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as User['role'] }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="member">Member</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
              <option value="guest">Guest</option>
            </select>
          </FormField>

          <FormField label="Phone Number">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Primary Temple">
              <input
                type="text"
                value={formData.temple}
                onChange={(e) => setFormData(prev => ({ ...prev, temple: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {user ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}