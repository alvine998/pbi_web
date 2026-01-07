import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Calendar, Clock, ChevronLeft, ChevronRight, List, CalendarDays } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

interface Event {
    id: number;
    title: string;
    date: string;
    description: string;
}

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState({ title: '', date: '', description: '' });
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEventForDetail, setSelectedEventForDetail] = useState<Event | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [events, setEvents] = useState<Event[]>([
        { id: 1, title: 'Peluncuran Produk Baru', date: '2024-01-15', description: 'Acara peluncuran produk terbaru kami dengan demo dan sesi tanya jawab' },
        { id: 2, title: 'Workshop Digital Marketing', date: '2024-01-20', description: 'Pelatihan intensif digital marketing untuk meningkatkan penjualan online' },
        { id: 3, title: 'Seminar Keuangan', date: '2024-01-25', description: 'Seminar tentang manajemen keuangan bisnis dan investasi' },
        { id: 4, title: 'Gathering Tahunan', date: '2024-02-01', description: 'Acara gathering tahunan perusahaan dengan seluruh karyawan' },
        { id: 5, title: 'Webinar Tech Talk', date: '2024-02-10', description: 'Diskusi teknologi terbaru dengan pakar industri IT' },
        { id: 6, title: 'Business Networking Night', date: '2024-02-15', description: 'Malam jejaring bisnis untuk para pengusaha dan profesional' },
        { id: 7, title: 'Product Training Session', date: '2024-02-20', description: 'Sesi pelatihan mendalam mengenai fitur-fitur produk unggulan' },
        { id: 8, title: 'Charity Run 2024', date: '2024-03-01', description: 'Acara lari amal untuk mendukung pendidikan anak di pelosok' },
        { id: 9, title: 'Hackathon Internal', date: '2024-03-05', description: 'Kompetisi inovasi internal untuk tim pengembang' },
        { id: 10, title: 'Leadership Summit', date: '2024-03-10', description: 'Pertemuan puncak para pemimpin divisi untuk strategi tahunan' },
        { id: 11, title: 'Expo UMKM Binaan', date: '2024-03-15', description: 'Pameran produk-produk UMKM yang dibina oleh perusahaan' },
        { id: 12, title: 'Family Day Out', date: '2024-03-20', description: 'Acara rekreasi keluarga besar perusahaan' },
    ]);

    const [currentPage, setCurrentPage] = useState(1);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: number, title: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus event "${title}"?`)) {
            setEvents(events.filter(e => e.id !== id));
            showToast.success(`Event "${title}" berhasil dihapus`);
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData({ title: event.title, date: event.date, description: event.description });
        setIsAddModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...formData } : ev));
            showToast.success('Event berhasil diupdate!');
        } else {
            const newEvent: Event = {
                id: Math.max(...events.map(e => e.id), 0) + 1,
                ...formData
            };
            setEvents([...events, newEvent]);
            showToast.success('Event berhasil ditambahkan!');
        }
        setIsAddModalOpen(false);
        setEditingEvent(null);
        setFormData({ title: '', date: '', description: '' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Calendar functions
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateStr);
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <div
                    key={day}
                    className="p-2 border rounded-lg min-h-24 hover:shadow-md transition-shadow cursor-pointer"
                    style={{ borderColor: isToday ? 'var(--color-info)' : 'rgba(169, 169, 169, 0.2)', backgroundColor: isToday ? 'rgba(101, 174, 197, 0.05)' : 'white' }}
                >
                    <div className="font-semibold mb-1" style={{ color: isToday ? 'var(--color-info)' : 'var(--color-dark-gray)' }}>{day}</div>
                    {dayEvents.map(event => (
                        <div
                            key={event.id}
                            className="text-xs px-2 py-1 rounded mb-1 truncate cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: 'var(--color-info)', color: '#fff' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEventForDetail(event);
                                setIsDetailModalOpen(true);
                            }}
                            title={event.title}
                        >
                            {event.title}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={previousMonth}
                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: 'var(--color-secondary)' }}
                        >
                            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: 'var(--color-secondary)' }}
                        >
                            <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center font-semibold p-2" style={{ color: 'var(--color-primary)' }}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {days}
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            Event Management
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            Kelola semua event dan acara
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-white rounded-xl shadow-lg p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${viewMode === 'list' ? 'text-white' : ''}`}
                                style={{ backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'list' ? '#fff' : 'var(--color-dark-gray)' }}
                            >
                                <List className="w-4 h-4" />
                                <span className="font-semibold">List</span>
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'text-white' : ''}`}
                                style={{ backgroundColor: viewMode === 'calendar' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'calendar' ? '#fff' : 'var(--color-dark-gray)' }}
                            >
                                <CalendarDays className="w-4 h-4" />
                                <span className="font-semibold">Calendar</span>
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setEditingEvent(null);
                                setFormData({ title: '', date: '', description: '' });
                                setIsAddModalOpen(true);
                            }}
                            className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            <Plus className="w-5 h-5" />
                            <span>Tambah Event</span>
                        </button>
                    </div>
                </div>

                {/* Search - only show in list view */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                            <input
                                type="text"
                                placeholder="Cari event..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                            />
                        </div>
                    </div>
                )}

                {/* Calendar View */}
                {viewMode === 'calendar' && renderCalendar()}

                {/* Events List */}
                {viewMode === 'list' && (
                    <>
                        <div className="space-y-4">
                            {paginatedEvents.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                    <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-gray-custom)' }} />
                                    <p style={{ color: 'var(--color-gray-custom)' }}>Tidak ada event ditemukan</p>
                                </div>
                            ) : (
                                paginatedEvents.map((event) => (
                                    <div key={event.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-info)' }}>
                                                        <Calendar className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{event.title}</h3>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <Clock className="w-4 h-4" style={{ color: 'var(--color-gray-custom)' }} />
                                                            <span className="text-sm" style={{ color: 'var(--color-gray-custom)' }}>{formatDate(event.date)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="ml-15" style={{ color: 'var(--color-dark-gray)' }}>{event.description}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                <button
                                                    onClick={() => handleEdit(event)}
                                                    className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                    style={{ backgroundColor: 'var(--color-warning)' }}
                                                >
                                                    <Edit2 className="w-4 h-4 text-white" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id, event.title)}
                                                    className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                    style={{ backgroundColor: 'var(--color-danger)' }}
                                                >
                                                    <Trash2 className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {filteredEvents.length > 0 && (
                            <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
                                <p className="text-sm text-center" style={{ color: 'var(--color-dark-gray)' }}>
                                    Menampilkan {paginatedEvents.length} dari {filteredEvents.length} event
                                </p>
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={filteredEvents.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    </>
                )}

                {/* Add/Edit Modal */}
                {isAddModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {editingEvent ? 'Edit Event' : 'Tambah Event'}
                                    </h2>
                                    <button onClick={() => setIsAddModalOpen(false)} className="hover:opacity-70">
                                        <X className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} />
                                    </button>
                                </div>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Judul Event</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Masukkan judul event..."
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Tanggal</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>Deskripsi</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Deskripsi event..."
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 px-4 py-3 border rounded-xl font-semibold hover:opacity-80 transition-opacity"
                                            style={{ borderColor: 'var(--color-gray-custom)', color: 'var(--color-dark-gray)' }}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-primary)' }}
                                        >
                                            {editingEvent ? 'Update' : 'Simpan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}

                {/* Detail Modal */}
                {isDetailModalOpen && selectedEventForDetail && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsDetailModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Detail Event</h2>
                                    <button onClick={() => setIsDetailModalOpen(false)} className="hover:opacity-70">
                                        <X className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>{selectedEventForDetail.title}</h3>
                                        <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-gray-custom)' }}>
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(selectedEventForDetail.date)}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-gray-custom)' }}>Deskripsi</h4>
                                        <p className="leading-relaxed" style={{ color: 'var(--color-dark-gray)' }}>{selectedEventForDetail.description}</p>
                                    </div>

                                    <div className="flex space-x-3 pt-6">
                                        <button
                                            onClick={() => {
                                                setIsDetailModalOpen(false);
                                                handleEdit(selectedEventForDetail);
                                            }}
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-warning)' }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span>Edit Event</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(selectedEventForDetail.id, selectedEventForDetail.title);
                                                setIsDetailModalOpen(false);
                                            }}
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: 'var(--color-danger)' }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
