import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, X, Facebook, Instagram, Twitter, Linkedin, ExternalLink, Globe, Loader2 } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';

const ITEMS_PER_PAGE = 10;

interface SocialMedia {
    id: number;
    platform: string;
    url: string;
    icon: string;
    status: 'active' | 'inactive';
    sortOrder: number;
}

export default function SocialMediaPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SocialMedia | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);

    const [formData, setFormData] = useState({
        platform: '',
        url: '',
        icon: '',
        status: 'active' as 'active' | 'inactive',
        sortOrder: 0
    });

    const [currentPage, setCurrentPage] = useState(1);

    const fetchSocialMedias = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/social-media');
            // Assuming it returns an array of SocialMedia items
            setSocialMedias(Array.isArray(response.data) ? response.data : response.data.items || []);
        } catch (error) {
            console.error('Error fetching social medias:', error);
            showToast.error('Gagal mengambil data media sosial');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSocialMedias();
    }, [fetchSocialMedias]);

    const filteredItems = socialMedias.filter(item =>
        item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number, platform: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${platform}?`)) {
            try {
                await api.delete(`/social-media/${id}`);
                showToast.success(`${platform} berhasil dihapus`);
                fetchSocialMedias();
            } catch (error) {
                console.error('Error deleting social media:', error);
                showToast.error('Gagal menghapus media sosial');
            }
        }
    };

    const handleEdit = (item: SocialMedia) => {
        setEditingItem(item);
        setFormData({
            platform: item.platform,
            url: item.url,
            icon: item.icon,
            status: item.status,
            sortOrder: item.sortOrder
        });
        setIsAddModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingItem) {
                await api.put(`/social-media/${editingItem.id}`, formData);
                showToast.success('Media sosial berhasil diperbarui');
            } else {
                await api.post('/social-media', formData);
                showToast.success('Media sosial berhasil ditambahkan');
            }
            fetchSocialMedias();
            setIsAddModalOpen(false);
            setEditingItem(null);
            setFormData({ platform: '', url: '', icon: '', status: 'active', sortOrder: 0 });
        } catch (error) {
            console.error('Error saving social media:', error);
            showToast.error('Gagal menyimpan media sosial');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('facebook')) return <Facebook className="w-5 h-5" />;
        if (p.includes('instagram')) return <Instagram className="w-5 h-5" />;
        if (p.includes('twitter') || p.includes(' x ')) return <Twitter className="w-5 h-5" />;
        if (p.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
        return <Globe className="w-5 h-5" />;
    };

    const getColor = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('facebook')) return '#1877F2';
        if (p.includes('instagram')) return '#E4405F';
        if (p.includes('twitter') || p.includes(' x ')) return '#1DA1F2';
        if (p.includes('linkedin')) return '#0A66C2';
        if (p.includes('youtube')) return '#FF0000';
        if (p.includes('tiktok')) return '#000000';
        return 'var(--color-primary)';
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            Social Media
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            Kelola tautan media sosial resmi
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({ platform: '', url: '', icon: '', status: 'active', sortOrder: 0 });
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Akun</span>
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                        <input
                            type="text"
                            placeholder="Cari platform atau URL..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                            <p className="text-gray-400">Memuat data media sosial...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead style={{ backgroundColor: 'var(--color-secondary)' }}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Platform</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>URL</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Urutan</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center" style={{ color: 'var(--color-gray-custom)' }}>
                                                Tidak ada media sosial ditemukan
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-all">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: getColor(item.platform) }}>
                                                            {getIcon(item.platform)}
                                                        </div>
                                                        <span className="font-bold text-gray-800">{item.platform}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-500 hover:underline">
                                                        <span className="truncate max-w-xs">{item.url}</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center font-mono text-sm text-gray-500">
                                                    {item.sortOrder}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id, item.platform)}
                                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={filteredItems.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                )}

                {/* Add/Edit Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsAddModalOpen(false)}></div>
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {editingItem ? 'Edit Media Sosial' : 'Tambah Akun Baru'}
                                    </h2>
                                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>

                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.platform}
                                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                            placeholder="Contoh: Instagram, Facebook, X"
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Platform URL</label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.url}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            placeholder="https://instagram.com/pbi"
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-gray-200"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                            <select
                                                required
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-gray-200"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Urutan (Sort)</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.sortOrder}
                                                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-3 pt-6">
                                        <button
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                                            style={{ backgroundColor: 'var(--color-primary)' }}
                                        >
                                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                            <span>{isSubmitting ? 'Menyimpan...' : (editingItem ? 'Update' : 'Simpan')}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
