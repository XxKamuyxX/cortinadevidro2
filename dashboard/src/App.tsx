import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientNew } from './pages/ClientNew';
import { Quotes } from './pages/Quotes';
import { QuoteNew } from './pages/QuoteNew';
import { WorkOrders } from './pages/WorkOrders';
import { Finance } from './pages/Finance';
import { Settings } from './pages/Settings';
import { Calendar } from './pages/Calendar';
import { PublicQuote } from './pages/PublicQuote';
import { PublicWorkOrder } from './pages/PublicWorkOrder';
import { PublicWorkOrderApprove } from './pages/PublicWorkOrderApprove';
import { PublicReceipt } from './pages/PublicReceipt';
import { WorkOrderDetails } from './pages/WorkOrderDetails';
import { Feedback } from './pages/Feedback';

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
      <Route path="/p/quote/:quoteId" element={<PublicQuote />} />
      <Route path="/p/:quoteId" element={<PublicQuote />} />
      <Route path="/p/os/:osId" element={<PublicWorkOrder />} />
      <Route path="/p/os/:osId/approve" element={<PublicWorkOrderApprove />} />
      <Route path="/p/receipt/:receiptId" element={<PublicReceipt />} />
      <Route path="/feedback/:osId" element={<Feedback />} />
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
        path="/clients/new"
        element={
          <PrivateRoute>
            <ClientNew />
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
        path="/work-orders/:id"
        element={
          <PrivateRoute>
            <WorkOrderDetails />
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


