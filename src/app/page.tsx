import Link from 'next/link'

export default function SplashPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .splash {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          font-family: 'DM Sans', sans-serif;
        }

        /* Nav */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #1e40af;
          text-decoration: none;
        }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover { background: #f1f5f9; color: #1e293b; }
        .nav-btn {
          font-size: 14px;
          font-weight: 500;
          color: white;
          background: #1d4ed8;
          text-decoration: none;
          padding: 8px 20px;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .nav-btn:hover { background: #1e40af; }

        /* Hero */
        .hero {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 48px;
          width: 100%;
          align-items: center;
        }
        .hero-left { display: flex; flex-direction: column; gap: 28px; }

        .hero-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          color: #2563eb;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .hero-label-dot {
          width: 6px; height: 6px;
          background: #2563eb;
          border-radius: 50%;
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: #0f172a;
        }
        .hero-title span {
          color: #1d4ed8;
        }

        .hero-desc {
          font-size: 17px;
          color: #64748b;
          line-height: 1.7;
          max-width: 440px;
        }

        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-main {
          display: inline-flex; align-items: center; gap: 8px;
          background: #1d4ed8; color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          padding: 13px 28px; border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s, transform 0.1s;
        }
        .btn-main:hover { background: #1e40af; transform: translateY(-1px); }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: #334155;
          border: 1.5px solid #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          padding: 13px 28px; border-radius: 10px;
          text-decoration: none;
          transition: border-color 0.15s, transform 0.1s;
        }
        .btn-outline:hover { border-color: #94a3b8; transform: translateY(-1px); }

        .hero-stats {
          display: flex; gap: 32px; padding-top: 8px;
          border-top: 1px solid #f1f5f9;
        }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 24px; font-weight: 700; color: #0f172a;
        }
        .stat-label { font-size: 12px; color: #94a3b8; margin-top: 2px; }

        /* Right panel */
        .hero-right {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-left: 64px;
        }

        .category-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: default;
        }
        .category-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); transform: translateX(4px); }
        .card-body { flex: 1; }
        .card-title { font-size: 15px; font-weight: 600; color: #1e293b; }
        .card-desc { font-size: 13px; color: #94a3b8; margin-top: 3px; }
        .card-badge {
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 999px;
          background: var(--badge-bg);
          color: var(--badge-color);
        }

        .card-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          background: var(--icon-bg);
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 24px 48px;
          border-top: 1px solid #f1f5f9;
          font-size: 13px;
          color: #cbd5e1;
        }

        /* Animations */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .a1 { animation: fade-up 0.5s ease both 0.05s; }
        .a2 { animation: fade-up 0.5s ease both 0.12s; }
        .a3 { animation: fade-up 0.5s ease both 0.2s; }
        .a4 { animation: fade-up 0.5s ease both 0.28s; }
        .a5 { animation: fade-up 0.5s ease both 0.36s; }
        .a6 { animation: fade-up 0.5s ease both 0.2s; }
        .a7 { animation: fade-up 0.5s ease both 0.32s; }
        .a8 { animation: fade-up 0.5s ease both 0.44s; }

        @media (max-width: 768px) {
          .nav { padding: 16px 24px; }
          .hero { grid-template-columns: 1fr; padding: 48px 24px; gap: 48px; }
          .hero-right { padding-left: 0; }
          .footer { padding: 20px 24px; }
        }
      `}</style>

      <div className="splash">
        {/* Nav */}
        <nav className="nav">
          <span className="nav-logo">LeARN</span>
          <div className="nav-right">
            <Link href="/login" className="nav-link">Entrar</Link>
            <Link href="/cadastro" className="nav-btn">Criar conta</Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-left">
            <div className="a1">
              <span className="hero-label">
                <span className="hero-label-dot" />
                IFRS Campus Sertão
              </span>
            </div>

            <h1 className="hero-title a2">
              Bolsas<br />
              <span>acadêmicas</span><br />
              sem burocracia
            </h1>

            <p className="hero-desc a3">
              Plataforma oficial de gestão de bolsas de Ensino, Pesquisa e Extensão.
              Encontre projetos, candidate-se e acompanhe tudo em um só lugar.
            </p>

            <div className="hero-actions a4">
              <Link href="/cadastro" className="btn-main">
                Começar agora
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/login" className="btn-outline">
                Já tenho conta
              </Link>
            </div>

            <div className="hero-stats a5">
              {[
                { value: '3', label: 'Modalidades' },
                { value: '100%', label: 'Gratuito' },
                { value: 'IFRS', label: 'Institucional' },
              ].map(s => (
                <div key={s.label}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right">
            {[
              {
                icon: '🔬',
                bg: '#eff6ff',
                title: 'Pesquisa',
                desc: 'Iniciação científica e projetos aplicados',
                badge: 'IC / PIBIC',
                badgeStyle: { background: '#dbeafe', color: '#1d4ed8' },
              },
              {
                icon: '📚',
                bg: '#f0fdf4',
                title: 'Ensino',
                desc: 'Monitoria e apoio pedagógico',
                badge: 'Monitoria',
                badgeStyle: { background: '#dcfce7', color: '#15803d' },
              },
              {
                icon: '🤝',
                bg: '#fff7ed',
                title: 'Extensão',
                desc: 'Impacto social e comunidade',
                badge: 'PIBEX',
                badgeStyle: { background: '#fed7aa', color: '#c2410c' },
              },
            ].map((c, i) => (
              <div key={c.title} className={`category-card a${6 + i}`} style={{ '--icon-bg': c.bg, '--badge-bg': c.badgeStyle.background, '--badge-color': c.badgeStyle.color } as any}>
                <div className="card-icon">{c.icon}</div>
                <div className="card-body">
                  <div className="card-title">{c.title}</div>
                  <div className="card-desc">{c.desc}</div>
                </div>
                <span className="card-badge">{c.badge}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          © 2026 Instituto Federal do Rio Grande do Sul — Campus Sertão · LeARN
        </footer>
      </div>
    </>
  )
}