import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Quotes } from './pages/Quotes';
import { QuoteNew } from './pages/QuoteNew';
import { WorkOrders } from './pages/WorkOrders';
import { Finance } from './pages/Finance';
import { Settings } from './pages/Settings';
import { Calendar } from './pages/Calendar';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <PrivateRoute>
            <Clients />
          </PrivateRoute>
        }
      />
      <Route
        path="/quotes"
        element={
          <PrivateRoute>
            <Quotes />
          </PrivateRoute>
        }
      />
      <Route
        path="/quotes/new"
        element={
          <PrivateRoute>
            <QuoteNew />
          </PrivateRoute>
        }
      />
      <Route
        path="/quotes/:id"
        element={
          <PrivateRoute>
            <QuoteNew />
          </PrivateRoute>
        }
      />
      <Route
        path="/work-orders"
        element={
          <PrivateRoute>
            <WorkOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <PrivateRoute>
            <Finance />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


