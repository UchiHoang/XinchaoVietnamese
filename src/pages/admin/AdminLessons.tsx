import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  course_id: string;
  title_vi: string;
  title_zh: string;
  description_vi: string | null;
  description_zh: string | null;
  content_vi: string | null;
  content_zh: string | null;
  access_type: 'free' | 'paid';
  duration_minutes: number | null;
  sort_order: number | null;
  is_published: boolean | null;
}

interface Course {
  id: string;
  title_vi: string;
  title_zh: string;
}

const emptyLesson: Partial<Lesson> = {
  course_id: '', title_vi: '', title_zh: '', description_vi: '', description_zh: '',
  content_vi: '', content_zh: '', access_type: 'free', duration_minutes: 15, sort_order: 0, is_published: false
};

export default function AdminLessons() {
  const { language } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
  const [filterCourse, setFilterCourse] = useState<string>('all');

  const fetchData = async () => {
    const [lessonsRes, coursesRes] = await Promise.all([
      supabase.from('lessons').select('*').order('course_id').order('sort_order'),
      supabase.from('courses').select('id, title_vi, title_zh').order('sort_order'),
    ]);

    if (lessonsRes.error) toast.error('Error loading lessons');
    if (coursesRes.error) toast.error('Error loading courses');

    setLessons(lessonsRes.data || []);
    setCourses(coursesRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!editingLesson?.title_vi || !editingLesson?.title_zh || !editingLesson?.course_id) {
      toast.error(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : '请填写完整信息');
      return;
    }

    const lessonData = {
      course_id: editingLesson.course_id,
      title_vi: editingLesson.title_vi,
      title_zh: editingLesson.title_zh,
      description_vi: editingLesson.description_vi,
      description_zh: editingLesson.description_zh,
      content_vi: editingLesson.content_vi,
      content_zh: editingLesson.content_zh,
      access_type: editingLesson.access_type,
      duration_minutes: editingLesson.duration_minutes,
      sort_order: editingLesson.sort_order,
      is_published: editingLesson.is_published,
    };

    if (editingLesson.id) {
      const { error } = await supabase.from('lessons').update(lessonData).eq('id', editingLesson.id);
      if (error) { toast.error('Error updating lesson'); return; }
      toast.success(language === 'vi' ? 'Đã cập nhật bài học' : '课时已更新');
    } else {
      const { error } = await supabase.from('lessons').insert(lessonData);
      if (error) { toast.error('Error creating lesson'); return; }
      toast.success(language === 'vi' ? 'Đã tạo bài học' : '课时已创建');
    }

    setDialogOpen(false);
    setEditingLesson(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'vi' ? 'Bạn có chắc muốn xóa?' : '确定要删除吗？')) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) { toast.error('Error deleting lesson'); return; }
    toast.success(language === 'vi' ? 'Đã xóa bài học' : '课时已删除');
    fetchData();
  };

  const togglePublish = async (lesson: Lesson) => {
    const { error } = await supabase.from('lessons').update({ is_published: !lesson.is_published }).eq('id', lesson.id);
    if (error) { toast.error('Error updating lesson'); return; }
    fetchData();
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? (language === 'vi' ? course.title_vi : course.title_zh) : '-';
  };

  const filteredLessons = filterCourse === 'all' ? lessons : lessons.filter(l => l.course_id === filterCourse);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{language === 'vi' ? 'Quản lý bài học' : '课时管理'}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingLesson(emptyLesson)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'vi' ? 'Thêm bài học' : '添加课时'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLesson?.id ? (language === 'vi' ? 'Sửa bài học' : '编辑课时') : (language === 'vi' ? 'Thêm bài học mới' : '添加新课时')}
              </DialogTitle>
            </DialogHeader>
            {editingLesson && (
              <div className="grid gap-4 py-4">
                <div>
                  <Label>{language === 'vi' ? 'Khóa học' : '课程'}</Label>
                  <Select value={editingLesson.course_id || ''} onValueChange={(v) => setEditingLesson({...editingLesson, course_id: v})}>
                    <SelectTrigger><SelectValue placeholder={language === 'vi' ? 'Chọn khóa học' : '选择课程'} /></SelectTrigger>
                    <SelectContent>
                      {courses.map(c => (
                        <SelectItem key={c.id} value={c.id}>{language === 'vi' ? c.title_vi : c.title_zh}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Tiêu đề (Tiếng Việt)</Label><Input value={editingLesson.title_vi || ''} onChange={(e) => setEditingLesson({...editingLesson, title_vi: e.target.value})} /></div>
                  <div><Label>标题 (中文)</Label><Input value={editingLesson.title_zh || ''} onChange={(e) => setEditingLesson({...editingLesson, title_zh: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Mô tả (Tiếng Việt)</Label><Textarea value={editingLesson.description_vi || ''} onChange={(e) => setEditingLesson({...editingLesson, description_vi: e.target.value})} /></div>
                  <div><Label>描述 (中文)</Label><Textarea value={editingLesson.description_zh || ''} onChange={(e) => setEditingLesson({...editingLesson, description_zh: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Nội dung (Tiếng Việt)</Label><Textarea rows={4} value={editingLesson.content_vi || ''} onChange={(e) => setEditingLesson({...editingLesson, content_vi: e.target.value})} /></div>
                  <div><Label>内容 (中文)</Label><Textarea rows={4} value={editingLesson.content_zh || ''} onChange={(e) => setEditingLesson({...editingLesson, content_zh: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>{language === 'vi' ? 'Quyền truy cập' : '访问权限'}</Label>
                    <Select value={editingLesson.access_type || 'free'} onValueChange={(v) => setEditingLesson({...editingLesson, access_type: v as 'free' | 'paid'})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">{language === 'vi' ? 'Miễn phí' : '免费'}</SelectItem>
                        <SelectItem value="paid">{language === 'vi' ? 'Trả phí' : '付费'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>{language === 'vi' ? 'Thời lượng (phút)' : '时长(分钟)'}</Label><Input type="number" value={editingLesson.duration_minutes || 15} onChange={(e) => setEditingLesson({...editingLesson, duration_minutes: Number(e.target.value)})} /></div>
                  <div><Label>{language === 'vi' ? 'Thứ tự' : '排序'}</Label><Input type="number" value={editingLesson.sort_order || 0} onChange={(e) => setEditingLesson({...editingLesson, sort_order: Number(e.target.value)})} /></div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{language === 'vi' ? 'Hủy' : '取消'}</Button>
              <Button onClick={handleSave}>{language === 'vi' ? 'Lưu' : '保存'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === 'vi' ? 'Tất cả khóa học' : '所有课程'}</SelectItem>
            {courses.map(c => (
              <SelectItem key={c.id} value={c.id}>{language === 'vi' ? c.title_vi : c.title_zh}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'vi' ? 'Tiêu đề' : '标题'}</TableHead>
                <TableHead>{language === 'vi' ? 'Khóa học' : '课程'}</TableHead>
                <TableHead>{language === 'vi' ? 'Thời lượng' : '时长'}</TableHead>
                <TableHead>{language === 'vi' ? 'Trạng thái' : '状态'}</TableHead>
                <TableHead className="text-right">{language === 'vi' ? 'Hành động' : '操作'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">{language === 'vi' ? 'Đang tải...' : '加载中...'}</TableCell></TableRow>
              ) : filteredLessons.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{language === 'vi' ? 'Chưa có bài học nào' : '暂无课时'}</TableCell></TableRow>
              ) : (
                filteredLessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{language === 'vi' ? lesson.title_vi : lesson.title_zh}</p>
                        <p className="text-sm text-muted-foreground">{language === 'vi' ? lesson.title_zh : lesson.title_vi}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{getCourseName(lesson.course_id)}</Badge></TableCell>
                    <TableCell>{lesson.duration_minutes} {language === 'vi' ? 'phút' : '分钟'}</TableCell>
                    <TableCell>
                      <Badge variant={lesson.is_published ? 'default' : 'secondary'}>
                        {lesson.is_published ? (language === 'vi' ? 'Đã xuất bản' : '已发布') : (language === 'vi' ? 'Bản nháp' : '草稿')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => togglePublish(lesson)}>{lesson.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                        <Button variant="ghost" size="icon" onClick={() => { setEditingLesson(lesson); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(lesson.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
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
