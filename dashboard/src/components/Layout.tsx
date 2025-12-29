import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  LogOut,
  Menu,
  X,
  DollarSign,
  Settings as SettingsIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/quotes', icon: FileText, label: 'Orçamentos' },
    { path: '/work-orders', icon: ClipboardList, label: 'Ordens de Serviço' },
    { path: '/calendar', icon: CalendarIcon, label: 'Agenda' },
    { path: '/finance', icon: DollarSign, label: 'Financeiro' },
    { path: '/settings', icon: SettingsIcon, label: 'Configurações' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <img src="/logo.png" alt="House Manutenção" className="h-8 w-auto" />
              <span className="text-xl font-serif font-bold text-navy hidden sm:inline">
                House Manutenção
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-navy text-white'
                        : 'text-slate-700 hover:bg-navy-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User & Mobile Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-slate-600">
                {user?.email}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="hidden md:flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-slate-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-navy text-white'
                        : 'text-slate-700 hover:bg-navy-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}


