/**
 * ReceiptModal - Modal for viewing receipt images
 * @param {boolean} isOpen - Modal visibility
 * @param {function} onClose - Close callback
 * @param {string} receiptUrl - URL of receipt image
 */
const ReceiptModal = ({ isOpen, onClose, receiptUrl }) => {
    if (!isOpen || !receiptUrl) return null;

    return (
        <div
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col relative animate-in zoom-in duration-300"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/50 hover:bg-white rounded-full p-2 transition-all z-10"
                >
                    <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex-grow overflow-auto bg-slate-100 flex items-center justify-center">
                    <img src={receiptUrl} alt="Receipt" className="max-w-full max-h-[80vh] object-contain" />
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">
                    <span className="text-sm font-bold text-slate-500">صورة الإيصال</span>
                    <a
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-all w-full md:w-auto text-center"
                    >
                        تحميل / فتح في نافذة جديدة
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
