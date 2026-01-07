import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Filter, X, Eye } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Aktif' | 'Nonaktif';
    avatar: string;
}

export default function UsersPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'Admin', status: 'Aktif', avatar: 'BS' },
        { id: 2, name: 'Siti Nurhaliza', email: 'siti@example.com', role: 'Editor', status: 'Aktif', avatar: 'SN' },
        { id: 3, name: 'Ahmad Rizki', email: 'ahmad@example.com', role: 'Viewer', status: 'Aktif', avatar: 'AR' },
        { id: 4, name: 'Dewi Lestari', email: 'dewi@example.com', role: 'Editor', status: 'Nonaktif', avatar: 'DL' },
        { id: 5, name: 'Rudi Hermawan', email: 'rudi@example.com', role: 'Viewer', status: 'Aktif', avatar: 'RH' },
        { id: 6, name: 'Linda Wati', email: 'linda@example.com', role: 'Editor', status: 'Aktif', avatar: 'LW' },
        { id: 7, name: 'Eko Prasetyo', email: 'eko@example.com', role: 'Viewer', status: 'Aktif', avatar: 'EP' },
        { id: 8, name: 'Maya Sari', email: 'maya@example.com', role: 'Editor', status: 'Aktif', avatar: 'MS' },
        { id: 9, name: 'Denny Caknan', email: 'denny@example.com', role: 'Viewer', status: 'Nonaktif', avatar: 'DC' },
        { id: 10, name: 'Hendra Setiawan', email: 'hendra@example.com', role: 'Admin', status: 'Aktif', avatar: 'HS' },
        { id: 11, name: 'Kevin Sanjaya', email: 'kevin@example.com', role: 'Editor', status: 'Aktif', avatar: 'KS' },
        { id: 12, name: 'Greysia Polii', email: 'greysia@example.com', role: 'Viewer', status: 'Aktif', avatar: 'GP' },
    ]);

    const [currentPage, setCurrentPage] = useState(1);

    const roles = ['Semua', 'Admin', 'Editor', 'Viewer'];
    const statuses = ['Semua', 'Aktif', 'Nonaktif'];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'Semua' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'Semua' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (userId: number, userName: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${userName}?`)) {
            setUsers(users.filter(u => u.id !== userId));
            showToast.success(`${userName} berhasil dihapus`);
        }
    };

    const handleEdit = (user: User) => {
        showToast.info(`Edit ${user.name} - Fitur segera hadir`);
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            Manajemen Pengguna
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            Kelola pengguna dan hak akses mereka
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Pengguna</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
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
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>Role: {role}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>Status: {status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ backgroundColor: 'var(--color-secondary)' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Pengguna</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Status</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center" style={{ color: 'var(--color-gray-custom)' }}>
                                            Tidak ada pengguna ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedUsers.map((user) => (
                                        <tr key={user.id} className="border-t hover:opacity-90 transition-opacity" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: 'var(--color-info)' }}>
                                                        {user.avatar}
                                                    </div>
                                                    <span className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: 'var(--color-gray-custom)' }}>{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                                    backgroundColor: user.role === 'Admin' ? 'var(--color-danger)' : user.role === 'Editor' ? 'var(--color-warning)' : 'var(--color-info)',
                                                    color: '#fff'
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                                    backgroundColor: user.status === 'Aktif' ? 'var(--color-success)' : 'var(--color-gray-custom)',
                                                    color: '#fff'
                                                }}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/users/${user.id}`)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-info)' }}
                                                    >
                                                        <Eye className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-warning)' }}
                                                    >
                                                        <Edit2 className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.name)}
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
                            Menampilkan {paginatedUsers.length} dari {filteredUsers.length} pengguna
                        </p>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredUsers.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />

                {/* Add User Modal */}
                {isAddModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Tambah Pengguna Baru</h2>
                                    <button onClick={() => setIsAddModalOpen(false)} className="hover:opacity-70">
                                        <X className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} />
                                    </button>
                                </div>
                                <form className="space-y-4" onSubmit={(e) => {
                                    e.preventDefault();
                                    showToast.success('Pengguna berhasil ditambahkan!');
                                    setIsAddModalOpen(false);
                                }}>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Nama Lengkap</label>
                                        <input type="text" required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2" style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Email</label>
                                        <input type="email" required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2" style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Role</label>
                                        <select required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2" style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}>
                                            <option value="Viewer">Viewer</option>
                                            <option value="Editor">Editor</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="flex space-x-3 pt-4">
                                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-3 border rounded-xl font-semibold hover:opacity-80 transition-opacity" style={{ borderColor: 'var(--color-gray-custom)', color: 'var(--color-dark-gray)' }}>
                                            Batal
                                        </button>
                                        <button type="submit" className="flex-1 px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--color-primary)' }}>
                                            Simpan
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
