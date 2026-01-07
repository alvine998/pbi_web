import { useState } from 'react';
import { Upload, Search, Filter, Image as ImageIcon, Video, FileText, Download, Eye, Edit2, Trash2, X } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

interface MediaItem {
    id: number;
    name: string;
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail: string;
    size: string;
    uploadDate: string;
    uploadedBy: string;
}

export default function MediaPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('Semua');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);


    const [mediaItems, setMediaItems] = useState<MediaItem[]>([
        { id: 1, name: 'banner-promo-2024.jpg', type: 'image', url: '🖼️', thumbnail: '🖼️', size: '2.4 MB', uploadDate: '5 Jan 2024', uploadedBy: 'Admin' },
        { id: 2, name: 'video-tutorial.mp4', type: 'video', url: '🎬', thumbnail: '🎬', size: '15.8 MB', uploadDate: '4 Jan 2024', uploadedBy: 'Editor' },
        { id: 3, name: 'product-catalog.pdf', type: 'document', url: '📄', thumbnail: '📄', size: '5.2 MB', uploadDate: '3 Jan 2024', uploadedBy: 'Admin' },
        { id: 4, name: 'logo-pbi.png', type: 'image', url: '🖼️', thumbnail: '🖼️', size: '856 KB', uploadDate: '2 Jan 2024', uploadedBy: 'Admin' },
        { id: 5, name: 'company-profile.mp4', type: 'video', url: '🎬', thumbnail: '🎬', size: '28.3 MB', uploadDate: '1 Jan 2024', uploadedBy: 'Editor' },
        { id: 6, name: 'annual-report-2023.pdf', type: 'document', url: '📄', thumbnail: '📄', size: '12.5 MB', uploadDate: '30 Des 2023', uploadedBy: 'Admin' },
        { id: 7, name: 'hero-image.jpg', type: 'image', url: '🖼️', thumbnail: '🖼️', size: '3.1 MB', uploadDate: '29 Des 2023', uploadedBy: 'Editor' },
        { id: 8, name: 'testimonial-video.mp4', type: 'video', url: '🎬', thumbnail: '🎬', size: '22.7 MB', uploadDate: '28 Des 2023', uploadedBy: 'Editor' },
        { id: 9, name: 'background-zoom.png', type: 'image', url: '🖼️', thumbnail: '🖼️', size: '1.2 MB', uploadDate: '27 Des 2023', uploadedBy: 'Admin' },
        { id: 10, name: 'user-manual-v1.pdf', type: 'document', url: '📄', thumbnail: '📄', size: '3.4 MB', uploadDate: '26 Des 2023', uploadedBy: 'Editor' },
        { id: 11, name: 'intro-animation.mp4', type: 'video', url: '🎬', thumbnail: '🎬', size: '18.9 MB', uploadDate: '25 Des 2023', uploadedBy: 'Admin' },
        { id: 12, name: 'team-photo.jpg', type: 'image', url: '🖼️', thumbnail: '🖼️', size: '4.5 MB', uploadDate: '24 Des 2023', uploadedBy: 'Editor' },
    ]);

    const [currentPage, setCurrentPage] = useState(1);

    const types = ['Semua', 'image', 'video', 'document'];
    const typeLabels: Record<string, string> = {
        'Semua': 'Semua',
        'image': 'Gambar',
        'video': 'Video',
        'document': 'Dokumen'
    };

    const filteredMedia = mediaItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'Semua' || item.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
    const paginatedMedia = filteredMedia.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalSize = mediaItems.reduce((sum, item) => {
        const size = parseFloat(item.size);
        return sum + (item.size.includes('MB') ? size : size / 1024);
    }, 0);

    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
            setMediaItems(mediaItems.filter(m => m.id !== id));
            showToast.success(`${name} berhasil dihapus`);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image':
                return <ImageIcon className="w-5 h-5" />;
            case 'video':
                return <Video className="w-5 h-5" />;
            case 'document':
                return <FileText className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'image':
                return 'var(--color-info)';
            case 'video':
                return 'var(--color-danger)';
            case 'document':
                return 'var(--color-warning)';
            default:
                return 'var(--color-gray-custom)';
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            Media Library
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            Kelola semua file media Anda
                        </p>
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Upload className="w-5 h-5" />
                        <span>Upload Media</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Total Media</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{mediaItems.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-info)' }}>
                                <ImageIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Gambar</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{mediaItems.filter(m => m.type === 'image').length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-info)' }}>
                                <ImageIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Video</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{mediaItems.filter(m => m.type === 'video').length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-danger)' }}>
                                <Video className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Total Ukuran</p>
                                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{totalSize.toFixed(1)} MB</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-success)' }}>
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <input
                                type="text"
                                placeholder="Cari media..."
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
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>Tipe: {typeLabels[type]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Media Grid */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    {paginatedMedia.length === 0 ? (
                        <div className="text-center py-12">
                            <ImageIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-gray-custom)' }} />
                            <p style={{ color: 'var(--color-gray-custom)' }}>Tidak ada media ditemukan</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {paginatedMedia.map((media) => (
                                <div key={media.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                    <div className="aspect-square flex items-center justify-center text-6xl" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                        {media.thumbnail}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="p-1 rounded" style={{ backgroundColor: getTypeColor(media.type), color: '#fff' }}>
                                                {getTypeIcon(media.type)}
                                            </div>
                                            <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: getTypeColor(media.type), color: '#fff' }}>
                                                {typeLabels[media.type]}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold mb-1 truncate" style={{ color: 'var(--color-dark-gray)' }}>{media.name}</h3>
                                        <p className="text-xs mb-1" style={{ color: 'var(--color-gray-custom)' }}>{media.size}</p>
                                        <p className="text-xs mb-3" style={{ color: 'var(--color-gray-custom)' }}>Oleh {media.uploadedBy} • {media.uploadDate}</p>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    showToast.info(`Melihat ${media.name}`);
                                                }}
                                                className="flex-1 p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                style={{ backgroundColor: 'var(--color-info)' }}
                                            >
                                                <Eye className="w-4 h-4 text-white mx-auto" />
                                            </button>
                                            <button
                                                onClick={() => showToast.success(`Mengunduh ${media.name}`)}
                                                className="flex-1 p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                style={{ backgroundColor: 'var(--color-success)' }}
                                            >
                                                <Download className="w-4 h-4 text-white mx-auto" />
                                            </button>
                                            <button
                                                onClick={() => showToast.info(`Edit ${media.name}`)}
                                                className="flex-1 p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                style={{ backgroundColor: 'var(--color-warning)' }}
                                            >
                                                <Edit2 className="w-4 h-4 text-white mx-auto" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(media.id, media.name)}
                                                className="flex-1 p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                style={{ backgroundColor: 'var(--color-danger)' }}
                                            >
                                                <Trash2 className="w-4 h-4 text-white mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-6 pt-6 border-t flex items-center justify-between" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                        <p className="text-sm" style={{ color: 'var(--color-dark-gray)' }}>
                            Menampilkan {paginatedMedia.length} dari {filteredMedia.length} media
                        </p>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredMedia.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />

                {/* Upload Modal */}
                {isUploadModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsUploadModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Upload Media</h2>
                                    <button onClick={() => setIsUploadModalOpen(false)} className="hover:opacity-70">
                                        <X className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} />
                                    </button>
                                </div>
                                <div className="border-2 border-dashed rounded-xl p-8 text-center mb-4" style={{ borderColor: 'var(--color-info)' }}>
                                    <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-info)' }} />
                                    <p className="font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Drag & drop file atau klik untuk browse</p>
                                    <p className="text-sm" style={{ color: 'var(--color-gray-custom)' }}>Mendukung: JPG, PNG, MP4, PDF (Max 50MB)</p>
                                    <input type="file" className="hidden" />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setIsUploadModalOpen(false)}
                                        className="flex-1 px-4 py-3 border rounded-xl font-semibold hover:opacity-80 transition-opacity"
                                        style={{ borderColor: 'var(--color-gray-custom)', color: 'var(--color-dark-gray)' }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={() => {
                                            showToast.success('Media berhasil diupload!');
                                            setIsUploadModalOpen(false);
                                        }}
                                        className="flex-1 px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
