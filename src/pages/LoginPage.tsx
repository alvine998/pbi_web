import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { showToast } from '../utils/toast';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);
        const loadingToast = showToast.loading('Sedang masuk...');

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            showToast.dismiss(loadingToast);

            // Store session using auth context
            const { token, user } = response.data;

            if (token && user) {
                login(token, {
                    id: user.id,
                    email: user.email,
                    name: user.name || user.email,
                    role: user.role,
                });
            } else if (token) {
                // Fallback if user data is not in response
                login(token, {
                    id: 0,
                    email: email,
                    name: email,
                });
            }

            showToast.success('Selamat datang kembali! Login berhasil.');
            navigate('/dashboard');
        } catch (error: any) {
            showToast.dismiss(loadingToast);
            const errorMessage = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
            showToast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-secondary)' }}>
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(101, 174, 197, 0.2)' }}></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(0, 41, 85, 0.1)' }}></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border p-8 space-y-6" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>Selamat Datang</h1>
                        <p style={{ color: 'var(--color-dark-gray)' }}>Masuk untuk melanjutkan ke dashboard Anda</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'var(--color-dark-gray)' }}>
                                Alamat Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                                    style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--color-dark-gray)' }}>
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                                    style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                                    ) : (
                                        <Eye className="w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                            className="w-full py-3 px-4 hover:opacity-90 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
