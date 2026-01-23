/**
 * Modal - Reusable modal dialog component
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {ReactNode} children - Modal content
 * @param {string} maxWidth - Max width class (default: 'max-w-md')
 */
const Modal = ({ isOpen, onClose, children, maxWidth = 'max-w-md' }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-[2.5rem] shadow-2xl w-full ${maxWidth} p-8 md:p-10 animate-in zoom-in duration-300 relative text-right`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 md:top-6 left-4 md:left-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
