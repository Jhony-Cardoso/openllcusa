-- Añadir columnas de atribución e intención a chat_leads
ALTER TABLE chat_leads 
  ADD COLUMN IF NOT EXISTS attribution TEXT,
  ADD COLUMN IF NOT EXISTS intent TEXT;

-- Añadir comentarios descriptivos
COMMENT ON COLUMN chat_leads.attribution IS 'Canal de origen del lead: google, linkedin, referral, youtube, other';
COMMENT ON COLUMN chat_leads.intent IS 'Intención declarada: hot_lead, warm_lead, exploring, ai_chat, other';
