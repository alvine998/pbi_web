import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, CheckCircle2, Trash2, ChevronRight, Inbox } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock data for notifications
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Pengguna baru terdaftar', message: 'John Doe baru saja mendaftar ke platform PBI.', time: '2 menit yang lalu', date: '7 Jan 2026', unread: true, category: 'Sistem' },
        { id: 2, title: 'Proyek selesai', message: 'Website Redesign untuk Klien Utama telah selesai ditinjau.', time: '1 jam yang lalu', date: '7 Jan 2026', unread: true, category: 'Proyek' },
        { id: 3, title: 'Pembayaran diterima', message: 'Pembayaran invoice #INV-2024-001 sebesar Rp 5.000.000 telah diterima.', time: '3 jam yang lalu', date: '7 Jan 2026', unread: false, category: 'Keuangan' },
        { id: 4, title: 'Pesan baru dari tim', message: 'Anda memiliki 3 pesan baru di forum diskusi umum.', time: '5 jam yang lalu', date: '7 Jan 2026', unread: false, category: 'Sosial' },
        { id: 5, title: 'Update Keamanan', message: 'Password Anda berhasil diubah secara berkala.', time: '1 hari yang lalu', date: '6 Jan 2026', unread: false, category: 'Keamanan' },
        { id: 6, title: 'Event Mendatang', message: 'Webinar Business Growth akan dimulai dalam 2 jam.', time: '2 hari yang lalu', date: '5 Jan 2026', unread: false, category: 'Event' },
        { id: 7, title: 'Subscription Expiring', message: 'Paket langganan Anda akan berakhir dalam 3 hari.', time: '3 hari yang lalu', date: '4 Jan 2026', unread: true, category: 'Sistem' },
        { id: 8, title: 'New Comment', message: 'Seseorang mengomentari kiriman Anda di forum.', time: '4 hari yang lalu', date: '3 Jan 2026', unread: false, category: 'Sosial' },
        { id: 9, title: 'Server Maintenance', message: 'Pemeliharaan server dijadwalkan pada hari Minggu pukul 02:00 WIB.', time: '5 hari yang lalu', date: '2 Jan 2026', unread: false, category: 'Sistem' },
        { id: 10, title: 'Data Backup Successful', message: 'Cadangan data sistem telah berhasil disimpan ke cloud.', time: '6 hari yang lalu', date: '1 Jan 2026', unread: false, category: 'Sistem' },
        { id: 11, title: 'User Verification', message: 'Akun pengembang baru sedang menunggu verifikasi KYC.', time: '1 minggu yang lalu', date: '31 Des 2025', unread: true, category: 'Keamanan' },
    ]);

    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'unread' && notification.unread) ||
            (filter === 'read' && !notification.unread);
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const paginatedNotifications = filteredNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
        showToast.success('Semua notifikasi ditandai sebagai dibaca');
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
        showToast.success('Notifikasi dihapus');
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Sistem': return 'bg-blue-100 text-blue-600';
            case 'Proyek': return 'bg-purple-100 text-purple-600';
            case 'Keuangan': return 'bg-green-100 text-green-600';
            case 'Sosial': return 'bg-cyan-100 text-cyan-600';
            case 'Keamanan': return 'bg-red-100 text-red-600';
            case 'Event': return 'bg-orange-100 text-orange-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center space-x-3" style={{ color: 'var(--color-primary)' }}>
                            <Bell className="w-8 h-8 text-blue-500" />
                            <span>Pusat Notifikasi</span>
                        </h1>
                        <p className="mt-1 text-gray-500">Kelola semua pemberitahuan dan aktivitas akun Anda.</p>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-blue-500 text-blue-500 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-sm"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Tandai Semua Dibaca</span>
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari notifikasi..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-2xl">
                            {(['all', 'unread', 'read'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => {
                                        setFilter(f);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filter === f
                                            ? 'bg-white text-blue-500 shadow-md'
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {f === 'all' ? 'Semua' : f === 'unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                    {paginatedNotifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {paginatedNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => navigate(`/notifications/${notification.id}`)}
                                    className={`group cursor-pointer hover:bg-gray-50/80 transition-all p-6 relative ${notification.unread ? 'bg-blue-50/20' : ''}`}
                                >
                                    {notification.unread && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl shrink-0 ${getCategoryColor(notification.category)}`}>
                                            <Bell className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center space-x-3">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getCategoryColor(notification.category)}`}>
                                                        {notification.category}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-medium">{notification.date} • {notification.time}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                        className="p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className={`text-lg font-bold truncate ${notification.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {notification.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1 line-clamp-1">{notification.message}</p>
                                        </div>
                                        <div className="shrink-0 self-center">
                                            <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Inbox className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada notifikasi</h3>
                            <p className="text-gray-500">Kami akan memberitahu Anda ketika ada aktivitas baru.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredNotifications.length}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
