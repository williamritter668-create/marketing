import React from 'react';

/**
 * WhatsAppFloat - A floating WhatsApp button that appears on all pages
 */
const WhatsAppFloat = () => {
    return (
        <a
            href="https://wa.me/message/B73TKEIEH3J4L1"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 md:bottom-6 left-6 z-[100] group flex items-center justify-center"
            aria-label="تواصل معنا عبر واتساب"
        >
            {/* Tooltip */}
            <span className="absolute right-full mr-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap translate-x-4 group-hover:translate-x-0">
                تواصل معنا مباشرة
            </span>

            {/* Pulsing Aura */}
            <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25 scale-125"></span>

            {/* Main Button */}
            <div className="relative bg-green-500 text-white w-14 h-14 rounded-full shadow-2xl shadow-green-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
            </div>
        </a>
    );
};

export default WhatsAppFloat;
