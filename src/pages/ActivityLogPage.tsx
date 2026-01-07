import { useState } from 'react';
import { Search, MapPin, Globe, Clock, ShieldCheck, LogOut, Filter, MoreHorizontal, UserCheck, Smartphone, Laptop } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

interface UserSession {
    id: number;
    userName: string;
    email: string;
    avatar: string;
    status: 'Active' | 'Idle' | 'Away';
    loginTime: string;
    lastActive: string;
    location: string;
    ipAddress: string;
    device: {
        type: 'Mobile' | 'Desktop';
        os: string;
        browser: string;
    };
}

export default function ActivityLogPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const [sessions, setSessions] = useState<UserSession[]>([
        {
            id: 1,
            userName: 'Budi Santoso',
            email: 'budi.s@pbi.co.id',
            avatar: 'BS',
            status: 'Active',
            loginTime: '2024-01-07 08:30',
            lastActive: 'Baru saja',
            location: 'Jakarta, Indonesia',
            ipAddress: '182.253.125.44',
            device: { type: 'Desktop', os: 'Windows 11', browser: 'Chrome 120' }
        },
        {
            id: 2,
            userName: 'Siti Aminah',
            email: 'siti.a@pbi.co.id',
            avatar: 'SA',
            status: 'Away',
            loginTime: '2024-01-07 10:15',
            lastActive: '15 menit yang lalu',
            location: 'Bandung, Indonesia',
            ipAddress: '114.125.10.88',
            device: { type: 'Mobile', os: 'iOS 17.2', browser: 'Safari' }
        },
        {
            id: 3,
            userName: 'Andi Wijaya',
            email: 'andi.w@pbi.co.id',
            avatar: 'AW',
            status: 'Idle',
            loginTime: '2024-01-07 09:00',
            lastActive: '5 menit yang lalu',
            location: 'Surabaya, Indonesia',
            ipAddress: '125.166.20.10',
            device: { type: 'Desktop', os: 'macOS Sonoma', browser: 'Chrome 120' }
        },
        {
            id: 4,
            userName: 'Rina Putri',
            email: 'rina.p@pbi.co.id',
            avatar: 'RP',
            status: 'Active',
            loginTime: '2024-01-07 11:20',
            lastActive: 'Baru saja',
            location: 'Yogyakarta, Indonesia',
            ipAddress: '180.248.15.33',
            device: { type: 'Mobile', os: 'Android 14', browser: 'Chrome Mobile' }
        },
        {
            id: 5,
            userName: 'Eko Santoso',
            email: 'eko.s@pbi.co.id',
            avatar: 'ES',
            status: 'Active',
            loginTime: '2024-01-07 12:00',
            lastActive: 'Baru saja',
            location: 'Medan, Indonesia',
            ipAddress: '103.111.90.22',
            device: { type: 'Desktop', os: 'Windows 10', browser: 'Firefox 121' }
        },
        {
            id: 6,
            userName: 'Dewi Sartika',
            email: 'dewi.s@pbi.co.id',
            avatar: 'DS',
            status: 'Idle',
            loginTime: '2024-01-07 07:45',
            lastActive: '30 menit yang lalu',
            location: 'Makassar, Indonesia',
            ipAddress: '112.215.100.5',
            device: { type: 'Mobile', os: 'Android 13', browser: 'Samsung Internet' }
        },
        {
            id: 7,
            userName: 'Rudi Hermawan',
            email: 'rudi.h@pbi.co.id',
            avatar: 'RH',
            status: 'Active',
            loginTime: '2024-01-07 13:10',
            lastActive: 'Baru saja',
            location: 'Jakarta, Indonesia',
            ipAddress: '182.253.120.10',
            device: { type: 'Desktop', os: 'Linux', browser: 'Firefox 121' }
        },
    ]);

    const [currentPage, setCurrentPage] = useState(1);

    const handleForceLogout = (sessionId: number, userName: string) => {
        if (window.confirm(`Force logout untuk ${userName}? Sesi ini akan segera diakhiri.`)) {
            setSessions(sessions.filter(s => s.id !== sessionId));
            showToast.success(`User ${userName} telah di-force logout.`);
        }
    };

    const filteredSessions = sessions.filter(s =>
        s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ipAddress.includes(searchQuery)
    );

    const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
    const paginatedSessions = filteredSessions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const activeCount = sessions.filter(s => s.status === 'Active').length;

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Log Aktivitas & Sesi</h1>
                    <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>Pantau sesi login aktif dan aktivitas pengguna</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Sedang Online</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{activeCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <UserCheck className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Sesi Aktif</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{sessions.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Lokasi Unik</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>4</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <Globe className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, lokasi, atau IP..."
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
                            <span className="font-semibold text-gray-600">Filter Status</span>
                        </button>
                    </div>
                </div>

                {/* Sessions Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F8F9FD]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pengguna</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu Login</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi & IP</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Perangkat</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedSessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                            Tidak ada sesi aktif ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedSessions.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                        {session.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-800">{session.userName}</p>
                                                        <p className="text-xs text-gray-500">{session.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${session.status === 'Active' ? 'bg-green-500' : session.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                                                    <span className="text-xs font-semibold text-gray-600">{session.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center space-x-1 text-xs text-gray-700">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{session.loginTime}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 mt-1">Aktif: {session.lastActive}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-xs">
                                                    <div className="flex items-center space-x-1 text-gray-700">
                                                        <MapPin className="w-3 h-3 text-red-400" />
                                                        <span>{session.location}</span>
                                                    </div>
                                                    <span className="text-gray-400 font-mono mt-1">{session.ipAddress}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3 text-xs text-gray-700">
                                                    {session.device.type === 'Desktop' ? <Laptop className="w-4 h-4 text-gray-400" /> : <Smartphone className="w-4 h-4 text-gray-400" />}
                                                    <div>
                                                        <p className="font-semibold">{session.device.os}</p>
                                                        <p className="text-[10px] text-gray-400">{session.device.browser}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleForceLogout(session.id, session.userName)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                                                        title="Force Logout"
                                                    >
                                                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredSessions.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>
        </DashboardLayout>
    );
}
