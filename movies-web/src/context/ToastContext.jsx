import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]); // { id, message, type }

    const showToast = useCallback((message, type = 'info', timeout = 3000) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, timeout);
    }, []);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto min-w-[220px] max-w-[320px] rounded-md px-3 py-2 text-sm shadow-lg border ${toast.type === 'success'
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : toast.type === 'error'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-slate-50 text-slate-800 border-slate-200'
                            }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}