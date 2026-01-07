import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Package, TrendingUp, TrendingDown, AlertCircle, Eye, Edit2, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

interface Product {
    id: number;
    name: string;
    category: string;
    stock: number;
    price: number;
    sales: number;
    status: 'Tersedia' | 'Stok Rendah' | 'Habis';
    trend: 'up' | 'down' | 'stable';
    image: string;
}

export default function ProductsPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('Semua');

    const [products] = useState<Product[]>([
        { id: 1, name: 'Laptop Dell XPS 13', category: 'Elektronik', stock: 45, price: 15000000, sales: 128, status: 'Tersedia', trend: 'up', image: '💻' },
        { id: 2, name: 'iPhone 15 Pro', category: 'Elektronik', stock: 12, price: 18000000, sales: 95, status: 'Stok Rendah', trend: 'up', image: '📱' },
        { id: 3, name: 'Sepatu Nike Air Max', category: 'Fashion', stock: 0, price: 2500000, sales: 45, status: 'Habis', trend: 'down', image: '👟' },
        { id: 4, name: 'Kamera Sony A7 III', category: 'Elektronik', stock: 28, price: 25000000, sales: 67, status: 'Tersedia', trend: 'stable', image: '📷' },
        { id: 5, name: 'Tas Gucci Marmont', category: 'Fashion', stock: 8, price: 35000000, sales: 23, status: 'Stok Rendah', trend: 'up', image: '👜' },
        { id: 6, name: 'Smart Watch Apple', category: 'Elektronik', stock: 67, price: 6500000, sales: 156, status: 'Tersedia', trend: 'up', image: '⌚' },
        { id: 7, name: 'Headphone Sony WH-1000XM5', category: 'Elektronik', stock: 34, price: 4500000, sales: 89, status: 'Tersedia', trend: 'stable', image: '🎧' },
        { id: 8, name: 'Jaket Leather Premium', category: 'Fashion', stock: 15, price: 3200000, sales: 34, status: 'Tersedia', trend: 'down', image: '🧥' },
        { id: 9, name: 'T-Shirt Uniqlo Airism', category: 'Fashion', stock: 120, price: 199000, sales: 450, status: 'Tersedia', trend: 'up', image: '👕' },
        { id: 10, name: 'Monitor LG UltraWide', category: 'Elektronik', stock: 5, price: 5500000, sales: 12, status: 'Stok Rendah', trend: 'stable', image: '🖥️' },
        { id: 11, name: 'Mechanical Keyboard Keychron', category: 'Elektronik', stock: 25, price: 1800000, sales: 56, status: 'Tersedia', trend: 'up', image: '⌨️' },
        { id: 12, name: 'Mouse Logitech MX Master', category: 'Elektronik', stock: 18, price: 1200000, sales: 43, status: 'Tersedia', trend: 'up', image: '🖱️' },
    ]);

    const [currentPage, setCurrentPage] = useState(1);

    const categories = ['Semua', 'Elektronik', 'Fashion'];
    const statuses = ['Semua', 'Tersedia', 'Stok Rendah', 'Habis'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'Semua' || product.category === categoryFilter;
        const matchesStatus = statusFilter === 'Semua' || product.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter(p => p.status === 'Stok Rendah' || p.status === 'Habis').length;
    const totalSales = products.reduce((sum, p) => sum + p.sales, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            Monitoring Produk
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            Pantau stok, penjualan, dan performa produk Anda
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/products/add')}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Produk Baru</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Total Produk</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{totalProducts}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-info)' }}>
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Total Stok</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{totalStock}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-success)' }}>
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Stok Rendah</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{lowStockCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-warning)' }}>
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Total Penjualan</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{totalSales}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-danger)' }}>
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <input
                                type="text"
                                placeholder="Cari produk..."
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
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>Kategori: {cat}</option>
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

                {/* Products Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ backgroundColor: 'var(--color-secondary)' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Produk</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Kategori</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Harga</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Stok</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Penjualan</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Trend</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center" style={{ color: 'var(--color-gray-custom)' }}>
                                            Tidak ada produk ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedProducts.map((product) => (
                                        <tr key={product.id} className="border-t hover:opacity-90 transition-opacity" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-3xl">{product.image}</div>
                                                    <span className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: 'var(--color-gray-custom)' }}>{product.category}</td>
                                            <td className="px-6 py-4 font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{formatCurrency(product.price)}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold" style={{ color: product.stock < 15 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: 'var(--color-dark-gray)' }}>{product.sales} unit</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                                    backgroundColor: product.status === 'Tersedia' ? 'var(--color-success)' : product.status === 'Stok Rendah' ? 'var(--color-warning)' : 'var(--color-danger)',
                                                    color: '#fff'
                                                }}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.trend === 'up' && <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-success)' }} />}
                                                {product.trend === 'down' && <TrendingDown className="w-5 h-5" style={{ color: 'var(--color-danger)' }} />}
                                                {product.trend === 'stable' && <div className="w-5 h-0.5" style={{ backgroundColor: 'var(--color-gray-custom)' }}></div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/products/${product.id}`)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-info)' }}
                                                    >
                                                        <Eye className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/products/edit/${product.id}`)}
                                                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                        style={{ backgroundColor: 'var(--color-warning)' }}
                                                    >
                                                        <Edit2 className="w-4 h-4 text-white" />
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
                            Menampilkan {paginatedProducts.length} dari {filteredProducts.length} produk
                        </p>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredProducts.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>
        </DashboardLayout>
    );
}
