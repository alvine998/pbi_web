import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, X, MessageSquare, Eye, Heart, Loader2, AlertCircle, Pin, Upload, Image as ImageIcon } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const ITEMS_PER_PAGE = 10;

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
    comments?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface FormData {
    title: string;
    content: string;
    category: string;
    image: string;
    status: string;
    isPinned: boolean;
}

export default function ForumPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
    const [deletingPost, setDeletingPost] = useState<ForumPost | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        category: '',
        image: '',
        status: 'active',
        isPinned: false
    });

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const categories = ['Teknologi', 'Marketing', 'Manajemen', 'Bisnis', 'Desain', 'Umum'];
    const statuses = ['active', 'inactive'];

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', ITEMS_PER_PAGE.toString());

            if (searchQuery) params.append('search', searchQuery);
            if (categoryFilter) params.append('category', categoryFilter);
            if (statusFilter) params.append('status', statusFilter);

            const response = await api.get(`/forum?${params.toString()}`);
            const data = response.data;

            console.log('Forum API response:', data);

            // Handle response formats
            if (data.items) {
                setPosts(data.items);
                setTotalItems(data.totalItems || data.items.length);
                setTotalPages(data.totalPages || Math.ceil((data.totalItems || data.items.length) / ITEMS_PER_PAGE));
            } else if (Array.isArray(data)) {
                setPosts(data);
                setTotalItems(data.length);
                setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
            } else if (data.data) {
                setPosts(Array.isArray(data.data) ? data.data : []);
                setTotalItems(data.total || data.data.length);
                setTotalPages(data.totalPages || Math.ceil(data.total / ITEMS_PER_PAGE));
            } else {
                setPosts([]);
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (err: any) {
            console.error('Error fetching forum posts:', err);
            setError(err.response?.data?.message || 'Gagal memuat data forum');
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, categoryFilter, statusFilter]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openCreateModal = () => {
        setEditingPost(null);
        setFormData({
            title: '',
            content: '',
            category: '',
            image: '',
            status: 'active',
            isPinned: false
        });
        setImageFile(null);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (post: ForumPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            category: post.category || '',
            image: post.image || '',
            status: post.status || 'active',
            isPinned: post.isPinned || false
        });
        setImageFile(null);
        setImagePreview(post.image || null);
        setIsModalOpen(true);
    };

    const openDeleteModal = (post: ForumPost) => {
        setDeletingPost(post);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        setFormData({
            title: '',
            content: '',
            category: '',
            image: '',
            status: 'active',
            isPinned: false
        });
        setImageFile(null);
        setImagePreview(null);
    };

    // Handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast.error('Ukuran file maksimal 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            showToast.error('File harus berupa gambar');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData({ ...formData, image: '' });
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    // Upload image to server
    const uploadImage = async (file: File): Promise<string> => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file, file.name);

        const response = await api.post('/upload', formDataUpload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Handle various response formats
        const data = response.data;
        return data.url || data.file?.url || data.data?.url || '';
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingPost(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            showToast.error('Judul dan konten wajib diisi');
            return;
        }

        setIsSubmitting(true);
        const loadingToast = showToast.loading(editingPost ? 'Menyimpan perubahan...' : 'Membuat postingan...');

        try {
            let imageUrl = formData.image;

            // Upload new image if selected
            if (imageFile) {
                try {
                    showToast.dismiss(loadingToast);
                    const uploadToast = showToast.loading('Mengunggah gambar...');
                    imageUrl = await uploadImage(imageFile);
                    showToast.dismiss(uploadToast);
                } catch (uploadErr) {
                    console.error('Image upload failed:', uploadErr);
                    showToast.dismiss(loadingToast);
                    showToast.error('Gagal mengunggah gambar');
                    setIsSubmitting(false);
                    return;
                }
            }

            const submitToast = showToast.loading(editingPost ? 'Menyimpan perubahan...' : 'Membuat postingan...');

            const payload = {
                title: formData.title,
                content: formData.content,
                category: formData.category,
                image: imageUrl,
                status: formData.status,
                isPinned: formData.isPinned,
                userId: user?.id || 0,
                userName: user?.name || 'Anonymous'
            };

            if (editingPost) {
                await api.put(`/forum/${editingPost.id}`, payload);
                showToast.dismiss(submitToast);
                showToast.success('Postingan berhasil diperbarui!');
            } else {
                await api.post('/forum', payload);
                showToast.dismiss(submitToast);
                showToast.success('Postingan baru berhasil dibuat!');
            }

            closeModal();
            fetchPosts();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menyimpan postingan');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingPost) return;

        setIsSubmitting(true);
        const loadingToast = showToast.loading('Menghapus postingan...');

        try {
            await api.delete(`/forum/${deletingPost.id}`);
            showToast.dismiss(loadingToast);
            showToast.success('Postingan berhasil dihapus!');
            closeDeleteModal();
            fetchPosts();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menghapus postingan');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (postId: number) => {
        try {
            await api.post(`/forum/${postId}/like`);
            showToast.success('Postingan disukai!');
            fetchPosts();
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Gagal menyukai postingan');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
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

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            Forum Diskusi
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            Diskusi dan berbagi pengetahuan
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Buat Diskusi Baru</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <input
                                type="text"
                                placeholder="Cari diskusi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            />
                        </div>
                        <div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            >
                                <option value="">Semua Status</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status === 'active' ? 'Aktif' : 'Tidak Aktif'}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                {/* Posts List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
                            <p style={{ color: 'var(--color-gray-custom)' }}>Memuat data...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-gray-custom)' }} />
                            <p style={{ color: 'var(--color-gray-custom)' }}>Tidak ada diskusi ditemukan</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
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
                                            <span className="text-sm" style={{ color: 'var(--color-gray-custom)' }}>
                                                oleh {post.userName || 'Anonymous'} • {formatDate(post.createdAt)}
                                            </span>
                                        </div>
                                        <h3
                                            className="text-xl font-bold mb-2 cursor-pointer hover:opacity-80"
                                            style={{ color: 'var(--color-primary)' }}
                                            onClick={() => navigate(`/forum/${post.id}`)}
                                        >
                                            {post.title}
                                        </h3>
                                        <p className="mb-3 line-clamp-2" style={{ color: 'var(--color-dark-gray)' }}>
                                            {post.content}
                                        </p>
                                        {post.image && (
                                            <div className="mb-3">
                                                <img src={post.image} alt={post.title} className="w-32 h-20 object-cover rounded-lg" />
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <Heart className="w-4 h-4" style={{ color: 'var(--color-danger)' }} />
                                                <span className="text-sm font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{post.likes || 0} likes</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <MessageSquare className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                                                <span className="text-sm font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{post.comments || 0} komentar</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Eye className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                                                <span className="text-sm font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{post.views || 0} views</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-danger)' }}
                                            title="Like"
                                        >
                                            <Heart className="w-4 h-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/forum/${post.id}`)}
                                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-info)' }}
                                            title="Lihat Detail"
                                        >
                                            <Eye className="w-4 h-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(post)}
                                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-warning)' }}
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(post)}
                                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-danger)' }}
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {posts.length > 0 && (
                    <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
                        <p className="text-sm text-center" style={{ color: 'var(--color-dark-gray)' }}>
                            Menampilkan {posts.length} dari {totalItems} diskusi
                        </p>
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                />

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {editingPost ? 'Edit Postingan' : 'Buat Diskusi Baru'}
                                    </h2>
                                    <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <X className="w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Judul <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Masukkan judul diskusi..."
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Konten <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Jelaskan topik diskusi Anda..."
                                        rows={5}
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                            Kategori
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        >
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Tidak Aktif</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Gambar
                                    </label>
                                    <div className="flex items-start space-x-4">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                                <ImageIcon className="w-10 h-10 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                ref={imageInputRef}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => imageInputRef.current?.click()}
                                                className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)' }}
                                            >
                                                <Upload className="w-4 h-4" />
                                                <span className="text-sm">{imagePreview ? 'Ganti Gambar' : 'Unggah Gambar'}</span>
                                            </button>
                                            <p className="text-xs mt-2" style={{ color: 'var(--color-gray-custom)' }}>
                                                Format: JPG, PNG. Maks 5MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="isPinned"
                                        checked={formData.isPinned}
                                        onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                                        className="w-5 h-5 rounded"
                                    />
                                    <label htmlFor="isPinned" className="text-sm font-medium" style={{ color: 'var(--color-dark-gray)' }}>
                                        Pin postingan ini
                                    </label>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-3 border rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-gray-custom)' }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    >
                                        {isSubmitting ? 'Menyimpan...' : editingPost ? 'Simpan Perubahan' : 'Buat Diskusi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && deletingPost && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                    <Trash2 className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                    Hapus Postingan?
                                </h3>
                                <p className="mb-6" style={{ color: 'var(--color-gray-custom)' }}>
                                    Apakah Anda yakin ingin menghapus "<strong>{deletingPost.title}</strong>"? Semua komentar juga akan dihapus.
                                </p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={closeDeleteModal}
                                        className="flex-1 px-4 py-3 border rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-gray-custom)' }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
                                        style={{ backgroundColor: 'var(--color-danger)' }}
                                    >
                                        {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
