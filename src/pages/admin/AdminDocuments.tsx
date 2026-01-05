import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Download, FileText } from 'lucide-react';
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

interface Document {
  id: string;
  title_vi: string;
  title_zh: string;
  description_vi: string | null;
  description_zh: string | null;
  file_url: string;
  file_type: string | null;
  category: string;
  level: string | null;
  access_type: 'free' | 'paid';
  download_count: number | null;
}

const emptyDoc: Partial<Document> = {
  title_vi: '', title_zh: '', description_vi: '', description_zh: '',
  file_url: '', file_type: 'pdf', category: 'vocabulary', level: 'A1', access_type: 'free'
};

const categories = ['vocabulary', 'grammar', 'conversation', 'business', 'exam'];
const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function AdminDocuments() {
  const { language } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Partial<Document> | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const fetchDocs = async () => {
    const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    if (error) { toast.error('Error loading documents'); return; }
    setDocuments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleSave = async () => {
    if (!editingDoc?.title_vi || !editingDoc?.title_zh || !editingDoc?.file_url) {
      toast.error(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : '请填写完整信息');
      return;
    }

    const docData = {
      title_vi: editingDoc.title_vi,
      title_zh: editingDoc.title_zh,
      description_vi: editingDoc.description_vi,
      description_zh: editingDoc.description_zh,
      file_url: editingDoc.file_url,
      file_type: editingDoc.file_type,
      category: editingDoc.category || 'vocabulary',
      level: editingDoc.level,
      access_type: editingDoc.access_type,
    };

    if (editingDoc.id) {
      const { error } = await supabase.from('documents').update(docData).eq('id', editingDoc.id);
      if (error) { toast.error('Error updating document'); return; }
      toast.success(language === 'vi' ? 'Đã cập nhật tài liệu' : '资料已更新');
    } else {
      const { error } = await supabase.from('documents').insert(docData);
      if (error) { toast.error('Error creating document'); return; }
      toast.success(language === 'vi' ? 'Đã tạo tài liệu' : '资料已创建');
    }

    setDialogOpen(false);
    setEditingDoc(null);
    fetchDocs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'vi' ? 'Bạn có chắc muốn xóa?' : '确定要删除吗？')) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) { toast.error('Error deleting document'); return; }
    toast.success(language === 'vi' ? 'Đã xóa tài liệu' : '资料已删除');
    fetchDocs();
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, { vi: string; zh: string }> = {
      vocabulary: { vi: 'Từ vựng', zh: '词汇' },
      grammar: { vi: 'Ngữ pháp', zh: '语法' },
      conversation: { vi: 'Hội thoại', zh: '会话' },
      business: { vi: 'Công sở', zh: '商务' },
      exam: { vi: 'Luyện thi', zh: '考试' },
    };
    return labels[cat]?.[language] || cat;
  };

  const filteredDocs = filterCategory === 'all' ? documents : documents.filter(d => d.category === filterCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{language === 'vi' ? 'Quản lý thư viện' : '资料库管理'}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDoc(emptyDoc)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'vi' ? 'Thêm tài liệu' : '添加资料'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDoc?.id ? (language === 'vi' ? 'Sửa tài liệu' : '编辑资料') : (language === 'vi' ? 'Thêm tài liệu mới' : '添加新资料')}</DialogTitle>
            </DialogHeader>
            {editingDoc && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Tiêu đề (Tiếng Việt)</Label><Input value={editingDoc.title_vi || ''} onChange={(e) => setEditingDoc({...editingDoc, title_vi: e.target.value})} /></div>
                  <div><Label>标题 (中文)</Label><Input value={editingDoc.title_zh || ''} onChange={(e) => setEditingDoc({...editingDoc, title_zh: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Mô tả (Tiếng Việt)</Label><Textarea value={editingDoc.description_vi || ''} onChange={(e) => setEditingDoc({...editingDoc, description_vi: e.target.value})} /></div>
                  <div><Label>描述 (中文)</Label><Textarea value={editingDoc.description_zh || ''} onChange={(e) => setEditingDoc({...editingDoc, description_zh: e.target.value})} /></div>
                </div>
                <div><Label>URL File</Label><Input value={editingDoc.file_url || ''} onChange={(e) => setEditingDoc({...editingDoc, file_url: e.target.value})} placeholder="/docs/filename.pdf" /></div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>{language === 'vi' ? 'Loại file' : '文件类型'}</Label>
                    <Select value={editingDoc.file_type || 'pdf'} onValueChange={(v) => setEditingDoc({...editingDoc, file_type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="doc">DOC</SelectItem>
                        <SelectItem value="mp3">MP3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{language === 'vi' ? 'Danh mục' : '分类'}</Label>
                    <Select value={editingDoc.category || 'vocabulary'} onValueChange={(v) => setEditingDoc({...editingDoc, category: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (<SelectItem key={c} value={c}>{getCategoryLabel(c)}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{language === 'vi' ? 'Cấp độ' : '级别'}</Label>
                    <Select value={editingDoc.level || 'A1'} onValueChange={(v) => setEditingDoc({...editingDoc, level: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{levels.map(l => (<SelectItem key={l} value={l}>{l}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{language === 'vi' ? 'Quyền truy cập' : '访问权限'}</Label>
                    <Select value={editingDoc.access_type || 'free'} onValueChange={(v) => setEditingDoc({...editingDoc, access_type: v as 'free' | 'paid'})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">{language === 'vi' ? 'Miễn phí' : '免费'}</SelectItem>
                        <SelectItem value="paid">{language === 'vi' ? 'Trả phí' : '付费'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === 'vi' ? 'Tất cả' : '全部'}</SelectItem>
            {categories.map(c => (<SelectItem key={c} value={c}>{getCategoryLabel(c)}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'vi' ? 'Tiêu đề' : '标题'}</TableHead>
                <TableHead>{language === 'vi' ? 'Danh mục' : '分类'}</TableHead>
                <TableHead>{language === 'vi' ? 'Cấp độ' : '级别'}</TableHead>
                <TableHead>{language === 'vi' ? 'Quyền' : '权限'}</TableHead>
                <TableHead className="text-right">{language === 'vi' ? 'Hành động' : '操作'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">{language === 'vi' ? 'Đang tải...' : '加载中...'}</TableCell></TableRow>
              ) : filteredDocs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{language === 'vi' ? 'Chưa có tài liệu nào' : '暂无资料'}</TableCell></TableRow>
              ) : (
                filteredDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{language === 'vi' ? doc.title_vi : doc.title_zh}</p>
                          <p className="text-sm text-muted-foreground">{language === 'vi' ? doc.title_zh : doc.title_vi}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{getCategoryLabel(doc.category)}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{doc.level}</Badge></TableCell>
                    <TableCell><Badge variant={doc.access_type === 'free' ? 'default' : 'secondary'}>{doc.access_type === 'free' ? (language === 'vi' ? 'Miễn phí' : '免费') : (language === 'vi' ? 'Trả phí' : '付费')}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingDoc(doc); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
