import SessionCard from './SessionCard'

const SKELETON_COUNT = 12

export default function SessionGrid({ sessions, loading, view, onSelect }) {
  if (loading) {
    return (
      <div className={view === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
        : 'space-y-3'
      }>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} view={view} delay={i * 60} />
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="font-display font-semibold text-base" style={{ color: 'var(--text-secondary)' }}>No sessions found</p>
        <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className={view === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
      : 'space-y-2'
    }>
      {sessions.map((session, idx) => (
        <SessionCard
          key={session.sessionId || session.id || idx}
          session={session}
          view={view}
          onSelect={onSelect}
          index={idx}
        />
      ))}
    </div>
  )
}

function SkeletonCard({ view, delay }) {
  if (view === 'list') {
    return (
      <div className="rounded-lg p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', animationDelay: `${delay}ms` }}>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2.5">
            <div className="h-4 rounded w-3/4 skeleton-shimmer" />
            <div className="h-3 rounded w-1/2 skeleton-shimmer" />
          </div>
          <div className="w-20 h-5 rounded shrink-0 skeleton-shimmer" />
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-xl p-5 space-y-3.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', animationDelay: `${delay}ms` }}>
      <div className="flex gap-2">
        <div className="h-5 rounded w-20 skeleton-shimmer" />
        <div className="h-5 rounded w-12 skeleton-shimmer" />
      </div>
      <div className="h-5 rounded w-full skeleton-shimmer" />
      <div className="h-5 rounded w-4/5 skeleton-shimmer" />
      <div className="h-3 rounded w-full skeleton-shimmer" />
      <div className="h-3 rounded w-3/4 skeleton-shimmer" />
      <div className="pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex gap-2">
          <div className="h-3.5 rounded w-28 skeleton-shimmer" />
          <div className="h-3.5 rounded w-20 skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}
