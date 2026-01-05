-- Create vocabulary_images table to cache AI-generated images (stores URLs only, not binary data)
CREATE TABLE public.vocabulary_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vocabulary_key TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'vi',
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_vocabulary_lang UNIQUE (vocabulary_key, language)
);

-- Enable RLS
ALTER TABLE public.vocabulary_images ENABLE ROW LEVEL SECURITY;

-- Anyone can read cached images (they are public educational content)
CREATE POLICY "Anyone can view vocabulary images" 
ON public.vocabulary_images 
FOR SELECT 
USING (true);

-- Only authenticated users can insert (via edge function with service role)
CREATE POLICY "Service role can insert vocabulary images" 
ON public.vocabulary_images 
FOR INSERT 
WITH CHECK (true);

-- Create index for fast lookups
CREATE INDEX idx_vocabulary_images_lookup ON public.vocabulary_images (vocabulary_key, language);

-- Create storage bucket for vocabulary images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vocabulary-images', 'vocabulary-images', true);

-- Storage policies for vocabulary images bucket
CREATE POLICY "Vocabulary images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vocabulary-images');

CREATE POLICY "Service role can upload vocabulary images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vocabulary-images');

-- Create trigger for updated_at
CREATE TRIGGER update_vocabulary_images_updated_at
BEFORE UPDATE ON public.vocabulary_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();