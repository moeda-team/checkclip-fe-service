// hooks/useNotification.tsx
// Context-based notification provider wrapping sonner toast.
// WHY: Centralizes toast styling and provides a typed hook for all notifications.
// Every component/hook uses showNotification() instead of calling toast() directly,
// making it trivial to swap toast libraries or add analytics later.

"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { toast } from "sonner";

type NotificationType = "success" | "error" | "info";

type NotificationContextValue = {
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    id?: string
  ) => void;
  dismissNotification: (id?: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

const styleMap: Record<NotificationType, string> = {
  success:
    "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400",
  error:
    "bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400",
  info:
    "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400",
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const showNotification = useCallback(
    (type: NotificationType, title: string, message: string, id?: string) => {
      toast[type](title, {
        id,
        description: message,
        className: styleMap[type],
      });
    },
    []
  );

  const dismissNotification = useCallback((id?: string) => {
    if (id) toast.dismiss(id);
    else toast.dismiss();
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, dismissNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return ctx;
}
