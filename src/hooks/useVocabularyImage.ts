import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VocabularyImageCache {
  [key: string]: string;
}

// Simple in-memory cache to avoid duplicate API calls in same session
const memoryCache: VocabularyImageCache = {};

export const useVocabularyImage = (vocabulary: string, language: 'vi' | 'zh', enabled: boolean = true) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !vocabulary || vocabulary.trim() === '') {
      setImageUrl(null);
      setLoading(false);
      return;
    }

    const cacheKey = `${vocabulary.trim().toLowerCase()}_${language}`;
    
    // Check memory cache first
    if (memoryCache[cacheKey]) {
      setImageUrl(memoryCache[cacheKey]);
      setLoading(false);
      return;
    }

    // Prevent duplicate requests for same vocabulary
    if (requestedRef.current) return;

    const fetchImage = async () => {
      requestedRef.current = true;
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching vocabulary image for: "${vocabulary}" (${language})`);
        
        const { data, error: fnError } = await supabase.functions.invoke('generate-vocabulary-image', {
          body: { vocabulary: vocabulary.trim(), language }
        });

        if (fnError) {
          console.error('Edge function error:', fnError);
          throw new Error(fnError.message);
        }

        if (data?.imageUrl) {
          console.log(`Got image URL: ${data.imageUrl}, cached: ${data.cached}`);
          memoryCache[cacheKey] = data.imageUrl;
          setImageUrl(data.imageUrl);
        } else if (data?.error) {
          throw new Error(data.error);
        }
      } catch (err) {
        console.error('Failed to get vocabulary image:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate image');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      requestedRef.current = false;
    };
  }, [vocabulary, language, enabled]);

  return { imageUrl, loading, error };
};
