/**
 * ConfirmModal - Confirmation modal for approve/reject actions
 * @param {boolean} isOpen - Modal visibility
 * @param {function} onClose - Close callback
 * @param {function} onConfirm - Confirm callback
 * @param {string} action - 'approve' or 'reject'
 */
const ConfirmModal = ({ isOpen, onClose, onConfirm, action }) => {
    if (!isOpen) return null;

    const isApprove = action === 'approve';
    const isDelete = action === 'delete_user';

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-6 md:p-8 animate-in zoom-in duration-300 text-center">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${isApprove ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                    {isApprove ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : isDelete ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>

                <h3 className="text-xl font-bold mb-2">هل أنت متأكد؟</h3>
                <p className="text-slate-500 mb-8">
                    {isDelete ? (
                        <span>
                            أنت على وشك <span className="font-bold text-red-600">حذف</span> هذا الحساب نهائياً.
                            لا يمكن التراجع عن هذا الإجراء.
                        </span>
                    ) : (
                        <span>
                            أنت على وشك <span className={`font-bold ${isApprove ? 'text-green-600' : 'text-red-600'}`}>
                                {isApprove ? 'قبول' : 'رفض'}
                            </span> هذا الاشتراك.
                            {isApprove && ' سيتم إضافة الرصيد للمستخدم فوراً.'}
                        </span>
                    )}
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className={`flex-grow py-3 rounded-xl font-bold text-white transition-all shadow-lg ${isApprove
                            ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                            : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                            }`}
                    >
                        نعم، تنفيذ
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-grow bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
