import { useEffect, useState } from 'react';
import { Download, FileText, Search, Eye, X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface Document {
  id: string;
  title_vi: string;
  title_zh: string;
  description_vi: string | null;
  description_zh: string | null;
  content_vi: string | null;
  content_zh: string | null;
  file_url: string;
  category: string;
  level: string | null;
  access_type: 'free' | 'paid';
}

export default function Library() {
  const { language, t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    async function fetchDocs() {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setDocuments(data || []);
      setLoading(false);
    }
    fetchDocs();
  }, []);

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

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = (language === 'vi' ? doc.title_vi : doc.title_zh)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || doc.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handlePreview = (doc: Document) => {
    setSelectedDoc(doc);
    setPreviewOpen(true);
  };

  const getContent = (doc: Document) => {
    return language === 'vi' ? doc.content_vi : doc.content_zh;
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
        <h1 className="text-3xl font-bold mb-8">{t('library.title')}</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('library.search')}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">{t('library.category.all')}</TabsTrigger>
            <TabsTrigger value="vocabulary">{t('library.category.vocabulary')}</TabsTrigger>
            <TabsTrigger value="grammar">{t('library.category.grammar')}</TabsTrigger>
            <TabsTrigger value="business">{t('library.category.business')}</TabsTrigger>
            <TabsTrigger value="exam">{t('library.category.exam')}</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {language === 'vi' ? 'Không tìm thấy tài liệu' : '未找到资料'}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <Card key={doc.id} className="hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={doc.access_type === 'free' ? 'default' : 'secondary'}>
                      {doc.access_type === 'free' ? t('course.free') : t('course.paid')}
                    </Badge>
                    <Badge variant="outline">{doc.level}</Badge>
                  </div>
                  <CardTitle className="flex items-center gap-2 mt-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {language === 'vi' ? doc.title_vi : doc.title_zh}
                  </CardTitle>
                  {(doc.description_vi || doc.description_zh) && (
                    <p className="text-sm text-muted-foreground">
                      {language === 'vi' ? doc.description_vi : doc.description_zh}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{getCategoryLabel(doc.category)}</Badge>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePreview(doc)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {language === 'vi' ? 'Xem' : '查看'}
                      </Button>
                      {doc.file_url && doc.file_url !== '#' && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.file_url} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedDoc && (language === 'vi' ? selectedDoc.title_vi : selectedDoc.title_zh)}
                    </DialogTitle>
                    {selectedDoc && (
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{getCategoryLabel(selectedDoc.category)}</Badge>
                        <Badge variant="outline">{selectedDoc.level}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <ScrollArea className="h-[60vh] px-6 pb-6">
              {selectedDoc && getContent(selectedDoc) ? (
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert mt-4"
                  dangerouslySetInnerHTML={{ __html: getContent(selectedDoc) || '' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <FileText className="h-16 w-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    {language === 'vi' ? 'Nội dung đang được cập nhật' : '内容正在更新中'}
                  </p>
                  <p className="text-sm mt-2">
                    {language === 'vi' 
                      ? 'Vui lòng quay lại sau hoặc tải file PDF để xem chi tiết' 
                      : '请稍后再来或下载PDF文件查看详情'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
