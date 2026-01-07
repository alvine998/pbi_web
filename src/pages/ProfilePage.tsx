import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Shield, User, Edit3, Camera, Activity, X, Lock, Eye, EyeOff } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

    // Mock data for the current user
    const [user, setUser] = useState({
        name: 'Alvin Yoga',
        email: 'alvineyoga@example.com',
        phone: '+62 812-3456-7890',
        address: 'Jl. Kemang Raya No. 45, Jakarta Selatan, DKI Jakarta',
        dateOfBirth: '20 Mei 1995',
        joinDate: '15 September 2023',
        role: 'Super Admin',
        avatar: 'AY'
    });

    const [editForm, setEditForm] = useState({
        name: user.name,
        phone: user.phone,
        address: user.address
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUser({ ...user, ...editForm });
        setIsEditModalOpen(false);
        showToast.success('Profil berhasil diperbaharui!');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showToast.error('Password baru tidak cocok!');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            showToast.error('Password minimal 6 karakter!');
            return;
        }
        showToast.success('Password berhasil diubah!');
        setIsPasswordModalOpen(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="h-32 bg-linear-to-r from-blue-500 to-cyan-500"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex items-end justify-between -mt-16 mb-6">
                            <div className="flex items-end space-x-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-white text-4xl font-bold transition-transform group-hover:scale-105" style={{ backgroundColor: 'var(--color-info)' }}>
                                        {user.avatar}
                                    </div>
                                    <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-md text-blue-500 hover:bg-blue-50 transition-colors">
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="pb-2">
                                    <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{user.name}</h1>
                                    <p className="text-gray-500 font-medium">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 hover:scale-[1.02] transition-all"
                            >
                                <Edit3 className="w-5 h-5" />
                                <span>Edit Profil</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Personal Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-lg p-8">
                            <h2 className="text-xl font-bold mb-8 flex items-center space-x-3" style={{ color: 'var(--color-primary)' }}>
                                <User className="w-6 h-6 text-blue-500" />
                                <span>Informasi Pribadi</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <Mail className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-400 mb-1">Email</p>
                                        <p className="font-bold text-gray-700">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <Phone className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-400 mb-1">Telepon</p>
                                        <p className="font-bold text-gray-700">{user.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <Calendar className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-400 mb-1">Tanggal Lahir</p>
                                        <p className="font-bold text-gray-700">{user.dateOfBirth}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <Calendar className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-400 mb-1">Bergabung Sejak</p>
                                        <p className="font-bold text-gray-700">{user.joinDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 md:col-span-2">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <MapPin className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-400 mb-1">Alamat</p>
                                        <p className="font-bold text-gray-700">{user.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-8">
                            <h2 className="text-xl font-bold mb-8 flex items-center space-x-3" style={{ color: 'var(--color-primary)' }}>
                                <Shield className="w-6 h-6 text-green-500" />
                                <span>Keamanan Akun</span>
                            </h2>
                            <div className="space-y-6">
                                <div
                                    className="flex items-center justify-between p-4 border-2 border-dashed border-gray-100 rounded-2xl hover:border-blue-100 transition-colors cursor-pointer group"
                                    onClick={() => setIsPasswordModalOpen(true)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                            <Shield className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700">Ubah Password</p>
                                            <p className="text-sm text-gray-400">Terakhir diubah 3 bulan yang lalu</p>
                                        </div>
                                    </div>
                                    <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Edit3 className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Experience/Stats */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <Activity className="w-10 h-10 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2">Aktivitas Login</h3>
                            <p className="text-sm text-gray-400 mb-6">Anda telah login dari 3 perangkat yang berbeda bulan ini.</p>
                            <button
                                onClick={() => navigate('/activity-log')}
                                className="w-full py-3 bg-gray-50 text-blue-500 font-bold rounded-2xl hover:bg-blue-50 transition-colors"
                            >
                                Lihat Log Aktivitas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center space-x-2" style={{ color: 'var(--color-primary)' }}>
                                <Edit3 className="w-5 h-5 text-blue-500" />
                                <span>Edit Profil</span>
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 ml-1">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 ml-1">Nomor Telepon</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 ml-1">Alamat</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                    <textarea
                                        rows={3}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                                        value={editForm.address}
                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                        placeholder="Masukkan alamat lengkap"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex space-x-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center space-x-2" style={{ color: 'var(--color-primary)' }}>
                                <Lock className="w-5 h-5 text-green-500" />
                                <span>Ubah Password</span>
                            </h3>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 ml-1">Password Lama</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPasswords.old ? "text" : "password"}
                                        required
                                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium"
                                        value={passwordForm.oldPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 ml-1">Password Baru</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        required
                                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 ml-1">Konfirmasi Password Baru</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        required
                                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex space-x-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-100 hover:bg-green-600 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

