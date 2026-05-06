-- Migration 007: Create leads table for quiz/calculadora lead capture
-- This table was missing, causing 500 errors in /api/leads

CREATE TABLE IF NOT EXISTS public.leads (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre text NOT NULL,
    email text NOT NULL,
    telefono text,
    situacion text,
    score integer,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Index for quick email lookups (avoid duplicate leads)
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);

-- RLS: solo el rol service_role (admin) puede leer/escribir leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to leads"
    ON public.leads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
