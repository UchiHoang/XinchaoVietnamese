-- Create enum for exercise categories
CREATE TYPE exercise_category AS ENUM ('vocabulary', 'reading', 'listening', 'writing');

-- Create enum for exercise levels
CREATE TYPE exercise_level AS ENUM ('A', 'B', 'C');

-- Create exercise sets table (Test 1, Test 2, etc.)
CREATE TABLE public.exercise_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level exercise_level NOT NULL DEFAULT 'A',
  set_number INTEGER NOT NULL DEFAULT 1,
  title_vi TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  description_vi TEXT,
  description_zh TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(level, set_number)
);

-- Create exercises table (Bài tập 1, Bài tập 2 within each category)
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_set_id UUID NOT NULL REFERENCES public.exercise_sets(id) ON DELETE CASCADE,
  category exercise_category NOT NULL,
  exercise_number INTEGER NOT NULL DEFAULT 1,
  title_vi TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  description_vi TEXT,
  description_zh TEXT,
  reading_passage_vi TEXT,
  reading_passage_zh TEXT,
  audio_url TEXT,
  time_limit_minutes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise questions table
CREATE TABLE public.exercise_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL DEFAULT 1,
  question_vi TEXT NOT NULL,
  question_zh TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  explanation_vi TEXT,
  explanation_zh TEXT,
  points INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise results table
CREATE TABLE public.exercise_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for exercise_sets
CREATE POLICY "Anyone can view published exercise sets"
ON public.exercise_sets FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage exercise sets"
ON public.exercise_sets FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- RLS policies for exercises
CREATE POLICY "Anyone can view published exercises"
ON public.exercises FOR SELECT
USING (is_published = true AND EXISTS (
  SELECT 1 FROM public.exercise_sets 
  WHERE exercise_sets.id = exercises.exercise_set_id 
  AND exercise_sets.is_published = true
));

CREATE POLICY "Admins can manage exercises"
ON public.exercises FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- RLS policies for exercise_questions
CREATE POLICY "Anyone can view questions for published exercises"
ON public.exercise_questions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.exercises e
  JOIN public.exercise_sets es ON es.id = e.exercise_set_id
  WHERE e.id = exercise_questions.exercise_id
  AND e.is_published = true
  AND es.is_published = true
));

CREATE POLICY "Admins can manage questions"
ON public.exercise_questions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- RLS policies for exercise_results
CREATE POLICY "Users can view own results"
ON public.exercise_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results"
ON public.exercise_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_exercises_set_category ON public.exercises(exercise_set_id, category);
CREATE INDEX idx_exercise_questions_exercise ON public.exercise_questions(exercise_id);
CREATE INDEX idx_exercise_results_user ON public.exercise_results(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_exercise_sets_updated_at
BEFORE UPDATE ON public.exercise_sets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
BEFORE UPDATE ON public.exercises
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();