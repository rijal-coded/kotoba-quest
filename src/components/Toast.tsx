import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X, Sparkles } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextId, setNextId] = useState(0);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = nextId;
    setNextId(prev => prev + 1);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, [nextId]);

  const dismiss = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icons = {
    success: <CheckCircle className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
    info: <Sparkles className="w-4 h-4" />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`pointer-events-auto kawaii-toast kawaii-toast--${toast.type}`}
            >
              {icons[toast.type]}
              <span className="whitespace-nowrap">{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
