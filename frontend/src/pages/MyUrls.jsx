import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserUrls,
  createShortUrl,
  updateShortUrl,
  deleteShortUrl,
  getOverallAnalytics
} from '../services/api';
import UrlCard from '../components/UrlCard';
import Modal from '../components/Modal';
import {
  Search,
  PlusCircle,
  Download,
  Filter,
  CheckCircle2,
  Trash2,
  QrCode,
  Link as LinkIcon,
  Activity,
  Zap,
  Layers,
  ArrowUpDown,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export default function MyUrls() {
  const navigate = useNavigate();

  // Data states
  const [urls, setUrls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'archived' | 'expiring'
  const [tagFilter, setTagFilter] = useState('all');
  const [sortBy, setSortBy] = useState('clicks-desc'); // 'clicks-desc' | 'clicks-asc' | 'newest' | 'oldest'
  const [selectedIds, setSelectedIds] = useState([]);

  // Empty state preview toggle for demonstration/testing
  const [previewEmptyState, setPreviewEmptyState] = useState(false);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeQrUrl, setActiveQrUrl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState(null);
  const [editSlug, setEditSlug] = useState('');

  // Form state for New URL modal
  const [newDestination, setNewDestination] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newTag, setNewTag] = useState('#marketing');
  const [newVisibility, setNewVisibility] = useState('public');
  const [toastMessage, setToastMessage] = useState('');

  // Trigger toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [urlsData, analyticsData] = await Promise.all([
          getUserUrls(),
          getOverallAnalytics(),
        ]);
        setUrls(urlsData || []);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Error fetching URLs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and sort URLs
  const filteredUrls = urls.filter((item) => {
    if (previewEmptyState) return false;

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchShort = item.shortUrl?.toLowerCase().includes(q);
      const matchOriginal = item.originalUrl?.toLowerCase().includes(q);
      const matchTag = item.tag?.toLowerCase().includes(q);
      if (!matchShort && !matchOriginal && !matchTag) return false;
    }

    // Status filter
    if (statusFilter === 'active' && item.statusType?.includes('Expires')) return false;
    if (statusFilter === 'archived' && item.statusType !== 'Archived') return false;
    if (statusFilter === 'expiring' && !item.statusType?.includes('Expires')) return false;

    // Tag filter
    if (tagFilter !== 'all' && item.tag !== tagFilter) return false;

    return true;
  });

  // Sort filtered list
  const sortedUrls = [...filteredUrls].sort((a, b) => {
    if (sortBy === 'clicks-desc') return (b.clicks || 0) - (a.clicks || 0);
    if (sortBy === 'clicks-asc') return (a.clicks || 0) - (b.clicks || 0);
    if (sortBy === 'newest') return (b.id > a.id ? 1 : -1);
    if (sortBy === 'oldest') return (a.id > b.id ? 1 : -1);
    return 0;
  });

  // Selection handlers
  const handleSelectToggle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === sortedUrls.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedUrls.map((u) => u.id));
    }
  };

  // Batch delete selected URLs
  const handleBatchDelete = async () => {
    if (!selectedIds.length) return;
    for (const id of selectedIds) {
      await deleteShortUrl(id);
    }
    setUrls(urls.filter((u) => !selectedIds.includes(u.id)));
    setSelectedIds([]);
    triggerToast(`Decommissioned ${selectedIds.length} URLs`);
  };

  // Create new URL submit handler
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newDestination) return;

    let finalUrl = newDestination.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      const created = await createShortUrl({
        originalUrl: finalUrl,
        slug: newSlug.trim() || undefined,
        tag: newTag,
        visibility: newVisibility,
      });

      setUrls([created, ...urls]);
      setCreateModalOpen(false);
      setNewDestination('');
      setNewSlug('');
      triggerToast(`Created short URL: ${created.shortUrl}`);
    } catch {
      triggerToast('Error creating short URL');
    }
  };

  // Edit URL submit handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!urlToEdit || !editSlug) return;
    try {
      const updated = await updateShortUrl(urlToEdit.id, {
        slug: editSlug.trim(),
        shortUrl: `tinyroute.app/${editSlug.trim()}`,
      });
      setUrls(urls.map((u) => (u.id === urlToEdit.id ? updated : u)));
      setEditModalOpen(false);
      setUrlToEdit(null);
      triggerToast('Updated short URL slug');
    } catch {
      triggerToast('Failed to update URL');
    }
  };

  // Single delete handler
  const handleConfirmDelete = async () => {
    if (!urlToDelete) return;
    try {
      await deleteShortUrl(urlToDelete.id);
      setUrls(urls.filter((u) => u.id !== urlToDelete.id));
      triggerToast(`Deleted ${urlToDelete.shortUrl}`);
    } catch {
      triggerToast('Error deleting URL');
    } finally {
      setDeleteModalOpen(false);
      setUrlToDelete(null);
    }
  };

  // CSV Export handler
  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Short URL,Destination,Clicks,Status,Created'].join(',') +
      '\n' +
      urls
        .map((u) => `"${u.shortUrl}","${u.originalUrl}",${u.clicks},"${u.statusType}","${u.createdDate}"`)
        .join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `tinyroute_urls_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Exported CSV file');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER & GLOBAL ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-[#3525cd] uppercase tracking-wider">
            Routing Console / Active Workspaces
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight mt-1">
            My URLs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage edge redirects, update destinations, and review granular telemetry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-100 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create URL</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR SUMMARY KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Shortlinks
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#3525cd] flex items-center justify-center">
              <LinkIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#0b1c30]">{urls.length || 128}</span>
            <span className="block text-[11px] font-mono text-emerald-600 font-semibold mt-0.5">
              +12% vs last month
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cumulative Clicks
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#0b1c30]">
              {(urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 49820).toLocaleString()}
            </span>
            <span className="block text-[11px] font-mono text-emerald-600 font-semibold mt-0.5">
              +34% engagement
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Global Latency
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#0b1c30]">18 ms</span>
            <span className="block text-[11px] font-mono text-indigo-600 font-semibold mt-0.5">
              Sub-millisecond TTFB
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active QR Scans
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#0b1c30]">6,104</span>
            <span className="block text-[11px] font-mono text-emerald-600 font-semibold mt-0.5">
              High mobile conversion
            </span>
          </div>
        </div>
      </div>

      {/* 3. TOOLBAR: SEARCH, STATUS TABS, SORT, TAGS, AND PREVIEW TOGGLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
        {/* Top bar: Search + Sort + Empty state toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by short URL, destination URL, or tag..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs bg-[#eff4ff] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-2 rounded-xl border border-slate-200/60 text-xs text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none text-xs font-medium cursor-pointer"
              >
                <option value="clicks-desc">Most Clicks</option>
                <option value="clicks-asc">Fewest Clicks</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Empty state preview toggle for demonstration */}
            <button
              type="button"
              onClick={() => setPreviewEmptyState(!previewEmptyState)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                previewEmptyState
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle to test empty state design"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewEmptyState ? 'Reset Live Data' : 'Preview Empty State'}</span>
            </button>
          </div>
        </div>

        {/* Bottom bar: Status tabs + Tag chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-slate-200/60 text-xs font-medium overflow-x-auto">
            {[
              { key: 'all', label: `All (${urls.length})` },
              { key: 'active', label: 'Active (112)' },
              { key: 'archived', label: 'Archived (16)' },
              { key: 'expiring', label: 'Expiring Soon (4)' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  statusFilter === tab.key
                    ? 'bg-white text-[#3525cd] font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tag filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-mono select-none">Tags:</span>
            {['all', '#dev', '#marketing', '#docs', '#hiring'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTagFilter(tag)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors whitespace-nowrap ${
                  tagFilter === tag
                    ? 'bg-[#3525cd] text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. URLS DATA TABLE & EMPTY STATE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {sortedUrls.length === 0 ? (
          /* Empty State View */
          <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#3525cd] mx-auto flex items-center justify-center shadow-xs">
              <LinkIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0b1c30]">No Shortened URLs Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {searchQuery || statusFilter !== 'all' || tagFilter !== 'all'
                ? 'No shortened URLs match your active search and filter parameters. Try resetting your filters or create a new route.'
                : 'You have not configured any routing links yet. Shorten your first destination URL to start routing traffic through our global Anycast edge.'}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              {(searchQuery || statusFilter !== 'all' || tagFilter !== 'all' || previewEmptyState) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setTagFilter('all');
                    setPreviewEmptyState(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Reset Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setPreviewEmptyState(false);
                  setCreateModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
              >
                + Shorten New URL
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-[#eff4ff] text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === sortedUrls.length && sortedUrls.length > 0}
                        onChange={handleSelectAll}
                        className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Shortlink & Routing Status</th>
                    <th className="py-3.5 px-4">Destination Target</th>
                    <th className="py-3.5 px-4 text-center">Telemetry Clicks</th>
                    <th className="py-3.5 px-4">Visibility</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedUrls.map((url) => (
                    <UrlCard
                      key={url.id}
                      url={url}
                      isSelected={selectedIds.includes(url.id)}
                      onSelectToggle={handleSelectToggle}
                      onCopy={() => triggerToast(`Copied ${url.shortUrl}`)}
                      onOpenQr={(u) => {
                        setActiveQrUrl(u);
                        setQrModalOpen(true);
                      }}
                      onEdit={(u) => {
                        setUrlToEdit(u);
                        setEditSlug(u.slug || '');
                        setEditModalOpen(true);
                      }}
                      onDelete={(u) => {
                        setUrlToDelete(u);
                        setDeleteModalOpen(true);
                      }}
                      onViewAnalytics={() => navigate('/analytics')}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3">
              {sortedUrls.map((url) => (
                <UrlCard
                  key={url.id}
                  url={url}
                  onCopy={() => triggerToast(`Copied ${url.shortUrl}`)}
                  onOpenQr={(u) => {
                    setActiveQrUrl(u);
                    setQrModalOpen(true);
                  }}
                  onDelete={(u) => {
                    setUrlToDelete(u);
                    setDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>

            {/* Table Pagination Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
              <span>
                Showing <strong className="text-slate-800">{sortedUrls.length}</strong> of{' '}
                <strong className="text-slate-800">{urls.length}</strong> routing links
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-50 cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-slate-800 font-semibold">Page 1 of 1</span>
                <button
                  type="button"
                  disabled
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-50 cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CREATE NEW URL MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Short URL"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destination URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              placeholder="https://acme.org/quarterly-metrics-2025"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Alias / Slug (Optional)
            </label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
              <span className="font-mono text-xs text-slate-400 mr-1 select-none">tinyroute.app/</span>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="q4-metrics"
                className="w-full bg-transparent text-xs font-mono text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category Tag
              </label>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none"
              >
                <option value="#marketing">#marketing</option>
                <option value="#dev">#dev</option>
                <option value="#docs">#docs</option>
                <option value="#hiring">#hiring</option>
                <option value="#product">#product</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visibility
              </label>
              <select
                value={newVisibility}
                onChange={(e) => setNewVisibility(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none"
              >
                <option value="public">Public (301)</option>
                <option value="private">Private (Password)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              Shorten & Deploy
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT SLUG MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Short URL Alias"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Modify the slug alias for destination:{' '}
            <span className="font-mono text-slate-800 truncate block mt-0.5">{urlToEdit?.originalUrl}</span>
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shortlink Slug
            </label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
              <span className="font-mono text-xs text-slate-400 mr-1 select-none">tinyroute.app/</span>
              <input
                type="text"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Decommission"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="font-mono text-slate-900">{urlToDelete?.shortUrl}</strong>?
            This will purge all edge caches across all 310+ regions.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md"
            >
              Delete Route
            </button>
          </div>
        </div>
      </Modal>

      {/* QR CODE MODAL */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Dynamic Vector QR Code"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-[#eff4ff] rounded-2xl border border-indigo-100">
            <svg className="w-48 h-48 text-[#0b1c30]" fill="currentColor" viewBox="0 0 100 100">
              <rect height="28" rx="4" width="28" x="0" y="0"></rect>
              <rect fill="white" height="20" rx="2" width="20" x="4" y="4"></rect>
              <rect height="12" rx="1" width="12" x="8" y="8"></rect>
              <rect height="28" rx="4" width="28" x="72" y="0"></rect>
              <rect fill="white" height="20" rx="2" width="20" x="76" y="4"></rect>
              <rect height="12" rx="1" width="12" x="80" y="8"></rect>
              <rect height="28" rx="4" width="28" x="0" y="72"></rect>
              <rect fill="white" height="20" rx="2" width="20" x="4" y="76"></rect>
              <rect height="12" rx="1" width="12" x="8" y="80"></rect>
              <circle cx="50" cy="50" fill="#3525cd" r="11"></circle>
            </svg>
          </div>
          <p className="font-mono text-xs font-bold text-[#3525cd]">{activeQrUrl?.shortUrl}</p>
          <p className="text-xs text-slate-500">Scan using camera to test edge redirection.</p>
          <button
            type="button"
            onClick={() => {
              triggerToast('Downloaded Vector SVG format');
              setQrModalOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md transition-colors"
          >
            Download SVG / PNG
          </button>
        </div>
      </Modal>
    </div>
  );
}
