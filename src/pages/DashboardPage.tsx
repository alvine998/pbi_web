import { Users, Settings, Bell, User, Package, Newspaper, MessageSquare, Loader2, DollarSign, ShoppingCart, Ticket, Layers, TrendingUp, ArrowRight } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Chart from 'react-apexcharts';
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

// --- Interfaces ---

interface DashboardSummary {
    summary: {
        users: number;
        products: number;
        transactions: number;
        activeVouchers: number;
        categories: number;
    };
    revenue: {
        total: number;
        avgOrderValue: number;
    };
    today: {
        transactions: number;
        newUsers: number;
        revenue: number;
    };
}

interface ActivityItem {
    id: number;
    user: string;
    action: string;
    target: string;
    timestamp: string;
    ip?: string;
}

interface TransactionItem {
    id: number;
    transactionNumber: string;
    user?: { name: string };
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
}

interface ChartItem {
    date: string;
    count: number;
    total: number;
}

interface UserStatItem {
    role?: string;
    status?: string;
    count: number;
}

export default function DashboardPage() {
    // --- State ---
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [chartData, setChartData] = useState<ChartItem[]>([]);
    const [userStats, setUserStats] = useState<{ byRole: UserStatItem[], byStatus: UserStatItem[] }>({ byRole: [], byStatus: [] });

    const [isLoading, setIsLoading] = useState(true);

    // --- Data Fetching ---
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [summaryRes, activitiesRes, transactionsRes, chartRes, userStatsRes] = await Promise.all([
                api.get('/dashboard/summary'),
                api.get('/dashboard/activities'),
                api.get('/dashboard/transactions'),
                api.get('/dashboard/chart/transactions'),
                api.get('/dashboard/users/stats')
            ]);

            setSummary(summaryRes.data);
            setActivities(activitiesRes.data.items || []);
            setTransactions(transactionsRes.data.items || []);
            setChartData(chartRes.data.items || []);
            setUserStats(userStatsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            showToast.error('Gagal memuat data dashboard');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // --- Helpers ---
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatTime = (timestamp: string) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Baru saja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    const getActivityIcon = (action: string) => {
        const a = action.toLowerCase();
        if (a.includes('user')) return User;
        if (a.includes('product')) return Package;
        if (a.includes('news')) return Newspaper;
        if (a.includes('forum') || a.includes('comment')) return MessageSquare;
        if (a.includes('login') || a.includes('logout')) return Settings;
        if (a.includes('transaction')) return DollarSign;
        return Bell;
    };

    // --- Chart Configurations ---
    const revenueChartOptions: ApexCharts.ApexOptions = {
        chart: {
            id: 'revenue-chart',
            toolbar: { show: false },
            fontFamily: 'Inter, system-ui, sans-serif',
            zoom: { enabled: false }
        },
        stroke: { curve: 'smooth', width: 3 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            }
        },
        xaxis: {
            categories: chartData.map(item => item.date),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#94a3b8' } }
        },
        yaxis: {
            labels: {
                formatter: (val) => `Rp ${val.toLocaleString()}`,
                style: { colors: '#94a3b8' }
            }
        },
        colors: ['#65aec5'],
        grid: {
            borderColor: 'rgba(169, 169, 169, 0.1)',
            strokeDashArray: 4,
        },
        dataLabels: { enabled: false },
        tooltip: {
            theme: 'light',
            y: { formatter: (val) => formatCurrency(val) }
        }
    };

    const revenueSeries = [
        {
            name: 'Pendapatan',
            data: chartData.map(item => item.total)
        }
    ];

    const distributionOptions: ApexCharts.ApexOptions = {
        chart: { id: 'dist-chart' },
        labels: userStats.byRole.map(s => s.role || 'Unknown'),
        colors: ['#65aec5', '#4caf50', '#ff9800', '#f44336', '#9c27b0'],
        legend: { position: 'bottom' },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: () => summary?.summary.users.toLocaleString() || '0'
                        }
                    }
                }
            }
        },
        stroke: { show: false }
    };

    const distributionSeries = userStats.byRole.map(s => s.count);

    if (isLoading && !summary) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-400 font-medium">Memuat data dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    const statCards = [
        { label: 'Total Pengguna', value: summary?.summary.users || 0, icon: Users, color: 'var(--color-info)', detail: `${summary?.today.newUsers || 0} hari ini` },
        { label: 'Total Produk', value: summary?.summary.products || 0, icon: Package, color: 'var(--color-success)', detail: `${summary?.summary.categories || 0} kategori` },
        { label: 'Total Transaksi', value: summary?.summary.transactions || 0, icon: ShoppingCart, color: 'var(--color-warning)', detail: `${summary?.today.transactions || 0} hari ini` },
        { label: 'Total Pendapatan', value: formatCurrency(summary?.revenue.total || 0), icon: DollarSign, color: 'var(--color-danger)', detail: `Avg: ${formatCurrency(summary?.revenue.avgOrderValue || 0)}` },
    ];

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="bg-white shadow-sm border-b px-8 py-8 mb-8" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-primary)' }}>Dashboard Overview</h1>
                        <p className="mt-1 text-gray-400">Statistik real-time dan ringkasan aktivitas sistem.</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl text-blue-600 font-bold border border-blue-100">
                        <TrendingUp className="w-5 h-5" />
                        <span>Today Revenue: {formatCurrency(summary?.today.revenue || 0)}</span>
                    </div>
                </div>
            </div>

            <div className="px-8 pb-8 space-y-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-6 border border-gray-50 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: stat.color, filter: 'brightness(1.1)' }}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Statistics</div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 mb-1">{stat.label}</h3>
                                <p className="text-3xl font-black truncate" style={{ color: 'var(--color-primary)' }}>{stat.value}</p>
                                <div className="mt-4 flex items-center space-x-1 text-xs font-bold" style={{ color: stat.color }}>
                                    <span>{stat.detail}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-8 border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-black" style={{ color: 'var(--color-primary)' }}>Statistik Penjualan</h2>
                                <p className="text-sm text-gray-400">Ringkasan transaksi dalam periode terakhir.</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 text-xs font-bold rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">Daily</button>
                                <button className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-500 text-white shadow-md">Monthly</button>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            {chartData.length > 0 ? (
                                <Chart options={revenueChartOptions} series={revenueSeries} type="area" height="100%" />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 italic">Data grafik tidak tersedia</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-8 border border-gray-50">
                        <h2 className="text-xl font-black mb-2" style={{ color: 'var(--color-primary)' }}>Role Pengguna</h2>
                        <p className="text-sm text-gray-400 mb-8">Distribusi berdasarkan level akses.</p>
                        <div className="h-[350px] flex items-center justify-center">
                            {userStats.byRole.length > 0 ? (
                                <Chart options={distributionOptions} series={distributionSeries} type="donut" width="100%" />
                            ) : (
                                <div className="text-gray-400 italic text-sm">Data tidak tersedia</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Transactions & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions Table */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-50 overflow-hidden flex flex-col">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <h2 className="text-xl font-black" style={{ color: 'var(--color-primary)' }}>Transaksi Terbaru</h2>
                            <button className="text-sm font-bold text-blue-500 flex items-center space-x-1 hover:underline">
                                <span>Lihat Semua</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="overflow-x-auto flex-1 px-4 pb-4">
                            <table className="w-full text-left">
                                <thead className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-4 py-4">ID Transaksi</th>
                                        <th className="px-4 py-4">Status</th>
                                        <th className="px-4 py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium divide-y divide-gray-50">
                                    {transactions.slice(0, 5).map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-blue-900">{tx.transactionNumber}</div>
                                                <div className="text-[10px] text-gray-400 uppercase">{new Date(tx.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${tx.status === 'success' ? 'bg-green-50 text-green-600' :
                                                    tx.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right font-black" style={{ color: 'var(--color-primary)' }}>
                                                {formatCurrency(tx.total)}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-12 text-center text-gray-400 italic">Belum ada transaksi</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-8 border border-gray-50">
                        <h2 className="text-xl font-black mb-6" style={{ color: 'var(--color-primary)' }}>Log Aktivitas</h2>
                        <div className="space-y-6">
                            {activities.slice(0, 6).map((activity, index) => {
                                const Icon = getActivityIcon(activity.action);
                                return (
                                    <div key={index} className="flex items-start space-x-4 group cursor-default">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-gray-50 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                            <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-700 truncate capitalize">
                                                {activity.action} <span className="text-blue-500">{activity.target}</span>
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                                <p className="text-xs font-bold text-gray-300 uppercase tracking-tighter">
                                                    {activity.user} • {formatTime(activity.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {activities.length === 0 && (
                                <p className="text-center py-12 text-gray-400 italic">Tidak ada aktivitas baru</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
                    {[
                        { label: 'Active Vouchers', value: summary?.summary.activeVouchers || 0, icon: Ticket, sub: 'Currently usable' },
                        { label: 'Total Categories', value: summary?.summary.categories || 0, icon: Layers, sub: 'Product groupings' },
                        { label: 'Today Revenue', value: formatCurrency(summary?.today.revenue || 0), icon: TrendingUp, sub: 'Updated real-time' },
                    ].map((item, i) => (
                        <div key={i} className="bg-linear-to-br from-white to-gray-50/50 p-6 rounded-3xl border border-gray-100 flex items-center space-x-5 shadow-sm">
                            <div className="p-4 bg-white rounded-2xl shadow-md">
                                <item.icon className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{item.label}</h4>
                                <div className="text-xl font-black text-blue-900 leading-tight">{item.value}</div>
                                <p className="text-[10px] font-bold text-gray-400">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}


