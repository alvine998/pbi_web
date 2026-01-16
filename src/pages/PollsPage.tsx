import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, X, Vote, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { showToast } from '../utils/toast';
import DashboardLayout from '../components/DashboardLayout';
import Pagination from '../components/Pagination';
import api from '../utils/api';

const ITEMS_PER_PAGE = 10;

interface PollOption {
    id: number;
    text: string;
    votes: number;
}

interface Poll {
    id: number;
    question: string;
    options: PollOption[];
    endDate: string;
    totalVotes: number;
    status: 'Active' | 'Ended';
}

export default function PollsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
    const [formData, setFormData] = useState({
        question: '',
        endDate: '',
        options: ['', '']
    });

    const [polls, setPolls] = useState<Poll[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPolls = useCallback(async () => {
        setIsLoading(true);
        setIsLoading(true);

        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', ITEMS_PER_PAGE.toString());
            if (searchQuery) params.append('search', searchQuery);

            const response = await api.get(`/polls?${params.toString()}`);
            const data = response.data;

            console.log('Polls API response:', data);

            if (data.items) {
                setPolls(data.items);
                setTotalItems(data.totalItems || data.items.length);
                setTotalPages(data.totalPages || Math.ceil((data.totalItems || data.items.length) / ITEMS_PER_PAGE));
            } else if (Array.isArray(data)) {
                setPolls(data);
                setTotalItems(data.length);
                setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
            } else if (data.data) {
                setPolls(Array.isArray(data.data) ? data.data : []);
                setTotalItems(data.total || data.data.length);
                setTotalPages(data.totalPages || Math.ceil(data.total / ITEMS_PER_PAGE));
            } else {
                setPolls([]);
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (err: any) {
            console.error('Error fetching polls:', err);
            setPolls([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery]);

    useEffect(() => {
        fetchPolls();
    }, [fetchPolls]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddOption = () => {
        setFormData({ ...formData, options: [...formData.options, ''] });
    };

    const handleRemoveOption = (index: number) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData({ ...formData, options: newOptions });
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loadingToast = showToast.loading(editingPoll ? 'Menyimpan perubahan...' : 'Membuat polling...');

        try {
            const payload = {
                question: formData.question,
                options: formData.options.map(text => ({ text })),
                endDate: formData.endDate
            };

            if (editingPoll) {
                await api.put(`/polls/${editingPoll.id}`, payload);
                showToast.dismiss(loadingToast);
                showToast.success('Polling berhasil diupdate!');
            } else {
                await api.post('/polls', payload);
                showToast.dismiss(loadingToast);
                showToast.success('Polling baru berhasil dibuat!');
            }

            setIsAddModalOpen(false);
            setEditingPoll(null);
            setFormData({ question: '', endDate: '', options: ['', ''] });
            fetchPolls();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menyimpan polling');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus polling ini?')) return;

        setIsSubmitting(true);
        const loadingToast = showToast.loading('Menghapus polling...');

        try {
            await api.delete(`/polls/${id}`);
            showToast.dismiss(loadingToast);
            showToast.success('Polling berhasil dihapus');
            fetchPolls();
        } catch (err: any) {
            showToast.dismiss(loadingToast);
            showToast.error(err.response?.data?.message || 'Gagal menghapus polling');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (poll: Poll) => {
        setEditingPoll(poll);
        setFormData({
            question: poll.question,
            endDate: poll.endDate ? poll.endDate.split('T')[0] : '',
            options: poll.options.map(o => o.text)
        });
        setIsAddModalOpen(true);
    };

    const getProgress = (votes: number, total: number) => {
        if (total === 0) return 0;
        return (votes / total) * 100;
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            Polling Survey
                        </h1>
                        <p className="mt-1" style={{ color: 'var(--color-dark-gray)' }}>
                            Kelola survei dan polling pengguna
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingPoll(null);
                            setFormData({ question: '', endDate: '', options: ['', ''] });
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Buat Polling Baru</span>
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-custom)' }} />
                        <input
                            type="text"
                            placeholder="Cari pertanyaan polling..."
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

                {/* Polls Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                        <p className="text-gray-400">Memuat polling...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {polls.map((poll) => (
                            <div key={poll.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${poll.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {poll.status}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handleEdit(poll)} className="p-2 rounded-lg hover:bg-yellow-50 transition-colors" title="Edit">
                                            <Edit2 className="w-4 h-4 text-yellow-500" />
                                        </button>
                                        <button onClick={() => handleDelete(poll.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Hapus">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-6 flex-1" style={{ color: 'var(--color-primary)' }}>{poll.question}</h3>

                                <div className="space-y-4 mb-6">
                                    {poll.options.map((option) => (
                                        <div key={option.id}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium" style={{ color: 'var(--color-dark-gray)' }}>{option.text}</span>
                                                <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{option.votes} ({Math.round(getProgress(option.votes, poll.totalVotes))}%)</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                                <div
                                                    className="h-2 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${getProgress(option.votes, poll.totalVotes)}%`,
                                                        backgroundColor: 'var(--color-info)'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-gray-custom)' }}>
                                        <div className="flex items-center space-x-1">
                                            <Vote className="w-4 h-4" />
                                            <span>{poll.totalVotes} Total Suara</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Ends: {poll.endDate ? new Date(poll.endDate).toLocaleDateString('id-ID') : '-'}</span>
                                        </div>
                                    </div>
                                    {poll.status === 'Active' && (
                                        <div className="flex items-center space-x-1 text-xs text-green-600 font-medium">
                                            <Clock className="w-3 h-3" />
                                            <span>Berlangsung</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {polls.length === 0 && (
                            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-400">Tidak ada survey polling ditemukan</p>
                            </div>
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

                {/* Add/Edit Modal */}
                {isAddModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        {editingPoll ? 'Edit Polling' : 'Buat Polling Baru'}
                                    </h2>
                                    <button onClick={() => setIsAddModalOpen(false)} className="hover:opacity-70 transition-opacity">
                                        <X className="w-6 h-6" style={{ color: 'var(--color-dark-gray)' }} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Pertanyaan Polling</label>
                                        <textarea
                                            required
                                            value={formData.question}
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                            placeholder="Apa yang ingin Anda tanyakan?"
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                            rows={3}
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-semibold" style={{ color: 'var(--color-dark-gray)' }}>Pilihan Jawaban</label>
                                            <button
                                                type="button"
                                                onClick={handleAddOption}
                                                className="text-xs font-bold flex items-center space-x-1"
                                                style={{ color: 'var(--color-info)' }}
                                            >
                                                <Plus className="w-3 h-3" />
                                                <span>Tambah Opsi</span>
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.options.map((option, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        required
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                                        placeholder={`Opsi ${index + 1}`}
                                                        className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                                        style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                                    />
                                                    {formData.options.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveOption(index)}
                                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-dark-gray)' }}>Tanggal Berakhir</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 px-4 py-3 border rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                            style={{ borderColor: 'rgba(169, 169, 169, 0.4)', color: 'var(--color-dark-gray)' }}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-3 rounded-xl text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                                            style={{ backgroundColor: 'var(--color-primary)' }}
                                        >
                                            {isSubmitting ? 'Menyimpan...' : editingPoll ? 'Simpan Perubahan' : 'Buat Polling'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
