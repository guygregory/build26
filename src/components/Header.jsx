export default function Header({ totalCount, loading }) {
  return (
    <header className="sticky top-0 z-40 glass border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      {/* Accent gradient line at very top */}
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet), var(--accent-amber))' }} />

      <div className="max-w-[1600px] mx-auto px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {/* Logo mark */}
          <div className="relative w-9 h-9 shrink-0">
            <div className="absolute inset-0 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))' }} />
            <div className="absolute inset-[2px] rounded-[6px] flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M1 1h6.5v6.5H1V1z" fill="var(--accent-cyan)" opacity="0.9" />
                <path d="M8.5 1H15v6.5H8.5V1z" fill="var(--accent-cyan)" opacity="0.6" />
                <path d="M1 8.5h6.5V15H1V8.5z" fill="var(--accent-cyan)" opacity="0.6" />
                <path d="M8.5 8.5H15V15H8.5V8.5z" fill="var(--accent-cyan)" opacity="0.3" />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="font-display text-lg font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
              Build <span style={{ color: 'var(--accent-cyan)' }}>2026</span>
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Session Catalog
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
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
