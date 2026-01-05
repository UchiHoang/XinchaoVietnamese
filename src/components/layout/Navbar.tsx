import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User, LogOut, BookOpen, Library, Home, Settings, PenTool, MessageCircle, GraduationCap, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logoImg from '@/assets/logo-new.png';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .then(({ data }) => {
          const hasAdminRole = data?.some(r => r.role === 'admin' || r.role === 'teacher');
          setIsAdmin(hasAdminRole ?? false);
        });
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success(t('auth.logoutSuccess'));
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'zh' : 'vi');
  };

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/courses', label: t('nav.courses'), icon: BookOpen },
    { to: '/exercises', label: t('nav.exercises'), icon: PenTool },
    { to: '/library', label: t('nav.library'), icon: Library },
    { to: '/tutor-registration', label: language === 'vi' ? 'Gia sư' : '家教', icon: GraduationCap },
    { to: '/chat-support', label: language === 'vi' ? 'Hỗ trợ' : '支持', icon: MessageCircle },
  ];
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="XinChao Vietnamese" className="h-10 w-auto" />
            <span className="hidden font-bold text-lg text-primary sm:inline-block">
              XinChao Vietnamese
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-base font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'vi' ? '中文' : 'Tiếng Việt'}
              </span>
            </Button>

            {/* User Menu / Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline-block text-sm">
                      {user.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/transactions" className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      {language === 'vi' ? 'Lịch sử GD' : '交易历史'}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex sm:items-center sm:gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth?mode=register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-border py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
              
              {user && isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  Admin
                </Link>
              )}
              
              {!user && (
                <>
                  <hr className="my-2 border-border" />
                  <Link
                    to="/auth"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/auth?mode=register"
                    className="flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
