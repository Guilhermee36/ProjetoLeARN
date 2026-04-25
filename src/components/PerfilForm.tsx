'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Profile = {
  id: string
  full_name: string | null
  role: string
  course: string | null
  lattes_url: string | null
}

export default function PerfilForm({ profile, email }: { profile: Profile; email: string }) {
  const supabase = createClient()
  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [course, setCourse] = useState(profile.course ?? '')
  const [lattes, setLattes] = useState(profile.lattes_url ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        course: profile.role === 'student' ? course : null,
        lattes_url: profile.role === 'teacher' ? lattes : null,
      })
      .eq('id', profile.id)

    if (error) {
      setError('Erro ao salvar. Tente novamente.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">

      {/* Avatar placeholder */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
          {fullName?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{fullName || 'Sem nome'}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            profile.role === 'teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {profile.role === 'teacher' ? 'Professor' : 'Estudante'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" value={email} disabled className="bg-slate-50 text-slate-400 cursor-not-allowed" />
        <p className="text-xs text-slate-400">O e-mail não pode ser alterado.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="Seu nome completo"
          required
        />
      </div>

      {profile.role === 'student' && (
        <div className="space-y-2">
          <Label htmlFor="course">Curso</Label>
          <Input
            id="course"
            value={course}
            onChange={e => setCourse(e.target.value)}
            placeholder="Ex: Técnico em Informática"
          />
        </div>
      )}

      {profile.role === 'teacher' && (
        <div className="space-y-2">
          <Label htmlFor="lattes">Link do Currículo Lattes</Label>
          <Input
            id="lattes"
            type="url"
            value={lattes}
            onChange={e => setLattes(e.target.value)}
            placeholder="http://lattes.cnpq.br/..."
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>
      )}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg">
          Perfil salvo com sucesso!
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </form>
  )
}