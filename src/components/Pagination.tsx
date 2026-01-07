import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (end === totalPages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
                Menampilkan <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{startItem}</span> sampai <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{endItem}</span> dari <span className="font-bold">{totalItems}</span> data
            </p>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex items-center space-x-1">
                    {getPageNumbers().map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 ${currentPage === page
                                    ? 'text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                                }`}
                            style={{
                                backgroundColor: currentPage === page ? 'var(--color-primary)' : 'transparent',
                                boxShadow: currentPage === page ? '0 10px 15px -3px rgba(30, 41, 59, 0.2)' : 'none'
                            }}
                        >
                            {page}
                        </button>
                    ))}

                    {totalPages > 5 && getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                        <>
                            <span className="px-2 text-gray-400">...</span>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="w-10 h-10 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
}
