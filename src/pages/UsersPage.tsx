import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Filter, X, Loader2, AlertCircle } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';

const ITEMS_PER_PAGE = 10;

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    phone?: string;
    avatar?: string;
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface UserFormData {
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    phone: string;
}

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [users, setUsers] = useState<User[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        role: 'User',
        status: 'Active',
        phone: ''
    });

    const roles = ['User', 'Admin', 'Editor'];
    const statuses = ['Active', 'Inactive'];

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', ITEMS_PER_PAGE.toString());

            if (searchQuery) {
                params.append('search', searchQuery);
            }
            if (roleFilter) {
                params.append('role', roleFilter);
            }
            if (statusFilter) {
                params.append('status', statusFilter);
            }

            const response = await api.get(`/users?${params.toString()}`);
            const data = response.data;

            console.log('Users API response:', data);

            // Handle the response format
            if (data.items) {
                setUsers(data.items);
                setTotalItems(data.totalItems || data.items.length);
                setTotalPages(data.totalPages || Math.ceil((data.totalItems || data.items.length) / ITEMS_PER_PAGE));
            } else if (Array.isArray(data)) {
                setUsers(data);
                setTotalItems(data.length);
                setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
            } else if (data.data) {
                setUsers(Array.isArray(data.data) ? data.data : []);
                setTotalItems(data.total || data.data.length);
                setTotalPages(data.totalPages || Math.ceil(data.total / ITEMS_PER_PAGE));
            } else {
                setUsers([]);
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.message || 'Gagal memuat data pengguna');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, roleFilter, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'User',
            status: 'Active',
            phone: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            status: user.status,
            phone: user.phone || ''
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (user: User) => {
        setDeletingUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'User',
            status: 'Active',
            phone: ''
        });
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            showToast.error('Nama dan email wajib diisi');
            return;
        }

        if (!editingUser && !formData.password) {
            showToast.error('Password wajib diisi untuk pengguna baru');
            return;
        }

        setIsSubmitting(true);
        const loadingToast = showToast.loading(editingUser ? 'Menyimpan perubahan...' : 'Menambahkan pengguna...');

        try {
            const payload: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                phone: formData.phone
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            if (editingUser) {
                await api.put(`/users/${editingUser.id}`, payload);
                showToast.dismiss(loadingToast);
                showToast.success('Pengguna berhasil diperbarui!');
            } else {
                await api.post('/users', payload);
                showToast.dismiss(loadingToast);
                showToast.success('Pengguna baru berhasil ditambahkan!');
            }

            closeModal();
            fetchUsers();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menyimpan pengguna');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingUser) return;

        setIsSubmitting(true);
        const loadingToast = showToast.loading('Menghapus pengguna...');

        try {
            await api.delete(`/users/${deletingUser.id}`);
            showToast.dismiss(loadingToast);
            showToast.success('Pengguna berhasil dihapus!');
            closeDeleteModal();
            fetchUsers();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menghapus pengguna');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'var(--color-danger)';
            case 'editor':
                return 'var(--color-warning)';
            default:
                return 'var(--color-info)';
        }
    };

    const getStatusColor = (status: string) => {
        return status.toLowerCase() === 'active' ? 'var(--color-success)' : 'var(--color-gray-custom)';
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
                        onClick={openCreateModal}
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
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                <option value="">Semua Role</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
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
                                <option value="">Semua Status</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

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
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center space-y-3">
                                                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                                                <span style={{ color: 'var(--color-gray-custom)' }}>Memuat data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center" style={{ color: 'var(--color-gray-custom)' }}>
                                            Tidak ada pengguna ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: 'var(--color-info)' }}>
                                                            {getInitials(user.name)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-medium block" style={{ color: 'var(--color-dark-gray)' }}>{user.name}</span>
                                                        {user.phone && (
                                                            <span className="text-xs" style={{ color: 'var(--color-gray-custom)' }}>{user.phone}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: 'var(--color-gray-custom)' }}>{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                                    backgroundColor: getRoleColor(user.role),
                                                    color: '#fff'
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                                    backgroundColor: getStatusColor(user.status),
                                                    color: '#fff'
                                                }}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    {/* <button
                                                        onClick={() => navigate(`/users/${user.id}`)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-info)' }}
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="w-4 h-4 text-white" />
                                                    </button> */}
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-warning)' }}
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-danger)' }}
                                                        title="Hapus"
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
                            Menampilkan {users.length} dari {totalItems} pengguna
                        </p>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                />

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                            <div className="p-6 border-b" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                                    </h2>
                                    <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <X className="w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Masukkan nama lengkap"
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Masukkan email"
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Password {!editingUser && <span className="text-red-500">*</span>}
                                        {editingUser && <span className="text-xs font-normal">(kosongkan jika tidak diubah)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={editingUser ? "Kosongkan jika tidak diubah" : "Masukkan password"}
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Masukkan nomor telepon"
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                            Role
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        >
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        >
                                            {statuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-3 border rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-gray-custom)' }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    >
                                        {isSubmitting ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && deletingUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                    <Trash2 className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                    Hapus Pengguna?
                                </h3>
                                <p className="mb-6" style={{ color: 'var(--color-gray-custom)' }}>
                                    Apakah Anda yakin ingin menghapus <strong>{deletingUser.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                                </p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={closeDeleteModal}
                                        className="flex-1 px-4 py-3 border rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-gray-custom)' }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
                                        style={{ backgroundColor: 'var(--color-danger)' }}
                                    >
                                        {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
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
