import { useEffect, useState } from 'react';
import { Search, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  preferred_language: string | null;
  created_at: string;
}

export default function AdminUsers() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Error loading users');
        return;
      }
      setUsers(data || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {language === 'vi' ? 'Quản lý học viên' : '学生管理'}
        </h1>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'vi' ? 'Tìm kiếm học viên...' : '搜索学生...'}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'vi' ? 'Họ tên' : '姓名'}</TableHead>
                <TableHead>{language === 'vi' ? 'ID người dùng' : '用户ID'}</TableHead>
                <TableHead>{language === 'vi' ? 'Ngôn ngữ' : '语言'}</TableHead>
                <TableHead>{language === 'vi' ? 'Ngày đăng ký' : '注册日期'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {language === 'vi' ? 'Đang tải...' : '加载中...'}
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {language === 'vi' ? 'Chưa có học viên nào' : '暂无学生'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.full_name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <span className="font-medium">
                          {user.full_name || (language === 'vi' ? 'Chưa đặt tên' : '未设置姓名')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {user.user_id.slice(0, 8)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.preferred_language === 'zh' ? '中文' : 'Tiếng Việt'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'zh-CN')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
