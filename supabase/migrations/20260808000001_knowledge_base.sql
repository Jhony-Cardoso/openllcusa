-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the knowledge_base table
create table if not exists knowledge_base (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  embedding vector(1536) -- OpenAI text-embedding-3-small generates 1536 dimensional vectors
);

-- Create an HNSW index for faster similarity search
create index if not exists knowledge_base_embedding_idx 
on knowledge_base 
using hnsw (embedding vector_cosine_ops);

-- Create a function to search for matching knowledge
drop function if exists match_knowledge(vector, float, int);
create or replace function match_knowledge (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    knowledge_base.id,
    knowledge_base.title,
    knowledge_base.content,
    1 - (knowledge_base.embedding <=> query_embedding) as similarity
  from knowledge_base
  where 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
