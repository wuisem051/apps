import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Edit, Flag, TrendingUp, ChevronLeft } from 'lucide-react';
import AdBanner from '../components/AdBanner';

interface PasteTab {
    title: string;
    content: string;
}

interface Paste {
    id: string;
    title: string;
    tabs: PasteTab[];
    views: number;
}

export default function PasteView() {
    const { id } = useParams<{ id: string }>();
    const [paste, setPaste] = useState<Paste | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        fetchPaste();

        // Increment view count
        const incrementViews = async () => {
            try {
                await updateDoc(doc(db, 'pastes', id), {
                    views: increment(1)
                });
            } catch (err) {
                console.error("Error incrementing views:", err);
            }
        };

        incrementViews();
    }, [id]);

    const fetchPaste = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'pastes', id!);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPaste({ id: docSnap.id, ...docSnap.data() } as Paste);
            } else {
                toast.error("Paste no encontrado");
                navigate('/');
            }
        } catch (error) {
            toast.error("Error al cargar el paste");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#4864D1] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!paste) return null;

    return (
        <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#4864D1] mb-8 font-medium transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Ad Space Top (Image 2) */}
                <AdBanner placementId="paste_view_top" className="mb-4" />

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    {/* Paste Title */}
                    <div className="bg-gradient-to-r from-[#4864D1] to-[#607CFF] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingUp className="w-32 h-32 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white relative z-10 drop-shadow-md">
                            {paste.title}
                        </h1>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* View Counter and Tabs Navigation */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-8">
                            <div className="flex flex-wrap gap-3">
                                {paste.tabs.map((tab, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveTab(idx)}
                                        className={`px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 ${activeTab === idx ? 'bg-[#2D2D2D] text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                                    >
                                        {tab.title}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-[#EF4444] text-white w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg transform hover:rotate-12 transition-all">
                                <span className="text-lg font-black leading-tight">{paste.views + 1}</span>
                                <span className="text-[10px] font-bold uppercase -mt-1 tracking-tighter">vistas</span>
                            </div>
                        </div>

                        {/* Paste Content Wrapper */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 min-h-[300px] shadow-inner relative group">
                            {/* Content Rendered as is - In production we should use DOMPurify/dangerouslySetInnerHTML if HTML is allowed */}
                            <div className="prose prose-slate max-w-none">
                                <p className="whitespace-pre-wrap font-medium text-slate-800 leading-relaxed text-lg italic">
                                    {paste.tabs[activeTab]?.content}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => navigate(`/playpaste`)}
                                className="bg-[#4864D1] hover:bg-[#3B54B4] text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold uppercase text-xs tracking-widest shadow-lg shadow-[#4864D1]/20 transition-all transform hover:-translate-y-1"
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </button>
                            <button className="bg-[#FDA4AF] hover:bg-[#F87171] text-[#7F1D1D] px-8 py-3 rounded-xl flex items-center gap-2 font-bold uppercase text-xs tracking-widest shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1">
                                <Flag className="w-4 h-4" />
                                Reportar
                            </button>
                        </div>

                        {/* Ad Space Bottom (NEW) */}
                        <AdBanner placementId="paste_view_bottom" className="mt-8" />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
