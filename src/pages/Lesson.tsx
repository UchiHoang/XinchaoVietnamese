import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Volume2, BookOpen, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VocabItem {
  vietnamese: string;
  chinese: string;
  pinyin: string;
}

interface QuizQuestion {
  question_vi: string;
  question_zh: string;
  options: string[];
  correct: number;
}

interface Lesson {
  id: string;
  course_id: string;
  title_vi: string;
  title_zh: string;
  content_vi: string | null;
  content_zh: string | null;
  vocabulary: VocabItem[];
  video_url: string | null;
  audio_url: string | null;
}

interface Test {
  id: string;
  title_vi: string;
  title_zh: string;
  questions: QuizQuestion[];
  passing_score: number | null;
}
// Extract YouTube video ID from URL
const getYoutubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
};

export default function Lesson() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      // Fetch lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (lessonError || !lessonData) {
        toast.error(language === 'vi' ? 'Không tìm thấy bài học' : '找不到课程');
        setLoading(false);
        return;
      }

      // Parse vocabulary JSON
      const vocab = Array.isArray(lessonData.vocabulary) 
        ? (lessonData.vocabulary as unknown as VocabItem[])
        : [];

      setLesson({ ...lessonData, vocabulary: vocab });

      // Fetch test for this lesson
      const { data: testData } = await supabase
        .from('tests')
        .select('*')
        .eq('lesson_id', id)
        .maybeSingle();

      if (testData) {
        const questions = Array.isArray(testData.questions) 
          ? (testData.questions as unknown as QuizQuestion[])
          : [];
        setTest({ ...testData, questions });
      }

      // Fetch user's note if logged in
      if (user) {
        const { data: noteData } = await supabase
          .from('user_notes')
          .select('content')
          .eq('user_id', user.id)
          .eq('lesson_id', id)
          .maybeSingle();

        if (noteData) setNote(noteData.content);
      }

      setLoading(false);
    }
    fetchData();
  }, [id, user, language]);

  const handleSaveNote = async () => {
    if (!user) {
      toast.error(language === 'vi' ? 'Vui lòng đăng nhập để lưu ghi chú' : '请登录以保存笔记');
      return;
    }
    if (!id) return;

    setNoteSaving(true);

    const { error } = await supabase
      .from('user_notes')
      .upsert({
        user_id: user.id,
        lesson_id: id,
        content: note,
      }, { onConflict: 'user_id,lesson_id' });

    setNoteSaving(false);

    if (error) {
      toast.error(language === 'vi' ? 'Lỗi lưu ghi chú' : '保存笔记失败');
      return;
    }
    toast.success(t('notes.saved'));
  };

  const handleSubmitQuiz = async () => {
    if (!test) return;
    
    if (quizAnswers.length !== test.questions.length) {
      toast.error(language === 'vi' ? 'Vui lòng trả lời tất cả câu hỏi' : '请回答所有问题');
      return;
    }

    setShowResults(true);
    const score = quizAnswers.filter((a, i) => a === test.questions[i].correct).length;
    const percentage = Math.round((score / test.questions.length) * 100);
    const passed = percentage >= (test.passing_score || 60);

    // Save result if logged in
    if (user && id && test.id) {
      await supabase.from('test_results').insert({
        user_id: user.id,
        test_id: test.id,
        lesson_id: id,
        score: percentage,
        answers: quizAnswers,
        passed,
      });
    }

    toast[passed ? 'success' : 'error'](
      `${t('quiz.score')}: ${score}/${test.questions.length} (${percentage}%) - ${passed ? t('quiz.passed') : t('quiz.failed')}`
    );
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

  if (!lesson) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              {language === 'vi' ? 'Không tìm thấy bài học' : '找不到课程'}
            </p>
            <Button asChild>
              <Link to="/courses">{t('nav.courses')}</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/courses" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t('lesson.prev')}
        </Link>

        <h1 className="text-3xl font-bold mb-2">
          {language === 'vi' ? lesson.title_vi : lesson.title_zh}
        </h1>

        <Tabs defaultValue="content" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content"><BookOpen className="h-4 w-4 mr-2" />{t('lesson.content')}</TabsTrigger>
            <TabsTrigger value="vocabulary"><FileText className="h-4 w-4 mr-2" />{t('lesson.vocabulary')}</TabsTrigger>
            <TabsTrigger value="notes"><FileText className="h-4 w-4 mr-2" />{t('lesson.notes')}</TabsTrigger>
            <TabsTrigger value="quiz" disabled={!test}><CheckCircle className="h-4 w-4 mr-2" />{t('quiz.title')}</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {/* Video embed */}
                {lesson.video_url ? (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(lesson.video_url)}`}
                      title={language === 'vi' ? lesson.title_vi : lesson.title_zh}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">{t('lesson.video')}</p>
                    </div>
                  </div>
                )}
                {/* Audio placeholder */}
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg mb-6">
                  <Volume2 className="h-6 w-6 text-primary" />
                  <span className="text-sm">{t('lesson.audio')}</span>
                  <Button variant="outline" size="sm">Play</Button>
                </div>
                <p className="text-foreground whitespace-pre-wrap">
                  {language === 'vi' ? lesson.content_vi : lesson.content_zh}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-6">
            {lesson.vocabulary.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {language === 'vi' ? 'Chưa có từ vựng' : '暂无词汇'}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {lesson.vocabulary.map((word, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold text-primary mb-2">{word.vietnamese}</p>
                      <p className="text-lg">{word.chinese}</p>
                      <p className="text-sm text-muted-foreground">{word.pinyin}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader><CardTitle>{t('lesson.notes')}</CardTitle></CardHeader>
              <CardContent>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t('notes.placeholder')}
                  className="min-h-[200px] mb-4"
                />
                <Button onClick={handleSaveNote} disabled={noteSaving}>
                  {noteSaving ? t('common.loading') : t('notes.save')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            {test && (
              <Card>
                <CardHeader><CardTitle>{language === 'vi' ? test.title_vi : test.title_zh}</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {test.questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 bg-secondary/50 rounded-lg">
                      <p className="font-medium mb-4">
                        {t('quiz.question')} {qIdx + 1}: {language === 'vi' ? q.question_vi : q.question_zh}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <Button
                            key={oIdx}
                            variant={quizAnswers[qIdx] === oIdx ? 'default' : 'outline'}
                            className={showResults 
                              ? (oIdx === q.correct 
                                ? 'bg-success hover:bg-success' 
                                : quizAnswers[qIdx] === oIdx 
                                  ? 'bg-destructive hover:bg-destructive' 
                                  : '') 
                              : ''}
                            onClick={() => {
                              if (!showResults) {
                                const newAnswers = [...quizAnswers];
                                newAnswers[qIdx] = oIdx;
                                setQuizAnswers(newAnswers);
                              }
                            }}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!showResults ? (
                    <Button onClick={handleSubmitQuiz} className="w-full">{t('quiz.submit')}</Button>
                  ) : (
                    <Button onClick={() => { setShowResults(false); setQuizAnswers([]); }} variant="outline" className="w-full">{t('quiz.retry')}</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
