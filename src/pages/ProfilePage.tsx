import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Shield, Bell, User, Edit3, Camera, Activity } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';

export default function ProfilePage() {
    const navigate = useNavigate();

    // Mock data for the current user
    const user = {
        name: 'Alvin Yoga',
        email: 'alvineyoga@example.com',
        phone: '+62 812-3456-7890',
        address: 'Jl. Kemang Raya No. 45, Jakarta Selatan, DKI Jakarta',
        dateOfBirth: '20 Mei 1995',
        joinDate: '15 September 2023',
        role: 'Super Admin',
        avatar: 'AY'
    };

    const handleEditProfile = () => {
        showToast.info('Fitur edit profil akan segera hadir!');
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
                                onClick={handleEditProfile}
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
                                <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-100 rounded-2xl hover:border-blue-100 transition-colors cursor-pointer group" onClick={() => showToast.info('Ubah password')}>
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
                                <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-100 rounded-2xl hover:border-blue-100 transition-colors cursor-pointer group" onClick={() => showToast.info('Dua langkah autentikasi')}>
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                            <Bell className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700">Otentikasi Dua Faktor (2FA)</p>
                                            <p className="text-sm text-gray-400">Amankan akun Anda dengan verifikasi tambahan</p>
                                        </div>
                                    </div>
                                    <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">
                                        Aktifkan
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

                        <div className="bg-linear-to-br from-blue-600 to-cyan-600 rounded-3xl shadow-lg p-8 text-white">
                            <h3 className="text-xl font-bold mb-4">Butuh Bantuan?</h3>
                            <p className="text-blue-100 mb-6 text-sm">Tim dukungan kami siap membantu Anda 24/7 untuk masalah teknis apa pun.</p>
                            <button
                                onClick={() => showToast.info('Menghubungi support...')}
                                className="w-full py-3 bg-white/20 text-white font-bold rounded-2xl hover:bg-white/30 transition-colors border border-white/30"
                            >
                                Hubungi Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
