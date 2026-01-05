import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, FileText, TrendingUp, Library } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  courses: number;
  lessons: number;
  users: number;
  documents: number;
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<Stats>({ courses: 0, lessons: 0, users: 0, documents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [coursesRes, lessonsRes, profilesRes, documentsRes] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('lessons').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        courses: coursesRes.count ?? 0,
        lessons: lessonsRes.count ?? 0,
        users: profilesRes.count ?? 0,
        documents: documentsRes.count ?? 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { title: language === 'vi' ? 'Khóa học' : '课程', value: stats.courses, icon: BookOpen, color: 'text-primary', link: '/admin/courses' },
    { title: language === 'vi' ? 'Bài học' : '课时', value: stats.lessons, icon: FileText, color: 'text-success', link: '/admin/lessons' },
    { title: language === 'vi' ? 'Học viên' : '学生', value: stats.users, icon: Users, color: 'text-accent', link: '/admin/users' },
    { title: language === 'vi' ? 'Tài liệu' : '资料', value: stats.documents, icon: Library, color: 'text-warning', link: '/admin/documents' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'vi' ? 'Bảng điều khiển' : '仪表板'}
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-elevated transition-all hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {language === 'vi' ? 'Hoạt động gần đây' : '最近活动'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {language === 'vi' ? 'Chưa có hoạt động nào' : '暂无活动'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              {language === 'vi' ? 'Học viên mới' : '新学生'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {language === 'vi' ? 'Chưa có học viên mới' : '暂无新学生'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
