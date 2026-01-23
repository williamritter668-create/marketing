import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/Landing';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { WhatsAppFloat } from './components/common';

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();

  // Handle undefined or loading state
  if (!auth || auth.loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { auth } = useAuth();

  // Handle undefined or loading state
  if (!auth || auth.loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return auth.isAuthenticated && auth.user?.role === 'ADMIN' ? children : <Navigate to="/login" />;
};


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen p-8 bg-red-50 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong.</h1>
          <p className="text-slate-700 mb-4">The application crashed. Here is the error:</p>
          <pre className="bg-white p-4 rounded shadow text-left overflow-auto max-w-4xl border border-red-200 text-red-800 text-sm">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {

  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            {/* We will add Signup and Dashboard routes here later */}
          </Routes>
          <WhatsAppFloat />
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
