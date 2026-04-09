export default function Header({ totalCount, loading }) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40 backdrop-blur-sm bg-gray-900/95">
      <div className="max-w-screen-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.5 2C6.25 2 2 6.25 2 11.5S6.25 21 11.5 21c1.63 0 3.16-.41 4.5-1.13V17.5c-1.28.95-2.87 1.5-4.5 1.5-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7v1c0 .55-.45 1-1 1s-1-.45-1-1v-1c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.63-.56 3.54-1.46.65.89 1.67 1.46 2.82 1.46 1.93 0 3.5-1.57 3.5-3.5v-1C22 6.25 17.75 2 11.5 2zM11.5 14.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
            </svg>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Microsoft Build 2026</h1>
              <p className="text-xs text-blue-400 font-medium">Session Browser</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Loading sessions…
            </span>
          ) : (
            <span className="text-sm text-gray-400">
              <span className="text-white font-semibold">{totalCount}</span> sessions available
            </span>
          )}
          <a
            href="https://build.microsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Microsoft Build ↗
          </a>
        </div>
      </div>
    </header>
  )
}
