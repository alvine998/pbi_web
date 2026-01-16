import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Package, TrendingUp, AlertCircle, Eye, Edit2, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';

const ITEMS_PER_PAGE = 10;

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    description?: string;
    images?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export default function ProductsPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [products, setProducts] = useState<Product[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categories = ['Semua', 'Elektronik', 'Fashion', 'Kecantikan', 'Makanan & Minuman', 'Lainnya'];

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', ITEMS_PER_PAGE.toString());

            if (searchQuery) {
                params.append('search', searchQuery);
            }

            if (categoryFilter && categoryFilter !== 'Semua') {
                params.append('category', categoryFilter);
            }

            const response = await api.get(`/products?${params.toString()}`);

            // Handle different possible response formats
            const data = response.data;
            let productsList: Product[] = [];
            let total = 0;
            let pages = 1;

            console.log('Products API response:', data);

            if (Array.isArray(data)) {
                // Response is an array directly
                productsList = data;
                total = data.length;
            } else if (data.products) {
                // Response has 'products' key
                productsList = data.products;
                total = data.total || data.products.length;
                pages = data.totalPages || Math.ceil(total / ITEMS_PER_PAGE);
            } else if (data.data) {
                // Response has 'data' key
                productsList = Array.isArray(data.data) ? data.data : [];
                total = data.total || data.count || productsList.length;
                pages = data.totalPages || data.last_page || Math.ceil(total / ITEMS_PER_PAGE);
            } else if (data.items) {
                // Response has 'items' key
                productsList = data.items;
                total = data.total || data.items.length;
                pages = data.totalPages || Math.ceil(total / ITEMS_PER_PAGE);
            }

            console.log('Parsed products:', productsList);

            setProducts(productsList);
            setTotalProducts(total);
            setTotalPages(pages);
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError(err.response?.data?.message || 'Gagal memuat data produk');
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, categoryFilter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, categoryFilter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-6">
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
                                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>Halaman</p>
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{currentPage} / {totalPages}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-success)' }}>
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
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
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat === 'Semua' ? '' : cat}>Kategori: {cat}</option>
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
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Deskripsi</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center" style={{ color: 'var(--color-gray-custom)' }}>
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Memuat data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center" style={{ color: 'var(--color-danger)' }}>
                                            <div className="flex flex-col items-center space-y-2">
                                                <AlertCircle className="w-8 h-8" />
                                                <span>{error}</span>
                                                <button
                                                    onClick={fetchProducts}
                                                    className="px-4 py-2 rounded-lg text-white text-sm"
                                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                                >
                                                    Coba Lagi
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center" style={{ color: 'var(--color-gray-custom)' }}>
                                            Tidak ada produk ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="border-t hover:opacity-90 transition-opacity" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <span className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: 'var(--color-gray-custom)' }}>{product.category}</td>
                                            <td className="px-6 py-4 font-semibold" style={{ color: 'var(--color-dark-gray)' }}>{formatCurrency(product.price)}</td>
                                            <td className="px-6 py-4" style={{ color: 'var(--color-gray-custom)' }}>
                                                {product.description ? (product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description) : '-'}
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
                            Menampilkan {products.length} dari {totalProducts} produk
                        </p>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalProducts}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>
        </DashboardLayout>
    );
}
