import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, X, Calendar, Clock, MapPin, CheckCircle, ChevronLeft, ChevronRight, List, CalendarDays, Loader2, Upload, Image as ImageIcon, Eye } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';

const ITEMS_PER_PAGE = 10;

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string;
    category: string;
    status: 'active' | 'inactive';
    createdAt?: string;
}

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
        category: '',
        status: 'active' as 'active' | 'inactive'
    });
    const [selectedEventForDetail, setSelectedEventForDetail] = useState<Event | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [events, setEvents] = useState<Event[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', ITEMS_PER_PAGE.toString());
            if (searchQuery) params.append('search', searchQuery);

            const response = await api.get(`/events?${params.toString()}`);
            const data = response.data;

            if (data.items) {
                setEvents(data.items);
                setTotalItems(data.totalItems || data.items.length);
                setTotalPages(data.totalPages || Math.ceil((data.totalItems || data.items.length) / ITEMS_PER_PAGE));
            } else if (Array.isArray(data)) {
                setEvents(data);
                setTotalItems(data.length);
                setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
            } else if (data.data) {
                setEvents(Array.isArray(data.data) ? data.data : []);
                setTotalItems(data.total || data.data.length);
                setTotalPages(data.totalPages || Math.ceil(data.total / ITEMS_PER_PAGE));
            } else {
                setEvents([]);
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (err: any) {
            console.error('Error fetching events:', err);
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`Apakah Anda yakin ingin menghapus event "${title}"?`)) return;

        setIsSubmitting(true);
        const loadingToast = showToast.loading('Menghapus event...');

        try {
            await api.delete(`/events/${id}`);
            showToast.dismiss(loadingToast);
            showToast.success(`Event "${title}" berhasil dihapus`);
            fetchEvents();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menghapus event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            date: event.date ? event.date.split('T')[0] : '',
            time: event.time || '',
            location: event.location || '',
            image: event.image || '',
            category: event.category || '',
            status: event.status || 'active'
        });
        setImagePreview(event.image || null);
        setImageFile(null);
        setIsAddModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast.error('Ukuran file maksimal 5MB');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const uploadImage = async (file: File): Promise<string> => {
        const form = new FormData();
        form.append('file', file);
        const response = await api.post('/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        const data = response.data;
        return data.url || data.file?.url || data.data?.url || '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loadingToast = showToast.loading(editingEvent ? 'Memperbarui event...' : 'Menambahkan event...');

        try {
            let imageUrl = formData.image;
            if (imageFile) {
                try {
                    imageUrl = await uploadImage(imageFile);
                } catch (uploadErr) {
                    console.error('Image upload failed:', uploadErr);
                    showToast.error('Gagal mengunggah gambar');
                    setIsSubmitting(false);
                    showToast.dismiss(loadingToast);
                    return;
                }
            }

            const payload = { ...formData, image: imageUrl };

            if (editingEvent) {
                await api.put(`/events/${editingEvent.id}`, payload);
                showToast.success('Event berhasil diupdate!');
            } else {
                await api.post('/events', payload);
                showToast.success('Event berhasil ditambahkan!');
            }
            showToast.dismiss(loadingToast);
            setIsAddModalOpen(false);
            setEditingEvent(null);
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                image: '',
                category: '',
                status: 'active'
            });
            setImageFile(null);
            setImagePreview(null);
            fetchEvents();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menyimpan event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Calendar functions
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.date && event.date.startsWith(dateStr));
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

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
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: 'var(--color-secondary)' }}>
                            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </button>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: 'var(--color-secondary)' }}>
                            <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center font-semibold p-2" style={{ color: 'var(--color-primary)' }}>{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">{days}</div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Event Management</h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>Kelola semua event dan acara</p>
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
                                setFormData({ title: '', description: '', date: '', time: '', location: '', image: '', category: '', status: 'active' });
                                setImagePreview(null);
                                setImageFile(null);
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

                {/* List View Content */}
                {viewMode === 'list' && (
                    <>
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                                <input
                                    type="text"
                                    placeholder="Cari event..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                    style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                                <p className="text-gray-400">Memuat event...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {events.map((event) => (
                                    <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow group ring-1 ring-gray-100">
                                        <div className="w-full md:w-64 h-48 bg-gray-100 flex items-center justify-center relative shrink-0">
                                            {event.image ? (
                                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <ImageIcon className="w-16 h-16 text-gray-300" />
                                            )}
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-1 rounded bg-indigo-500 text-white text-[10px] uppercase font-bold shadow-sm">
                                                    {event.category || 'General'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-2 line-clamp-1" style={{ color: 'var(--color-primary)' }}>{event.title}</h3>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="w-4 h-4 text-blue-500" />
                                                            <span>{formatDate(event.date)}</span>
                                                        </div>
                                                        {event.time && (
                                                            <div className="flex items-center space-x-1">
                                                                <Clock className="w-4 h-4 text-purple-500" />
                                                                <span>{event.time}</span>
                                                            </div>
                                                        )}
                                                        {event.location && (
                                                            <div className="flex items-center space-x-1">
                                                                <MapPin className="w-4 h-4 text-red-500" />
                                                                <span className="line-clamp-1">{event.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 uppercase tracking-wider ${event.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {event.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                    <span>{event.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</span>
                                                </span>
                                            </div>
                                            <p className="text-gray-500 line-clamp-2 mb-4 flex-1 text-sm leading-relaxed">{event.description}</p>
                                            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-50">
                                                <button onClick={() => { setSelectedEventForDetail(event); setIsDetailModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Lihat Detail">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEdit(event)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(event.id, event.title)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {events.length === 0 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-gray-400 italic">Tidak ada event ditemukan</div>
                                )}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={totalItems}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    </>
                )}

                {/* Calendar View Content */}
                {viewMode === 'calendar' && renderCalendar()}

                {/* Add/Edit Modal */}
                {isAddModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{editingEvent ? 'Edit Event' : 'Tambah Event'}</h2>
                                    <button onClick={() => setIsAddModalOpen(false)} className="hover:opacity-70 transition-opacity"><X className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} /></button>
                                </div>
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Judul Event <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text" required value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="Nama event..."
                                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                                    style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Tanggal <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="date" required value={formData.date}
                                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Waktu</label>
                                                    <input
                                                        type="time" value={formData.time}
                                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Lokasi</label>
                                                <input
                                                    type="text" value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    placeholder="Tempat acara..."
                                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                                    style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Kategori</label>
                                                    <input
                                                        type="text" value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        placeholder="e.g. Workshop"
                                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Status</label>
                                                    <select
                                                        value={formData.status}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                                    >
                                                        <option value="active">Aktif</option>
                                                        <option value="inactive">Tidak Aktif</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Poster Event</label>
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="w-full h-48 rounded-2xl border-2 border-dashed flex items-center justify-center bg-gray-50 overflow-hidden" style={{ borderColor: 'rgba(169, 169, 169, 0.3)' }}>
                                                    {imagePreview ? (
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-12 h-12 text-gray-300" />
                                                    )}
                                                </div>
                                                <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                                <button
                                                    type="button"
                                                    onClick={() => imageInputRef.current?.click()}
                                                    className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                                    style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)' }}
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{imagePreview ? 'Ganti Poster' : 'Unggah Poster'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Deskripsi <span className="text-red-500">*</span></label>
                                        <textarea
                                            required rows={4} value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Jelaskan detail acara..."
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>
                                    <div className="flex space-x-3 pt-4 border-t" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-3 border rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-colors" style={{ borderColor: 'rgba(169, 169, 169, 0.4)' }}>Batal</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-xl text-white font-bold hover:shadow-lg transition-all disabled:opacity-50" style={{ backgroundColor: 'var(--color-primary)' }}>{isSubmitting ? 'Menyimpan...' : editingEvent ? 'Update Event' : 'Buat Event'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}

                {/* Detail Modal */}
                {isDetailModalOpen && selectedEventForDetail && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setIsDetailModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                                <div className="h-64 bg-gray-100 relative">
                                    {selectedEventForDetail.image ? (
                                        <img src={selectedEventForDetail.image} alt={selectedEventForDetail.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50"><ImageIcon className="w-20 h-20 text-gray-200" /></div>
                                    )}
                                    <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"><X className="w-6 h-6" /></button>
                                    <div className="absolute bottom-4 left-6">
                                        <span className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-xs font-bold uppercase shadow-lg">
                                            {selectedEventForDetail.category || 'General'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <div className="flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                                            <Calendar className="w-4 h-4" /><span>{formatDate(selectedEventForDetail.date)}</span>
                                        </div>
                                        {selectedEventForDetail.time && (
                                            <div className="flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-600">
                                                <Clock className="w-4 h-4" /><span>{selectedEventForDetail.time}</span>
                                            </div>
                                        )}
                                        {selectedEventForDetail.location && (
                                            <div className="flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full bg-green-50 text-green-600">
                                                <MapPin className="w-4 h-4" /><span>{selectedEventForDetail.location}</span>
                                            </div>
                                        )}
                                        <div className={`flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full ${selectedEventForDetail.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {selectedEventForDetail.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                            <span>{selectedEventForDetail.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-extrabold mb-6" style={{ color: 'var(--color-primary)' }}>{selectedEventForDetail.title}</h3>
                                    <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        <p className="whitespace-pre-wrap">{selectedEventForDetail.description}</p>
                                    </div>
                                    <div className="flex space-x-3 mt-8 pt-6 border-t" style={{ borderColor: 'rgba(169, 169, 169, 0.1)' }}>
                                        <button onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedEventForDetail); }} className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-amber-500 text-white font-bold hover:shadow-lg transition-all"><Edit2 className="w-4 h-4" /><span>Edit Event</span></button>
                                        <button onClick={() => { handleDelete(selectedEventForDetail.id, selectedEventForDetail.title); setIsDetailModalOpen(false); }} className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-rose-500 text-white font-bold hover:shadow-lg transition-all"><Trash2 className="w-4 h-4" /><span>Hapus Event</span></button>
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
