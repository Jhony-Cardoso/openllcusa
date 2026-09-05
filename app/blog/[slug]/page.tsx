// app/blog/[slug]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getAllPosts,
  getPostBySlug,
} from '@/lib/blog/posts';


interface PageProps {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description:
      post.excerpt ||
      'Guía completa sobre LLC en Estados Unidos para emprendedores hispanohablantes.',
    alternates: {
      canonical: `https://openllcusa.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://openllcusa.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://openllcusa.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://openllcusa.com/blog/${slug}` }
    ]
  };

  return (
    <main className="blog-page">
      {post.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="blog-container">
        <article className="blog-article">
          <div className="blog-inner">
            {/* Navegación Back */}
            <div className="mb-6">
              <a 
                href="/blog" 
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a todos los artículos
              </a>
            </div>

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
                <div className="blog-tags mb-8">
                  {tags.map((tag: string) => (
                    <span key={tag} className="blog-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {post.image && (
                <div className="w-full max-h-96 mb-12 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(12,32,71,0.12)] border border-slate-100 flex items-center justify-center bg-slate-50">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    width={1200} 
                    height={500} 
                    className="w-full h-full object-cover"
                    priority
                  />
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
            <section className="mt-12 rounded-2xl bg-blue-50/50 border border-blue-100 px-8 py-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
              <div className="sm:max-w-2xl">
                <h2 className="mb-2 text-2xl font-bold text-slate-900">
                  ¿Te ayudamos a crear tu LLC?
                </h2>
                <p className="text-slate-600 mb-6 sm:mb-0">
                  Proceso completo en 72 horas, sin complicaciones. Te guiamos paso a paso según tu situación y los objetivos de tu negocio.
                </p>
              </div>
              <div className="flex-shrink-0">
                <a 
                  href="/agendar" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                >
                  Agendar llamada gratuita
                </a>
              </div>
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
