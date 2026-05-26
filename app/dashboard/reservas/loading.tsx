export default function ReservationsLoading() {
  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-12 w-3/4 animate-pulse rounded-2xl bg-slate-200" />
        <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-panel rounded-3xl p-5">
            <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded-full bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="glass-panel overflow-hidden rounded-3xl">
        <div className="border-b border-slate-200/70 p-4">
          <div className="h-10 w-full animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="divide-y divide-slate-200/70 p-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 py-4">
              <div className="h-4 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 animate-pulse rounded-full bg-slate-200" />
              <div className="ml-auto h-9 w-28 animate-pulse rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
