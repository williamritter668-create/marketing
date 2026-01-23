import { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * HistoryTab - Display user's previous projects with premium design
 * @param {array} projects - List of user projects
 */
const HistoryTab = ({ projects }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('تم نسخ النص بنجاح! 📋');
    };

    return (
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-10 bg-[#f8fafc]">
            {/* Header section */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">أرشيف الإبداع ✨</h2>
                    <p className="text-slate-500 font-medium">هنا تجد كل ما صنعته من حملات إعلانية احترافية.</p>
                </div>
                <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <span className="text-slate-400 text-sm font-bold">إجمالي الأعمال:</span>
                    <span className="text-sky-600 font-black text-xl">{projects.length}</span>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <p className="font-bold text-lg text-slate-600">لا توجد أعمال سابقة حتى الآن</p>
                    <p className="text-slate-400 mt-2">توجه إلى الاستوديو وابدأ بصناعة أول إعلان لك!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col"
                        >
                            {/* Image Part */}
                            <div className="relative aspect-square overflow-hidden bg-slate-50">
                                {project.imageUrl ? (
                                    <img
                                        src={project.imageUrl}
                                        alt="المنتج المولد"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <span className="text-xs font-bold uppercase tracking-widest">نص فقط</span>
                                    </div>
                                )}

                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-tighter shadow-xl">
                                        {project.platform || 'عصري'}
                                    </span>
                                </div>

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                const response = await fetch(project.imageUrl);
                                                const blob = await response.blob();
                                                const blobUrl = window.URL.createObjectURL(blob);
                                                const link = document.createElement('a');
                                                link.href = blobUrl;
                                                link.download = `syrian-ad-${Date.now()}.png`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                window.URL.revokeObjectURL(blobUrl);
                                                toast.success('بدأ التحميل... 📥');
                                            } catch (err) {
                                                console.error('Download failed', err);
                                                window.open(project.imageUrl, '_blank');
                                            }
                                        }}
                                        className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:bg-sky-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        تحميل الصورة
                                    </button>
                                </div>
                            </div>

                            {/* Content Part */}
                            <div className="p-7 flex-grow flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(project.createdAt).toLocaleDateString('ar-SY', { day: 'numeric', month: 'long' })}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => project.caption && copyToClipboard(project.caption)}
                                        className="text-slate-400 hover:text-sky-600 transition-colors"
                                        title="نسخ النص الإعلاني"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    </button>
                                </div>

                                {project.caption ? (
                                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50 relative">
                                        <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-4 overflow-hidden">
                                            {project.caption}
                                        </p>
                                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50/80 to-transparent pointer-events-none"></div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">لا يوجد نص لهذا المشروع</p>
                                )}

                                <div className="mt-auto pt-6 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">الوصف المستخدم:</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 truncate w-full">
                                        {project.prompt || '--'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryTab;
