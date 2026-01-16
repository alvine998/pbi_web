import { useState, useEffect, useCallback } from 'react';
import { Upload, Search, Filter, Image as ImageIcon, Video, FileText, Download, Trash2, X, Music, MoreHorizontal, Loader2 } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';

const ITEMS_PER_PAGE = 12;

interface MediaItem {
    id: number;
    name: string;
    type: 'image' | 'video' | 'document' | 'audio' | 'other';
    url: string;
    thumbnail: string;
    size: string;
    uploadDate: string;
    uploadedBy: string;
}

interface MediaResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: MediaItem[];
    stats?: {
        total: number;
        image: number;
        video: number;
        document: number;
        audio: number;
        other: number;
        totalSize: string;
    };
}

export default function MediaPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('Semua');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadSubmitting, setIsUploadSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [data, setData] = useState<MediaResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/media', {
                params: {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    search: searchQuery || undefined,
                    type: typeFilter === 'Semua' ? undefined : typeFilter
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching media:', error);
            showToast.error('Gagal mengambil data media');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, typeFilter]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    const types = ['Semua', 'image', 'video', 'document', 'audio', 'other'];
    const typeLabels: Record<string, string> = {
        'Semua': 'Semua',
        'image': 'Gambar',
        'video': 'Video',
        'document': 'Dokumen',
        'audio': 'Audio',
        'other': 'Lainnya'
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            showToast.error('Silakan pilih file terlebih dahulu');
            return;
        }

        setIsUploadSubmitting(true);
        const loadingToast = showToast.loading('Mengunggah file...');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            showToast.dismiss(loadingToast);
            showToast.success('File berhasil diunggah!');
            setIsUploadModalOpen(false);
            setSelectedFile(null);
            fetchMedia();
        } catch (error: any) {
            showToast.dismiss(loadingToast);
            showToast.error(error.response?.data?.message || 'Gagal mengunggah file');
        } finally {
            setIsUploadSubmitting(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
            try {
                await api.delete(`/media/${id}`);
                showToast.success(`${name} berhasil dihapus`);
                fetchMedia();
            } catch (error) {
                console.error('Error deleting media:', error);
                showToast.error('Gagal menghapus media');
            }
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image': return <ImageIcon className="w-5 h-5" />;
            case 'video': return <Video className="w-5 h-5" />;
            case 'document': return <FileText className="w-5 h-5" />;
            case 'audio': return <Music className="w-5 h-5" />;
            default: return <MoreHorizontal className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'image': return '#3B82F6'; // Blue-500
            case 'video': return '#EF4444'; // Red-500
            case 'document': return '#F59E0B'; // Amber-500
            case 'audio': return '#8B5CF6'; // Violet-500
            default: return '#6B7280'; // Gray-500
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
                            Kelola semua aset media di perpustakaan digital
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedFile(null);
                            setIsUploadModalOpen(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Upload className="w-5 h-5" />
                        <span>Upload Media</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Media</p>
                                <p className="text-3xl font-black text-gray-800">{data?.stats?.total || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gambar</p>
                                <p className="text-3xl font-black text-gray-800">{data?.stats?.image || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Video</p>
                                <p className="text-3xl font-black text-gray-800">{data?.stats?.video || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                                <Video className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Penyimpanan</p>
                                <p className="text-3xl font-black text-gray-800">{data?.stats?.totalSize || '0 B'}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari media..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>Tipe: {typeLabels[type]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Media Grid */}
                <div className="min-h-[400px]">
                    {isLoading ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                            <p className="text-gray-400 font-medium">Memuat pustaka media...</p>
                        </div>
                    ) : (
                        <>
                            {!data || data.items.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
                                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                                    <p className="text-gray-400 font-bold text-lg">Tidak ada media ditemukan</p>
                                    <p className="text-gray-300 text-sm mt-1">Gunakan filter atau pencarian lain</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {data.items.map((media) => (
                                        <div key={media.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="aspect-square relative overflow-hidden bg-gray-50 flex items-center justify-center">
                                                {media.type === 'image' ? (
                                                    <img
                                                        src={media.thumbnail || media.url}
                                                        alt={media.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="text-6xl text-gray-200">
                                                        {media.thumbnail || (media.type === 'video' ? '🎬' : media.type === 'audio' ? '🎵' : '📄')}
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <div className="px-2 py-1 rounded-lg backdrop-blur-md bg-white/70 shadow-sm flex items-center space-x-1">
                                                        <span className="p-0.5 rounded" style={{ color: getTypeColor(media.type) }}>
                                                            {getTypeIcon(media.type)}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                                                            {typeLabels[media.type]}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-gray-800 mb-1 truncate text-sm" title={media.name}>
                                                    {media.name}
                                                </h3>
                                                <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mb-4">
                                                    <span>{media.size}</span>
                                                    <span>{media.uploadDate}</span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    {/* <button
                                                        onClick={() => showToast.info(`Melihat ${media.name}`)}
                                                        className="flex-1 p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                                                        title="Lihat"
                                                    >
                                                        <Eye className="w-4 h-4 mx-auto" />
                                                    </button> */}
                                                    <a
                                                        href={media.url}
                                                        download
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            showToast.success(`Mengunduh ${media.name}`);
                                                        }}
                                                        className="flex-1 p-2 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100 transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download className="w-4 h-4 mx-auto" />
                                                    </a>
                                                    {/* <button
                                                        onClick={() => showToast.info(`Edit ${media.name}`)}
                                                        className="flex-1 p-2 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4 mx-auto" />
                                                    </button> */}
                                                    <button
                                                        onClick={() => handleDelete(media.id, media.name)}
                                                        className="flex-1 p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4 mx-auto" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {data && data.totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={data.totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={data.totalItems}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Upload Modal */}
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => !isUploadSubmitting && setIsUploadModalOpen(false)}
                        ></div>
                        <div className="relative bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-lg animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Upload Media Baru</h2>
                                    <p className="text-sm text-gray-400 font-medium">Tambah aset ke perpustakaan digital Anda</p>
                                </div>
                                <button
                                    onClick={() => !isUploadSubmitting && setIsUploadModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    disabled={isUploadSubmitting}
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <label
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative block border-2 border-dashed rounded-[24px] p-12 text-center transition-all duration-300 cursor-pointer ${selectedFile
                                        ? 'border-emerald-400 bg-emerald-50/30'
                                        : isDragging
                                            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                                            : 'border-blue-100 bg-blue-50/10 hover:border-blue-300 hover:bg-blue-50/30'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={isUploadSubmitting}
                                    />

                                    <div className="flex flex-col items-center">
                                        <div className={`w-20 h-20 rounded-[22px] shadow-sm flex items-center justify-center mb-6 transition-all duration-500 ${selectedFile
                                            ? 'bg-emerald-500 text-white rotate-[360deg]'
                                            : 'bg-white text-blue-500'
                                            }`}>
                                            {isUploadSubmitting ? (
                                                <Loader2 className="w-10 h-10 animate-spin" />
                                            ) : selectedFile ? (
                                                <ImageIcon className="w-10 h-10" />
                                            ) : (
                                                <Upload className="w-10 h-10" />
                                            )}
                                        </div>

                                        {selectedFile ? (
                                            <div className="space-y-2">
                                                <p className="font-bold text-gray-800 text-lg truncate max-w-[280px] mx-auto">
                                                    {selectedFile.name}
                                                </p>
                                                <div className="flex items-center justify-center space-x-3">
                                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setSelectedFile(null);
                                                        }}
                                                        className="text-[10px] font-bold text-red-500 hover:underline"
                                                    >
                                                        Ganti File
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="font-bold text-gray-700 text-lg">
                                                    {isDragging ? 'Lepaskan file di sini' : 'Klik atau tarik file ke sini'}
                                                </p>
                                                <p className="text-xs text-gray-400 font-medium tracking-wide">
                                                    JPG, PNG, MP4, PDF, MP3 (Maks. 50MB)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </label>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setIsUploadModalOpen(false)}
                                        disabled={isUploadSubmitting}
                                        className="flex-1 px-6 py-4 border border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={isUploadSubmitting || !selectedFile}
                                        className="flex-[2] px-6 py-4 rounded-2xl text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    >
                                        {isUploadSubmitting ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Mengunggah...</span>
                                            </div>
                                        ) : (
                                            'Unggah Sekarang'
                                        )}
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
