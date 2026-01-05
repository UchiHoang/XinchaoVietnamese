import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Course {
  id: string;
  title_vi: string;
  title_zh: string;
  description_vi: string | null;
  description_zh: string | null;
  course_type: 'free' | 'paid' | 'exam';
  price: number | null;
  is_published: boolean | null;
  sort_order: number | null;
}

const emptyCourse: Partial<Course> = {
  title_vi: '', title_zh: '', description_vi: '', description_zh: '',
  course_type: 'free', price: 0, is_published: false, sort_order: 0
};

export default function AdminCourses() {
  const { language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order');
    if (error) {
      toast.error('Error loading courses');
      return;
    }
    setCourses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSave = async () => {
    if (!editingCourse?.title_vi || !editingCourse?.title_zh) {
      toast.error(language === 'vi' ? 'Vui lòng nhập tiêu đề' : '请输入标题');
      return;
    }

    if (editingCourse.id) {
      const { error } = await supabase
        .from('courses')
        .update({
          title_vi: editingCourse.title_vi,
          title_zh: editingCourse.title_zh,
          description_vi: editingCourse.description_vi,
          description_zh: editingCourse.description_zh,
          course_type: editingCourse.course_type,
          price: editingCourse.price,
          is_published: editingCourse.is_published,
          sort_order: editingCourse.sort_order,
        })
        .eq('id', editingCourse.id);
      if (error) {
        toast.error('Error updating course');
        return;
      }
      toast.success(language === 'vi' ? 'Đã cập nhật khóa học' : '课程已更新');
    } else {
      const { error } = await supabase.from('courses').insert({
        title_vi: editingCourse.title_vi,
        title_zh: editingCourse.title_zh,
        description_vi: editingCourse.description_vi,
        description_zh: editingCourse.description_zh,
        course_type: editingCourse.course_type,
        price: editingCourse.price,
        is_published: editingCourse.is_published,
        sort_order: editingCourse.sort_order,
      });
      if (error) {
        toast.error('Error creating course');
        return;
      }
      toast.success(language === 'vi' ? 'Đã tạo khóa học' : '课程已创建');
    }

    setDialogOpen(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'vi' ? 'Bạn có chắc muốn xóa?' : '确定要删除吗？')) return;
    
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      toast.error('Error deleting course');
      return;
    }
    toast.success(language === 'vi' ? 'Đã xóa khóa học' : '课程已删除');
    fetchCourses();
  };

  const togglePublish = async (course: Course) => {
    const { error } = await supabase
      .from('courses')
      .update({ is_published: !course.is_published })
      .eq('id', course.id);
    if (error) {
      toast.error('Error updating course');
      return;
    }
    fetchCourses();
  };

  const getBadgeColor = (type: string) => {
    switch(type) {
      case 'free': return 'bg-success';
      case 'paid': return 'bg-primary';
      case 'exam': return 'bg-accent';
      default: return 'bg-muted';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {language === 'vi' ? 'Quản lý khóa học' : '课程管理'}
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCourse(emptyCourse)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'vi' ? 'Thêm khóa học' : '添加课程'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse?.id 
                  ? (language === 'vi' ? 'Sửa khóa học' : '编辑课程') 
                  : (language === 'vi' ? 'Thêm khóa học mới' : '添加新课程')}
              </DialogTitle>
            </DialogHeader>
            {editingCourse && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tiêu đề (Tiếng Việt)</Label>
                    <Input
                      value={editingCourse.title_vi || ''}
                      onChange={(e) => setEditingCourse({...editingCourse, title_vi: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>标题 (中文)</Label>
                    <Input
                      value={editingCourse.title_zh || ''}
                      onChange={(e) => setEditingCourse({...editingCourse, title_zh: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mô tả (Tiếng Việt)</Label>
                    <Textarea
                      value={editingCourse.description_vi || ''}
                      onChange={(e) => setEditingCourse({...editingCourse, description_vi: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>描述 (中文)</Label>
                    <Textarea
                      value={editingCourse.description_zh || ''}
                      onChange={(e) => setEditingCourse({...editingCourse, description_zh: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>{language === 'vi' ? 'Loại' : '类型'}</Label>
                    <Select
                      value={editingCourse.course_type || 'free'}
                      onValueChange={(v) => setEditingCourse({...editingCourse, course_type: v as Course['course_type']})}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">{language === 'vi' ? 'Miễn phí' : '免费'}</SelectItem>
                        <SelectItem value="paid">{language === 'vi' ? 'Trả phí' : '付费'}</SelectItem>
                        <SelectItem value="exam">{language === 'vi' ? 'Luyện thi' : '考试'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{language === 'vi' ? 'Giá (VND)' : '价格'}</Label>
                    <Input
                      type="number"
                      value={editingCourse.price || 0}
                      onChange={(e) => setEditingCourse({...editingCourse, price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>{language === 'vi' ? 'Thứ tự' : '排序'}</Label>
                    <Input
                      type="number"
                      value={editingCourse.sort_order || 0}
                      onChange={(e) => setEditingCourse({...editingCourse, sort_order: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {language === 'vi' ? 'Hủy' : '取消'}
              </Button>
              <Button onClick={handleSave}>
                {language === 'vi' ? 'Lưu' : '保存'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'vi' ? 'Tiêu đề' : '标题'}</TableHead>
                <TableHead>{language === 'vi' ? 'Loại' : '类型'}</TableHead>
                <TableHead>{language === 'vi' ? 'Giá' : '价格'}</TableHead>
                <TableHead>{language === 'vi' ? 'Trạng thái' : '状态'}</TableHead>
                <TableHead className="text-right">{language === 'vi' ? 'Hành động' : '操作'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {language === 'vi' ? 'Đang tải...' : '加载中...'}
                  </TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {language === 'vi' ? 'Chưa có khóa học nào' : '暂无课程'}
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{language === 'vi' ? course.title_vi : course.title_zh}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'vi' ? course.title_zh : course.title_vi}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(course.course_type)}>
                        {course.course_type === 'free' && (language === 'vi' ? 'Miễn phí' : '免费')}
                        {course.course_type === 'paid' && (language === 'vi' ? 'Trả phí' : '付费')}
                        {course.course_type === 'exam' && (language === 'vi' ? 'Luyện thi' : '考试')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {course.price ? `${course.price.toLocaleString()} VND` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.is_published ? 'default' : 'secondary'}>
                        {course.is_published 
                          ? (language === 'vi' ? 'Đã xuất bản' : '已发布') 
                          : (language === 'vi' ? 'Bản nháp' : '草稿')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublish(course)}
                          title={course.is_published ? 'Ẩn' : 'Xuất bản'}
                        >
                          {course.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditingCourse(course); setDialogOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(course.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
