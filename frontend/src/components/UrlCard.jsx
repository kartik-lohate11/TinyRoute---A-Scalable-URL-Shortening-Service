import React, { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Edit2,
  Trash2,
  Globe,
  Lock,
  MoreVertical,
  BarChart2,
  Clock
} from 'lucide-react';

/**
 * Reusable UrlCard component.
 * Supports both full table row layout (desktop) and stacked card layout (mobile).
 */
export default function UrlCard({
  url,
  onCopy,
  onOpenQr,
  onEdit,
  onDelete,
  onViewAnalytics,
  isSelected,
  onSelectToggle
}) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle local copy with micro-interaction state
  const handleCopyClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://${url.shortUrl}`);
    setCopied(true);
    if (onCopy) onCopy(url);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Table Row layout for screens >= md */}
      <tr className="hidden md:table-row hover:bg-slate-50/75 transition-colors group border-b border-slate-100">
        {onSelectToggle && (
          <td className="py-4 px-4 w-10">
            <input
              type="checkbox"
              checked={isSelected || false}
              onChange={() => onSelectToggle(url.id)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
          </td>
        )}
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenQr(url)}
              className="w-9 h-9 rounded-lg bg-[#eff4ff] text-indigo-700 flex items-center justify-center hover:bg-indigo-100 transition-colors shrink-0"
              title="View QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-[#3525cd] hover:underline cursor-pointer" onClick={handleCopyClick}>
                  {url.shortUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyClick}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Copy Short URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${url.statusType?.includes('Expires') ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                <span className="font-mono text-xs text-slate-500">{url.statusType || '301 Permanent'}</span>
                {url.tag && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-600">{url.tag}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Original Destination */}
        <td className="py-4 px-4">
          <div className="flex items-center gap-2 max-w-xs lg:max-w-sm">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="truncate text-xs text-slate-600 hover:text-slate-900 hover:underline"
              title={url.originalUrl}
            >
              {url.originalUrl}
            </a>
          </div>
        </td>

        {/* Clicks & Sparkline */}
        <td className="py-4 px-4 text-center">
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm">{url.clicks?.toLocaleString() || 0}</span>
              {/* Mini Sparkline SVG */}
              <svg className="w-14 h-4 text-emerald-600 stroke-current fill-none shrink-0" viewBox="0 0 60 20">
                <path d="M 0 16 Q 15 2 30 11 T 60 4" strokeLinecap="round" strokeWidth="2"></path>
                <circle className="fill-emerald-600" cx="60" cy="4" r="2.5"></circle>
              </svg>
            </div>
            <span className="font-mono text-[11px] text-emerald-600 font-medium mt-0.5">
              {url.weeklyGrowth || '+12% traffic'}
            </span>
          </div>
        </td>

        {/* Visibility */}
        <td className="py-4 px-4">
          {url.visibility === 'private' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              <Lock className="w-3 h-3" /> Private
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
              <Globe className="w-3 h-3" /> Public
            </span>
          )}
        </td>

        {/* Created Date */}
        <td className="py-4 px-4">
          <div className="flex flex-col text-xs">
            <span className="text-slate-800">{url.createdDate || 'Oct 24, 2024'}</span>
            <span className="font-mono text-slate-400 text-[11px]">{url.timeAgo || 'Recently'}</span>
          </div>
        </td>

        {/* Action Buttons */}
        <td className="py-4 px-4 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onViewAnalytics && onViewAnalytics(url)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="View Analytics"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title="Open Destination"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(url)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Edit Alias"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(url)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete URL"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile Card Layout for screens < md */}
      <div className="md:hidden bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => onOpenQr(url)}
              className="w-8 h-8 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <span className="font-mono text-sm font-semibold text-[#3525cd] truncate block">{url.shortUrl}</span>
              <span className="text-[11px] text-slate-400 font-mono">{url.createdDate}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyClick}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 text-xs font-medium text-slate-700 hover:text-indigo-700 flex items-center gap-1 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 truncate bg-slate-50 px-2.5 py-1.5 rounded font-mono">
          {url.originalUrl}
        </p>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900">{url.clicks?.toLocaleString() || 0} clicks</span>
            <span className="text-emerald-600 font-medium text-[11px]">{url.weeklyGrowth || '+14%'}</span>
          </div>
          <div className="flex items-center gap-1">
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 text-slate-400 hover:text-slate-800"
              title="Open"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => onDelete(url)}
              className="p-1 text-slate-400 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
