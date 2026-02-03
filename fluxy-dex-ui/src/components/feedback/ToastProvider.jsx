import { ToastContext } from "./useToast";
import { useState } from "react";

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  return (
    <ToastContext.Provider value={setToast}>
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-zinc-800 px-4 py-2 rounded-xl shadow">
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}
