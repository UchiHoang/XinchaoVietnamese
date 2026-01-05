import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Headphones, Pen, BookText } from 'lucide-react';

interface ExerciseSet {
  id: string;
  level: 'A' | 'B' | 'C';
  set_number: number;
  title_vi: string;
  title_zh: string;
}

interface Exercise {
  id: string;
  exercise_set_id: string;
  category: 'vocabulary' | 'reading' | 'listening' | 'writing';
  exercise_number: number;
  title_vi: string;
  title_zh: string;
}

const categoryIcons = {
  vocabulary: BookText,
  reading: BookOpen,
  listening: Headphones,
  writing: Pen,
};

const categoryLabels = {
  vocabulary: { vi: 'Từ vựng', zh: '词汇' },
  reading: { vi: 'Đọc hiểu', zh: '阅读理解' },
  listening: { vi: 'Nghe', zh: '听力' },
  writing: { vi: 'Viết', zh: '写作' },
};

const categoryColors = {
  vocabulary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  reading: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  listening: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  writing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const Exercises = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState<'A' | 'B' | 'C'>('A');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const [setsResult, exercisesResult] = await Promise.all([
        supabase.from('exercise_sets').select('*').order('level').order('set_number'),
        supabase.from('exercises').select('*').order('sort_order'),
      ]);

      if (setsResult.data) {
        setExerciseSets(setsResult.data as ExerciseSet[]);
      }
      if (exercisesResult.data) {
        setExercises(exercisesResult.data as Exercise[]);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredSets = exerciseSets.filter(set => set.level === activeLevel);
  const categories: ('vocabulary' | 'reading' | 'listening' | 'writing')[] = ['vocabulary', 'reading', 'listening', 'writing'];

  const getExercisesForSetAndCategory = (setId: string, category: string) => {
    return exercises.filter(e => e.exercise_set_id === setId && e.category === category);
  };

  const handleExerciseClick = (exerciseId: string) => {
    navigate(`/exercise/${exerciseId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {language === 'vi' ? 'Bài tập luyện tập' : '练习题'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'vi' 
              ? 'Chọn trình độ và loại bài tập để bắt đầu luyện tập'
              : '选择级别和题型开始练习'}
          </p>
        </div>

        <Tabs value={activeLevel} onValueChange={(v) => setActiveLevel(v as 'A' | 'B' | 'C')}>
          <TabsList className="mb-6">
            <TabsTrigger value="A" className="px-8">
              {language === 'vi' ? 'Trình độ A' : 'A级'}
            </TabsTrigger>
            <TabsTrigger value="B" className="px-8">
              {language === 'vi' ? 'Trình độ B' : 'B级'}
            </TabsTrigger>
            <TabsTrigger value="C" className="px-8">
              {language === 'vi' ? 'Trình độ C' : 'C级'}
            </TabsTrigger>
          </TabsList>

          {['A', 'B', 'C'].map((level) => (
            <TabsContent key={level} value={level}>
              {filteredSets.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      {language === 'vi' 
                        ? 'Chưa có bài tập cho trình độ này'
                        : '此级别暂无练习'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary text-primary-foreground">
                        <th className="p-3 text-left font-semibold border border-border/50"></th>
                        {categories.map((cat) => {
                          const Icon = categoryIcons[cat];
                          return (
                            <th key={cat} className="p-3 text-center font-semibold border border-border/50 min-w-[180px]">
                              <div className="flex items-center justify-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{categoryLabels[cat][language]}</span>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSets.map((set, idx) => (
                        <tr key={set.id} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                          <td className="p-3 border border-border font-semibold bg-secondary/50">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                Test {set.set_number}
                              </Badge>
                            </div>
                          </td>
                          {categories.map((cat) => {
                            const categoryExercises = getExercisesForSetAndCategory(set.id, cat);
                            return (
                              <td key={cat} className="p-2 border border-border">
                                <div className="flex flex-col gap-1">
                                  {categoryExercises.length > 0 ? (
                                    categoryExercises.map((ex) => (
                                      <button
                                        key={ex.id}
                                        onClick={() => handleExerciseClick(ex.id)}
                                        className={`
                                          px-3 py-1.5 rounded-md text-sm font-medium
                                          transition-all duration-200 hover:scale-105
                                          ${categoryColors[cat]}
                                          hover:shadow-md cursor-pointer text-left
                                        `}
                                      >
                                        {language === 'vi' 
                                          ? `Bài tập ${ex.exercise_number}`
                                          : `练习 ${ex.exercise_number}`}
                                      </button>
                                    ))
                                  ) : (
                                    <span className="text-muted-foreground text-sm text-center py-2">—</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Exercises;
