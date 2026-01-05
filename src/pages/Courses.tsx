import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Lock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title_vi: string;
  title_zh: string;
  description_vi: string | null;
  description_zh: string | null;
  course_type: 'free' | 'paid' | 'exam';
  price: number | null;
}

interface Lesson {
  id: string;
  course_id: string;
  title_vi: string;
  title_zh: string;
  duration_minutes: number | null;
  access_type: 'free' | 'paid';
}

export default function Courses() {
  const { language, t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchData() {
      const [coursesRes, lessonsRes] = await Promise.all([
        supabase.from('courses').select('*').eq('is_published', true).order('sort_order'),
        supabase.from('lessons').select('*').eq('is_published', true).order('sort_order'),
      ]);

      setCourses(coursesRes.data || []);
      setLessons(lessonsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(c => c.course_type === activeTab);

  const getLessonsForCourse = (courseId: string) => 
    lessons.filter(l => l.course_id === courseId);

  const getBadgeColor = (type: string) => {
    switch(type) {
      case 'free': return 'bg-success';
      case 'paid': return 'bg-primary';
      case 'exam': return 'bg-accent';
      default: return 'bg-muted';
    }
  };


  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('nav.courses')}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">{t('library.category.all')}</TabsTrigger>
            <TabsTrigger value="free">{t('course.free')}</TabsTrigger>
            <TabsTrigger value="paid">{t('course.paid')}</TabsTrigger>
            <TabsTrigger value="exam">{t('course.exam')}</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {language === 'vi' ? 'Chưa có khóa học nào' : '暂无课程'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const courseLessons = getLessonsForCourse(course.id);
              return (
                <Card key={course.id} className="overflow-hidden hover:shadow-elevated transition-all">
                  <div className={`h-2 ${getBadgeColor(course.course_type)}`} />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getBadgeColor(course.course_type)}>
                        {t(`course.${course.course_type}`)}
                      </Badge>
                      {course.course_type !== 'free' && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <CardTitle className="mt-2">
                      {language === 'vi' ? course.title_vi : course.title_zh}
                    </CardTitle>
                    <CardDescription>
                      {language === 'vi' ? course.description_vi : course.description_zh}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {courseLessons.length} {language === 'vi' ? 'bài học' : '课时'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {courseLessons.slice(0, 3).map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/lesson/${lesson.id}`}
                          className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Play className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              {language === 'vi' ? lesson.title_vi : lesson.title_zh}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.duration_minutes}m
                          </span>
                        </Link>
                      ))}
                      {courseLessons.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          +{courseLessons.length - 3} {language === 'vi' ? 'bài học khác' : '更多课时'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
