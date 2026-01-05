import { useVocabularyImage } from '@/hooks/useVocabularyImage';
import { ImageIcon, Sparkles, Loader2 } from 'lucide-react';

interface VocabularyImageProps {
  vocabulary: string;
  language: 'vi' | 'zh';
  enabled?: boolean;
}

const VocabularyImage = ({ vocabulary, language, enabled = true }: VocabularyImageProps) => {
  const { imageUrl, loading, error } = useVocabularyImage(vocabulary, language, enabled);

  if (!enabled) return null;

  if (loading) {
    return (
      <div className="relative w-full aspect-square max-w-[180px] mx-auto mb-4">
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 animate-pulse flex items-center justify-center border-2 border-dashed border-primary/30">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-medium">
              {language === 'vi' ? 'AI đang tạo hình...' : 'AI生成中...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className="w-full aspect-square max-w-[180px] mx-auto mb-4 rounded-xl bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
          <span className="text-xs text-center px-2">
            {language === 'vi' ? 'Không có hình' : '暂无图片'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square max-w-[180px] mx-auto mb-4 group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
      <img
        src={imageUrl}
        alt={vocabulary}
        className="relative w-full h-full object-cover rounded-xl shadow-lg border-2 border-primary/20"
        loading="lazy"
      />
      <div className="absolute bottom-1 right-1 bg-background/80 backdrop-blur-sm rounded-full p-1">
        <Sparkles className="h-3 w-3 text-primary" />
      </div>
    </div>
  );
};

export default VocabularyImage;
