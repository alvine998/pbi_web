import { useState, useEffect, useCallback } from 'react';
import { Search, Heart, Eye, Trash2, Clock, X, MessageSquare, Loader2 } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';

interface Aspiration {
    id: number;
    userName: string;
    userEmail?: string;
    category: string;
    content: string;
    date: string;
    status: 'Pending' | 'Diproses' | 'Selesai';
    createdAt?: string;
}

const ITEMS_PER_PAGE = 10;

export default function AspirationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Diproses' | 'Selesai'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAspiration, setSelectedAspiration] = useState<Aspiration | null>(null);

    const [aspirations, setAspirations] = useState<Aspiration[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAspirations = useCallback(async () => {
        setIsLoading(true);
        setIsLoading(true);

        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', ITEMS_PER_PAGE.toString());

            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter !== 'All') params.append('status', statusFilter);

            const response = await api.get(`/aspirations?${params.toString()}`);
            const data = response.data;

            console.log('Aspirations API response:', data);

            if (data.items) {
                setAspirations(data.items);
                setTotalItems(data.totalItems || data.items.length);
                setTotalPages(data.totalPages || Math.ceil((data.totalItems || data.items.length) / ITEMS_PER_PAGE));
            } else if (Array.isArray(data)) {
                setAspirations(data);
                setTotalItems(data.length);
                setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
            } else if (data.data) {
                setAspirations(Array.isArray(data.data) ? data.data : []);
                setTotalItems(data.total || data.data.length);
                setTotalPages(data.totalPages || Math.ceil(data.total / ITEMS_PER_PAGE));
            } else {
                setAspirations([]);
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (err: any) {
            console.error('Error fetching aspirations:', err);
            setAspirations([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, statusFilter]);

    useEffect(() => {
        fetchAspirations();
    }, [fetchAspirations]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'Diproses': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Selesai': return 'bg-green-100 text-green-600 border-green-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        setIsSubmitting(true);
        const loadingToast = showToast.loading(`Memperbarui status menjadi ${newStatus}...`);

        try {
            await api.patch(`/aspirations/${id}/status`, { status: newStatus });
            showToast.dismiss(loadingToast);
            showToast.success(`Status aspirasi diperbarui menjadi ${newStatus}`);

            if (selectedAspiration?.id === id) {
                setSelectedAspiration({ ...selectedAspiration, status: newStatus as any });
            }

            fetchAspirations();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal memperbarui status');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus aspirasi ini?')) return;

        setIsSubmitting(true);
        const loadingToast = showToast.loading('Menghapus aspirasi...');

        try {
            await api.delete(`/aspirations/${id}`);
            showToast.dismiss(loadingToast);
            showToast.success('Aspirasi berhasil dihapus');
            setSelectedAspiration(null);
            fetchAspirations();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menghapus aspirasi');
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center space-x-3" style={{ color: 'var(--color-primary)' }}>
                        <Heart className="w-8 h-8 text-pink-500" />
                        <span>Aspirasiku</span>
                    </h1>
                    <p className="mt-1 text-gray-500">Monitor masukan dari warga (Tanpa syarat KYC). Kelola saran serta keluhan dari semua pengguna aplikasi.</p>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau isi aspirasi..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-2xl overflow-x-auto">
                            {(['All', 'Pending', 'Diproses', 'Selesai'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => {
                                        setStatusFilter(s);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${statusFilter === s
                                        ? 'bg-white text-blue-500 shadow-md'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Table/List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-lg">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                        <p className="text-gray-400">Memuat aspirasi...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Warga</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Kategori</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Isi Aspirasi</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Tanggal</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {aspirations.map((asp) => (
                                        <tr key={asp.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                                                        {asp.userName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 leading-none mb-1">{asp.userName}</p>
                                                        <p className="text-xs text-gray-400">{asp.userEmail || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase">
                                                    {asp.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm text-gray-600 max-w-xs truncate font-medium">{asp.content}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center text-gray-500 text-xs">
                                                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                    <span className="font-bold">{formatDate(asp.date || asp.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border animate-in fade-in zoom-in ${getStatusStyles(asp.status)}`}>
                                                    {asp.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={() => setSelectedAspiration(asp)}
                                                    className="p-2 hover:bg-white hover:shadow-md rounded-xl text-gray-400 hover:text-blue-500 transition-all group-hover:scale-110"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {aspirations.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                                Tidak ada aspirasi ditemukan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                </div>
            </div>

            {/* Detail Modal */}
            {selectedAspiration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedAspiration(null)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-300">
                        {/* Modal Header */}
                        <div className="p-8 border-b flex items-start justify-between bg-gray-50/50">
                            <div className="flex items-center space-x-5">
                                <div className="w-16 h-16 rounded-3xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm border border-pink-200">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="px-3 py-1 bg-white text-gray-500 rounded-full text-[10px] font-black uppercase shadow-sm">
                                            {selectedAspiration.category}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyles(selectedAspiration.status)} shadow-sm`}>
                                            {selectedAspiration.status}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900">Detail Aspirasi</h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedAspiration(null)}
                                className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-gray-600 transition-all shadow-sm group"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-10">
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dikirim Oleh</p>
                                    <p className="font-bold text-gray-800 text-lg">{selectedAspiration.userName}</p>
                                    <p className="text-sm text-gray-500">{selectedAspiration.userEmail || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal Pengiriman</p>
                                    <p className="font-bold text-gray-800 text-lg">{formatDate(selectedAspiration.date || selectedAspiration.createdAt)}</p>
                                    <div className="flex items-center text-xs text-amber-500 font-bold">
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                        <span>{selectedAspiration.status === 'Selesai' ? 'Telah Ditanggapi' : 'Menunggu Tanggapan'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Isi Aspirasi</p>
                                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 italic text-gray-700 leading-loose">
                                    "{selectedAspiration.content}"
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-10 border-t border-gray-50">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedAspiration.id, 'Diproses')}
                                        disabled={selectedAspiration.status === 'Diproses' || isSubmitting}
                                        className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-blue-100 disabled:opacity-50 transition-all border border-blue-100"
                                    >
                                        Tandai Diproses
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedAspiration.id, 'Selesai')}
                                        disabled={selectedAspiration.status === 'Selesai' || isSubmitting}
                                        className="px-6 py-3 bg-green-50 text-green-600 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-green-100 disabled:opacity-50 transition-all border border-green-100"
                                    >
                                        Tandai Selesai
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDelete(selectedAspiration.id)}
                                    disabled={isSubmitting}
                                    className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all border border-red-100 shadow-sm disabled:opacity-50"
                                    title="Hapus Aspirasi"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
