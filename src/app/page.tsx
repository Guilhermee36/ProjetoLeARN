// src/app/page.tsx
import Link from 'next/link'

export default function SplashPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8fafc',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Google Fonts via next/head não funciona aqui — use link direto */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid #e2e8f0',
        background: 'white',
      }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '22px',
          fontWeight: 800,
          color: '#1e40af',
        }}>
          LeARN
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/login" style={{
            fontSize: '14px', fontWeight: 500, color: '#64748b',
            textDecoration: 'none', padding: '8px 16px', borderRadius: '8px',
          }}>
            Entrar
          </Link>
          <Link href="/cadastro" style={{
            fontSize: '14px', fontWeight: 500, color: 'white',
            background: '#1d4ed8', textDecoration: 'none',
            padding: '8px 20px', borderRadius: '8px',
          }}>
            Criar conta
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 48px',
        width: '100%',
        alignItems: 'center',
        gap: '64px',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 500, color: '#2563eb',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <span style={{
              width: '6px', height: '6px',
              background: '#2563eb', borderRadius: '50%',
              display: 'inline-block',
            }} />
            IFRS Campus Sertão
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(48px, 6vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            margin: 0,
          }}>
            Bolsas<br />
            <span style={{ color: '#1d4ed8' }}>acadêmicas</span><br />
            sem burocracia
          </h1>

          <p style={{
            fontSize: '17px', color: '#64748b',
            lineHeight: 1.7, maxWidth: '440px', margin: 0,
          }}>
            Plataforma oficial de gestão de bolsas de Ensino, Pesquisa e Extensão.
            Encontre projetos, candidate-se e acompanhe tudo em um só lugar.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/cadastro" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#1d4ed8', color: 'white',
              fontSize: '15px', fontWeight: 500,
              padding: '13px 28px', borderRadius: '10px',
              textDecoration: 'none',
            }}>
              Começar agora
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'white', color: '#334155',
              border: '1.5px solid #e2e8f0',
              fontSize: '15px', fontWeight: 500,
              padding: '13px 28px', borderRadius: '10px',
              textDecoration: 'none',
            }}>
              Já tenho conta
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #f1f5f9',
          }}>
            {[
              { value: '3', label: 'Modalidades' },
              { value: '100%', label: 'Gratuito' },
              { value: 'IFRS', label: 'Institucional' },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '24px', fontWeight: 700, color: '#0f172a',
                }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Category cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              icon: '🔬', bg: '#eff6ff',
              title: 'Pesquisa', desc: 'Iniciação científica e projetos aplicados',
              badge: 'IC / PIBIC', badgeBg: '#dbeafe', badgeColor: '#1d4ed8',
            },
            {
              icon: '📚', bg: '#f0fdf4',
              title: 'Ensino', desc: 'Monitoria e apoio pedagógico',
              badge: 'Monitoria', badgeBg: '#dcfce7', badgeColor: '#15803d',
            },
            {
              icon: '🤝', bg: '#fff7ed',
              title: 'Extensão', desc: 'Impacto social e comunidade',
              badge: 'PIBEX', badgeBg: '#fed7aa', badgeColor: '#c2410c',
            },
          ].map(c => (
            <div key={c.title} style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '12px',
                background: c.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', flexShrink: 0,
              }}>
                {c.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{c.title}</div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>{c.desc}</div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600,
                padding: '3px 10px', borderRadius: '999px',
                background: c.badgeBg, color: c.badgeColor,
                whiteSpace: 'nowrap',
              }}>
                {c.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px 48px',
        borderTop: '1px solid #f1f5f9',
        fontSize: '13px',
        color: '#cbd5e1',
      }}>
        © 2026 Instituto Federal do Rio Grande do Sul — Campus Sertão · LeARN
      </footer>
    </div>
  )
}
