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
          <SkeletonCard key={i} view={view} />
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="w-12 h-12 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-400 font-medium">No sessions match your filters</p>
        <p className="text-gray-600 text-sm mt-1">Try broadening your search criteria</p>
      </div>
    )
  }

  return (
    <div className={view === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
      : 'space-y-3'
    }>
      {sessions.map((session, idx) => (
        <SessionCard
          key={session.sessionId || session.id || idx}
          session={session}
          view={view}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function SkeletonCard({ view }) {
  if (view === 'list') {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-800 rounded w-1/2" />
            <div className="h-3 bg-gray-800 rounded w-2/3" />
          </div>
          <div className="w-24 h-6 bg-gray-800 rounded shrink-0" />
        </div>
      </div>
    )
  }
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse space-y-3">
      <div className="flex gap-2">
        <div className="h-5 bg-gray-800 rounded w-20" />
        <div className="h-5 bg-gray-800 rounded w-16" />
      </div>
      <div className="h-5 bg-gray-800 rounded w-full" />
      <div className="h-5 bg-gray-800 rounded w-4/5" />
      <div className="h-3 bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-800 rounded w-3/4" />
      <div className="flex gap-2 pt-2">
        <div className="h-4 bg-gray-800 rounded w-24" />
        <div className="h-4 bg-gray-800 rounded w-20" />
      </div>
    </div>
  )
}
