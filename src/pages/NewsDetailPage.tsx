import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar, Tag, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

interface NewsArticle {
    id: number;
    title: string;
    category?: string;
    content?: string;
    status?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function NewsDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticle = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`/news/${id}`);
            const data = response.data;
            // Handle various response formats
            setArticle(data.data || data);
        } catch (err: any) {
            console.error('Error fetching news detail:', err);
            setError(err.response?.data?.message || 'Gagal memuat detail berita');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-8 flex items-center justify-center min-h-[50vh]">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                        <p style={{ color: 'var(--color-gray-custom)' }}>Memuat detail berita...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !article) {
        return (
            <DashboardLayout>
                <div className="p-8">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-red-700">{error || 'Berita tidak ditemukan'}</p>
                        <button
                            onClick={() => navigate('/news')}
                            className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            Kembali ke Daftar Berita
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8 max-w-4xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/news')}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:opacity-80 transition-all font-semibold"
                        style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)' }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Kembali</span>
                    </button>
                </div>

                {/* Article Content */}
                <article className="bg-white rounded-3xl shadow-xl overflow-hidden ring-1 ring-gray-100">
                    {/* Featured Image */}
                    <div className="relative h-[400px] bg-gray-100 flex items-center justify-center overflow-hidden">
                        {article.image ? (
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-300">
                                <ImageIcon className="w-24 h-24 mb-2" />
                                <span className="font-medium">Tidak ada gambar</span>
                            </div>
                        )}
                        <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 rounded-xl text-sm font-bold shadow-lg text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                                {article.category || 'Berita'}
                            </span>
                        </div>
                    </div>

                    <div className="p-10">
                        {/* Meta Info */}
                        <div className="flex items-center space-x-6 mb-8 text-sm font-medium" style={{ color: 'var(--color-gray-custom)' }}>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(article.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Tag className="w-4 h-4" />
                                <span>{article.status || 'Published'}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-extrabold mb-8 leading-tight" style={{ color: 'var(--color-primary)' }}>
                            {article.title}
                        </h1>

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none prose-indigo text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: article.content || '' }}
                        />
                    </div>
                </article>
            </div>
        </DashboardLayout>
    );
}
