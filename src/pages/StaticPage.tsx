import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSiteSettings } from '../context/SiteContext';

export default function StaticPage() {
    const { slug } = useParams();
    const { footerPages } = useSiteSettings();

    const page = footerPages.find(p => p.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!page) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-1 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <article className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm prose prose-slate max-w-none">
                        <h1 className="text-3xl font-bold text-slate-900 mb-8 border-b pb-4">
                            {page.title}
                        </h1>
                        <div
                            className="text-slate-600 leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: page.content.replace(/\n\n/g, '<br/><br/>') }}
                        />
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
