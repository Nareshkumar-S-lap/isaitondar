import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventsList from './pages/Events/EventsList';
import CreateEvent from './pages/Events/CreateEvent';
import EditEvent from './pages/Events/EditEvent';
import EventDetails from './pages/Events/EventDetails';
import ThevaramList from './pages/Thevaram/ThevaramList';
import CreateThevaram from './pages/Thevaram/CreateThevaram';
import EditThevaram from './pages/Thevaram/EditThevaram';
import ThevaramDetails from './pages/Thevaram/ThevaramDetails';
import ExpensesList from './pages/Expenses/ExpensesList';
import CreateExpense from './pages/Expenses/CreateExpense';
import EditExpense from './pages/Expenses/EditExpense';
import Maintenance from './pages/Maintenance/Maintenance';
import Profile from './pages/Profile/Profile';
import UserManagement from './pages/Users/UserManagement';
import AccessControl from './pages/AccessControl/AccessControl';
import TempleManagement from './pages/Temples/TempleManagement';
import InstrumentManagement from './pages/Instruments/InstrumentManagement';
import './i18n';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex h-screen">
        {/* Sidebar - Always Open on Desktop */}
        <Sidebar 
          collapsed={false}
          onToggleCollapse={() => {}}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <TopBar 
            onMenuClick={() => setMobileSidebarOpen(true)}
            onToggleSidebar={() => {}}
            sidebarCollapsed={false}
          />
          
          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Events Routes */}
              <Route path="/events" element={<EventsList />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/events/:id/edit" element={<EditEvent />} />
              
              {/* Thevaram Routes */}
              <Route path="/thevaram" element={<ThevaramList />} />
              <Route path="/thevaram/create" element={<CreateThevaram />} />
              <Route path="/thevaram/:id" element={<ThevaramDetails />} />
              <Route path="/thevaram/:id/edit" element={<EditThevaram />} />
              
              {/* Expenses Routes */}
              <Route path="/expenses" element={<ExpensesList />} />
              <Route path="/expenses/create" element={<CreateExpense />} />
              <Route path="/expenses/:id/edit" element={<EditExpense />} />
              
              {/* Temple & Instrument Management Routes */}
              <Route path="/temples" element={<TempleManagement />} />
              <Route path="/instruments" element={<InstrumentManagement />} />
              
              {/* User Management Routes */}
              <Route path="/users" element={<UserManagement />} />
              <Route path="/access-control" element={<AccessControl />} />
              
              {/* Other Routes */}
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/profile" element={<Profile />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;