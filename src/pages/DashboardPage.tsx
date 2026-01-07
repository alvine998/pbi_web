import { BarChart3, TrendingUp, Users, Settings, Bell, User, Plus, FileText } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Chart from 'react-apexcharts';

export default function DashboardPage() {
    const stats = [
        { label: 'Total Pengguna', value: '2,543', change: '+12%', colorVar: 'var(--color-info)' },
        { label: 'Pendapatan', value: 'Rp 45.231.000', change: '+23%', colorVar: 'var(--color-success)' },
        { label: 'Proyek Aktif', value: '127', change: '+8%', colorVar: 'var(--color-warning)' },
        { label: 'Tingkat Konversi', value: '3.24%', change: '+5%', colorVar: 'var(--color-danger)' },
    ];

    const revenueChartOptions: ApexCharts.ApexOptions = {
        chart: {
            id: 'revenue-chart',
            toolbar: { show: false },
            fontFamily: 'inherit',
            zoom: { enabled: false }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (val) => `Rp ${val}jt`
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
            y: {
                formatter: (val) => `Rp ${val}.000.000`
            }
        }
    };

    const revenueSeries = [
        {
            name: 'Pendapatan',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }
    ];

    const userDistributionOptions: ApexCharts.ApexOptions = {
        chart: {
            id: 'user-distribution-chart'
        },
        labels: ['Super Admin', 'Admin', 'Editor', 'Viewer'],
        colors: ['#65aec5', '#4caf50', '#ff9800', '#f44336'],
        legend: {
            position: 'bottom'
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: () => '2.543'
                        }
                    }
                }
            }
        },
        stroke: {
            show: false
        }
    };

    const userDistributionSeries = [45, 120, 480, 1898];

    return (
        <DashboardLayout>
            {/* Header / Welcome Section */}
            <div className="bg-white shadow-sm border-b px-8 py-8 mb-8" style={{ borderColor: 'rgba(169, 169, 169, 0.2)' }}>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Selamat datang kembali! 👋</h1>
                <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>Berikut yang terjadi dengan proyek Anda hari ini.</p>
            </div>

            {/* Dashboard Content */}
            <div className="px-8 pb-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                        >
                            <div className="w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: stat.colorVar }}></div>
                            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--color-dark-gray)' }}>{stat.label}</h3>
                            <div className="flex items-end justify-between">
                                <p className={stat.label.includes("Pendapatan") ? "text-xl font-bold" : "text-3xl font-bold"} style={{ color: 'var(--color-primary)' }}>{stat.value}</p>
                                <span className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Area Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>Tren Pendapatan</h2>
                            <select className="bg-gray-50 border-none rounded-lg text-sm font-medium p-2 focus:ring-0">
                                <option>9 Bulan Terakhir</option>
                                <option>6 Bulan Terakhir</option>
                                <option>3 Bulan Terakhir</option>
                            </select>
                        </div>
                        <div className="h-[300px]">
                            <Chart
                                options={revenueChartOptions}
                                series={revenueSeries}
                                type="area"
                                height="100%"
                            />
                        </div>
                    </div>

                    {/* User Donut Chart */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Distribusi Pengguna</h2>
                        <div className="h-[300px] flex items-center justify-center">
                            <Chart
                                options={userDistributionOptions}
                                series={userDistributionSeries}
                                type="donut"
                                width="100%"
                            />
                        </div>
                    </div>
                </div>

                {/* Secondary Section: Activity & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Aktivitas Terbaru</h2>
                        <div className="space-y-4">
                            {
                                [
                                    { action: 'Pengguna baru terdaftar', time: '2 menit yang lalu', icon: User },
                                    { action: 'Proyek selesai', time: '1 jam yang lalu', icon: BarChart3 },
                                    { action: 'Pembayaran diterima', time: '3 jam yang lalu', icon: TrendingUp },
                                    { action: 'Pesan baru', time: '5 jam yang lalu', icon: Bell },
                                ].map((activity, index) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg transition-colors hover:bg-gray-50/50">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-info)', opacity: 0.1 }}>
                                                <Icon className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>{activity.action}</p>
                                                <p className="text-sm" style={{ color: 'var(--color-gray-custom)' }}>{activity.time}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Aksi Cepat</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {
                                [
                                    { label: 'Proyek Baru', icon: Plus, colorVar: 'var(--color-info)', message: 'Proyek berhasil dibuat!' },
                                    { label: 'Tambah Pengguna', icon: Users, colorVar: 'var(--color-success)', message: 'Pengguna berhasil ditambahkan!' },
                                    { label: 'Buat Laporan', icon: FileText, colorVar: 'var(--color-warning)', message: 'Pembuatan laporan sedang berlangsung...' },
                                    { label: 'Pengaturan', icon: Settings, colorVar: 'var(--color-primary)', message: 'Membuka pengaturan...' },
                                ].map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.label}
                                            onClick={() => showToast.info(action.message)}
                                            className="p-6 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-[1.05] transition-all duration-300"
                                            style={{ backgroundColor: action.colorVar }}
                                        >
                                            <Icon className="w-8 h-8 mb-2 mx-auto" />
                                            <div className="text-sm">{action.label}</div>
                                        </button>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

