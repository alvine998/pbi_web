import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Clock, FileText, Download, Eye } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';

interface KYCDocument {
    id: number;
    type: string;
    fileName: string;
    uploadDate: string;
    status: 'Terverifikasi' | 'Pending' | 'Ditolak';
}

interface UserDetail {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    joinDate: string;
    role: string;
    status: 'Aktif' | 'Nonaktif';
    avatar: string;
    kycStatus: 'Terverifikasi' | 'Pending' | 'Belum Verifikasi';
    kycDocuments: KYCDocument[];
}

export default function UserDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data - in production, fetch from API based on id
    const user: UserDetail = {
        id: parseInt(id || '1'),
        name: 'Budi Santoso',
        email: 'budi@example.com',
        phone: '+62 812-3456-7890',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
        dateOfBirth: '15 Januari 1990',
        joinDate: '1 Januari 2024',
        role: 'Admin',
        status: 'Aktif',
        avatar: 'BS',
        kycStatus: 'Terverifikasi',
        kycDocuments: [
            { id: 1, type: 'KTP', fileName: 'ktp_budi_santoso.pdf', uploadDate: '5 Jan 2024', status: 'Terverifikasi' },
            { id: 2, type: 'NPWP', fileName: 'npwp_budi_santoso.pdf', uploadDate: '5 Jan 2024', status: 'Terverifikasi' },
            { id: 3, type: 'Selfie dengan KTP', fileName: 'selfie_ktp.jpg', uploadDate: '5 Jan 2024', status: 'Terverifikasi' },
            { id: 4, type: 'Bukti Alamat', fileName: 'bukti_alamat.pdf', uploadDate: '6 Jan 2024', status: 'Pending' },
        ]
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Terverifikasi':
            case 'Aktif':
                return 'var(--color-success)';
            case 'Pending':
                return 'var(--color-warning)';
            case 'Ditolak':
            case 'Nonaktif':
                return 'var(--color-danger)';
            default:
                return 'var(--color-gray-custom)';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Terverifikasi':
                return <CheckCircle className="w-5 h-5" />;
            case 'Pending':
                return <Clock className="w-5 h-5" />;
            case 'Ditolak':
                return <XCircle className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/users')}
                    className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)' }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Kembali ke Daftar Pengguna</span>
                </button>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: 'var(--color-info)' }}>
                                {user.avatar}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                    {user.name}
                                </h1>
                                <div className="flex items-center space-x-4">
                                    <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                                        backgroundColor: user.role === 'Admin' ? 'var(--color-danger)' : 'var(--color-info)',
                                        color: '#fff'
                                    }}>
                                        {user.role}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                                        backgroundColor: getStatusColor(user.status),
                                        color: '#fff'
                                    }}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Status KYC</p>
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg" style={{ backgroundColor: getStatusColor(user.kycStatus), color: '#fff' }}>
                                {getStatusIcon(user.kycStatus)}
                                <span className="font-semibold">{user.kycStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Informasi Personal</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <Mail className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Email</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Phone className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Telepon</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{user.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Tanggal Lahir</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{user.dateOfBirth}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Bergabung Sejak</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{user.joinDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 md:col-span-2">
                                    <MapPin className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Alamat</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{user.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KYC Documents */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Dokumen KYC</h2>
                            <div className="space-y-4">
                                {user.kycDocuments.map((doc) => (
                                    <div key={doc.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                                    <FileText className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold mb-1" style={{ color: 'var(--color-dark-gray)' }}>{doc.type}</p>
                                                    <p className="text-sm" style={{ color: 'var(--color-gray-custom)' }}>{doc.fileName}</p>
                                                    <p className="text-xs mt-1" style={{ color: 'var(--color-gray-custom)' }}>Diunggah: {doc.uploadDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1" style={{
                                                    backgroundColor: getStatusColor(doc.status),
                                                    color: '#fff'
                                                }}>
                                                    {getStatusIcon(doc.status)}
                                                    <span>{doc.status}</span>
                                                </span>
                                                <button
                                                    onClick={() => showToast.info(`Melihat ${doc.fileName}`)}
                                                    className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                    style={{ backgroundColor: 'var(--color-info)' }}
                                                >
                                                    <Eye className="w-4 h-4 text-white" />
                                                </button>
                                                <button
                                                    onClick={() => showToast.success(`Mengunduh ${doc.fileName}`)}
                                                    className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                    style={{ backgroundColor: 'var(--color-success)' }}
                                                >
                                                    <Download className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions & Stats */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Aksi Cepat</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => showToast.info('Mengirim email ke pengguna')}
                                    className="w-full px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--color-info)' }}
                                >
                                    Kirim Email
                                </button>
                                <button
                                    onClick={() => showToast.warning('Reset password')}
                                    className="w-full px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--color-warning)' }}
                                >
                                    Reset Password
                                </button>
                                <button
                                    onClick={() => showToast.error('Suspend akun')}
                                    className="w-full px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--color-danger)' }}
                                >
                                    Suspend Akun
                                </button>
                            </div>
                        </div>

                        {/* KYC Stats */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Statistik KYC</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm" style={{ color: 'var(--color-dark-gray)' }}>Dokumen Terverifikasi</span>
                                        <span className="font-bold" style={{ color: 'var(--color-success)' }}>
                                            {user.kycDocuments.filter(d => d.status === 'Terverifikasi').length}/{user.kycDocuments.length}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                        <div
                                            className="h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${(user.kycDocuments.filter(d => d.status === 'Terverifikasi').length / user.kycDocuments.length) * 100}%`,
                                                backgroundColor: 'var(--color-success)'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm" style={{ color: 'var(--color-gray-custom)' }}>Pending</span>
                                        <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                            {user.kycDocuments.filter(d => d.status === 'Pending').length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm" style={{ color: 'var(--color-gray-custom)' }}>Ditolak</span>
                                        <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>
                                            {user.kycDocuments.filter(d => d.status === 'Ditolak').length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
