'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  BookOpen,
  FileText,
  User,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Bell,
  PlusCircle,
} from 'lucide-react'

type Props = {
  role: 'student' | 'teacher' | 'admin'
  userName: string
}

const studentLinks = [
  { href: '/bolsas', label: 'Bolsas', icon: BookOpen },
  { href: '/editais', label: 'Editais', icon: FileText },
  { href: '/minha-bolsa', label: 'Minha Bolsa', icon: GraduationCap },
  { href: '/notificacoes', label: 'Notificações', icon: Bell },
  { href: '/perfil', label: 'Perfil', icon: User },
]

const teacherLinks = [
  { href: '/bolsas', label: 'Bolsas', icon: BookOpen },
  { href: '/professor/projetos', label: 'Meus Projetos', icon: LayoutDashboard },
  { href: '/professor/novo-projeto', label: 'Novo Projeto', icon: PlusCircle },
  { href: '/editais', label: 'Editais', icon: FileText },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/notificacoes', label: 'Notificações', icon: Bell },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export default function Sidebar({ role, userName }: Props) {
  const pathname = usePathname()
  const supabase = createClient()
  const links = role === 'teacher' ? teacherLinks : studentLinks
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">LeARN</h1>
          <p className="text-xs text-slate-500 mt-1">IFRS — Campus Sertão</p>
        </div>
        {/* Botão fechar no mobile */}
        <button
          type="button"
          className="md:hidden text-slate-400 hover:text-slate-600"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar menu"
          title="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Info do usuário */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
            {userName?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {userName || 'Usuário'}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              role === 'teacher'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {role === 'teacher' ? 'Professor' : 'Estudante'}
            </span>
          </div>
        </div>
      </div>

      {/* Links de navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname?.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Botão hambúrguer — só aparece no mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-slate-200 rounded-lg p-2 shadow-sm"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={20} className="text-slate-600" />
      </button>

      {/* Overlay escuro no mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar desktop: sempre visível */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex-col z-10">
        {sidebarContent}
      </aside>

      {/* Sidebar mobile: drawer deslizante */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col z-40 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
