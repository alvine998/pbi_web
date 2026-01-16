import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, X, Calendar, CheckCircle, Clock, Loader2, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';

const ITEMS_PER_PAGE = 9;

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

interface FormData {
    title: string;
    category: string;
    content: string;
    status: string;
    image: string;
}

export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [deletingArticle, setDeletingArticle] = useState<NewsArticle | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        category: 'Technology',
        content: '',
        status: 'Draft',
        image: ''
    });

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const categories = ['Technology', 'Business', 'Event', 'Promo', 'General'];
    const statuses = ['Published', 'Draft'];

    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', ITEMS_PER_PAGE.toString());

            if (searchQuery) params.append('search', searchQuery);
            if (categoryFilter) params.append('category', categoryFilter);
            if (statusFilter) params.append('status', statusFilter);

            const response = await api.get(`/news?${params.toString()}`);
            const data = response.data;

            console.log('News API response:', data);

            if (data.items) {
                setArticles(data.items);
                setTotalItems(data.totalItems || data.items.length);
                setTotalPages(data.totalPages || Math.ceil((data.totalItems || data.items.length) / ITEMS_PER_PAGE));
            } else if (Array.isArray(data)) {
                setArticles(data);
                setTotalItems(data.length);
                setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
            } else if (data.data) {
                setArticles(Array.isArray(data.data) ? data.data : []);
                setTotalItems(data.total || data.data.length);
                setTotalPages(data.totalPages || Math.ceil(data.total / ITEMS_PER_PAGE));
            } else {
                setArticles([]);
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (err: any) {
            console.error('Error fetching news:', err);
            setError(err.response?.data?.message || 'Gagal memuat data berita');
            setArticles([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, categoryFilter, statusFilter]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage !== 1) setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openCreateModal = () => {
        setEditingArticle(null);
        setFormData({
            title: '',
            category: 'Technology',
            content: '',
            status: 'Draft',
            image: ''
        });
        setImageFile(null);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (article: NewsArticle) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            category: article.category || 'Technology',
            content: article.content || '',
            status: article.status || 'Draft',
            image: article.image || ''
        });
        setImageFile(null);
        setImagePreview(article.image || null);
        setIsModalOpen(true);
    };

    const openDeleteModal = (article: NewsArticle) => {
        setDeletingArticle(article);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingArticle(null);
        setFormData({
            title: '',
            category: 'Technology',
            content: '',
            status: 'Draft',
            image: ''
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingArticle(null);
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

        const data = response.data;
        return data.url || data.file?.url || data.data?.url || '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            showToast.error('Judul dan konten wajib diisi');
            return;
        }

        setIsSubmitting(true);
        const loadingToast = showToast.loading(editingArticle ? 'Menyimpan perubahan...' : 'Menyimpan berita...');

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

            const submitToast = showToast.loading(editingArticle ? 'Menyimpan perubahan...' : 'Menyimpan berita...');

            const payload = {
                title: formData.title,
                category: formData.category,
                content: formData.content,
                status: formData.status,
                image: imageUrl
            };

            if (editingArticle) {
                await api.put(`/news/${editingArticle.id}`, payload);
                showToast.dismiss(submitToast);
                showToast.success('Berita berhasil diperbarui!');
            } else {
                await api.post('/news', payload);
                showToast.dismiss(submitToast);
                showToast.success('Berita baru berhasil dibuat!');
            }

            closeModal();
            fetchArticles();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menyimpan berita');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingArticle) return;

        setIsSubmitting(true);
        const loadingToast = showToast.loading('Menghapus berita...');

        try {
            await api.delete(`/news/${deletingArticle.id}`);
            showToast.dismiss(loadingToast);
            showToast.success('Berita berhasil dihapus!');
            closeDeleteModal();
            fetchArticles();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menghapus berita');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Manajemen Berita</h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>Kelola konten berita dan publikasi artikel</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tulis Berita Baru</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <input
                                type="text"
                                placeholder="Cari berita..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2"
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
                                className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
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
                                className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            >
                                <option value="">Semua Status</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
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

                {/* News List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                            <p style={{ color: 'var(--color-gray-custom)' }}>Memuat berita...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group ring-1 ring-gray-100">
                                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {article.image ? (
                                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <ImageIcon className="w-16 h-16 text-gray-300" />
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider">
                                        <span className="px-3 py-1 rounded-lg bg-indigo-50" style={{ color: 'var(--color-primary)' }}>{article.category || 'General'}</span>
                                        <span className={`px-3 py-1 rounded-lg flex items-center space-x-1 ${article.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                            {article.status === 'Published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            <span>{article.status || 'Draft'}</span>
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 leading-tight line-clamp-2" style={{ color: 'var(--color-primary)' }}>{article.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{article.content}</p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(article.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => openEditModal(article)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openDeleteModal(article)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {articles.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white rounded-2xl shadow-inner ring-1 ring-gray-100 italic text-gray-400">
                                Tidak ada berita ditemukan
                            </div>
                        )}
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                />

                {/* News Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {editingArticle ? 'Edit Berita' : 'Tulis Berita Baru'}
                                    </h2>
                                    <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <X className="w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700">Judul Berita <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Masukkan judul berita..."
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">Kategori</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        >
                                            {statuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700">Gambar</label>
                                    <div className="flex items-start space-x-4">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <div className="w-32 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
                                            <div className="w-32 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
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

                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700">Konten <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Tulis konten berita di sini..."
                                        rows={6}
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none resize-none"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        required
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 rounded-xl text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    >
                                        {isSubmitting ? 'Menyimpan...' : editingArticle ? 'Update Berita' : 'Publikasikan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && deletingArticle && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                    <Trash2 className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                    Hapus Berita?
                                </h3>
                                <p className="mb-6" style={{ color: 'var(--color-gray-custom)' }}>
                                    Apakah Anda yakin ingin menghapus "<strong>{deletingArticle.title}</strong>"?
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
