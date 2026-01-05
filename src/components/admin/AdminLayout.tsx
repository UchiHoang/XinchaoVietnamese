import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, FileText, Users, Library, 
  Settings, Menu, LogOut, ChevronLeft, CreditCard, GraduationCap, MessageCircle, PenTool
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, useSidebar 
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logoImg from '@/assets/logo.png';

const adminMenuItems = [
  { title: 'Dashboard', titleZh: '仪表板', url: '/admin', icon: LayoutDashboard },
  { title: 'Khóa học', titleZh: '课程', url: '/admin/courses', icon: BookOpen },
  { title: 'Bài học', titleZh: '课时', url: '/admin/lessons', icon: FileText },
  { title: 'Bài tập', titleZh: '练习', url: '/admin/exercises', icon: PenTool },
  { title: 'Học viên', titleZh: '学生', url: '/admin/users', icon: Users },
  { title: 'Thư viện', titleZh: '资料库', url: '/admin/documents', icon: Library },
  { title: 'Thanh toán', titleZh: '支付', url: '/admin/payments', icon: CreditCard },
  { title: 'Đăng ký gia sư', titleZh: '家教注册', url: '/admin/tutor-bookings', icon: GraduationCap },
  { title: 'Hỗ trợ chat', titleZh: '聊天支持', url: '/admin/chat-support', icon: MessageCircle },
];
function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { language } = useLanguage();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className="p-4 flex items-center gap-2 border-b border-border">
        <img src={logoImg} alt="Logo" className="h-8 w-8" />
        {!collapsed && <span className="font-bold text-primary">Admin Panel</span>}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{language === 'vi' ? 'Quản lý' : '管理'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{language === 'vi' ? item.title : item.titleZh}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      // Check if user has admin role
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error checking role:', error);
            setIsAdmin(false);
            return;
          }
          const hasAdminRole = data?.some(r => r.role === 'admin' || r.role === 'teacher');
          setIsAdmin(hasAdminRole ?? false);
          if (!hasAdminRole) {
            toast.error(language === 'vi' ? 'Bạn không có quyền truy cập' : '您没有访问权限');
            navigate('/');
          }
        });
    }
  }, [user, loading, navigate, language]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                {language === 'vi' ? 'Quay lại trang chủ' : '返回首页'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          
          {/* Content */}
          <main className="flex-1 p-6 bg-background overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
