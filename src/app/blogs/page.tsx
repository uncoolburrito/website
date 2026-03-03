import Link from 'next/link';

export const metadata = {
    title: 'Blogs - Ramiz Rahman',
    description: 'My thoughts and writings.',
};

const BLOGS = [
    {
        slug: 'studio-ghibli-style-art-with-ai',
        title: 'Studio Ghibli Style Art with AI (my thoughts, no hard feelings)',
        date: 'Feb 15, 2025',
    }
];

export default function BlogsPage() {
    return (
        <div className="w-full max-w-3xl flex flex-col gap-12 px-6 py-24 sm:py-32">
            <section className="flex flex-col mb-4">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                    blogs
                </h1>
            </section>

            <div className="flex flex-col border-t border-foreground/10 pt-8 mt-4">
                {BLOGS.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blogs/${post.slug}`}
                        className="flex flex-col space-y-1 mb-6 group cursor-pointer"
                    >
                        <div className="w-full flex flex-col md:flex-row md:items-center md:space-x-4">
                            <span className="text-foreground/50 w-[120px] tabular-nums font-mono text-sm mb-1 md:mb-0">
                                {post.date}
                            </span>
                            <span className="text-foreground tracking-tight font-medium text-[17px] group-hover:underline decoration-foreground/30 underline-offset-4">
                                {post.title}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
