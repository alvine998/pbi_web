import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, X, MessageSquare, Tag, Eye } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

interface Discussion {
    id: number;
    title: string;
    category: string;
    description: string;
    tags: string[];
    author: string;
    createdAt: string;
    replies: number;
    views: number;
}

export default function ForumPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDiscussion, setEditingDiscussion] = useState<Discussion | null>(null);
    const [formData, setFormData] = useState({ title: '', category: 'Teknologi', description: '', tags: '' });

    const [discussions, setDiscussions] = useState<Discussion[]>([
        { id: 1, title: 'Bagaimana cara meningkatkan performa website?', category: 'Teknologi', description: 'Saya ingin tahu tips dan trik untuk meningkatkan kecepatan loading website', tags: ['performance', 'web', 'optimization'], author: 'John Doe', createdAt: '2024-01-05', replies: 12, views: 145 },
        { id: 2, title: 'Strategi marketing digital terbaik 2024', category: 'Marketing', description: 'Diskusi tentang strategi marketing digital yang efektif di tahun 2024', tags: ['marketing', 'digital', 'strategy'], author: 'Jane Smith', createdAt: '2024-01-06', replies: 8, views: 98 },
        { id: 3, title: 'Tips manajemen tim remote', category: 'Manajemen', description: 'Berbagi pengalaman dalam mengelola tim yang bekerja secara remote', tags: ['remote', 'management', 'team'], author: 'Bob Wilson', createdAt: '2024-01-07', replies: 15, views: 203 },
        { id: 4, title: 'Framework JavaScript terbaik untuk pemula', category: 'Teknologi', description: 'Rekomendasi framework JavaScript yang cocok untuk developer pemula', tags: ['javascript', 'framework', 'beginner'], author: 'Alice Brown', createdAt: '2024-01-07', replies: 20, views: 312 },
        { id: 5, title: 'Cara optimasi SEO On-Page', category: 'Marketing', description: 'Berbagi teknik terbaru untuk optimasi SEO di halaman website', tags: ['seo', 'marketing'], author: 'Mike Ross', createdAt: '2024-01-08', replies: 5, views: 67 },
        { id: 6, title: 'Peluang bisnis kuliner 2024', category: 'Bisnis', description: 'Tren kuliner apa yang akan booming tahun ini?', tags: ['business', 'culinary'], author: 'Rachel Zane', createdAt: '2024-01-08', replies: 18, views: 189 },
        { id: 7, title: 'Trend UI/UX Design di era AI', category: 'Desain', description: 'Bagaimana AI merubah cara kita mendesain antarmuka?', tags: ['design', 'uiux', 'ai'], author: 'Harvey Specter', createdAt: '2024-01-09', replies: 14, views: 245 },
        { id: 8, title: 'Keamanan data di cloud', category: 'Teknologi', description: 'Diskusi mengenai praktik terbaik menjaga data di cloud', tags: ['cloud', 'security'], author: 'Louis Litt', createdAt: '2024-01-09', replies: 7, views: 112 },
        { id: 9, title: 'Social media marketing vs Email marketing', category: 'Marketing', description: 'Mana yang lebih efektif untuk konversi penjualan?', tags: ['marketing', 'conversion'], author: 'Donna Paulsen', createdAt: '2024-01-10', replies: 22, views: 278 },
        { id: 10, title: 'Membangun kultur perusahaan yang sehat', category: 'Manajemen', description: 'Tips membangun lingkungan kerja yang positif dan produktif', tags: ['culture', 'management'], author: 'Jessica Pearson', createdAt: '2024-01-10', replies: 9, views: 156 },
        { id: 11, title: 'Intro to Web3 for Web2 developers', category: 'Teknologi', description: 'Langkah awal belajar Web3 dari perspektif pengembang Web2', tags: ['web3', 'blockchain'], author: 'Katrina Bennett', createdAt: '2024-01-11', replies: 3, views: 89 },
        { id: 12, title: 'Investasi saham vs reksadana', category: 'Bisnis', description: 'Mana pilihan investasi yang lebih baik bagi pemula?', tags: ['investment', 'finance'], author: 'Alex Williams', createdAt: '2024-01-11', replies: 31, views: 402 },
    ]);

    const [currentPage, setCurrentPage] = useState(1);

    const categories = ['Semua', 'Teknologi', 'Marketing', 'Manajemen', 'Bisnis', 'Desain'];

    const filteredDiscussions = discussions.filter(discussion => {
        const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            discussion.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'Semua' || discussion.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredDiscussions.length / ITEMS_PER_PAGE);
    const paginatedDiscussions = filteredDiscussions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: number, title: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus diskusi "${title}"?`)) {
            setDiscussions(discussions.filter(d => d.id !== id));
            showToast.success('Diskusi berhasil dihapus');
        }
    };

    const handleEdit = (discussion: Discussion) => {
        setEditingDiscussion(discussion);
        setFormData({
            title: discussion.title,
            category: discussion.category,
            description: discussion.description,
            tags: discussion.tags.join(', ')
        });
        setIsAddModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        if (editingDiscussion) {
            setDiscussions(discussions.map(d => d.id === editingDiscussion.id ? {
                ...d,
                title: formData.title,
                category: formData.category,
                description: formData.description,
                tags: tagsArray
            } : d));
            showToast.success('Diskusi berhasil diupdate!');
        } else {
            const newDiscussion: Discussion = {
                id: Math.max(...discussions.map(d => d.id), 0) + 1,
                title: formData.title,
                category: formData.category,
                description: formData.description,
                tags: tagsArray,
                author: 'Current User',
                createdAt: new Date().toISOString().split('T')[0],
                replies: 0,
                views: 0
            };
            setDiscussions([newDiscussion, ...discussions]);
            showToast.success('Diskusi berhasil dibuat!');
        }
        setIsAddModalOpen(false);
        setEditingDiscussion(null);
        setFormData({ title: '', category: 'Teknologi', description: '', tags: '' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
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
                        onClick={() => {
                            setEditingDiscussion(null);
                            setFormData({ title: '', category: 'Teknologi', description: '', tags: '' });
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Buat Diskusi Baru</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <input
                                type="text"
                                placeholder="Cari diskusi..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>Kategori: {cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Discussions List */}
                <div className="space-y-4">
                    {paginatedDiscussions.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-gray-custom)' }} />
                            <p style={{ color: 'var(--color-gray-custom)' }}>Tidak ada diskusi ditemukan</p>
                        </div>
                    ) : (
                        paginatedDiscussions.map((discussion) => (
                            <div key={discussion.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                                backgroundColor: getCategoryColor(discussion.category),
                                                color: '#fff'
                                            }}>
                                                {discussion.category}
                                            </span>
                                            <span className="text-sm" style={{ color: 'var(--color-gray-custom)' }}>
                                                oleh {discussion.author} • {formatDate(discussion.createdAt)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 cursor-pointer hover:opacity-80" style={{ color: 'var(--color-primary)' }} onClick={() => navigate(`/forum/${discussion.id}`)}>
                                            {discussion.title}
                                        </h3>
                                        <p className="mb-3" style={{ color: 'var(--color-dark-gray)' }}>{discussion.description}</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <MessageSquare className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                                                <span className="text-sm font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{discussion.replies} balasan</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Eye className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                                                <span className="text-sm font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{discussion.views} views</span>
                                            </div>
                                        </div>
                                        {discussion.tags.length > 0 && (
                                            <div className="flex items-center space-x-2 mt-3">
                                                <Tag className="w-4 h-4" style={{ color: 'var(--color-gray-custom)' }} />
                                                {discussion.tags.map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-dark-gray)' }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => navigate(`/forum/${discussion.id}`)}
                                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-info)' }}
                                        >
                                            <Eye className="w-4 h-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(discussion)}
                                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-warning)' }}
                                        >
                                            <Edit2 className="w-4 h-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discussion.id, discussion.title)}
                                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-danger)' }}
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
                {filteredDiscussions.length > 0 && (
                    <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
                        <p className="text-sm text-center" style={{ color: 'var(--color-dark-gray)' }}>
                            Menampilkan {paginatedDiscussions.length} dari {filteredDiscussions.length} diskusi
                        </p>
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredDiscussions.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />

                {/* Add/Edit Modal */}
                {isAddModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {editingDiscussion ? 'Edit Diskusi' : 'Buat Diskusi Baru'}
                                    </h2>
                                    <button onClick={() => setIsAddModalOpen(false)} className="hover:opacity-70">
                                        <X className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} />
                                    </button>
                                </div>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Judul Diskusi</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Masukkan judul diskusi..."
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Kategori</label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        >
                                            <option value="Teknologi">Teknologi</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Manajemen">Manajemen</option>
                                            <option value="Bisnis">Bisnis</option>
                                            <option value="Desain">Desain</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Deskripsi</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Jelaskan topik diskusi Anda..."
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Tags (pisahkan dengan koma)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="contoh: javascript, react, web"
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
                                            {editingDiscussion ? 'Update' : 'Buat Diskusi'}
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
