import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Package, Tag, DollarSign, Database, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';

interface ProductFormData {
    name: string;
    category: string;
    price: string;
    stock: string;
    status: 'Tersedia' | 'Stok Rendah' | 'Habis';
    image: string;
    photos: string[];
}

export default function ProductFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        category: 'Elektronik',
        price: '',
        stock: '',
        status: 'Tersedia',
        image: '📦',
        photos: []
    });

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: 'Contoh Produk ' + id,
                category: 'Elektronik',
                price: '15000000',
                stock: '45',
                status: 'Tersedia',
                image: '💻',
                photos: []
            });
        }
    }, [id, isEditMode]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (formData.photos.length + files.length > 5) {
            showToast.error('Maksimal 5 foto per produk');
            return;
        }

        const newPhotos: string[] = [];

        files.forEach(file => {
            if (file.size > 1024 * 1024) {
                showToast.error(`File ${file.name} melebihi 1MB`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                newPhotos.push(reader.result as string);
                if (newPhotos.length === files.filter(f => f.size <= 1024 * 1024).length) {
                    setFormData(prev => ({
                        ...prev,
                        photos: [...prev.photos, ...newPhotos].slice(0, 5)
                    }));
                }
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.stock) {
            showToast.error('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        console.log('Submitting Product:', formData);
        showToast.success(isEditMode ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!');
        navigate('/products');
    };

    const categories = ['Elektronik', 'Fashion', 'Kecantikan', 'Makanan & Minuman', 'Lainnya'];
    const statuses = ['Tersedia', 'Stok Rendah', 'Habis'];

    return (
        <DashboardLayout>
            <div className="p-8 max-w-5xl mx-auto">
                {/* Breadcrumbs / Back */}
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center space-x-2 text-gray-500 hover:text-black mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Kembali ke Daftar Produk</span>
                </button>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            {isEditMode ? 'Perbarui informasi detail produk Anda' : 'Masukkan informasi untuk produk baru Anda'}
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <form onSubmit={handleSubmit} className="p-8 space-y-10">
                        {/* Photo Upload Section */}
                        <div className="space-y-4">
                            <label className="text-lg font-bold flex items-center space-x-2" style={{ color: 'var(--color-primary)' }}>
                                <ImageIcon className="w-6 h-6 text-blue-500" />
                                <span>Foto Produk (Maks 5 Foto, @1MB)</span>
                            </label>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {formData.photos.map((photo, index) => (
                                    <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                                        <img src={photo} alt={`Product ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Foto {index + 1}
                                        </div>
                                    </div>
                                ))}

                                {formData.photos.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center space-y-2 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500 group-hover:text-blue-600">Unggah Foto</span>
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold mb-2 flex items-center space-x-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        <Package className="w-4 h-4 text-gray-400" />
                                        <span>Nama Produk <span className="text-red-500">*</span></span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Contoh: Laptop Dell XPS 13"
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold mb-2 flex items-center space-x-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        <span>Kategori <span className="text-red-500">*</span></span>
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white"
                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold mb-2 flex items-center space-x-2" style={{ color: 'var(--color-dark-gray)' }}>
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <span>Harga (IDR) <span className="text-red-500">*</span></span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="0"
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold mb-2 flex items-center space-x-2" style={{ color: 'var(--color-dark-gray)' }}>
                                            <Database className="w-4 h-4 text-gray-400" />
                                            <span>Stok <span className="text-red-500">*</span></span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            placeholder="0"
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Status & Visuals */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold mb-2 flex items-center space-x-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        <Database className="w-4 h-4 text-gray-400" />
                                        <span>Status Ketersediaan</span>
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {statuses.map((status) => (
                                            <label
                                                key={status}
                                                className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.status === status
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="status"
                                                    value={status}
                                                    checked={formData.status === status}
                                                    onChange={() => setFormData({ ...formData, status: status as any })}
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${formData.status === status ? 'border-blue-500' : 'border-gray-300'
                                                    }`}>
                                                    {formData.status === status && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                                </div>
                                                <span className={`font-semibold ${formData.status === status ? 'text-blue-700' : 'text-gray-600'}`}>
                                                    {status}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold mb-2 flex items-center space-x-2" style={{ color: 'var(--color-dark-gray)' }}>
                                        <ImageIcon className="w-4 h-4 text-gray-400" />
                                        <span>Ikon Produk (Emoji)</span>
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-gray-200">
                                            {formData.image}
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="Contoh: 💻"
                                            maxLength={2}
                                            className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-10 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/products')}
                                className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center space-x-2"
                            >
                                <X className="w-5 h-5" />
                                <span>Batal</span>
                            </button>
                            <button
                                type="submit"
                                className="px-10 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center space-x-2"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                <Save className="w-5 h-5" />
                                <span>{isEditMode ? 'Simpan Perubahan' : 'Tambah Produk'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
