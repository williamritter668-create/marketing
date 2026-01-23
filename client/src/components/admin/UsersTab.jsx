/**
 * UsersTab - Admin tab for managing users
 * @param {array} users - List of users
 * @param {function} onAddCredits - Callback when clicking add credits button
 */
const UsersTab = ({ users, onAddCredits, onAddUser, onDeleteUser }) => {
    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
                <button
                    onClick={onAddUser}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm w-full md:w-auto hover:bg-slate-800 transition-colors"
                >
                    إضافة مستخدم يدوي
                </button>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {users.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-slate-400">
                        لا يوجد مستخدمين مسجلين بعد
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sky-600">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{user.name}</p>
                                        <p className="text-[10px] text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onAddCredits(user)}
                                    className="p-2 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all ml-2"
                                    title="إضافة رصيد"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => onDeleteUser(user)}
                                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                    title="حذف المستخدم"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">{user.role === 'ADMIN' ? 'مدير' : 'مستخدم'}</span>
                                <span className="text-slate-700 font-bold">{user.credits || 0} صورة</span>
                                <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold">نشط</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-right text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 font-bold text-slate-500 uppercase">المستخدم</th>
                            <th className="px-8 py-5 font-bold text-slate-500 uppercase">الخطة</th>
                            <th className="px-8 py-5 font-bold text-slate-500 uppercase">الرصيد</th>
                            <th className="px-8 py-5 font-bold text-slate-500 uppercase">الحالة</th>
                            <th className="px-8 py-5 font-bold text-slate-500 uppercase">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-12 text-center text-slate-400">
                                    لا يوجد مستخدمين مسجلين بعد
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sky-600">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{user.name}</span>
                                                <span className="text-[10px] text-slate-400">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-medium">{user.role === 'ADMIN' ? 'مدير' : 'مستخدم'}</td>
                                    <td className="px-8 py-5">{user.credits || 0} صورة</td>
                                    <td className="px-8 py-5">
                                        <span className="bg-[#dcfce7] text-[#166534] px-3 py-1 rounded-full text-[10px] font-black uppercase">نشط</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onAddCredits(user)}
                                                className="p-2 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                                                title="إضافة رصيد"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onDeleteUser(user)}
                                                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="حذف المستخدم"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTab;
