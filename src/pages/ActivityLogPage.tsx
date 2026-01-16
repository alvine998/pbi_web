import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Clock, Filter, User, Activity, Loader2 } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';

const ITEMS_PER_PAGE = 10;

interface ActivityLogItem {
    id: number;
    user: string;
    action: string;
    target: string;
    timestamp: string;
    ip: string;
}

interface ActivityLogResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: ActivityLogItem[];
}

export default function ActivityLogPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ActivityLogResponse | null>(null);

    const fetchActivities = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/dashboard/activities', {
                params: {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    search: searchQuery || undefined
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
            showToast.error('Gagal mengambil data log aktivitas');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatTimestamp = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Log Aktivitas</h1>
                    <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>Pantau riwayat aktivitas dan perubahan sistem</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari user, aksi, atau IP..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            />
                        </div>
                        <button className="flex items-center justify-center space-x-2 px-6 py-3 border rounded-xl hover:bg-gray-50 transition-colors bg-white">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-gray-600">Filter</span>
                        </button>
                    </div>
                </div>

                {/* Activity List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                            <p className="text-gray-400">Memuat data aktivitas...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F8F9FD]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pengguna</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi & Target</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {!data || data.items.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                                Tidak ada riwayat aktivitas ditemukan
                                            </td>
                                        </tr>
                                    ) : (
                                        data.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                            <User className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-gray-800">{item.user}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center space-x-2">
                                                            <Activity className="w-4 h-4 text-blue-500" />
                                                            <span className="text-sm font-semibold text-gray-700">{item.action}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-500 mt-1">{item.target}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center space-x-1 text-xs text-gray-700">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{formatTimestamp(item.timestamp)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-1 text-xs text-gray-700">
                                                        <MapPin className="w-3 h-3 text-red-400" />
                                                        <span className="font-mono">{item.ip}</span>
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

                {data && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={data.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={data.totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
