import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MessageSquare, Tag, Clock, User, Send, ThumbsUp } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';

interface Comment {
    id: number;
    author: string;
    avatar: string;
    content: string;
    createdAt: string;
    likes: number;
}

interface DiscussionDetail {
    id: number;
    title: string;
    category: string;
    description: string;
    tags: string[];
    author: string;
    createdAt: string;
    views: number;
    comments: Comment[];
}

export default function ForumDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState('');

    // Mock data - in production, fetch from API based on id
    const [discussion] = useState<DiscussionDetail>({
        id: parseInt(id || '1'),
        title: 'Bagaimana cara meningkatkan performa website?',
        category: 'Teknologi',
        description: 'Saya ingin tahu tips dan trik untuk meningkatkan kecepatan loading website. Website saya saat ini memiliki loading time sekitar 5 detik dan saya ingin menurunkannya menjadi di bawah 2 detik. Apa saja yang perlu saya perhatikan?',
        tags: ['performance', 'web', 'optimization'],
        author: 'John Doe',
        createdAt: '2024-01-05',
        views: 145,
        comments: [
            { id: 1, author: 'Jane Smith', avatar: 'JS', content: 'Coba optimasi gambar dengan menggunakan format WebP dan lazy loading. Ini bisa mengurangi loading time secara signifikan.', createdAt: '2024-01-05 10:30', likes: 8 },
            { id: 2, author: 'Bob Wilson', avatar: 'BW', content: 'Gunakan CDN untuk static assets dan enable caching di server. Juga minify CSS dan JavaScript files.', createdAt: '2024-01-05 14:20', likes: 12 },
            { id: 3, author: 'Alice Brown', avatar: 'AB', content: 'Jangan lupa untuk menggunakan compression seperti Gzip atau Brotli. Dan pastikan untuk menghapus unused CSS/JS.', createdAt: '2024-01-06 09:15', likes: 5 },
            { id: 4, author: 'Charlie Davis', avatar: 'CD', content: 'Saya recommend untuk menggunakan tools seperti Google PageSpeed Insights atau Lighthouse untuk analyze performa website Anda.', createdAt: '2024-01-06 16:45', likes: 15 },
        ]
    });

    const [comments, setComments] = useState(discussion.comments);

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Math.max(...comments.map(c => c.id), 0) + 1,
            author: 'Current User',
            avatar: 'CU',
            content: newComment,
            createdAt: new Date().toLocaleString('id-ID'),
            likes: 0
        };

        setComments([...comments, comment]);
        setNewComment('');
        showToast.success('Komentar berhasil ditambahkan!');
    };

    const handleLike = (commentId: number) => {
        setComments(comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
        showToast.success('Liked!');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Teknologi': return 'var(--color-info)';
            case 'Marketing': return 'var(--color-danger)';
            case 'Manajemen': return 'var(--color-warning)';
            case 'Bisnis': return 'var(--color-success)';
            case 'Desain': return 'var(--color-primary)';
            default: return 'var(--color-gray-custom)';
        }
    };

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

                {/* Discussion Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                            backgroundColor: getCategoryColor(discussion.category),
                            color: '#fff'
                        }}>
                            {discussion.category}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--color-gray-custom)' }}>
                            {discussion.views} views
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
                        {discussion.title}
                    </h1>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: 'var(--color-info)' }}>
                                {discussion.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{discussion.author}</p>
                                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-gray-custom)' }}>
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDate(discussion.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--color-dark-gray)' }}>
                        {discussion.description}
                    </p>
                    {discussion.tags.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4" style={{ color: 'var(--color-gray-custom)' }} />
                            {discussion.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-dark-gray)' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center space-x-2 mb-6">
                        <MessageSquare className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            {comments.length} Komentar
                        </h2>
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleSubmitComment} className="mb-8">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0" style={{ backgroundColor: 'var(--color-success)' }}>
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Tulis komentar Anda..."
                                    rows={3}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 mb-3"
                                    style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                />
                                <button
                                    type="submit"
                                    className="flex items-center space-x-2 px-6 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Kirim Komentar</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-4 pb-6 border-b" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0" style={{ backgroundColor: 'var(--color-info)' }}>
                                    {comment.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{comment.author}</p>
                                            <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-gray-custom)' }}>
                                                <Clock className="w-3 h-3" />
                                                <span>{comment.createdAt}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-3" style={{ color: 'var(--color-dark-gray)' }}>{comment.content}</p>
                                    <button
                                        onClick={() => handleLike(comment.id)}
                                        className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:opacity-80 transition-opacity"
                                        style={{ backgroundColor: 'var(--color-secondary)' }}
                                    >
                                        <ThumbsUp className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                                        <span className="text-sm font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{comment.likes}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
