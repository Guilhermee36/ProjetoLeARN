// src/app/page.tsx
import Link from 'next/link'

export default function SplashPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        .splash-root {
          min-height: 100vh;
          background-color: #0a1628;
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(37,99,235,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(29,78,216,0.2) 0%, transparent 55%);
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          color: white;
          overflow: hidden;
          position: relative;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(37,99,235,0.2);
          border: 1px solid rgba(37,99,235,0.4);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 14px;
          border-radius: 999px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .badge-dot {
          width: 6px; height: 6px;
          background: #3b82f6;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(64px, 12vw, 120px);
          line-height: 0.9;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #93c5fd 60%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: clamp(15px, 2vw, 18px);
          color: #94a3b8;
          max-width: 480px;
          line-height: 1.65;
          font-weight: 400;
        }

        .hero-heading-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #2563eb;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          padding: 13px 28px;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          padding: 13px 28px;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
        }

        .feature-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-icon {
          font-size: 24px;
          line-height: 1;
        }

        .feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #e2e8f0;
        }

        .feature-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
        }

        .main-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(32px, 6vw, 80px) clamp(24px, 8vw, 120px);
          gap: 48px;
        }

        .footer-bar {
          position: relative;
          z-index: 1;
          padding: 20px clamp(24px, 8vw, 120px);
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer-text {
          font-size: 12px;
          color: #334155;
        }

        .deco-ring {
          position: absolute;
          right: -120px;
          top: 50%;
          transform: translateY(-50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          border: 1px solid rgba(37,99,235,0.12);
          pointer-events: none;
        }
        .deco-ring-2 {
          position: absolute;
          right: -60px;
          top: 50%;
          transform: translateY(-50%);
          width: 400px;
          height: 400px;
          border-radius: 50%;
          border: 1px solid rgba(37,99,235,0.08);
          pointer-events: none;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-1 { animation: fade-up 0.6s ease both 0.05s; }
        .animate-2 { animation: fade-up 0.6s ease both 0.15s; }
        .animate-3 { animation: fade-up 0.6s ease both 0.25s; }
        .animate-4 { animation: fade-up 0.6s ease both 0.35s; }
        .animate-5 { animation: fade-up 0.6s ease both 0.5s; }
      `}</style>

      <div className="splash-root">
        <div className="grid-overlay" />
        <div className="deco-ring"></div>
        <div className="deco-ring-2"></div>

        <main className="main-content">
          {/* Badge */}
          <div className="animate-1">
            <span className="badge">
              <span className="badge-dot" />
              IFRS Campus Sertão
            </span>
          </div>

          {/* Title + subtitle */}
          <div className="hero-heading-group">
            <h1 className="hero-title animate-2">LeARN</h1>
            <p className="hero-sub animate-3">
              Plataforma de gestão de bolsas acadêmicas de Ensino, Pesquisa e Extensão.
              Conectamos estudantes e professores de forma simples e transparente.
            </p>
          </div>

          {/* CTAs */}
          <div className="animate-4 cta-row">
            <Link href="/cadastro" className="btn-primary">
              Criar conta
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/login" className="btn-secondary">
              Já tenho conta
            </Link>
          </div>

          {/* Feature cards */}
          <div className="features-grid animate-5">
            {[
              { icon: '🔬', title: 'Pesquisa', desc: 'Bolsas de iniciação científica e projetos de pesquisa aplicada.' },
              { icon: '📚', title: 'Ensino', desc: 'Monitoria e apoio pedagógico em disciplinas técnicas.' },
              { icon: '🤝', title: 'Extensão', desc: 'Projetos de impacto social e interação com a comunidade.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-title">{f.title}</span>
                <span className="feature-desc">{f.desc}</span>
              </div>
            ))}
          </div>
        </main>

        <footer className="footer-bar">
          <span className="footer-text">© 2026 IFRS Campus Sertão — LeARN</span>
          <span className="footer-text">Instituto Federal do Rio Grande do Sul</span>
        </footer>
      </div>
    </>
  )
}