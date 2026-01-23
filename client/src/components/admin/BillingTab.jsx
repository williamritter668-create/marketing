/**
 * BillingTab - Admin tab for viewing subscription requests
 * @param {array} subscriptions - List of subscriptions
 * @param {boolean} isLoading - Loading state
 * @param {function} onViewReceipt - Callback to view receipt image
 * @param {function} onAction - Callback for approve/reject action (id, action)
 */
const BillingTab = ({ subscriptions, isLoading, onViewReceipt, onAction }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-orange-100 text-orange-600';
            case 'APPROVED':
                return 'bg-green-100 text-green-600';
            default:
                return 'bg-red-100 text-red-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'قيد المراجعة';
            case 'APPROVED':
                return 'مقبول';
            default:
                return 'مرفوض';
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold">طلبات الاشتراك المعلقة</h2>

            {isLoading ? (
                <div className="text-center p-8 text-slate-400">جاري تحميل الطلبات...</div>
            ) : subscriptions.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden p-8 flex flex-col items-center justify-center h-64 text-slate-400">
                    <svg className="w-12 h-12 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>لا توجد طلبات معلقة حالياً</p>
                </div>
            ) : (
                <>
                    {/* Mobile Cards View */}
                    <div className="md:hidden space-y-4">
                        {subscriptions.map(sub => (
                            <div key={sub.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-bold text-sm">{sub.userName}</p>
                                        <p className="text-[10px] text-slate-400">{sub.userEmail}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(sub.status)}`}>
                                        {getStatusText(sub.status)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="text-slate-500">{sub.plan}</span>
                                    <span className="text-green-600 font-bold">${sub.amount}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => onViewReceipt(sub.receiptImage)}
                                        className="text-sky-600 text-xs font-bold"
                                    >
                                        مشاهدة الإيصال
                                    </button>

                                    {sub.status === 'PENDING' && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onAction(sub.id, 'approve')}
                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onAction(sub.id, 'reject')}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 font-bold text-slate-500 uppercase">المستخدم</th>
                                    <th className="px-8 py-5 font-bold text-slate-500 uppercase">نوع الباقة</th>
                                    <th className="px-8 py-5 font-bold text-slate-500 uppercase">القيمة</th>
                                    <th className="px-8 py-5 font-bold text-slate-500 uppercase">الإيصال</th>
                                    <th className="px-8 py-5 font-bold text-slate-500 uppercase">التاريخ</th>
                                    <th className="px-8 py-5 font-bold text-slate-500 uppercase">الحالة</th>
                                    <th className="px-8 py-5 font-bold text-slate-500 uppercase">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {subscriptions.map(sub => (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-all">
                                        <td className="px-8 py-5 font-bold">
                                            {sub.userName} <br />
                                            <span className="text-[10px] text-slate-400 font-normal">{sub.userEmail}</span>
                                        </td>
                                        <td className="px-8 py-5">{sub.plan}</td>
                                        <td className="px-8 py-5 text-green-600 font-bold">${sub.amount}</td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={() => onViewReceipt(sub.receiptImage)}
                                                className="text-sky-600 underline text-xs font-bold hover:text-sky-800 transition-colors"
                                            >
                                                مشاهدة الإيصال
                                            </button>
                                        </td>
                                        <td className="px-8 py-5 text-slate-400 text-xs">
                                            {new Date(sub.date).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(sub.status)}`}>
                                                {getStatusText(sub.status)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {sub.status === 'PENDING' && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => onAction(sub.id, 'approve')}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => onAction(sub.id, 'reject')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default BillingTab;
