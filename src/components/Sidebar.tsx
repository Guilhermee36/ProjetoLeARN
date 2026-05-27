'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, X, Menu } from 'lucide-react'
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

  const sidebarInner = (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-blue-700" style={{ fontFamily: 'Syne, sans-serif' }}>
            LeARN
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">IFRS — Campus Sertão</p>
        </div>
        <button
          className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Info do usuário */}
      <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
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
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
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
              <Icon size={16} className={active ? 'text-blue-600' : 'text-slate-400'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} className="text-slate-400" />
          Sair
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── Topbar mobile — substituiu o botão flutuante ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex-shrink-0"
        >
          <Menu size={18} />
        </button>
        <span className="font-bold text-base text-blue-700" style={{ fontFamily: 'Syne, sans-serif' }}>
          LeARN
        </span>
      </div>

      {/* ── Overlay mobile ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar desktop: sempre visível ── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex-col z-30">
        {sidebarInner}
      </aside>

      {/* ── Sidebar mobile: drawer ── */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarInner}
      </aside>
    </>
  )
}
