-- Add content columns for document preview
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS content_vi TEXT,
ADD COLUMN IF NOT EXISTS content_zh TEXT;