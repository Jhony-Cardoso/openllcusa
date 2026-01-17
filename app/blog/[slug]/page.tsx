// app/blog/[slug]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getAllPosts,
  getPostBySlug,
} from '@/lib/blog/posts';

interface PageProps {
  params: { slug: string };
}

// Genera de forma estática todas las rutas /blog/[slug]
export function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// SEO: título, descripción y Open Graph por cada post
export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description:
      post.excerpt ||
      'Guía completa sobre LLC en Estados Unidos para emprendedores hispanohablantes.',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString(
    'es-ES',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  const tags = post.tags || [];

  return (
    <main className="blog-page">
      <div className="blog-container">
        <article className="blog-article">
          <div className="blog-inner">
            {/* Encabezado del artículo */}
            <header>
              <div className="blog-kicker">
                <span className="blog-kicker-dot" />
                GUÍAS
              </div>

              <h1 className="blog-title">
                {post.title}
              </h1>

              <div className="blog-meta">
                <span>{formattedDate}</span>
                <span className="blog-meta-dot" />
                <span>{post.readTime}</span>
                <span className="blog-meta-dot" />
                <span>{post.author}</span>
              </div>

              {tags.length > 0 && (
                <div className="blog-tags">
                  {tags.map((tag: string) => (
                    <span key={tag} className="blog-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Contenido del post en Markdown */}
            <section className="blog-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </section>

            {/* CTA final destacado */}
            <section className="mt-8 rounded-2xl bg-[color:var(--color-bg-8)] px-6 py-6">
              <h2 className="mb-1 text-xl font-semibold text-[color:var(--color-text)]">
                ¿Te ayudamos a crear tu LLC?
              </h2>
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                Proceso completo en 72 horas, sin complicaciones. Agenda una llamada o
                contáctanos y te guiamos paso a paso según tu situación en Argentina
                y tus objetivos con el negocio.
              </p>
              {/* Aquí puedes añadir un botón/enlace a tu formulario de contacto */}
            </section>

            {/* Pie del artículo: autor + CTA a contacto */}
            <footer className="blog-footer">
              <div className="blog-author">
                <div className="blog-author-avatar">
                  {(post.author?.[0] || 'O').toUpperCase()}
                </div>
                <div>
                  <div>{post.author}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    Acompañamos a emprendedores no residentes a crear y
                    mantener su LLC en Estados Unidos.
                  </div>
                </div>
              </div>

              <div>
                <a href="/contacto" className="blog-cta-link">
                  ¿Dudas? Habla con un experto →
                </a>
              </div>
            </footer>

            {/* JSON-LD para SEO si el post tiene schema */}
            {post.schema && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(post.schema),
                }}
              />
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
