import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, MessageSquare, Clock, User, Send, ThumbsUp, Heart, Eye, Loader2, AlertCircle, Trash2, Pin } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
    id: number;
    userId?: number;
    userName?: string;
    content: string;
    createdAt?: string;
    likes?: number;
}

interface ForumPost {
    id: number;
    title: string;
    content: string;
    userId?: number;
    userName?: string;
    category?: string;
    image?: string;
    status?: string;
    isPinned?: boolean;
    likes?: number;
    views?: number;
    createdAt?: string;
    updatedAt?: string;
}

export default function ForumDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState<ForumPost | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch post details
    const fetchPost = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`/forum/${id}`);
            const data = response.data;
            setPost(data.data || data);
        } catch (err: any) {
            console.error('Error fetching post:', err);
            setError(err.response?.data?.message || 'Gagal memuat postingan');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    // Fetch comments
    const fetchComments = useCallback(async () => {
        if (!id) return;

        setIsCommentsLoading(true);

        try {
            const response = await api.get(`/forum/${id}/comments`);
            const data = response.data;

            // Handle various response formats
            if (data.items) {
                setComments(data.items);
            } else if (Array.isArray(data)) {
                setComments(data);
            } else if (data.data) {
                setComments(Array.isArray(data.data) ? data.data : []);
            } else {
                setComments([]);
            }
        } catch (err: any) {
            console.error('Error fetching comments:', err);
            // Don't set error for comments, just show empty
            setComments([]);
        } finally {
            setIsCommentsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [fetchPost, fetchComments]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !id) return;

        setIsSubmitting(true);
        const loadingToast = showToast.loading('Mengirim komentar...');

        try {
            await api.post(`/forum/${id}/comments`, {
                content: newComment,
                userId: user?.id || 0,
                userName: user?.name || 'Anonymous'
            });

            showToast.dismiss(loadingToast);
            showToast.success('Komentar berhasil ditambahkan!');
            setNewComment('');
            fetchComments();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal mengirim komentar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikePost = async () => {
        if (!id) return;

        try {
            await api.post(`/forum/${id}/like`);
            showToast.success('Postingan disukai!');
            fetchPost();
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Gagal menyukai postingan');
        }
    };

    const handleLikeComment = async (commentId: number) => {
        try {
            await api.post(`/forum/${id}/comments/${commentId}/like`);
            showToast.success('Liked!');
            fetchComments();
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Gagal menyukai komentar');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;

        const loadingToast = showToast.loading('Menghapus komentar...');

        try {
            await api.delete(`/forum/${id}/comments/${commentId}`);
            showToast.dismiss(loadingToast);
            showToast.success('Komentar berhasil dihapus!');
            fetchComments();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menghapus komentar');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'Teknologi': return 'var(--color-info)';
            case 'Marketing': return 'var(--color-danger)';
            case 'Manajemen': return 'var(--color-warning)';
            case 'Bisnis': return 'var(--color-success)';
            case 'Desain': return 'var(--color-primary)';
            default: return 'var(--color-gray-custom)';
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-8 flex items-center justify-center min-h-[50vh]">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                        <p style={{ color: 'var(--color-gray-custom)' }}>Memuat postingan...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !post) {
        return (
            <DashboardLayout>
                <div className="p-8">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-red-700">{error || 'Postingan tidak ditemukan'}</p>
                        <button
                            onClick={() => navigate('/forum')}
                            className="px-4 py-2 rounded-lg text-white font-medium"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            Kembali ke Forum
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/forum')}
                    className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)' }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Kembali ke Forum</span>
                </button>

                {/* Post Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-center flex-wrap gap-2 mb-4">
                        {post.isPinned && (
                            <span className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: 'var(--color-warning)', color: '#fff' }}>
                                <Pin className="w-3 h-3" />
                                <span>Pinned</span>
                            </span>
                        )}
                        {post.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                backgroundColor: getCategoryColor(post.category),
                                color: '#fff'
                            }}>
                                {post.category}
                            </span>
                        )}
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                            backgroundColor: post.status === 'active' ? 'var(--color-success)' : 'var(--color-gray-custom)',
                            color: '#fff'
                        }}>
                            {post.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
                        {post.title}
                    </h1>

                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: 'var(--color-info)' }}>
                                {getInitials(post.userName)}
                            </div>
                            <div>
                                <p className="font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{post.userName || 'Anonymous'}</p>
                                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-gray-custom)' }}>
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {post.image && (
                        <div className="mb-4">
                            <img src={post.image} alt={post.title} className="max-w-full h-auto rounded-xl" />
                        </div>
                    )}

                    <p className="text-lg leading-relaxed mb-6 whitespace-pre-wrap" style={{ color: 'var(--color-dark-gray)' }}>
                        {post.content}
                    </p>

                    <div className="flex items-center space-x-4 pt-4 border-t" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                        <button
                            onClick={handleLikePost}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        >
                            <Heart className="w-5 h-5" style={{ color: 'var(--color-danger)' }} />
                            <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>{post.likes || 0} likes</span>
                        </button>
                        <div className="flex items-center space-x-2">
                            <Eye className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                            <span className="font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{post.views || 0} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
                            <span className="font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{comments.length} komentar</span>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center space-x-2 mb-6">
                        <MessageSquare className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            Komentar ({comments.length})
                        </h2>
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleSubmitComment} className="mb-8">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0" style={{ backgroundColor: 'var(--color-success)' }}>
                                {user ? getInitials(user.name) : <User className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Tulis komentar Anda..."
                                    rows={3}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 mb-3 resize-none"
                                    style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="flex items-center space-x-2 px-6 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Comments List */}
                    {isCommentsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-gray-custom)' }} />
                            <p style={{ color: 'var(--color-gray-custom)' }}>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex items-start space-x-4 pb-6 border-b" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0" style={{ backgroundColor: 'var(--color-info)' }}>
                                        {getInitials(comment.userName)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{comment.userName || 'Anonymous'}</p>
                                                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-gray-custom)' }}>
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatDate(comment.createdAt)}</span>
                                                </div>
                                            </div>
                                            {user?.id === comment.userId && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Hapus komentar"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="mb-3 whitespace-pre-wrap" style={{ color: 'var(--color-dark-gray)' }}>{comment.content}</p>
                                        <button
                                            onClick={() => handleLikeComment(comment.id)}
                                            className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-secondary)' }}
                                        >
                                            <ThumbsUp className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                                            <span className="text-sm font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{comment.likes || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
