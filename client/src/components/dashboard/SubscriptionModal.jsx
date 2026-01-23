import { useState } from 'react';
import { Modal } from '../common';
import api from '../../api/axios';
import toast from 'react-hot-toast';

/**
 * SubscriptionModal - Modal for submitting subscription with receipt
 * @param {boolean} isOpen - Modal visibility
 * @param {function} onClose - Close callback
 * @param {object} selectedPlan - { name, amount }
 */
const SubscriptionModal = ({ isOpen, onClose, selectedPlan }) => {
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptName, setReceiptName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('syriatel'); // 'syriatel' or 'sham'

    const handleReceiptUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReceiptFile(file);
            setReceiptName(file.name);
        }
    };

    // ... (handleSubmit implementation remains the same) ...
    const handleSubmit = async () => {
        if (!receiptFile) {
            toast.error("يرجى رفع صورة الإيصال");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('plan', selectedPlan.name);
            formData.append('amount', selectedPlan.amount);
            formData.append('receiptImage', receiptFile);

            // Optionally append payment method if backend supports it
            formData.append('paymentMethod', paymentMethod);

            await api.post('/api/subscriptions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("تم إرسال طلب الاشتراك بنجاح! سيقوم الأدمن بمراجعته.");
            handleClose();
        } catch (error) {
            console.error("Subscription error", error);
            toast.error("حدث خطأ أثناء إرسال الطلب");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setReceiptFile(null);
        setReceiptName('');
        onClose();
    };

    if (!selectedPlan) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            </div>

            <h3 className="text-xl font-bold mb-2">إتمام الاشتراك اليدوي</h3>
            <p className="text-sm text-slate-500 mb-6">
                لقد اخترت <span className="font-bold text-slate-900">{selectedPlan.name}</span> بسعر <span className="font-bold text-slate-900">${selectedPlan.amount}</span>
            </p>

            {/* Payment Method Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button
                    onClick={() => setPaymentMethod('syriatel')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === 'syriatel'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    Syriatel Cash
                </button>
                <button
                    onClick={() => setPaymentMethod('sham')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === 'sham'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Sham Cash
                </button>
            </div>

            {/* Syriatel Cash Details */}
            {paymentMethod === 'syriatel' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200 mb-6 animate-in fade-in zoom-in duration-300">
                    <p className="font-bold text-green-800 mb-3 flex items-center gap-2">
                        حوّل عبر Syriatel Cash:
                    </p>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-green-300">
                        <span className="font-mono text-lg font-bold text-green-700 select-all dir-ltr">98951670</span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText('98951670');
                                toast.success('تم نسخ الرقم!');
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            نسخ
                        </button>
                    </div>
                    <p className="text-xs text-green-700 mt-2">* بعد التحويل، ارفع صورة الإيصال أدناه</p>
                </div>
            )}

            {/* Sham Cash Details */}
            {paymentMethod === 'sham' && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-2xl border-2 border-orange-200 mb-6 animate-in fade-in zoom-in duration-300">
                    <p className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                        حوّل عبر الشام كاش (Sham Cash):
                    </p>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-orange-300">
                        <span className="font-mono text-xs md:text-sm font-bold text-orange-700 select-all dir-ltr truncate max-w-[200px] md:max-w-none" title="df66cbb4241a03ab631715ffffb4381a">
                            df66cbb4241a03ab631715ffffb4381a
                        </span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText('df66cbb4241a03ab631715ffffb4381a');
                                toast.success('تم نسخ الرمز!');
                            }}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            نسخ
                        </button>
                    </div>
                    <p className="text-xs text-orange-700 mt-2">* بعد التحويل، ارفع صورة الإيصال أدناه</p>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">رفع صورة الإيصال</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleReceiptUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-dashed border-slate-200 text-center text-slate-400 hover:border-sky-400 transition-all flex items-center justify-center gap-2">
                            {receiptName ? (
                                <span className="text-sky-600 font-bold">{receiptName}</span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>اضغط لاختيار صورة</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال للتحقق'}
                </button>
            </div>
        </Modal>
    );
};

export default SubscriptionModal;
