import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    Clipboard,
    PlusCircle,
    Flag,
    Trash2,
    HelpCircle,
    Search,
    Edit,
    ChevronDown,
    User as UserIcon,
    Bold,
    Italic,
    Underline,
    Link as LinkIcon,
    Image as ImageIcon,
    List as ListIcon,
    Video,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Maximize2,
    Save,
    Trash
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, Timestamp, getDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PasteTab {
    title: string;
    content: string;
}

interface Paste {
    id: string;
    title: string;
    content: string;
    tabs: PasteTab[];
    views: number;
    createdAt: any;
    updatedAt: any;
    userId: string;
    status: 'active' | 'reported' | 'trash';
}

const RICH_TEXT_BUTTONS = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: Underline, label: 'Underline' },
    { icon: LinkIcon, label: 'Link' },
    { icon: ImageIcon, label: 'Image' },
    { icon: ListIcon, label: 'List' },
    { icon: Video, label: 'Video' },
    { icon: Quote, label: 'Quote' },
    { icon: AlignLeft, label: 'Align Left' },
    { icon: AlignCenter, label: 'Align Center' },
    { icon: AlignRight, label: 'Align Right' },
];

export default function PlayPaste() {
    const [activeSubTab, setActiveSubTab] = useState<'mis-pastes' | 'nuevo-paste' | 'reportados' | 'papelera'>('mis-pastes');
    const [pastes, setPastes] = useState<Paste[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [title, setTitle] = useState('');
    const [tabs, setTabs] = useState<PasteTab[]>([
        { title: 'Pestaña 1', content: '' },
        { title: '', content: '' },
        { title: '', content: '' },
        { title: '', content: '' },
        { title: '', content: '' },
        { title: '', content: '' }
    ]);
    const [activeEditorTab, setActiveEditorTab] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            toast.info("Por favor, inicia sesión para acceder a PlayPaste");
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (user) {
            fetchPastes();
        }
    }, [user]);

    const fetchPastes = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, 'pastes'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const fetchedPastes: Paste[] = [];
            querySnapshot.forEach((doc) => {
                fetchedPastes.push({ id: doc.id, ...doc.data() } as Paste);
            });
            setPastes(fetchedPastes);
        } catch (error) {
            console.error("Error fetching pastes: ", error);
            toast.error("Error al cargar pastes");
        } finally {
            setLoading(false);
        }
    };

    const handleSavePaste = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) {
            toast.error("El título es obligatorio");
            return;
        }

        setLoading(true);
        try {
            const pasteData = {
                title,
                tabs: tabs.filter(t => t.title || t.content),
                updatedAt: Timestamp.now(),
                status: 'active'
            };

            if (editingId) {
                await updateDoc(doc(db, 'pastes', editingId), pasteData);
                toast.success("Paste actualizado correctamente");
                setEditingId(null);
            } else {
                await addDoc(collection(db, 'pastes'), {
                    ...pasteData,
                    createdAt: Timestamp.now(),
                    views: 0,
                    userId: user?.uid || 'anonymous'
                });
                toast.success("Paste creado correctamente");
            }

            resetForm();
            setActiveSubTab('mis-pastes');
            fetchPastes();
        } catch (error) {
            console.error("Error saving paste: ", error);
            toast.error("Error al guardar el paste");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setTabs([
            { title: 'Pestaña 1', content: '' },
            { title: '', content: '' },
            { title: '', content: '' },
            { title: '', content: '' },
            { title: '', content: '' },
            { title: '', content: '' }
        ]);
        setActiveEditorTab(0);
        setEditingId(null);
    };

    const handleEdit = (paste: Paste) => {
        setTitle(paste.title);
        setTabs(paste.tabs.length > 0 ? [...paste.tabs, ...Array(6 - paste.tabs.length).fill({ title: '', content: '' })] : Array(6).fill({ title: '', content: '' }));
        setEditingId(paste.id);
        setActiveSubTab('nuevo-paste');
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este paste?")) {
            try {
                await deleteDoc(doc(db, 'pastes', id));
                toast.success("Paste eliminado");
                fetchPastes();
            } catch (error) {
                toast.error("Error al eliminar");
            }
        }
    };

    const handleTabChange = (index: number, field: 'title' | 'content', value: string) => {
        const newTabs = [...tabs];
        newTabs[index][field] = value;
        setTabs(newTabs);
    };

    const filteredPastes = pastes.filter(p =>
        p.status === (activeSubTab === 'papelera' ? 'trash' : 'active') &&
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#E9ECF2]">
            {/* Blue App Header */}
            <div className="bg-[#4864D1] py-4 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center">
                            <Clipboard className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase underline decoration-orange-500 underline-offset-4">PASTE INYECTOR</h1>
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
                        <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center overflow-hidden">
                            {user?.photoURL ? <img src={user.photoURL} alt="" /> : <UserIcon className="w-5 h-5 text-white" />}
                        </div>
                        <span className="font-medium text-sm">{user?.displayName || user?.email?.split('@')[0] || 'Cargando...'}</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Sub Navigation */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8 overflow-x-auto whitespace-nowrap">
                        <button
                            onClick={() => setActiveSubTab('mis-pastes')}
                            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all font-medium text-sm ${activeSubTab === 'mis-pastes' ? 'border-[#4864D1] text-[#4864D1]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <Clipboard className="w-4 h-4 text-orange-600" />
                            Mis pastes
                        </button>
                        <button
                            onClick={() => { setActiveSubTab('nuevo-paste'); resetForm(); }}
                            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all font-medium text-sm ${activeSubTab === 'nuevo-paste' ? 'border-[#4864D1] text-[#4864D1]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <PlusCircle className="w-4 h-4 text-orange-600" />
                            Nuevo paste
                        </button>
                        <button
                            onClick={() => setActiveSubTab('reportados')}
                            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all font-medium text-sm ${activeSubTab === 'reportados' ? 'border-[#4864D1] text-[#4864D1]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <Flag className="w-4 h-4 text-red-500" />
                            Reportados
                        </button>
                        <button
                            onClick={() => setActiveSubTab('papelera')}
                            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all font-medium text-sm ${activeSubTab === 'papelera' ? 'border-[#4864D1] text-[#4864D1]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                            Papelera
                        </button>
                        <button
                            className="flex items-center gap-2 py-4 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm"
                        >
                            <HelpCircle className="w-4 h-4 text-orange-600" />
                            Cómo usar Paste Inyector <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeSubTab === 'mis-pastes' && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-center">
                            <h2 className="text-2xl font-bold text-slate-800">Mis pastes:</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Busca un paste"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4864D1]/20"
                                    />
                                </div>
                                <button className="bg-[#4D5154] hover:bg-[#343A40] text-white px-6 py-2 rounded text-sm font-medium transition-colors uppercase">
                                    Buscar
                                </button>
                            </div>

                            <div className="flex justify-between items-center">
                                <button className="bg-[#4864D1] hover:bg-[#3B54B4] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                                    Seleccionar todos los pastes
                                </button>

                                <div className="flex gap-2">
                                    <select className="border border-slate-300 rounded px-2 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4864D1]/20">
                                        <option>Eliminar (mover a la papelera)</option>
                                        <option>Mover a reportados</option>
                                    </select>
                                    <button className="bg-[#4D5154] hover:bg-[#343A40] text-white px-6 py-2 rounded text-sm font-medium transition-colors uppercase">
                                        Procesar
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="border border-slate-200 rounded overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#4D5154] text-white uppercase text-xs font-bold tracking-wider">
                                        <tr>
                                            <th className="p-3 w-10">
                                                <input type="checkbox" className="rounded" />
                                            </th>
                                            <th className="p-3">Título</th>
                                            <th className="p-3 text-center">Opciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-slate-400">Cargando...</td>
                                            </tr>
                                        ) : filteredPastes.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-slate-400 font-medium">No se encontraron pastes</td>
                                            </tr>
                                        ) : (
                                            filteredPastes.map((p) => (
                                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-3">
                                                        <input type="checkbox" className="rounded border-slate-300" />
                                                    </td>
                                                    <td className="p-3">
                                                        <button
                                                            onClick={() => navigate(`/v/${p.id}`)}
                                                            className="text-[#4864D1] hover:underline font-medium text-sm text-left"
                                                        >
                                                            {p.title}
                                                        </button>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => handleEdit(p)}
                                                                className="bg-[#4864D1] hover:bg-[#3B54B4] text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-bold transition-all"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(p.id)}
                                                                className="bg-[#F87171] hover:bg-[#EF4444] text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-bold transition-all"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeSubTab === 'nuevo-paste' && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <form onSubmit={handleSavePaste} className="p-6 space-y-6">
                            {/* Tab Selector for Editor */}
                            <div className="flex overflow-x-auto border border-[#E9ECF2] rounded-t-md">
                                {tabs.map((tab, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveEditorTab(idx)}
                                        className={`px-6 py-4 text-xs font-bold uppercase transition-all whitespace-nowrap ${idx === activeEditorTab ? 'bg-[#2D2D2D] text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border-r border-[#E9ECF2]'}`}
                                    >
                                        {tab.title || (idx === activeEditorTab ? 'Pestaña Actual' : 'Desactivado')}
                                    </button>
                                ))}
                            </div>

                            <div className="border border-slate-200 rounded-b-md p-6 space-y-4">
                                <input
                                    type="text"
                                    placeholder="Título de la Pestaña"
                                    value={tabs[activeEditorTab].title}
                                    onChange={(e) => handleTabChange(activeEditorTab, 'title', e.target.value)}
                                    className="w-full p-3 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#4864D1]"
                                />

                                <div className="border border-slate-200 rounded overflow-hidden">
                                    {/* Rich Text Toolbar Mockup */}
                                    <div className="bg-[#F8F9FA] border-b border-slate-200 p-2 flex flex-wrap gap-1">
                                        {RICH_TEXT_BUTTONS.map((btn, idx) => {
                                            const Icon = btn.icon;
                                            return (
                                                <button key={idx} type="button" className="p-2 hover:bg-slate-200 rounded transition-colors" title={btn.label}>
                                                    <Icon className="w-4 h-4 text-slate-600" />
                                                </button>
                                            );
                                        })}
                                        <div className="w-[1px] h-6 bg-slate-300 mx-1 self-center" />
                                        <select className="bg-transparent text-xs text-slate-600 p-1 border border-slate-300 rounded">
                                            <option>Fuente</option>
                                        </select>
                                        <select className="bg-transparent text-xs text-slate-600 p-1 border border-slate-300 rounded">
                                            <option>Tamaño</option>
                                        </select>
                                        <div className="flex gap-1 ml-auto">
                                            <button type="button" className="p-2 hover:bg-slate-200 rounded"><Maximize2 className="w-4 h-4 text-slate-600" /></button>
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="Escribe el contenido aquí..."
                                        value={tabs[activeEditorTab].content}
                                        onChange={(e) => handleTabChange(activeEditorTab, 'content', e.target.value)}
                                        className="w-full h-80 p-4 focus:outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Título Principal del Paste:</label>
                                <input
                                    type="text"
                                    placeholder="Nombre de este Paste (ej: APK MOD BitLife)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-3 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#4864D1]/20 font-medium"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => { setActiveSubTab('mis-pastes'); resetForm(); }}
                                    className="px-8 py-3 rounded-md text-sm font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#4864D1] hover:bg-[#3B54B4] text-white px-10 py-3 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg shadow-[#4864D1]/20 transition-all flex items-center gap-2"
                                >
                                    {loading ? 'Guardando...' : editingId ? 'Actualizar Paste' : 'Guardar Paste'}
                                    <Save className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {(activeSubTab === 'reportados' || activeSubTab === 'papelera') && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            {activeSubTab === 'reportados' ? <Flag className="w-8 h-8 text-slate-300" /> : <Trash2 className="w-8 h-8 text-slate-300" />}
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Sección vacía</h2>
                        <p className="text-slate-500">No hay contenido en esta sección por el momento.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
