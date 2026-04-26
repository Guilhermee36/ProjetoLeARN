'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2 } from 'lucide-react'  
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

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-10">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-blue-700">LeARN</h1>
        <p className="text-xs text-slate-500 mt-1">IFRS — Campus Sertão</p>
      </div>

      {/* Info do usuário */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            {userName?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 truncate max-w-[140px]">
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
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
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
    </aside>
  )
}