export default function BookingDetailLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <div className="glass-panel rounded-3xl p-6">
        <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-8 w-48 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
      <div className="glass-panel min-h-[60vh] rounded-3xl p-6">
        <div className="h-10 w-48 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-14 w-full animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
