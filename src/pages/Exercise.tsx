import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Check, X, List, Trophy, RotateCcw, Clock, AlertTriangle } from 'lucide-react';
import VocabularyImage from '@/components/exercise/VocabularyImage';
import ListeningAudioPlayer from '@/components/exercise/ListeningAudioPlayer';

interface QuestionOption {
  key: string;
  vi: string;
  zh: string;
}

interface Question {
  id: string;
  question_number: number;
  question_vi: string;
  question_zh: string;
  options: QuestionOption[];
  correct_answer: string;
  explanation_vi?: string;
  explanation_zh?: string;
}

interface Exercise {
  id: string;
  title_vi: string;
  title_zh: string;
  category: string;
  reading_passage_vi?: string;
  reading_passage_zh?: string;
  audio_url?: string;
  time_limit_minutes: number;
}

const Exercise = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);

      const [exerciseResult, questionsResult] = await Promise.all([
        supabase.from('exercises').select('*').eq('id', id).maybeSingle(),
        supabase.from('exercise_questions').select('*').eq('exercise_id', id).order('sort_order'),
      ]);

      if (exerciseResult.data) {
        setExercise(exerciseResult.data as Exercise);
        // Set timer if exercise has time limit
        if (exerciseResult.data.time_limit_minutes && exerciseResult.data.time_limit_minutes > 0) {
          setTimeRemaining(exerciseResult.data.time_limit_minutes * 60);
        }
      }
      if (questionsResult.data) {
        setQuestions(questionsResult.data.map(q => ({
          ...q,
          options: Array.isArray(q.options) ? q.options as unknown as QuestionOption[] : []
        })));
      }
      
      setLoading(false);
    };

    fetchData();
  }, [id]);

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining === null || submitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, submitted]);

  // Auto-submit when time is up
  useEffect(() => {
    if (isTimeUp && !submitted) {
      handleSubmitCallback();
      toast({
        title: language === 'vi' ? '⏰ Hết giờ!' : '⏰ 时间到！',
        description: language === 'vi' ? 'Bài làm đã được tự động nộp' : '答卷已自动提交',
        variant: 'destructive',
      });
    }
  }, [isTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitCallback = useCallback(async () => {
    const correctCount = questions.reduce((count, q) => {
      return answers[q.id] === q.correct_answer ? count + 1 : count;
    }, 0);

    setScore(correctCount);
    setSubmitted(true);

    // Save result to database
    if (user && exercise) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      await supabase.from('exercise_results').insert({
        user_id: user.id,
        exercise_id: exercise.id,
        score: correctCount,
        total_questions: questions.length,
        answers: answers,
        time_spent_seconds: timeSpent,
      });
    }

    toast({
      title: language === 'vi' ? 'Hoàn thành!' : '完成！',
      description: language === 'vi' 
        ? `Bạn đạt ${correctCount}/${questions.length} câu đúng`
        : `您答对了 ${correctCount}/${questions.length} 题`,
    });
  }, [questions, answers, user, exercise, startTime, language, toast]);

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentQuestion(0);
    setStartTime(Date.now());
    setIsTimeUp(false);
    if (exercise?.time_limit_minutes) {
      setTimeRemaining(exercise.time_limit_minutes * 60);
    }
  };

  const hasReadingPassage = exercise?.reading_passage_vi || exercise?.reading_passage_zh;
  const isListeningExercise = exercise?.category === 'listening';

  const currentQ = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <div className="grid lg:grid-cols-2 gap-6">
            <Skeleton className="h-[500px]" />
            <Skeleton className="h-[500px]" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!exercise) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            {language === 'vi' ? 'Không tìm thấy bài tập' : '未找到练习'}
          </p>
          <Button onClick={() => navigate('/exercises')} className="mt-4">
            {language === 'vi' ? 'Quay lại' : '返回'}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="bg-primary/90 text-primary-foreground rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/exercises')} 
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {language === 'vi' ? 'Quay lại' : '返回'}
                </Button>
                <div>
                  <h1 className="text-xl font-bold">
                    {language === 'vi' ? exercise.title_vi : exercise.title_zh}
                  </h1>
                  <p className="text-sm opacity-90">
                    {hasReadingPassage 
                      ? (language === 'vi' ? 'Đọc đoạn văn và trả lời câu hỏi' : '阅读文章并回答问题')
                      : (language === 'vi' ? 'Trả lời các câu hỏi' : '回答问题')
                    }
                  </p>
                </div>
              </div>
              
              {/* Timer */}
              {timeRemaining !== null && !submitted && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining <= 60 ? 'bg-red-500 animate-pulse' : 
                  timeRemaining <= 300 ? 'bg-orange-500' : 'bg-primary-foreground/20'
                }`}>
                  {timeRemaining <= 60 ? <AlertTriangle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  <span className="text-lg font-mono font-bold">{formatTime(timeRemaining)}</span>
                </div>
              )}
              {submitted && (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-6 w-6" />
                      <span className="text-2xl font-bold">{score}/{questions.length}</span>
                    </div>
                    <p className="text-xs opacity-90">
                      {language === 'vi' ? 'Điểm số' : '得分'}
                    </p>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleRetry}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    {language === 'vi' ? 'Làm lại' : '重做'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main content - conditional layout */}
          <div className={`grid gap-6 ${hasReadingPassage || isListeningExercise ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
            {/* Left: Audio player for listening exercises */}
            {isListeningExercise && (
              <ListeningAudioPlayer 
                audioUrl={exercise?.audio_url} 
                language={language} 
              />
            )}

            {/* Left: Reading passage - only show if exists and not listening */}
            {hasReadingPassage && !isListeningExercise && (
              <Card className="h-fit lg:sticky lg:top-20 shadow-lg border-2">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/80 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-950/40 p-8 rounded-lg min-h-[500px] max-h-[70vh] overflow-y-auto">
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-foreground leading-[2] text-base whitespace-pre-wrap indent-8">
                          {language === 'vi' ? exercise.reading_passage_vi : exercise.reading_passage_zh}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Right: Questions */}
            <div className="space-y-4">
              {/* Question controls */}
              <div className="flex items-center justify-between bg-card p-3 rounded-lg border shadow-sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                >
                  <List className="h-4 w-4 mr-2" />
                  {showAllQuestions 
                    ? (language === 'vi' ? 'Xem từng câu' : '单题显示')
                    : (language === 'vi' ? 'Xem tất cả' : '显示全部')}
                </Button>
                
                {!showAllQuestions && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {currentQuestion + 1} / {questions.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1))}
                      disabled={currentQuestion === questions.length - 1}
                    >
                      <span className="text-lg">=&gt;</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Progress indicator */}
              <div className="grid grid-cols-10 gap-1">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestion(idx);
                      setShowAllQuestions(false);
                    }}
                    className={`
                      h-8 rounded text-xs font-medium transition-all
                      ${idx === currentQuestion && !showAllQuestions
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                        : answers[q.id]
                          ? submitted
                            ? answers[q.id] === q.correct_answer
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Questions Card */}
              <Card className="shadow-lg border-2">
                <CardContent className="p-6">
                  {showAllQuestions ? (
                    <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
                      {questions.map((q, idx) => (
                        <QuestionCard
                          key={q.id}
                          question={q}
                          questionNumber={idx + 1}
                          totalQuestions={questions.length}
                          selectedAnswer={answers[q.id]}
                          onAnswer={handleAnswer}
                          language={language}
                          submitted={submitted}
                          isVocabulary={exercise?.category === 'vocabulary'}
                        />
                      ))}
                    </div>
                  ) : (
                    currentQ && (
                      <QuestionCard
                        question={currentQ}
                        questionNumber={currentQuestion + 1}
                        totalQuestions={questions.length}
                        selectedAnswer={answers[currentQ.id]}
                        onAnswer={handleAnswer}
                        language={language}
                        submitted={submitted}
                        isVocabulary={exercise?.category === 'vocabulary'}
                      />
                    )
                  )}

                  {/* Navigation for single question mode */}
                  {!showAllQuestions && (
                    <div className="flex justify-between mt-6 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                        disabled={currentQuestion === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        {language === 'vi' ? 'Câu trước' : '上一题'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        disabled={currentQuestion === questions.length - 1}
                      >
                        {language === 'vi' ? 'Câu tiếp' : '下一题'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit section */}
              <Card className="shadow-lg border-2 bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      {language === 'vi' 
                        ? `Đã trả lời: ${answeredCount}/${questions.length} câu`
                        : `已回答: ${answeredCount}/${questions.length} 题`}
                    </span>
                    <Progress value={(answeredCount / questions.length) * 100} className="w-32 h-2" />
                  </div>
                  
                  {!submitted ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleSubmitCallback}
                      disabled={answeredCount < questions.length}
                    >
                      {answeredCount < questions.length 
                        ? (language === 'vi' 
                          ? `Còn ${questions.length - answeredCount} câu chưa trả lời`
                          : `还有 ${questions.length - answeredCount} 题未回答`)
                        : (language === 'vi' ? 'Nộp bài' : '提交答案')
                      }
                    </Button>
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium">
                        {score >= questions.length * 0.8 
                          ? (language === 'vi' ? '🎉 Xuất sắc!' : '🎉 太棒了！')
                          : score >= questions.length * 0.6
                            ? (language === 'vi' ? '👍 Tốt lắm!' : '👍 不错！')
                            : (language === 'vi' ? '💪 Cố gắng hơn!' : '💪 继续加油！')
                        }
                      </p>
                      <Button variant="outline" onClick={handleRetry}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Làm lại bài tập' : '重新做题'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Question Card Component
interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onAnswer: (questionId: string, answer: string) => void;
  language: 'vi' | 'zh';
  submitted: boolean;
  isVocabulary?: boolean;
}

const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions,
  selectedAnswer, 
  onAnswer, 
  language, 
  submitted,
  isVocabulary = false
}: QuestionCardProps) => {
  const isCorrect = selectedAnswer === question.correct_answer;
  
  // Extract vocabulary word from question for image generation
  const vocabularyWord = language === 'vi' ? question.question_vi : question.question_zh;

  return (
    <div className="space-y-4">
      {/* AI-generated vocabulary illustration */}
      {isVocabulary && (
        <VocabularyImage 
          vocabulary={vocabularyWord} 
          language={language} 
          enabled={isVocabulary}
        />
      )}

      {/* Question text */}
      <div className="space-y-2">
        <p className="text-lg font-medium text-foreground text-center">
          {vocabularyWord}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.key;
          const isCorrectOption = option.key === question.correct_answer;
          
          let optionStyles = 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer';
          
          if (submitted) {
            if (isCorrectOption) {
              optionStyles = 'border-green-500 bg-green-50 dark:bg-green-950/30';
            } else if (isSelected && !isCorrect) {
              optionStyles = 'border-red-500 bg-red-50 dark:bg-red-950/30';
            } else {
              optionStyles = 'border-border opacity-60';
            }
          } else if (isSelected) {
            optionStyles = 'border-primary bg-primary/10 ring-2 ring-primary/30';
          }

          return (
            <button
              key={option.key}
              onClick={() => !submitted && onAnswer(question.id, option.key)}
              disabled={submitted}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all
                flex items-start gap-4 ${optionStyles}
                ${submitted ? 'cursor-default' : ''}
              `}
            >
              <span className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${isSelected && !submitted ? 'bg-primary text-primary-foreground' : ''}
                ${submitted && isCorrectOption ? 'bg-green-500 text-white' : ''}
                ${submitted && isSelected && !isCorrect ? 'bg-red-500 text-white' : ''}
                ${!isSelected && !submitted ? 'bg-muted text-muted-foreground border border-border' : ''}
                ${!isSelected && submitted && !isCorrectOption ? 'bg-muted text-muted-foreground' : ''}
              `}>
                {submitted && isCorrectOption ? <Check className="h-4 w-4" /> : 
                 submitted && isSelected && !isCorrect ? <X className="h-4 w-4" /> : 
                 option.key}
              </span>
              <span className="text-foreground pt-1">
                {language === 'vi' ? option.vi : option.zh}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation after submit */}
      {submitted && (question.explanation_vi || question.explanation_zh) && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-foreground">
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              {language === 'vi' ? '💡 Giải thích: ' : '💡 解释：'}
            </span>
            {language === 'vi' ? question.explanation_vi : question.explanation_zh}
          </p>
        </div>
      )}
    </div>
  );
};

export default Exercise;