import { useState } from 'react';
import { Modal } from '../common';
import api from '../../api/axios';
import toast from 'react-hot-toast';

/**
 * CreditModal - Modal for adding credits to a user
 * @param {boolean} isOpen - Modal visibility
 * @param {function} onClose - Close callback
 * @param {object} user - Selected user
 * @param {function} onSuccess - Callback after successful credit addition
 */
const CreditModal = ({ isOpen, onClose, user, onSuccess }) => {
    const [creditAmount, setCreditAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!creditAmount || creditAmount <= 0) {
            toast.error("يرجى إدخال رقم صحيح.");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post(`/api/users/${user.id}/credits`, { credits: creditAmount });
            toast.success(`تم إضافة ${creditAmount} صورة بنجاح لرصيد ${user.name}`);
            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            console.error('Failed to add credits:', error);
            toast.error('حدث خطأ أثناء إضافة الرصيد');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setCreditAmount('');
        onClose();
    };

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <h3 className="text-xl font-bold mb-2">إضافة رصيد صور</h3>
            <p className="text-sm text-slate-500 mb-8">
                أنت تقوم بزيادة رصيد المستخدم: <span className="font-bold text-slate-900">{user.name}</span>
            </p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        عدد الصور المراد إضافتها
                    </label>
                    <input
                        type="number"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        placeholder="مثال: 50"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-sky-500 outline-none text-right transition-all"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-grow bg-sky-600 text-white py-4 rounded-2xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 disabled:opacity-50"
                    >
                        {isSubmitting ? 'جاري المعالجة...' : 'تحديث الرصيد'}
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-8 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreditModal;
