export default function AdminLoading() {
  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Hero */}
      <div className="rounded-3xl p-6 md:p-10 border border-white/5 bg-white/[0.02]">
        <div className="h-8 w-64 bg-white/[0.06] rounded-lg mb-4" />
        <div className="h-4 w-96 max-w-full bg-white/[0.04] rounded-lg" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
            <div className="w-11 h-11 rounded-2xl bg-white/[0.05] mb-6" />
            <div className="h-9 w-24 bg-white/[0.06] rounded-lg mb-3" />
            <div className="h-3 w-32 bg-white/[0.04] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5">
        <div className="h-5 w-48 bg-white/[0.06] rounded-lg mb-6" />
        <div className="h-56 bg-white/[0.03] rounded-2xl" />
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
