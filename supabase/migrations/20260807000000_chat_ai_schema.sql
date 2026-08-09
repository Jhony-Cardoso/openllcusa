-- Habilitar la extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector
WITH SCHEMA extensions;

-- ==========================================
-- 1. Tabla de Conocimiento (Knowledge Base)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.chat_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(1536), -- Tamaño del vector para text-embedding-3-small de OpenAI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índice para búsquedas más rápidas (hnsw)
CREATE INDEX IF NOT EXISTS chat_knowledge_embedding_idx ON public.chat_knowledge
USING hnsw (embedding vector_cosine_ops);

-- ==========================================
-- 2. Tabla de Leads (Captura de clientes)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.chat_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    pregunta_inicial TEXT,
    status TEXT DEFAULT 'nuevo' NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de Seguridad (RLS)
ALTER TABLE public.chat_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer el conocimiento (anon)
CREATE POLICY "Allow public read-only access to chat_knowledge"
ON public.chat_knowledge FOR SELECT
TO anon, authenticated
USING (true);

-- Solo admins pueden insertar/actualizar conocimiento (asumiendo que lo hacen vía un backend seguro)
-- (Por ahora lo dejamos protegido para Service Role)

-- Cualquiera puede insertar leads (anon)
CREATE POLICY "Allow public insert to chat_leads"
ON public.chat_leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Solo authenticated (o service role) puede leer los leads
CREATE POLICY "Allow authenticated read access to chat_leads"
ON public.chat_leads FOR SELECT
TO authenticated
USING (true);

-- ==========================================
-- 3. Función de Búsqueda de Similitud (RAG)
-- ==========================================
CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    chat_knowledge.id,
    chat_knowledge.content,
    chat_knowledge.metadata,
    1 - (chat_knowledge.embedding <=> query_embedding) AS similarity
  FROM chat_knowledge
  WHERE 1 - (chat_knowledge.embedding <=> query_embedding) > match_threshold
  ORDER BY chat_knowledge.embedding <=> query_embedding
  LIMIT match_count;
$$;
