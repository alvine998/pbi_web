import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, Tag, ShoppingCart, Edit, Trash2, Loader2, ImageIcon } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

interface ProductDetail {
    id: number;
    name: string;
    category?: string;
    categoryId?: number;
    categoryName?: string;
    price: number;
    stock: number;
    status?: string;
    images?: string[];
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get(`/products/${id}`);
                const data = response.data.data || response.data;
                console.log('Product detail:', data);
                setProduct(data);
            } catch (err: any) {
                console.error('Error fetching product:', err);
                setError(err.response?.data?.message || 'Gagal memuat detail produk');
                showToast.error('Gagal memuat detail produk');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        if (!product || !window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

        setIsDeleting(true);
        try {
            await api.delete(`/products/${id}`);
            showToast.success('Produk berhasil dihapus');
            navigate('/products');
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Gagal menghapus produk');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Tersedia':
                return 'var(--color-success)';
            case 'Stok Rendah':
                return 'var(--color-warning)';
            case 'Habis':
                return 'var(--color-danger)';
            default:
                return 'var(--color-info)';
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-8 flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                        <p style={{ color: 'var(--color-gray-custom)' }}>Memuat detail produk...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <DashboardLayout>
                <div className="p-8">
                    <button
                        onClick={() => navigate('/products')}
                        className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)' }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Kembali ke Daftar Produk</span>
                    </button>
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <p className="text-lg" style={{ color: 'var(--color-danger)' }}>
                            {error || 'Produk tidak ditemukan'}
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const images = product.images || [];

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)' }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Kembali ke Daftar Produk</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Images */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-2xl shadow-lg p-4">
                            {/* Main Image */}
                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
                                {images.length > 0 ? (
                                    <img
                                        src={images[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon className="w-16 h-16 mb-2" />
                                        <span>Tidak ada gambar</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                    ? 'border-blue-500 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center space-x-3">
                                        {product.category || product.categoryName ? (
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                                                backgroundColor: 'var(--color-info)',
                                                color: '#fff'
                                            }}>
                                                {product.category || product.categoryName}
                                            </span>
                                        ) : null}
                                        {product.status && (
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                                                backgroundColor: getStatusColor(product.status),
                                                color: '#fff'
                                            }}>
                                                {product.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Harga</p>
                                    <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>Deskripsi Produk</h2>
                                <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-dark-gray)' }}>
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Product Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Detail Produk</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start space-x-3">
                                    <Tag className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>ID Produk</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>#{product.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Package className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Stok Tersedia</p>
                                        <p className="font-medium" style={{ color: product.stock < 10 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                            {product.stock} unit
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Ditambahkan</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{formatDate(product.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Terakhir Update</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{formatDate(product.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Aksi</h2>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate(`/products/edit/${id}`)}
                                    className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--color-warning)' }}
                                >
                                    <Edit className="w-5 h-5" />
                                    <span>Edit Produk</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                                    style={{ backgroundColor: 'var(--color-danger)' }}
                                >
                                    {isDeleting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                    <span>{isDeleting ? 'Menghapus...' : 'Hapus Produk'}</span>
                                </button>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity border"
                                    style={{ borderColor: 'var(--color-gray-custom)', color: 'var(--color-dark-gray)' }}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Lihat Semua Produk</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
