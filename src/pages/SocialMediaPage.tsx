import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Facebook, Instagram, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

interface SocialMedia {
    id: number;
    type: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'YouTube' | 'TikTok';
    url: string;
    description: string;
}

export default function SocialMediaPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SocialMedia | null>(null);
    const [formData, setFormData] = useState<{ type: SocialMedia['type']; url: string; description: string }>({ type: 'Facebook', url: '', description: '' });

    const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([
        { id: 1, type: 'Facebook', url: 'https://facebook.com/pbi.official', description: 'Halaman resmi Facebook PBI untuk update dan promosi' },
        { id: 2, type: 'Instagram', url: 'https://instagram.com/pbi.official', description: 'Instagram PBI - Konten visual dan behind the scenes' },
        { id: 3, type: 'Twitter', url: 'https://twitter.com/pbi_official', description: 'Twitter PBI untuk news dan customer service' },
        { id: 4, type: 'LinkedIn', url: 'https://linkedin.com/company/pbi', description: 'LinkedIn PBI - Networking profesional dan rekrutmen' },
        { id: 5, type: 'YouTube', url: 'https://youtube.com/c/PBIOfficial', description: 'Channel YouTube PBI untuk konten video tutorial' },
        { id: 6, type: 'TikTok', url: 'https://tiktok.com/@pbi.official', description: 'TikTok PBI - Konten pendek dan tren terkini' },
        { id: 7, type: 'Facebook', url: 'https://facebook.com/groups/pbi.community', description: 'Grup komunitas pengguna PBI' },
        { id: 8, type: 'Instagram', url: 'https://instagram.com/pbi.life', description: 'Sisi lain kehidupan di balik layar PBI' },
        { id: 9, type: 'Twitter', url: 'https://twitter.com/pbi_support', description: 'Akun khusus bantuan teknis PBI' },
        { id: 10, type: 'LinkedIn', url: 'https://linkedin.com/company/pbi-careers', description: 'Informasi lowongan kerja di PBI' },
        { id: 11, type: 'YouTube', url: 'https://youtube.com/c/PBIShorts', description: 'Video pendek seputar fitur PBI' },
        { id: 12, type: 'TikTok', url: 'https://tiktok.com/@pbi.tips', description: 'Tips dan trik menggunakan aplikasi PBI' },
    ]);

    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = socialMedias.filter(item =>
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
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

    const handleDelete = (id: number, type: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${type}?`)) {
            setSocialMedias(socialMedias.filter(s => s.id !== id));
            showToast.success(`${type} berhasil dihapus`);
        }
    };

    const handleEdit = (item: SocialMedia) => {
        setEditingItem(item);
        setFormData({ type: item.type, url: item.url, description: item.description });
        setIsAddModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            setSocialMedias(socialMedias.map(s => s.id === editingItem.id ? { ...s, ...formData } : s));
            showToast.success('Social media berhasil diupdate!');
        } else {
            const newItem: SocialMedia = {
                id: Math.max(...socialMedias.map(s => s.id), 0) + 1,
                type: formData.type as SocialMedia['type'],
                url: formData.url,
                description: formData.description
            };
            setSocialMedias([...socialMedias, newItem]);
            showToast.success('Social media berhasil ditambahkan!');
        }
        setIsAddModalOpen(false);
        setEditingItem(null);
        setFormData({ type: 'Facebook', url: '', description: '' });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'Facebook': return <Facebook className="w-5 h-5" />;
            case 'Instagram': return <Instagram className="w-5 h-5" />;
            case 'Twitter': return <Twitter className="w-5 h-5" />;
            case 'LinkedIn': return <Linkedin className="w-5 h-5" />;
            default: return <ExternalLink className="w-5 h-5" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'Facebook': return '#1877F2';
            case 'Instagram': return '#E4405F';
            case 'Twitter': return '#1DA1F2';
            case 'LinkedIn': return '#0A66C2';
            case 'YouTube': return '#FF0000';
            case 'TikTok': return '#000000';
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
                            Social Media
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            Kelola akun social media PBI
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({ type: 'Facebook', url: '', description: '' });
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Social Media</span>
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                        <input
                            type="text"
                            placeholder="Cari social media..."
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
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ backgroundColor: 'var(--color-secondary)' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Platform</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>URL</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Deskripsi</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center" style={{ color: 'var(--color-gray-custom)' }}>
                                            Tidak ada social media ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedItems.map((item) => (
                                        <tr key={item.id} className="border-t hover:opacity-90 transition-opacity" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: getColor(item.type) }}>
                                                        {getIcon(item.type)}
                                                    </div>
                                                    <span className="font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{item.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:underline" style={{ color: 'var(--color-info)' }}>
                                                    <span className="truncate max-w-xs">{item.url}</span>
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: 'var(--color-gray-custom)' }}>
                                                <span className="line-clamp-2">{item.description}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-warning)' }}
                                                    >
                                                        <Edit2 className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id, item.type)}
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
                            Menampilkan {paginatedItems.length} dari {filteredItems.length} social media
                        </p>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredItems.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />

                {/* Add/Edit Modal */}
                {isAddModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {editingItem ? 'Edit Social Media' : 'Tambah Social Media'}
                                    </h2>
                                    <button onClick={() => setIsAddModalOpen(false)} className="hover:opacity-70">
                                        <X className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} />
                                    </button>
                                </div>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Tipe Platform</label>
                                        <select
                                            required
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as SocialMedia['type'] })}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        >
                                            <option value="Facebook">Facebook</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="Twitter">Twitter</option>
                                            <option value="LinkedIn">LinkedIn</option>
                                            <option value="YouTube">YouTube</option>
                                            <option value="TikTok">TikTok</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>URL</label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.url}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Deskripsi</label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Deskripsi singkat tentang akun ini..."
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 px-4 py-3 border rounded-xl font-semibold hover:opacity-80 transition-opacity"
                                            style={{ borderColor: 'var(--color-gray-custom)', color: 'var(--color-dark-gray)' }}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-primary)' }}
                                        >
                                            {editingItem ? 'Update' : 'Simpan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
