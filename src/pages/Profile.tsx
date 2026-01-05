import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, BookOpen, FileText, Award, Trophy, Target, Clock, 
  TrendingUp, Calendar, Star, Flame, CheckCircle2, BookMarked,
  GraduationCap, BarChart3, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LearningStats {
  totalLessonsCompleted: number;
  totalExercisesCompleted: number;
  totalStudyHours: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  vocabularyLearned: number;
  certificatesEarned: number;
}

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastAccessed: string;
}

interface ExerciseResult {
  id: string;
  title: string;
  category: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export default function Profile() {
  const { language, t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Mock learning stats - in real app, calculate from actual data
  const learningStats: LearningStats = {
    totalLessonsCompleted: 12,
    totalExercisesCompleted: 28,
    totalStudyHours: 15.5,
    currentStreak: 5,
    longestStreak: 14,
    averageScore: 85,
    vocabularyLearned: 320,
    certificatesEarned: 1,
  };

  // Mock achievements
  const achievements: Achievement[] = [
    { id: '1', title: language === 'vi' ? 'Người mới bắt đầu' : '初学者', description: language === 'vi' ? 'Hoàn thành bài học đầu tiên' : '完成第一课', icon: '🎯', earnedAt: '2024-01-15', type: 'bronze' },
    { id: '2', title: language === 'vi' ? 'Siêng năng' : '勤奋学习', description: language === 'vi' ? 'Học 7 ngày liên tiếp' : '连续学习7天', icon: '🔥', earnedAt: '2024-01-20', type: 'silver' },
    { id: '3', title: language === 'vi' ? 'Vua từ vựng' : '词汇大王', description: language === 'vi' ? 'Học 100 từ vựng' : '学习100个词汇', icon: '📚', earnedAt: '2024-01-25', type: 'gold' },
    { id: '4', title: language === 'vi' ? 'Điểm cao' : '高分达人', description: language === 'vi' ? 'Đạt 90% trong bài kiểm tra' : '测验得分90%以上', icon: '⭐', earnedAt: '2024-01-28', type: 'silver' },
  ];

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();

      setProfile(profileData);

      // Fetch lesson progress
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select(`
          *,
          course:courses(title_vi, title_zh),
          lesson:lessons(title_vi, title_zh)
        `)
        .eq('user_id', user.id);

      // Process course progress
      if (progressData) {
        const courseMap = new Map<string, CourseProgress>();
        progressData.forEach((p: any) => {
          const courseId = p.course_id;
          if (!courseMap.has(courseId)) {
            courseMap.set(courseId, {
              id: courseId,
              title: language === 'vi' ? p.course?.title_vi : p.course?.title_zh,
              progress: 0,
              lessonsCompleted: 0,
              totalLessons: 0,
              lastAccessed: p.last_accessed_at,
            });
          }
          const course = courseMap.get(courseId)!;
          course.totalLessons++;
          if (p.is_completed) course.lessonsCompleted++;
          if (new Date(p.last_accessed_at) > new Date(course.lastAccessed)) {
            course.lastAccessed = p.last_accessed_at;
          }
        });
        courseMap.forEach(course => {
          course.progress = course.totalLessons > 0 
            ? Math.round((course.lessonsCompleted / course.totalLessons) * 100) 
            : 0;
        });
        setCourseProgress(Array.from(courseMap.values()));
      }

      // Fetch exercise results
      const { data: exerciseData } = await supabase
        .from('exercise_results')
        .select(`
          *,
          exercise:exercises(title_vi, title_zh, category)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (exerciseData) {
        setExerciseResults(exerciseData.map((e: any) => ({
          id: e.id,
          title: language === 'vi' ? e.exercise?.title_vi : e.exercise?.title_zh,
          category: e.exercise?.category,
          score: e.score,
          totalQuestions: e.total_questions,
          completedAt: e.completed_at,
          timeSpent: e.time_spent_seconds || 0,
        })));
      }

      setLoadingData(false);
    }

    fetchData();
  }, [user, language]);

  if (loading) return <Layout><div className="container py-8 text-center">{t('common.loading')}</div></Layout>;
  if (!user) return null;

  const getAchievementBadgeColor = (type: Achievement['type']) => {
    switch (type) {
      case 'bronze': return 'bg-amber-600/20 text-amber-700 border-amber-600/30';
      case 'silver': return 'bg-slate-400/20 text-slate-600 border-slate-400/30';
      case 'gold': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'platinum': return 'bg-cyan-500/20 text-cyan-700 border-cyan-500/30';
    }
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, { vi: string; zh: string }> = {
      vocabulary: { vi: 'Từ vựng', zh: '词汇' },
      reading: { vi: 'Đọc hiểu', zh: '阅读' },
      listening: { vi: 'Nghe', zh: '听力' },
      writing: { vi: 'Viết', zh: '写作' },
    };
    return labels[cat]?.[language] || cat;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'zh-CN');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile?.full_name || user.email?.split('@')[0]}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="gap-1">
                <Flame className="h-3 w-3 text-orange-500" />
                {learningStats.currentStreak} {language === 'vi' ? 'ngày streak' : '天连续'}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                {language === 'vi' ? 'Cấp độ A2' : 'A2级别'}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Trophy className="h-3 w-3 text-primary" />
                {achievements.length} {language === 'vi' ? 'huy hiệu' : '成就'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{learningStats.totalLessonsCompleted}</p>
                  <p className="text-xs text-muted-foreground">{language === 'vi' ? 'Bài học hoàn thành' : '已完成课程'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{learningStats.totalExercisesCompleted}</p>
                  <p className="text-xs text-muted-foreground">{language === 'vi' ? 'Bài tập hoàn thành' : '已完成练习'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{learningStats.totalStudyHours}h</p>
                  <p className="text-xs text-muted-foreground">{language === 'vi' ? 'Giờ học tập' : '学习时长'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <BookMarked className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{learningStats.vocabularyLearned}</p>
                  <p className="text-xs text-muted-foreground">{language === 'vi' ? 'Từ vựng đã học' : '已学词汇'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="progress" className="flex flex-col md:flex-row gap-1 py-3">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs md:text-sm">{language === 'vi' ? 'Tiến độ' : '学习进度'}</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex flex-col md:flex-row gap-1 py-3">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs md:text-sm">{language === 'vi' ? 'Bài tập' : '练习成绩'}</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex flex-col md:flex-row gap-1 py-3">
              <Trophy className="h-4 w-4" />
              <span className="text-xs md:text-sm">{language === 'vi' ? 'Huy hiệu' : '成就勋章'}</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex flex-col md:flex-row gap-1 py-3">
              <Zap className="h-4 w-4" />
              <span className="text-xs md:text-sm">{language === 'vi' ? 'Thống kê' : '学习统计'}</span>
            </TabsTrigger>
          </TabsList>

          {/* Course Progress Tab */}
          <TabsContent value="progress">
            <div className="grid gap-4 md:grid-cols-2">
              {courseProgress.length > 0 ? courseProgress.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {language === 'vi' ? 'Truy cập gần đây:' : '最近访问：'} {formatDate(course.lastAccessed)}
                        </CardDescription>
                      </div>
                      <Badge variant={course.progress === 100 ? 'default' : 'secondary'}>
                        {course.progress}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={course.progress} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {course.lessonsCompleted}/{course.totalLessons} {language === 'vi' ? 'bài học' : '课程'}
                    </p>
                  </CardContent>
                </Card>
              )) : (
                <Card className="md:col-span-2">
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'vi' ? 'Chưa có tiến độ học tập. Bắt đầu học ngay!' : '暂无学习进度，开始学习吧！'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Exercise Results Tab */}
          <TabsContent value="exercises">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {language === 'vi' ? 'Kết quả bài tập gần đây' : '最近练习成绩'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exerciseResults.length > 0 ? (
                  <div className="space-y-4">
                    {exerciseResults.map((result) => (
                      <div 
                        key={result.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                            result.score / result.totalQuestions >= 0.8 
                              ? 'bg-success/20 text-success' 
                              : result.score / result.totalQuestions >= 0.6 
                                ? 'bg-warning/20 text-warning' 
                                : 'bg-destructive/20 text-destructive'
                          }`}>
                            {Math.round((result.score / result.totalQuestions) * 100)}%
                          </div>
                          <div>
                            <p className="font-medium">{result.title}</p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {getCategoryLabel(result.category)}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(result.timeSpent)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{result.score}/{result.totalQuestions}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(result.completedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'vi' ? 'Chưa có kết quả bài tập. Làm bài tập ngay!' : '暂无练习成绩，开始做练习吧！'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <Badge className={`mb-2 ${getAchievementBadgeColor(achievement.type)}`}>
                      {achievement.type.toUpperCase()}
                    </Badge>
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(achievement.earnedAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Locked achievements hint */}
            <Card className="mt-6 bg-muted/30 border-dashed">
              <CardContent className="py-8 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  {language === 'vi' 
                    ? 'Tiếp tục học tập để mở khóa thêm nhiều huy hiệu!' 
                    : '继续学习，解锁更多成就勋章！'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Learning Streak */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    {language === 'vi' ? 'Chuỗi học tập' : '学习连续天数'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-4xl font-bold text-orange-500">{learningStats.currentStreak}</p>
                      <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Ngày liên tiếp' : '天'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold">{learningStats.longestStreak}</p>
                      <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Kỷ lục cao nhất' : '最高记录'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i}
                        className={`flex-1 h-8 rounded ${
                          i < learningStats.currentStreak 
                            ? 'bg-orange-500' 
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{language === 'vi' ? 'T2' : '周一'}</span>
                    <span>{language === 'vi' ? 'CN' : '周日'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Average Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {language === 'vi' ? 'Điểm trung bình' : '平均分数'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${learningStats.averageScore * 3.52} 352`}
                          className="text-primary"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{learningStats.averageScore}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {learningStats.averageScore >= 80 
                      ? (language === 'vi' ? 'Xuất sắc! Tiếp tục phát huy!' : '太棒了！继续保持！')
                      : (language === 'vi' ? 'Cố gắng lên!' : '继续努力！')}
                  </p>
                </CardContent>
              </Card>

              {/* Study Time Distribution */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-success" />
                    {language === 'vi' ? 'Phân bố thời gian học' : '学习时间分布'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language === 'vi' ? 'Từ vựng' : '词汇'}</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language === 'vi' ? 'Ngữ pháp' : '语法'}</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language === 'vi' ? 'Đọc hiểu' : '阅读'}</span>
                        <span>20%</span>
                      </div>
                      <Progress value={20} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language === 'vi' ? 'Nghe' : '听力'}</span>
                        <span>10%</span>
                      </div>
                      <Progress value={10} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
