import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, X, Tag, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';
import { showToast } from '../utils/toast';

const ITEMS_PER_PAGE = 10;

interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function ProductCategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [categories, setCategories] = useState<Category[]>([]);
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const iconInputRef = useRef<HTMLInputElement>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', ITEMS_PER_PAGE.toString());

            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const response = await api.get(`/product/categories?${params.toString()}`);

            // Handle different possible response formats
            const data = response.data;
            let categoriesList: Category[] = [];
            let total = 0;
            let pages = 1;

            if (Array.isArray(data)) {
                // Response is an array directly
                categoriesList = data;
                total = data.length;
            } else if (data.categories) {
                // Response has 'categories' key
                categoriesList = data.categories;
                total = data.total || data.categories.length;
                pages = data.totalPages || Math.ceil(total / ITEMS_PER_PAGE);
            } else if (data.data) {
                // Response has 'data' key
                categoriesList = Array.isArray(data.data) ? data.data : [];
                total = data.total || data.count || categoriesList.length;
                pages = data.totalPages || data.last_page || Math.ceil(total / ITEMS_PER_PAGE);
            } else if (data.items) {
                // Response has 'items' key
                categoriesList = data.items;
                total = data.total || data.items.length;
                pages = data.totalPages || Math.ceil(total / ITEMS_PER_PAGE);
            }

            console.log('Categories API response:', data);
            console.log('Parsed categories:', categoriesList);

            setCategories(categoriesList);
            setTotalCategories(total);
            setTotalPages(pages);
        } catch (err: any) {
            console.error('Error fetching categories:', err);
            setError(err.response?.data?.message || 'Gagal memuat data kategori');
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

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
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        setIconFile(null);
        setIconPreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || '' });
        setIconFile(null);
        setIconPreview(category.icon || category.image || null);
        setIsModalOpen(true);
    };

    const openDeleteModal = (category: Category) => {
        setDeletingCategory(category);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        setIconFile(null);
        setIconPreview(null);
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showToast.error('Ukuran file maksimal 2MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            showToast.error('File harus berupa gambar');
            return;
        }

        setIconFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setIconPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeIcon = () => {
        setIconFile(null);
        setIconPreview(null);
        if (iconInputRef.current) iconInputRef.current.value = '';
    };

    // Upload icon to server
    const uploadIcon = async (file: File): Promise<string> => {
        const formDataUpload = new FormData();
        formDataUpload.append('files', file, file.name);

        const response = await api.post('/upload/multiple', formDataUpload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const uploadedFiles = response.data.files || [];
        return uploadedFiles.length > 0 ? uploadedFiles[0].url : '';
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            showToast.error('Nama kategori wajib diisi');
            return;
        }

        setIsSubmitting(true);
        const loadingToast = showToast.loading(editingCategory ? 'Menyimpan perubahan...' : 'Menambahkan kategori...');

        try {
            let iconUrl = editingCategory?.icon || editingCategory?.image || '';

            // Upload new icon if selected
            if (iconFile) {
                try {
                    iconUrl = await uploadIcon(iconFile);
                } catch (uploadErr) {
                    console.error('Icon upload failed:', uploadErr);
                    showToast.dismiss(loadingToast);
                    showToast.error('Gagal mengunggah ikon');
                    setIsSubmitting(false);
                    return;
                }
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                icon: iconUrl
            };

            if (editingCategory) {
                await api.put(`/product/categories/${editingCategory.id}`, payload);
                showToast.dismiss(loadingToast);
                showToast.success('Kategori berhasil diperbarui!');
            } else {
                await api.post('/product/categories', payload);
                showToast.dismiss(loadingToast);
                showToast.success('Kategori baru berhasil ditambahkan!');
            }
            closeModal();
            fetchCategories();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menyimpan kategori');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingCategory) return;

        setIsSubmitting(true);
        const loadingToast = showToast.loading('Menghapus kategori...');

        try {
            await api.delete(`/product/categories/${deletingCategory.id}`);
            showToast.dismiss(loadingToast);
            showToast.success('Kategori berhasil dihapus!');
            closeDeleteModal();
            fetchCategories();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menghapus kategori');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            Kategori Produk
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            Kelola kategori produk Anda
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Kategori</span>
                    </button>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Total Kategori</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{totalCategories}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-info)' }}>
                                <Tag className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                        <input
                            type="text"
                            placeholder="Cari kategori..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                        />
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ backgroundColor: 'var(--color-secondary)' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Nama Kategori</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Deskripsi</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center" style={{ color: 'var(--color-gray-custom)' }}>
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Memuat data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center" style={{ color: 'var(--color-danger)' }}>
                                            <div className="flex flex-col items-center space-y-2">
                                                <AlertCircle className="w-8 h-8" />
                                                <span>{error}</span>
                                                <button
                                                    onClick={fetchCategories}
                                                    className="px-4 py-2 rounded-lg text-white text-sm"
                                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                                >
                                                    Coba Lagi
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center" style={{ color: 'var(--color-gray-custom)' }}>
                                            Tidak ada kategori ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-info)' }}>
                                                        <Tag className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{category.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: 'var(--color-gray-custom)' }}>
                                                {category.description || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(category)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-warning)' }}
                                                    >
                                                        <Edit2 className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(category)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-danger)' }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(169, 169, 169, 0.1)', backgroundColor: 'var(--color-secondary)' }}>
                        <p className="text-sm" style={{ color: 'var(--color-dark-gray)' }}>
                            Menampilkan {categories.length} dari {totalCategories} kategori
                        </p>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalCategories}
                    itemsPerPage={ITEMS_PER_PAGE}
                />

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                            <div className="p-6 border-b" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                                    </h2>
                                    <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <X className="w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Nama Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Masukkan nama kategori"
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Masukkan deskripsi kategori (opsional)"
                                        rows={3}
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                    />
                                </div>
                                {/* Icon Upload */}
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Ikon Kategori
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        {iconPreview ? (
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200">
                                                    <img
                                                        src={iconPreview}
                                                        alt="Icon preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeIcon}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                ref={iconInputRef}
                                                onChange={handleIconChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => iconInputRef.current?.click()}
                                                className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)' }}
                                            >
                                                <Upload className="w-4 h-4" />
                                                <span className="text-sm">{iconPreview ? 'Ganti Ikon' : 'Unggah Ikon'}</span>
                                            </button>
                                            <p className="text-xs mt-1" style={{ color: 'var(--color-gray-custom)' }}>
                                                Format: JPG, PNG. Maks 2MB
                                            </p>
                                        </div>
                                    </div>
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
                                        {isSubmitting ? 'Menyimpan...' : editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && deletingCategory && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                                    <Trash2 className="w-8 h-8" style={{ color: 'var(--color-danger)' }} />
                                </div>
                                <h2 className="text-xl font-bold text-center mb-2" style={{ color: 'var(--color-primary)' }}>
                                    Hapus Kategori?
                                </h2>
                                <p className="text-center mb-6" style={{ color: 'var(--color-gray-custom)' }}>
                                    Apakah Anda yakin ingin menghapus kategori <strong>"{deletingCategory.name}"</strong>? Tindakan ini tidak dapat dibatalkan.
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
                                        {isSubmitting ? 'Menghapus...' : 'Hapus'}
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
