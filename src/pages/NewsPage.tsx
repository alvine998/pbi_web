import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Calendar, User, CheckCircle, Clock } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

interface NewsArticle {
    id: number;
    title: string;
    category: 'Bisnis' | 'Teknologi' | 'Event' | 'Promo';
    author: string;
    publishDate: string;
    status: 'Published' | 'Draft';
    image: string;
    summary: string;
}

export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Bisnis',
        status: 'Draft',
        summary: '',
        image: ''
    });

    const [articles, setArticles] = useState<NewsArticle[]>([
        {
            id: 1,
            title: 'PBI Meresmikan Kantor Pusat Baru di Jakarta',
            category: 'Bisnis',
            author: 'Admin',
            publishDate: '2024-01-05',
            status: 'Published',
            image: '🏢',
            summary: 'Ekspansi besar-besaran PBI ditandai dengan pembukaan kantor pusat baru dengan fasilitas modern.'
        },
        {
            id: 2,
            title: 'Inovasi Teknologi AI dalam Manajemen Produk',
            category: 'Teknologi',
            author: 'Tech Guru',
            publishDate: '2024-01-06',
            status: 'Published',
            image: '🤖',
            summary: 'Bagaimana kecerdasan buatan merubah cara kita mengelola inventaris dan prediksi penjualan.'
        },
        {
            id: 3,
            title: 'Persiapan Event Gathering Tahunan 2024',
            category: 'Event',
            author: 'Event Team',
            publishDate: '2024-01-07',
            status: 'Draft',
            image: '🎉',
            summary: 'Berbagai kejutan menarik disiapkan untuk menyambut gathering tahunan seluruh anggota PBI.'
        },
        {
            id: 4,
            title: 'Promo Spesial Awal Tahun 2024',
            category: 'Promo',
            author: 'Marketing',
            publishDate: '2024-01-01',
            status: 'Published',
            image: '🏷️',
            summary: 'Jangan lewatkan promo cashback hingga 50% untuk semua kategori produk selama Januari.'
        },
        {
            id: 5,
            title: 'Tips Memilih Laptop untuk Desainer Grafis',
            category: 'Teknologi',
            author: 'Creative Lead',
            publishDate: '2024-01-08',
            status: 'Published',
            image: '💻',
            summary: 'Panduan lengkap spesifikasi laptop yang dibutuhkan untuk menunjang kreativitas desainer.'
        },
        {
            id: 6,
            title: 'Kerjasama Strategis PBI dengan Perbankan Nasional',
            category: 'Bisnis',
            author: 'Finance Director',
            publishDate: '2024-01-09',
            status: 'Published',
            image: '🤝',
            summary: 'Langkah strategis PBI untuk mempermudah akses pembiayaan bagi mitra UMKM.'
        },
        {
            id: 7,
            title: 'Pemenang Hackathon Internal PBI 2023',
            category: 'Event',
            author: 'Tech HR',
            publishDate: '2023-12-28',
            status: 'Published',
            image: '🏆',
            summary: 'Daftar inovasi terbaik hasil karya talenta internal PBI yang akan segera diimplementasikan.'
        }
    ]);

    const [currentPage, setCurrentPage] = useState(1);

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingArticle) {
            setArticles(articles.map(a => a.id === editingArticle.id ? { ...a, ...formData as any } : a));
            showToast.success('Berita berhasil diperbarui!');
        } else {
            const newArticle: NewsArticle = {
                id: Math.max(...articles.map(a => a.id), 0) + 1,
                title: formData.title,
                category: formData.category as NewsArticle['category'],
                author: 'Admin',
                publishDate: new Date().toISOString().split('T')[0],
                status: formData.status as NewsArticle['status'],
                image: formData.image || '📰',
                summary: formData.summary
            };
            setArticles([newArticle, ...articles]);
            showToast.success('Berita baru berhasil ditambahkan!');
        }
        setIsModalOpen(false);
        setEditingArticle(null);
        setFormData({ title: '', category: 'Bisnis', status: 'Draft', summary: '', image: '' });
    };

    const handleEdit = (article: NewsArticle) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            category: article.category,
            status: article.status,
            summary: article.summary,
            image: article.image
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Hapus berita ini?')) {
            setArticles(articles.filter(a => a.id !== id));
            showToast.success('Berita telah dihapus');
        }
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
                        onClick={() => {
                            setEditingArticle(null);
                            setFormData({ title: '', category: 'Bisnis', status: 'Draft', summary: '', image: '' });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tulis Berita Baru</span>
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                        <input
                            type="text"
                            placeholder="Cari berita berdasarkan judul atau kategori..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2"
                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                        />
                    </div>
                </div>

                {/* News List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedArticles.map((article) => (
                        <div key={article.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group ring-1 ring-gray-100">
                            <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                                {article.image}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider">
                                    <span className="px-3 py-1 rounded-lg bg-indigo-50" style={{ color: 'var(--color-primary)' }}>{article.category}</span>
                                    <span className={`px-3 py-1 rounded-lg flex items-center space-x-1 ${article.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                        {article.status === 'Published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        <span>{article.status}</span>
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 leading-tight" style={{ color: 'var(--color-primary)' }}>{article.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{article.summary}</p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                                        <div className="flex items-center space-x-1">
                                            <User className="w-3 h-3" />
                                            <span>{article.author}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{article.publishDate}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handleEdit(article)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(article.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {paginatedArticles.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-2xl shadow-inner ring-1 ring-gray-100 italic text-gray-400">
                            Tidak ada berita ditemukan
                        </div>
                    )}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredArticles.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />

                {/* News Modal */}
                {isModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {editingArticle ? 'Edit Berita' : 'Tulis Berita Baru'}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="hover:opacity-70 transition-opacity">
                                        <X className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-gray-700">Judul Berita</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Judul artikel..."
                                                className="w-full px-4 py-3 border rounded-xl focus:ring-2"
                                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-gray-700">Kategori</label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                                className="w-full px-4 py-3 border rounded-xl focus:ring-2"
                                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                            >
                                                <option value="Bisnis">Bisnis</option>
                                                <option value="Teknologi">Teknologi</option>
                                                <option value="Event">Event</option>
                                                <option value="Promo">Promo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">Status</label>
                                        <div className="flex items-center space-x-6">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" checked={formData.status === 'Draft'} onChange={() => setFormData({ ...formData, status: 'Draft' })} className="w-4 h-4" />
                                                <span className="text-sm text-gray-600">Draft</span>
                                            </label>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" checked={formData.status === 'Published'} onChange={() => setFormData({ ...formData, status: 'Published' })} className="w-4 h-4" />
                                                <span className="text-sm text-gray-600">Published</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">Thumbnail (Emoji/Character)</label>
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="Gunakan emoji atau karakter tunggal..."
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">Konten/Ringkasan Berita</label>
                                        <textarea
                                            required
                                            rows={6}
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            placeholder="Tulis ringkasan atau isi berita di sini..."
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 px-4 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-3 rounded-xl text-white font-bold hover:shadow-lg transition-all"
                                            style={{ backgroundColor: 'var(--color-primary)' }}
                                        >
                                            {editingArticle ? 'Update Berita' : 'Publikasikan'}
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
