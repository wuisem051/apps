import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, Mail, Github, Chrome, ArrowRight, Clipboard } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { useAuth } from '../context/AuthContext';
import { ADMIN_CREDENTIALS } from './Admin';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (!isLoading && user) {
            navigate('/playpaste');
        }
    }, [user, isLoading, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Check for Admin Credentials
        if (email === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('isAdmin', 'true');
            // Trigger storage event for AuthContext to update
            window.dispatchEvent(new Event('storage'));
            toast.success("¡Bienvenido Administrador!");
            navigate('/playpaste');
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("¡Bienvenido de nuevo!");
            navigate('/playpaste');
        } catch (error: any) {
            toast.error("Error al iniciar sesión: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success("Sesión iniciada con Google");
            navigate('/playpaste');
        } catch (error: any) {
            toast.error("Error con Google: " + error.message);
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
                                <Clipboard className="w-24 h-24 text-white" />
                            </div>
                            <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2 underline decoration-orange-500 underline-offset-8 uppercase">PASTE INYECTOR</h1>
                            <p className="text-white/80 font-medium">Inicia sesión en tu cuenta</p>
                        </div>

                        <div className="p-10 space-y-8">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="tu@email.com o 'admin'"
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
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4864D1]/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full bg-[#4864D1] hover:bg-[#3B54B4] text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg shadow-[#4864D1]/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Cargando...' : 'Entrar'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                                    <span className="px-4 bg-white text-slate-400">O continúa con</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm"
                                >
                                    <Chrome className="w-5 h-5 text-red-500" />
                                    Google
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm"
                                >
                                    <Github className="w-5 h-5 text-slate-800" />
                                    GitHub
                                </button>
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-slate-500 font-medium">
                                    ¿No tienes cuenta? {' '}
                                    <Link to="/register" className="text-[#4864D1] font-bold hover:underline">Regístrate</Link>
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
