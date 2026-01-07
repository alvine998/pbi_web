import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-gray-50 to-gray-100">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Illustration Area */}
                <div className="relative mb-12">
                    <div className="text-[12rem] font-black text-gray-200 select-none leading-none animate-pulse">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center rotate-12 transition-transform hover:rotate-0">
                            <AlertTriangle className="w-16 h-16 text-amber-500" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    Halaman Tidak Ditemukan
                </h1>
                <p className="text-xl text-gray-500 mb-12 max-w-lg mx-auto">
                    Ups! Sepertinya Anda tersesat di dimensi lain. Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center space-x-2 border border-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Kembali</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center space-x-2"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Home className="w-5 h-5" />
                        <span>Ke Dashboard</span>
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-20 flex items-center justify-center space-x-8 text-gray-300">
                    <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4" />
                        <span className="text-sm font-medium">Verify URL</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Report Issue</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
