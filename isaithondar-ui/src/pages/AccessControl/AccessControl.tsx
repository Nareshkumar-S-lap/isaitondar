import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Settings, 
  Lock, 
  Unlock,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import toast from 'react-hot-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export default function AccessControl() {
  const { hasRole } = useAuth();
  
  const [permissions] = useState<Permission[]>([
    { id: '1', name: 'View Events', description: 'Can view all events', resource: 'events', action: 'read' },
    { id: '2', name: 'Create Events', description: 'Can create new events', resource: 'events', action: 'create' },
    { id: '3', name: 'Edit Events', description: 'Can edit existing events', resource: 'events', action: 'update' },
    { id: '4', name: 'Delete Events', description: 'Can delete events', resource: 'events', action: 'delete' },
    { id: '5', name: 'View Expenses', description: 'Can view expenses', resource: 'expenses', action: 'read' },
    { id: '6', name: 'Manage Expenses', description: 'Can create and edit expenses', resource: 'expenses', action: 'write' },
    { id: '7', name: 'View Users', description: 'Can view user list', resource: 'users', action: 'read' },
    { id: '8', name: 'Manage Users', description: 'Can create, edit, and delete users', resource: 'users', action: 'write' },
    { id: '9', name: 'System Settings', description: 'Can access system settings', resource: 'system', action: 'admin' },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access',
      permissions: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      userCount: 2
    },
    {
      id: '2',
      name: 'Organizer',
      description: 'Can organize events and manage expenses',
      permissions: ['1', '2', '3', '5', '6'],
      userCount: 5
    },
    {
      id: '3',
      name: 'Member',
      description: 'Basic member access',
      permissions: ['1', '5'],
      userCount: 25
    },
    {
      id: '4',
      name: 'Guest',
      description: 'Limited read-only access',
      permissions: ['1'],
      userCount: 10
    }
  ]);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; roleId?: string }>({ isOpen: false });

  if (!hasRole(['admin'])) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access access control settings.</p>
        </div>
      </div>
    );
  }

  const handleCreateRole = (roleData: Partial<Role>) => {
    const newRole: Role = {
      id: Date.now().toString(),
      name: roleData.name || '',
      description: roleData.description || '',
      permissions: roleData.permissions || [],
      userCount: 0
    };
    setRoles(prev => [...prev, newRole]);
    toast.success('Role created successfully!');
    setShowRoleModal(false);
  };

  const handleUpdateRole = (roleId: string, roleData: Partial<Role>) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId ? { ...role, ...roleData } : role
    ));
    toast.success('Role updated successfully!');
    setShowRoleModal(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role && role.userCount > 0) {
      toast.error('Cannot delete role with assigned users');
      return;
    }
    setRoles(prev => prev.filter(role => role.id !== roleId));
    toast.success('Role deleted successfully!');
    setDeleteConfirm({ isOpen: false });
  };

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
            <Shield className="w-8 h-8 text-indigo-600 mr-3" />
            Access Control
          </h1>
          <p className="text-gray-600 mt-2">Manage roles and permissions</p>
        </div>
        <Button
          onClick={() => {
            setEditingRole(null);
            setShowRoleModal(true);
          }}
          icon={<Plus className="w-5 h-5" />}
          className="mt-4 sm:mt-0"
        >
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Roles Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 text-indigo-600 mr-2" />
              Roles
            </h2>
            
            <div className="space-y-4">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          role.name === 'Admin' ? 'bg-red-100 text-red-600' :
                          role.name === 'Organizer' ? 'bg-blue-100 text-blue-600' :
                          role.name === 'Member' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{role.name}</h3>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{role.permissions.length} permissions</span>
                        <span>{role.userCount} users</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => {
                          setEditingRole(role);
                          setShowRoleModal(true);
                        }}
                        icon={<Edit className="w-3 h-3" />}
                      >
                        Edit
                      </Button>
                      {role.userCount === 0 && (
                        <Button
                          size="xs"
                          variant="danger"
                          onClick={() => setDeleteConfirm({ isOpen: true, roleId: role.id })}
                          icon={<Trash2 className="w-3 h-3" />}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Lock className="w-6 h-6 text-indigo-600 mr-2" />
              System Permissions
            </h2>
            
            <div className="space-y-3">
              {permissions.map((permission) => (
                <motion.div
                  key={permission.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      permission.action === 'admin' ? 'bg-red-100 text-red-600' :
                      permission.action === 'write' ? 'bg-yellow-100 text-yellow-600' :
                      permission.action === 'create' ? 'bg-blue-100 text-blue-600' :
                      permission.action === 'update' ? 'bg-purple-100 text-purple-600' :
                      permission.action === 'delete' ? 'bg-red-100 text-red-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {permission.action === 'read' ? <Eye className="w-4 h-4" /> :
                       permission.action === 'admin' ? <Settings className="w-4 h-4" /> :
                       <Lock className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{permission.name}</p>
                      <p className="text-sm text-gray-600">{permission.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {permission.resource}:{permission.action}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Modal */}
      <RoleModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setEditingRole(null);
        }}
        role={editingRole}
        permissions={permissions}
        onSave={editingRole ? 
          (roleData) => handleUpdateRole(editingRole.id, roleData) :
          handleCreateRole
        }
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={() => deleteConfirm.roleId && handleDeleteRole(deleteConfirm.roleId)}
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        type="danger"
      />
    </motion.div>
  );
}

// Role Modal Component
interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  permissions: Permission[];
  onSave: (roleData: Partial<Role>) => void;
}

function RoleModal({ isOpen, onClose, role, permissions, onSave }: RoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  React.useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: []
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={role ? 'Edit Role' : 'Create New Role'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Role Name" required>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </FormField>

          <FormField label="Description" required>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </FormField>
        </div>

        <div>
          <FormField label="Permissions">
            <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{permission.name}</p>
                    <p className="text-sm text-gray-600">{permission.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </FormField>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" icon={<Save className="w-4 h-4" />}>
            {role ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}