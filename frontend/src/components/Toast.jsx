import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 max-w-sm flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xl backdrop-blur-lg animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[16px]">check_circle</span>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-slate-900">
          {toast.title || 'TinyRoute Edge Sync'}
        </span>
        <span className="text-xs text-slate-500 truncate">
          {toast.message}
        </span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
}
