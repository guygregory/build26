export default function Header({ totalCount, loading, theme, onThemeToggle }) {
  return (
    <header className="sticky top-0 z-40 glass border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      {/* Accent gradient line at very top */}
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet), var(--accent-amber))' }} />

      <div className="max-w-[1600px] mx-auto px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {/* Microsoft logo */}
          <div className="w-9 h-9 shrink-0 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
              <rect x="0" y="0" width="10" height="10" fill="#F25022" />
              <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
              <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
              <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
            </svg>
          </div>

          <h1 className="text-lg font-semibold tracking-tight leading-none" style={{ color: 'var(--text-primary)', fontFamily: "'Segoe UI', -apple-system, system-ui, sans-serif" }}>
            Microsoft Build <span style={{ color: 'var(--accent-cyan)' }}>2026</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <span className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-cyan)', borderTopColor: 'transparent' }} />
              Loading…
            </span>
          ) : (
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-mono font-semibold" style={{ color: 'var(--accent-cyan)' }}>{totalCount}</span>
              {' '}sessions
            </span>
          )}
          <button
            onClick={onThemeToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-[1.05]"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
            }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href="https://build.microsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: 'var(--accent-cyan-dim)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(0 212 255 / 0.2)',
            }}
          >
            build.microsoft.com ↗
          </a>
        </div>
      </div>
    </header>
  )
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
