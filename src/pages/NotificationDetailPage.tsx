import { useParams, useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Calendar, Clock, Trash2, Mail, Info, AlertTriangle, CheckCircle, Star, Share2, Tag } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';

export default function NotificationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data - in production, fetch based on ID
    const notification = {
        id: parseInt(id || '1'),
        title: 'Pengguna baru terdaftar',
        message: 'John Doe baru saja mendaftar ke platform PBI. Anda mungkin ingin meninjau profil mereka atau memberikan izin akses yang sesuai. Pendaftaran ini mencakup email validasi yang telah dikirimkan ke alamat pengguna.',
        detailedContent: 'Pendaftaran dilakukan pada tanggal 7 Januari 2026 pukul 10:24 WIB menggunakan alamat email john.doe@example.com. Alamat IP pendaftar tercatat dari Jakarta, Indonesia. Sesuai dengan prosedur operasional standar, akun ini akan berstatus "Pending" hingga verifikasi KYC selesai dilakukan oleh tim administrasi.',
        time: '2 menit yang lalu',
        date: '7 Jan 2026',
        category: 'Sistem',
        unread: true,
        priority: 'Medium',
        sender: 'Security System'
    };

    const handleDelete = () => {
        showToast.success('Notifikasi permanen dihapus');
        navigate('/notifications');
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Sistem': return <Info className="w-8 h-8 text-blue-500" />;
            case 'Proyek': return <Star className="w-8 h-8 text-purple-500" />;
            case 'Keuangan': return <CheckCircle className="w-8 h-8 text-green-500" />;
            case 'Sosial': return <Share2 className="w-8 h-8 text-cyan-500" />;
            case 'Keamanan': return <AlertTriangle className="w-8 h-8 text-red-500" />;
            case 'Event': return <Calendar className="w-8 h-8 text-orange-500" />;
            default: return <Bell className="w-8 h-8 text-gray-500" />;
        }
    };

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'Sistem': return 'bg-blue-50 border-blue-100';
            case 'Proyek': return 'bg-purple-50 border-purple-100';
            case 'Keuangan': return 'bg-green-50 border-green-100';
            case 'Sosial': return 'bg-cyan-50 border-cyan-100';
            case 'Keamanan': return 'bg-red-50 border-red-100';
            case 'Event': return 'bg-orange-50 border-orange-100';
            default: return 'bg-gray-50 border-gray-100';
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/notifications')}
                    className="flex items-center space-x-2 mb-8 text-gray-400 hover:text-blue-500 transition-colors font-bold group"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span>Kembali ke Daftar Notifikasi</span>
                </button>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
                    {/* Status Header */}
                    <div className={`p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-6 ${getCategoryStyles(notification.category)}`}>
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center">
                                {getCategoryIcon(notification.category)}
                            </div>
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white shadow-sm`} style={{ color: 'var(--color-primary)' }}>
                                        {notification.category}
                                    </span>
                                    {notification.unread && (
                                        <span className="flex items-center space-x-1.5 px-3 py-1 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                            <span>Baru</span>
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 leading-tight">
                                    {notification.title}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleDelete}
                                className="p-4 bg-white hover:bg-red-50 text-red-400 hover:text-red-500 rounded-3xl transition-all shadow-sm border border-transparent hover:border-red-100"
                                title="Hapus Notifikasi"
                            >
                                <Trash2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50/30">
                        <div className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                                <Calendar className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal</p>
                                <p className="font-bold text-gray-700">{notification.date}</p>
                            </div>
                        </div>
                        <div className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                                <Clock className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu</p>
                                <p className="font-bold text-gray-700">{notification.time}</p>
                            </div>
                        </div>
                        <div className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                                <Tag className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pengirim</p>
                                <p className="font-bold text-gray-700">{notification.sender}</p>
                            </div>
                        </div>
                    </div>

                    {/* Message Body */}
                    <div className="p-10">
                        <div className="prose prose-blue max-w-none">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                <Mail className="w-6 h-6 text-blue-500" />
                                <span>Detail Pesan</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium italic border-l-4 border-blue-500 pl-6 py-2">
                                "{notification.message}"
                            </p>
                            <div className="bg-gray-50 rounded-3xl p-8 text-gray-700 leading-loose border border-gray-100">
                                {notification.detailedContent}
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="mt-12 pt-10 border-t border-gray-100 flex flex-wrap gap-4">
                            <button
                                onClick={() => showToast.info('Aksi divalidasi')}
                                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-blue-100"
                            >
                                Verifikasi Sekarang
                            </button>
                            <button
                                onClick={() => showToast.info('Ditandai untuk tindak lanjut')}
                                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 hover:scale-[1.03] active:scale-95 transition-all"
                            >
                                Tandai Nanti
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
