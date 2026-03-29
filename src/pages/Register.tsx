import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, PlusCircle, ArrowRight, Clipboard } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Register() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName });

            // Save to Firestore for Admin management
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName,
                email,
                createdAt: Timestamp.now(),
                role: 'user'
            });

            toast.success("¡Cuenta creada con éxito!");
            navigate('/playpaste');
        } catch (error: any) {
            toast.error("Error al registrarse: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                        <div className="bg-[#4864D1] p-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <PlusCircle className="w-24 h-24 text-white" />
                            </div>
                            <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2 underline decoration-orange-500 underline-offset-8">PASTE INYECTOR</h1>
                            <p className="text-white/80 font-medium">Únete a nuestra plataforma</p>
                        </div>

                        <div className="p-10 space-y-8">
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de Usuario</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            required
                                            placeholder="inyector"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4864D1]/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="tu@email.com"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4864D1]/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4864D1]/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full bg-[#4864D1] hover:bg-[#3B54B4] text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg shadow-[#4864D1]/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>

                            <div className="text-center pt-4">
                                <p className="text-slate-500 font-medium">
                                    ¿Ya tienes cuenta? {' '}
                                    <Link to="/login" className="text-[#4864D1] font-bold hover:underline">Inicia sesión</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
