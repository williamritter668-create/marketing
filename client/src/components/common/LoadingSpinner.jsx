/**
 * LoadingSpinner - Reusable loading indicator component
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {string} text - Optional text to display
 */
const LoadingSpinner = ({ size = 'md', text = '' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-12 h-12 border-4',
        lg: 'w-16 h-16 border-4'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`${sizeClasses[size]} border-sky-500 border-t-transparent rounded-full animate-spin`}></div>
            {text && <p className="text-slate-500 font-bold animate-pulse">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
