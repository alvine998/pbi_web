import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, TrendingUp, TrendingDown, Calendar, Tag, BarChart3, ShoppingCart, Star, Eye } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';

interface ProductDetail {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    sales: number;
    status: 'Tersedia' | 'Stok Rendah' | 'Habis';
    trend: 'up' | 'down' | 'stable';
    image: string;
    description: string;
    sku: string;
    addedDate: string;
    lastUpdated: string;
    rating: number;
    reviews: number;
    salesHistory: { month: string; sales: number }[];
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data - in production, fetch from API based on id
    const product: ProductDetail = {
        id: parseInt(id || '1'),
        name: 'Laptop Dell XPS 13',
        category: 'Elektronik',
        price: 15000000,
        stock: 45,
        sales: 128,
        status: 'Tersedia',
        trend: 'up',
        image: '💻',
        description: 'Laptop premium dengan performa tinggi, layar 13.3 inch FHD, processor Intel Core i7 generasi terbaru, RAM 16GB, SSD 512GB. Cocok untuk profesional dan content creator.',
        sku: 'DELL-XPS13-2024',
        addedDate: '1 Januari 2024',
        lastUpdated: '5 Januari 2024',
        rating: 4.8,
        reviews: 45,
        salesHistory: [
            { month: 'Jan', sales: 32 },
            { month: 'Feb', sales: 28 },
            { month: 'Mar', sales: 35 },
            { month: 'Apr', sales: 33 },
        ]
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Tersedia':
                return 'var(--color-success)';
            case 'Stok Rendah':
                return 'var(--color-warning)';
            case 'Habis':
                return 'var(--color-danger)';
            default:
                return 'var(--color-gray-custom)';
        }
    };

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

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="text-6xl">{product.image}</div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                    {product.name}
                                </h1>
                                <div className="flex items-center space-x-4 mb-3">
                                    <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                                        backgroundColor: 'var(--color-info)',
                                        color: '#fff'
                                    }}>
                                        {product.category}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                                        backgroundColor: getStatusColor(product.status),
                                        color: '#fff'
                                    }}>
                                        {product.status}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4"
                                                style={{ color: i < Math.floor(product.rating) ? 'var(--color-warning)' : 'var(--color-gray-custom)' }}
                                                fill={i < Math.floor(product.rating) ? 'var(--color-warning)' : 'none'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold" style={{ color: 'var(--color-dark-gray)' }}>
                                        {product.rating} ({product.reviews} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Harga</p>
                            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                {formatCurrency(product.price)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Deskripsi Produk</h2>
                            <p className="leading-relaxed" style={{ color: 'var(--color-dark-gray)' }}>{product.description}</p>
                        </div>

                        {/* Product Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Detail Produk</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <Tag className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>SKU</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{product.sku}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Package className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Stok Tersedia</p>
                                        <p className="font-medium" style={{ color: product.stock < 15 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                            {product.stock} unit
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <ShoppingCart className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Total Penjualan</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{product.sales} unit</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    {product.trend === 'up' ? (
                                        <TrendingUp className="w-5 h-5 mt-1" style={{ color: 'var(--color-success)' }} />
                                    ) : product.trend === 'down' ? (
                                        <TrendingDown className="w-5 h-5 mt-1" style={{ color: 'var(--color-danger)' }} />
                                    ) : (
                                        <BarChart3 className="w-5 h-5 mt-1" style={{ color: 'var(--color-gray-custom)' }} />
                                    )}
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Trend Penjualan</p>
                                        <p className="font-medium" style={{ color: product.trend === 'up' ? 'var(--color-success)' : product.trend === 'down' ? 'var(--color-danger)' : 'var(--color-gray-custom)' }}>
                                            {product.trend === 'up' ? 'Meningkat' : product.trend === 'down' ? 'Menurun' : 'Stabil'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Ditambahkan</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{product.addedDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 mt-1" style={{ color: 'var(--color-info)' }} />
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--color-gray-custom)' }}>Terakhir Update</p>
                                        <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{product.lastUpdated}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sales History */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Riwayat Penjualan</h2>
                            <div className="space-y-3">
                                {product.salesHistory.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{item.month} 2024</span>
                                        <div className="flex items-center space-x-3 flex-1 mx-4">
                                            <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                                <div
                                                    className="h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${(item.sales / 40) * 100}%`,
                                                        backgroundColor: 'var(--color-info)'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{item.sales} unit</span>
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
                                    onClick={() => showToast.info('Edit produk')}
                                    className="w-full px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--color-warning)' }}
                                >
                                    Edit Produk
                                </button>
                                <button
                                    onClick={() => showToast.success('Stok diupdate')}
                                    className="w-full px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--color-info)' }}
                                >
                                    Update Stok
                                </button>
                                <button
                                    onClick={() => showToast.info('Melihat analytics')}
                                    className="w-full px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--color-success)' }}
                                >
                                    Lihat Analytics
                                </button>
                                <button
                                    onClick={() => showToast.error('Hapus produk')}
                                    className="w-full px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--color-danger)' }}
                                >
                                    Hapus Produk
                                </button>
                            </div>
                        </div>

                        {/* Performance Stats */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Performa</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm" style={{ color: 'var(--color-dark-gray)' }}>Tingkat Penjualan</span>
                                        <span className="font-bold" style={{ color: 'var(--color-success)' }}>74%</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                        <div className="h-2 rounded-full transition-all duration-300" style={{ width: '74%', backgroundColor: 'var(--color-success)' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm" style={{ color: 'var(--color-dark-gray)' }}>Stok Tersisa</span>
                                        <span className="font-bold" style={{ color: 'var(--color-warning)' }}>45%</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                        <div className="h-2 rounded-full transition-all duration-300" style={{ width: '45%', backgroundColor: 'var(--color-warning)' }}></div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm flex items-center space-x-2">
                                            <Eye className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                                            <span style={{ color: 'var(--color-gray-custom)' }}>Views</span>
                                        </span>
                                        <span className="font-semibold" style={{ color: 'var(--color-dark-gray)' }}>1,234</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm flex items-center space-x-2">
                                            <ShoppingCart className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                                            <span style={{ color: 'var(--color-gray-custom)' }}>Conversion Rate</span>
                                        </span>
                                        <span className="font-semibold" style={{ color: 'var(--color-success)' }}>10.4%</span>
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
