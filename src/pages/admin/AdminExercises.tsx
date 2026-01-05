import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen, Headphones, Pen, BookText } from 'lucide-react';

interface ExerciseSet {
  id: string;
  level: 'A' | 'B' | 'C';
  set_number: number;
  title_vi: string;
  title_zh: string;
  is_published: boolean;
}

interface Exercise {
  id: string;
  exercise_set_id: string;
  category: 'vocabulary' | 'reading' | 'listening' | 'writing';
  exercise_number: number;
  title_vi: string;
  title_zh: string;
  reading_passage_vi?: string;
  reading_passage_zh?: string;
  is_published: boolean;
}

interface Question {
  id: string;
  exercise_id: string;
  question_number: number;
  question_vi: string;
  question_zh: string;
  options: { label: string; text_vi: string; text_zh: string }[];
  correct_answer: string;
  explanation_vi?: string;
  explanation_zh?: string;
}

const emptySet: Omit<ExerciseSet, 'id'> = {
  level: 'A',
  set_number: 1,
  title_vi: '',
  title_zh: '',
  is_published: false,
};

const emptyExercise: Omit<Exercise, 'id'> = {
  exercise_set_id: '',
  category: 'vocabulary',
  exercise_number: 1,
  title_vi: '',
  title_zh: '',
  reading_passage_vi: '',
  reading_passage_zh: '',
  is_published: false,
};

const emptyQuestion: Omit<Question, 'id'> = {
  exercise_id: '',
  question_number: 1,
  question_vi: '',
  question_zh: '',
  options: [
    { label: 'A', text_vi: '', text_zh: '' },
    { label: 'B', text_vi: '', text_zh: '' },
    { label: 'C', text_vi: '', text_zh: '' },
  ],
  correct_answer: 'A',
  explanation_vi: '',
  explanation_zh: '',
};

const categoryIcons = {
  vocabulary: BookText,
  reading: BookOpen,
  listening: Headphones,
  writing: Pen,
};

const AdminExercises = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [sets, setSets] = useState<ExerciseSet[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('sets');
  const [setDialogOpen, setSetDialogOpen] = useState(false);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  
  const [editingSet, setEditingSet] = useState<ExerciseSet | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [setsRes, exercisesRes, questionsRes] = await Promise.all([
      supabase.from('exercise_sets').select('*').order('level').order('set_number'),
      supabase.from('exercises').select('*').order('sort_order'),
      supabase.from('exercise_questions').select('*').order('sort_order'),
    ]);

    if (setsRes.data) setSets(setsRes.data as ExerciseSet[]);
    if (exercisesRes.data) setExercises(exercisesRes.data.map(e => ({
      ...e,
      reading_passage_vi: e.reading_passage_vi || '',
      reading_passage_zh: e.reading_passage_zh || '',
    })) as Exercise[]);
    if (questionsRes.data) setQuestions(questionsRes.data.map(q => ({
      ...q,
      options: Array.isArray(q.options) ? q.options as unknown as Question['options'] : [],
      explanation_vi: q.explanation_vi || '',
      explanation_zh: q.explanation_zh || '',
    })));
    
    setLoading(false);
  };

  // Exercise Set CRUD
  const handleSaveSet = async () => {
    if (!editingSet) return;
    
    const data = {
      level: editingSet.level,
      set_number: editingSet.set_number,
      title_vi: editingSet.title_vi,
      title_zh: editingSet.title_zh,
      is_published: editingSet.is_published,
    };

    if ('id' in editingSet && editingSet.id) {
      await supabase.from('exercise_sets').update(data).eq('id', editingSet.id);
    } else {
      await supabase.from('exercise_sets').insert(data);
    }

    toast({ title: language === 'vi' ? 'Đã lưu!' : '已保存！' });
    setSetDialogOpen(false);
    setEditingSet(null);
    fetchData();
  };

  const handleDeleteSet = async (id: string) => {
    if (!confirm(language === 'vi' ? 'Xóa bộ đề này?' : '确定删除此题组？')) return;
    await supabase.from('exercise_sets').delete().eq('id', id);
    toast({ title: language === 'vi' ? 'Đã xóa!' : '已删除！' });
    fetchData();
  };

  const toggleSetPublish = async (set: ExerciseSet) => {
    await supabase.from('exercise_sets').update({ is_published: !set.is_published }).eq('id', set.id);
    fetchData();
  };

  // Exercise CRUD
  const handleSaveExercise = async () => {
    if (!editingExercise) return;

    const data = {
      exercise_set_id: editingExercise.exercise_set_id,
      category: editingExercise.category,
      exercise_number: editingExercise.exercise_number,
      title_vi: editingExercise.title_vi,
      title_zh: editingExercise.title_zh,
      reading_passage_vi: editingExercise.reading_passage_vi || null,
      reading_passage_zh: editingExercise.reading_passage_zh || null,
      is_published: editingExercise.is_published,
    };

    if ('id' in editingExercise && editingExercise.id) {
      await supabase.from('exercises').update(data).eq('id', editingExercise.id);
    } else {
      await supabase.from('exercises').insert(data);
    }

    toast({ title: language === 'vi' ? 'Đã lưu!' : '已保存！' });
    setExerciseDialogOpen(false);
    setEditingExercise(null);
    fetchData();
  };

  const handleDeleteExercise = async (id: string) => {
    if (!confirm(language === 'vi' ? 'Xóa bài tập này?' : '确定删除此练习？')) return;
    await supabase.from('exercises').delete().eq('id', id);
    toast({ title: language === 'vi' ? 'Đã xóa!' : '已删除！' });
    fetchData();
  };

  const toggleExercisePublish = async (exercise: Exercise) => {
    await supabase.from('exercises').update({ is_published: !exercise.is_published }).eq('id', exercise.id);
    fetchData();
  };

  // Question CRUD
  const handleSaveQuestion = async () => {
    if (!editingQuestion) return;

    const data = {
      exercise_id: editingQuestion.exercise_id,
      question_number: editingQuestion.question_number,
      question_vi: editingQuestion.question_vi,
      question_zh: editingQuestion.question_zh,
      options: editingQuestion.options,
      correct_answer: editingQuestion.correct_answer,
      explanation_vi: editingQuestion.explanation_vi || null,
      explanation_zh: editingQuestion.explanation_zh || null,
    };

    if ('id' in editingQuestion && editingQuestion.id) {
      await supabase.from('exercise_questions').update(data).eq('id', editingQuestion.id);
    } else {
      await supabase.from('exercise_questions').insert(data);
    }

    toast({ title: language === 'vi' ? 'Đã lưu!' : '已保存！' });
    setQuestionDialogOpen(false);
    setEditingQuestion(null);
    fetchData();
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm(language === 'vi' ? 'Xóa câu hỏi này?' : '确定删除此问题？')) return;
    await supabase.from('exercise_questions').delete().eq('id', id);
    toast({ title: language === 'vi' ? 'Đã xóa!' : '已删除！' });
    fetchData();
  };

  const updateOption = (index: number, field: 'text_vi' | 'text_zh', value: string) => {
    if (!editingQuestion) return;
    const newOptions = [...editingQuestion.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const filteredExercises = selectedSetId 
    ? exercises.filter(e => e.exercise_set_id === selectedSetId)
    : exercises;

  const filteredQuestions = selectedExerciseId
    ? questions.filter(q => q.exercise_id === selectedExerciseId)
    : questions;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {language === 'vi' ? 'Quản lý bài tập' : '练习管理'}
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sets">
            {language === 'vi' ? 'Bộ đề' : '题组'}
          </TabsTrigger>
          <TabsTrigger value="exercises">
            {language === 'vi' ? 'Bài tập' : '练习'}
          </TabsTrigger>
          <TabsTrigger value="questions">
            {language === 'vi' ? 'Câu hỏi' : '问题'}
          </TabsTrigger>
        </TabsList>

        {/* Exercise Sets Tab */}
        <TabsContent value="sets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === 'vi' ? 'Danh sách bộ đề' : '题组列表'}</CardTitle>
              <Button onClick={() => { setEditingSet(emptySet as ExerciseSet); setSetDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Thêm bộ đề' : '添加题组'}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'vi' ? 'Trình độ' : '级别'}</TableHead>
                    <TableHead>{language === 'vi' ? 'Số thứ tự' : '序号'}</TableHead>
                    <TableHead>{language === 'vi' ? 'Tiêu đề' : '标题'}</TableHead>
                    <TableHead>{language === 'vi' ? 'Trạng thái' : '状态'}</TableHead>
                    <TableHead className="text-right">{language === 'vi' ? 'Thao tác' : '操作'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sets.map((set) => (
                    <TableRow key={set.id}>
                      <TableCell>
                        <Badge variant="outline">{set.level}</Badge>
                      </TableCell>
                      <TableCell>Test {set.set_number}</TableCell>
                      <TableCell>{language === 'vi' ? set.title_vi : set.title_zh}</TableCell>
                      <TableCell>
                        <Badge variant={set.is_published ? 'default' : 'secondary'}>
                          {set.is_published 
                            ? (language === 'vi' ? 'Đã đăng' : '已发布')
                            : (language === 'vi' ? 'Nháp' : '草稿')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => toggleSetPublish(set)}>
                          {set.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditingSet(set); setSetDialogOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteSet(set.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercises Tab */}
        <TabsContent value="exercises">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <CardTitle>{language === 'vi' ? 'Danh sách bài tập' : '练习列表'}</CardTitle>
                <Select value={selectedSetId} onValueChange={setSelectedSetId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={language === 'vi' ? 'Lọc theo bộ đề' : '按题组筛选'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{language === 'vi' ? 'Tất cả' : '全部'}</SelectItem>
                    {sets.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.level} - Test {s.set_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => { 
                setEditingExercise({ ...emptyExercise, exercise_set_id: selectedSetId } as Exercise); 
                setExerciseDialogOpen(true); 
              }}>
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Thêm bài tập' : '添加练习'}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'vi' ? 'Loại' : '类型'}</TableHead>
                    <TableHead>{language === 'vi' ? 'Số thứ tự' : '序号'}</TableHead>
                    <TableHead>{language === 'vi' ? 'Tiêu đề' : '标题'}</TableHead>
                    <TableHead>{language === 'vi' ? 'Trạng thái' : '状态'}</TableHead>
                    <TableHead className="text-right">{language === 'vi' ? 'Thao tác' : '操作'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExercises.map((ex) => {
                    const Icon = categoryIcons[ex.category];
                    return (
                      <TableRow key={ex.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="capitalize">{ex.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>Bài tập {ex.exercise_number}</TableCell>
                        <TableCell>{language === 'vi' ? ex.title_vi : ex.title_zh}</TableCell>
                        <TableCell>
                          <Badge variant={ex.is_published ? 'default' : 'secondary'}>
                            {ex.is_published ? (language === 'vi' ? 'Đã đăng' : '已发布') : (language === 'vi' ? 'Nháp' : '草稿')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => toggleExercisePublish(ex)}>
                            {ex.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setEditingExercise(ex); setExerciseDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteExercise(ex.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <CardTitle>{language === 'vi' ? 'Danh sách câu hỏi' : '问题列表'}</CardTitle>
                <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder={language === 'vi' ? 'Lọc theo bài tập' : '按练习筛选'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{language === 'vi' ? 'Tất cả' : '全部'}</SelectItem>
                    {exercises.map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {language === 'vi' ? e.title_vi : e.title_zh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => { 
                  setEditingQuestion({ ...emptyQuestion, exercise_id: selectedExerciseId } as Question); 
                  setQuestionDialogOpen(true); 
                }}
                disabled={!selectedExerciseId}
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Thêm câu hỏi' : '添加问题'}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>{language === 'vi' ? 'Câu hỏi' : '问题'}</TableHead>
                    <TableHead>{language === 'vi' ? 'Đáp án' : '答案'}</TableHead>
                    <TableHead className="text-right">{language === 'vi' ? 'Thao tác' : '操作'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell>{q.question_number}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {language === 'vi' ? q.question_vi : q.question_zh}
                      </TableCell>
                      <TableCell>
                        <Badge>{q.correct_answer}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => { setEditingQuestion(q); setQuestionDialogOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteQuestion(q.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Set Dialog */}
      <Dialog open={setDialogOpen} onOpenChange={setSetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSet?.id ? (language === 'vi' ? 'Sửa bộ đề' : '编辑题组') : (language === 'vi' ? 'Thêm bộ đề' : '添加题组')}
            </DialogTitle>
          </DialogHeader>
          {editingSet && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'vi' ? 'Trình độ' : '级别'}</Label>
                  <Select 
                    value={editingSet.level} 
                    onValueChange={(v) => setEditingSet({ ...editingSet, level: v as 'A' | 'B' | 'C' })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{language === 'vi' ? 'Số thứ tự' : '序号'}</Label>
                  <Input 
                    type="number" 
                    value={editingSet.set_number} 
                    onChange={(e) => setEditingSet({ ...editingSet, set_number: parseInt(e.target.value) || 1 })} 
                  />
                </div>
              </div>
              <div>
                <Label>{language === 'vi' ? 'Tiêu đề (Tiếng Việt)' : '标题（越南语）'}</Label>
                <Input 
                  value={editingSet.title_vi} 
                  onChange={(e) => setEditingSet({ ...editingSet, title_vi: e.target.value })} 
                />
              </div>
              <div>
                <Label>{language === 'vi' ? 'Tiêu đề (Tiếng Trung)' : '标题（中文）'}</Label>
                <Input 
                  value={editingSet.title_zh} 
                  onChange={(e) => setEditingSet({ ...editingSet, title_zh: e.target.value })} 
                />
              </div>
              <Button onClick={handleSaveSet} className="w-full">
                {language === 'vi' ? 'Lưu' : '保存'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Exercise Dialog */}
      <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExercise?.id ? (language === 'vi' ? 'Sửa bài tập' : '编辑练习') : (language === 'vi' ? 'Thêm bài tập' : '添加练习')}
            </DialogTitle>
          </DialogHeader>
          {editingExercise && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'vi' ? 'Bộ đề' : '题组'}</Label>
                  <Select 
                    value={editingExercise.exercise_set_id} 
                    onValueChange={(v) => setEditingExercise({ ...editingExercise, exercise_set_id: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {sets.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.level} - Test {s.set_number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{language === 'vi' ? 'Loại bài tập' : '练习类型'}</Label>
                  <Select 
                    value={editingExercise.category} 
                    onValueChange={(v) => setEditingExercise({ ...editingExercise, category: v as Exercise['category'] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vocabulary">{language === 'vi' ? 'Từ vựng' : '词汇'}</SelectItem>
                      <SelectItem value="reading">{language === 'vi' ? 'Đọc hiểu' : '阅读理解'}</SelectItem>
                      <SelectItem value="listening">{language === 'vi' ? 'Nghe' : '听力'}</SelectItem>
                      <SelectItem value="writing">{language === 'vi' ? 'Viết' : '写作'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>{language === 'vi' ? 'Số thứ tự bài tập' : '练习序号'}</Label>
                <Input 
                  type="number" 
                  value={editingExercise.exercise_number} 
                  onChange={(e) => setEditingExercise({ ...editingExercise, exercise_number: parseInt(e.target.value) || 1 })} 
                />
              </div>
              <div>
                <Label>{language === 'vi' ? 'Tiêu đề (Tiếng Việt)' : '标题（越南语）'}</Label>
                <Input 
                  value={editingExercise.title_vi} 
                  onChange={(e) => setEditingExercise({ ...editingExercise, title_vi: e.target.value })} 
                />
              </div>
              <div>
                <Label>{language === 'vi' ? 'Tiêu đề (Tiếng Trung)' : '标题（中文）'}</Label>
                <Input 
                  value={editingExercise.title_zh} 
                  onChange={(e) => setEditingExercise({ ...editingExercise, title_zh: e.target.value })} 
                />
              </div>
              {editingExercise.category === 'reading' && (
                <>
                  <div>
                    <Label>{language === 'vi' ? 'Đoạn văn (Tiếng Việt)' : '文章（越南语）'}</Label>
                    <Textarea 
                      rows={6}
                      value={editingExercise.reading_passage_vi || ''} 
                      onChange={(e) => setEditingExercise({ ...editingExercise, reading_passage_vi: e.target.value })} 
                    />
                  </div>
                  <div>
                    <Label>{language === 'vi' ? 'Đoạn văn (Tiếng Trung)' : '文章（中文）'}</Label>
                    <Textarea 
                      rows={6}
                      value={editingExercise.reading_passage_zh || ''} 
                      onChange={(e) => setEditingExercise({ ...editingExercise, reading_passage_zh: e.target.value })} 
                    />
                  </div>
                </>
              )}
              <Button onClick={handleSaveExercise} className="w-full">
                {language === 'vi' ? 'Lưu' : '保存'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Question Dialog */}
      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion?.id ? (language === 'vi' ? 'Sửa câu hỏi' : '编辑问题') : (language === 'vi' ? 'Thêm câu hỏi' : '添加问题')}
            </DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'vi' ? 'Bài tập' : '练习'}</Label>
                  <Select 
                    value={editingQuestion.exercise_id} 
                    onValueChange={(v) => setEditingQuestion({ ...editingQuestion, exercise_id: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {exercises.map(e => (
                        <SelectItem key={e.id} value={e.id}>
                          {language === 'vi' ? e.title_vi : e.title_zh}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{language === 'vi' ? 'Số thứ tự' : '序号'}</Label>
                  <Input 
                    type="number" 
                    value={editingQuestion.question_number} 
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, question_number: parseInt(e.target.value) || 1 })} 
                  />
                </div>
              </div>
              <div>
                <Label>{language === 'vi' ? 'Câu hỏi (Tiếng Việt)' : '问题（越南语）'}</Label>
                <Textarea 
                  value={editingQuestion.question_vi} 
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question_vi: e.target.value })} 
                />
              </div>
              <div>
                <Label>{language === 'vi' ? 'Câu hỏi (Tiếng Trung)' : '问题（中文）'}</Label>
                <Textarea 
                  value={editingQuestion.question_zh} 
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question_zh: e.target.value })} 
                />
              </div>
              
              <div className="space-y-3">
                <Label>{language === 'vi' ? 'Các đáp án' : '答案选项'}</Label>
                {editingQuestion.options.map((opt, idx) => (
                  <div key={opt.label} className="grid grid-cols-[40px_1fr_1fr] gap-2 items-center">
                    <Badge variant="outline" className="justify-center">{opt.label}</Badge>
                    <Input 
                      placeholder={language === 'vi' ? 'Tiếng Việt' : '越南语'}
                      value={opt.text_vi} 
                      onChange={(e) => updateOption(idx, 'text_vi', e.target.value)} 
                    />
                    <Input 
                      placeholder={language === 'vi' ? 'Tiếng Trung' : '中文'}
                      value={opt.text_zh} 
                      onChange={(e) => updateOption(idx, 'text_zh', e.target.value)} 
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label>{language === 'vi' ? 'Đáp án đúng' : '正确答案'}</Label>
                <Select 
                  value={editingQuestion.correct_answer} 
                  onValueChange={(v) => setEditingQuestion({ ...editingQuestion, correct_answer: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {editingQuestion.options.map(opt => (
                      <SelectItem key={opt.label} value={opt.label}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{language === 'vi' ? 'Giải thích (Tiếng Việt)' : '解释（越南语）'}</Label>
                <Textarea 
                  value={editingQuestion.explanation_vi || ''} 
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation_vi: e.target.value })} 
                />
              </div>
              <div>
                <Label>{language === 'vi' ? 'Giải thích (Tiếng Trung)' : '解释（中文）'}</Label>
                <Textarea 
                  value={editingQuestion.explanation_zh || ''} 
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation_zh: e.target.value })} 
                />
              </div>

              <Button onClick={handleSaveQuestion} className="w-full">
                {language === 'vi' ? 'Lưu' : '保存'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminExercises;
