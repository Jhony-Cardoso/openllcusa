// app/blog/page.tsx

import Link from 'next/link';
import { getAllPosts } from '@/lib/blog/posts';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Blog de Open LLC USA
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Guías, consejos y novedades sobre LLC en Estados Unidos
            para emprendedores hispanohablantes que quieren cobrar en
            dólares y ordenar su fiscalidad internacional.
          </p>
        </header>

        <section className="space-y-6">
          {posts.map((post) => {
            const formattedDate = new Date(
              post.date,
            ).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <article
                key={post.slug}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {post.category}
                </p>

                <Link href={`/blog/${post.slug}`} className="mt-1 block">
                  <h2 className="text-2xl font-semibold leading-snug text-slate-900 hover:underline">
                    {post.title}
                  </h2>
                </Link>

                <p className="mt-2 text-sm text-slate-500">
                  {formattedDate} · {post.readTime} · {post.author}
                </p>

                <p className="mt-3 text-slate-700">
                  {post.excerpt}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Leer guía completa →
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
