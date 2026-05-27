import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-xs" style={{ fontFamily: 'Syne, sans-serif' }}>Le</span>
            </div>
            <span className="font-bold text-lg text-slate-900" style={{ fontFamily: 'Syne, sans-serif' }}>
              Le<span className="text-blue-700">ARN</span>
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="text-sm font-medium bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-full text-xs font-medium text-slate-500 bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
            IFRS CAMPUS SERTÃO
          </span>
        </div>

        {/* Título — clamp responsivo, sem overflow */}
        <h1
          className="text-center font-bold leading-tight tracking-tight text-slate-900 mb-6"
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            letterSpacing: '-0.02em',
          }}
        >
          Bolsas <span className="text-blue-700">acadêmicas</span>
          <br />sem burocracia
        </h1>

        {/* Subtítulo */}
        <p className="text-center text-slate-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-10">
          Plataforma oficial de gestão de bolsas de Ensino, Pesquisa e Extensão.
          Encontre projetos, candidate-se e acompanhe tudo em um só lugar.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            Começar agora →
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-colors"
          >
            Já tenho conta
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 sm:gap-16 mb-20 text-center">
          {[
            { value: '3', label: 'Modalidades' },
            { value: '100%', label: 'Gratuito' },
            { value: 'IFRS', label: 'Institucional' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p
                className="font-bold text-slate-900 text-xl sm:text-2xl"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                {value}
              </p>
              <p className="text-slate-400 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '🔬',
              iconBg: 'bg-green-50',
              title: 'Pesquisa',
              badge: 'IC / PIBIC',
              badgeColor: 'bg-blue-100 text-blue-700',
              desc: 'Iniciação científica e projetos aplicados',
            },
            {
              icon: '📚',
              iconBg: 'bg-blue-50',
              title: 'Ensino',
              badge: 'Monitoria',
              badgeColor: 'bg-green-100 text-green-700',
              desc: 'Monitoria e apoio pedagógico',
            },
            {
              icon: '🤝',
              iconBg: 'bg-orange-50',
              title: 'Extensão',
              badge: 'PIBEX',
              badgeColor: 'bg-orange-100 text-orange-700',
              desc: 'Impacto social e comunidade',
            },
          ].map(({ icon, iconBg, title, badge, badgeColor, desc }) => (
            <div
              key={title}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center text-base mb-3`}>
                {icon}
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3
                  className="font-semibold text-slate-900 text-sm"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {title}
                </h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {badge}
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Instituto Federal do Rio Grande do Sul — Campus Sertão · LeARN
          </p>
        </div>
      </footer>
    </div>
  )
}
