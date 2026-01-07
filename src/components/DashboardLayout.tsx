import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, LogOut, Bell, User, Package, Image, Share2, Calendar, MessageSquare, ClipboardList, MessageCircle, Activity, Newspaper } from 'lucide-react';
import { showToast } from '../utils/toast';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const navigate = useNavigate();
    const [isSidebarOpen] = useState(true);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleLogout = () => {
        showToast.info('Keluar...');
        setTimeout(() => {
            navigate('/login');
        }, 500);
    };

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Pengguna baru terdaftar', message: 'John Doe baru saja mendaftar', time: '2 menit yang lalu', unread: true },
        { id: 2, title: 'Proyek selesai', message: 'Website Redesign telah selesai', time: '1 jam yang lalu', unread: true },
        { id: 3, title: 'Pembayaran diterima', message: 'Pembayaran Rp 5.000.000 diterima', time: '3 jam yang lalu', unread: false },
        { id: 4, title: 'Pesan baru', message: 'Anda memiliki 3 pesan baru', time: '5 jam yang lalu', unread: false },
    ]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
        setIsNotificationOpen(false);
        showToast.success('Semua notifikasi ditandai sebagai dibaca');
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-secondary)' }}>
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} shadow-2xl z-10`}
                style={{ backgroundColor: 'var(--color-primary)' }}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className={`text-2xl font-bold text-center ${!isSidebarOpen && 'hidden'}`}>Dashboard PBI</h2>
                        {/* <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button> */}
                    </div>

                    <nav className="space-y-2">
                        {
                            [
                                { icon: BarChart3, label: 'Ringkasan', path: '/dashboard' },
                                { icon: Package, label: 'Produk', path: '/products' },
                                { icon: Users, label: 'Pengguna', path: '/users' },
                                { icon: Image, label: 'Media', path: '/media' },
                                { icon: Share2, label: 'Social Media', path: '/social-media' },
                                { icon: Calendar, label: 'Events', path: '/events' },
                                { icon: MessageSquare, label: 'Forum', path: '/forum' },
                                { icon: ClipboardList, label: 'Polling', path: '/polls' },
                                { icon: MessageCircle, label: 'Live Chat', path: '/chat' },
                                { icon: Activity, label: 'Activity Log', path: '/activity-log' },
                                { icon: Newspaper, label: 'Berita', path: '/news' },
                            ].map((item) => {
                                const Icon = item.icon;
                                const isActive = window.location.pathname === item.path;
                                return (
                                    <a
                                        key={item.label}
                                        href={item.path}
                                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                                        style={{ backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                                    </a>
                                );
                            })
                        }
                    </nav>
                </div>

                <div className="absolute bottom-6 left-0 right-0 px-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-medium">Keluar</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="bg-white shadow-sm border-b" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div></div>
                            <div className="flex items-center space-x-4">
                                {/* Notification Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                        className="p-2 rounded-lg transition-colors relative hover:opacity-90"
                                        style={{ backgroundColor: 'var(--color-secondary)' }}
                                    >
                                        <Bell className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} />
                                        {notifications.filter(n => n.unread).length > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-danger)' }}></span>
                                        )}
                                    </button>

                                    {/* Notification Dropdown Panel */}
                                    {isNotificationOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsNotificationOpen(false)}></div>
                                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border z-20" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                                <div className="p-4 border-b" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>Notifikasi</h3>
                                                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-danger)', color: '#fff' }}>
                                                            {notifications.filter(n => n.unread).length} baru
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    {notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className="p-4 border-b hover:opacity-90 cursor-pointer transition-all"
                                                            style={{
                                                                borderColor: 'rgba(169, 169, 169, 0.1)',
                                                                backgroundColor: notification.unread ? 'rgba(101, 174, 197, 0.05)' : 'transparent'
                                                            }}
                                                            onClick={() => {
                                                                setIsNotificationOpen(false);
                                                                navigate(`/notifications/${notification.id}`);
                                                            }}
                                                        >
                                                            <div className="flex items-start space-x-3">
                                                                <div className="w-2 h-2 rounded-full mt-2" style={{
                                                                    backgroundColor: notification.unread ? 'var(--color-info)' : 'transparent'
                                                                }}></div>
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-sm" style={{ color: 'var(--color-dark-gray)' }}>
                                                                        {notification.title}
                                                                    </p>
                                                                    <p className="text-xs mt-1" style={{ color: 'var(--color-gray-custom)' }}>
                                                                        {notification.message}
                                                                    </p>
                                                                    <p className="text-xs mt-1" style={{ color: 'var(--color-info)' }}>
                                                                        {notification.time}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="p-3 text-center border-t" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                                    <div className="flex flex-col">
                                                        <button
                                                            className="p-3 text-sm font-bold hover:bg-gray-50 transition-colors border-b"
                                                            style={{ color: 'var(--color-primary)', borderColor: 'rgba(169, 169, 169, 0.1)' }}
                                                            onClick={markAllAsRead}
                                                        >
                                                            Tandai semua sebagai dibaca
                                                        </button>
                                                        <button
                                                            className="p-3 text-sm font-bold text-blue-500 hover:bg-blue-50 transition-colors"
                                                            onClick={() => {
                                                                setIsNotificationOpen(false);
                                                                navigate('/notifications');
                                                            }}
                                                        >
                                                            Lihat semua notifikasi
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* User Avatar */}
                                <div
                                    onClick={() => navigate('/profile')}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-110 active:scale-95 transition-all"
                                    style={{ backgroundColor: 'var(--color-info)' }}
                                >
                                    <User className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                {children}
            </main>
        </div>
    );
}
