'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, Trash2 } from 'lucide-react'

type Slot = {
  slot_code: string
  weekly_hours: string
  monthly_value: string
  start_date: string
  end_date: string
}

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const HORARIOS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
]

export default function NovoprojetoPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'teaching' | 'research' | 'extension'>('research')
  const [location, setLocation] = useState('')
  const [scheduleDays, setScheduleDays] = useState<string[]>([])
  const [scheduleStart, setScheduleStart] = useState('')
  const [scheduleEnd, setScheduleEnd] = useState('')
  const [slots, setSlots] = useState<Slot[]>([
    { slot_code: '', weekly_hours: '', monthly_value: '', start_date: '', end_date: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function addSlot() {
    setSlots(prev => [...prev, { slot_code: '', weekly_hours: '', monthly_value: '', start_date: '', end_date: '' }])
  }

  function removeSlot(index: number) {
    setSlots(prev => prev.filter((_, i) => i !== index))
  }

  function updateSlot(index: number, field: keyof Slot, value: string) {
    setSlots(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Não autenticado.'); setLoading(false); return }

    const scheduleText = scheduleDays.length > 0 && scheduleStart && scheduleEnd
      ? `${scheduleDays.join(', ')}, ${scheduleStart}–${scheduleEnd}`
      : null

    // 1. Cria o projeto
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        category,
        location,
        schedule: scheduleText,
        teacher_id: user.id,
        status: 'active',
      })
      .select()
      .single()

    if (projectError || !project) {
      setError('Erro ao criar projeto. Tente novamente.')
      setLoading(false)
      return
    }

    // 2. Cria as vagas
    // Substitua o map de slotsToInsert por:
    const slotsToInsert = slots
      .filter(s => s.weekly_hours || s.monthly_value)
      .map(s => ({
        project_id: project.id,
        slot_code: s.slot_code || null,
        weekly_hours: s.weekly_hours ? parseInt(s.weekly_hours) : null,
        monthly_value: s.monthly_value ? parseFloat(s.monthly_value) : null,
        start_date: s.start_date || null,
        end_date: s.end_date || null,
        status: 'open' as const,
        is_open: true,         
      }))

    if (slotsToInsert.length > 0) {
      await supabase.from('scholarship_slots').insert(slotsToInsert)
    }

    router.push('/professor/projetos')
    router.refresh()
  }

  const categories = [
    { value: 'research', label: '🔬 Pesquisa' },
    { value: 'teaching', label: '📚 Ensino' },
    { value: 'extension', label: '🤝 Extensão' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Novo Projeto de Bolsa</h1>
        <p className="text-slate-500 mt-1">Preencha os dados do projeto e adicione as vagas disponíveis.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Dados do projeto */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Dados do Projeto</h2>

          <div className="space-y-2">
            <Label htmlFor="title">Título do projeto *</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Desenvolvimento de Sistema de Gestão Agrícola"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva brevemente o projeto, objetivos e atividades do bolsista..."
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria *</Label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value as any)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${category === cat.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local das atividades</Label>
            <Input
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Ex: Lab. de Informática"
            />
          </div>

          {/* Dias da semana */}
          <div className="space-y-2">
            <Label>Dias de atividade</Label>
            <div className="flex flex-wrap gap-2">
              {DIAS.map(dia => (
                <button
                  key={dia}
                  type="button"
                  onClick={() =>
                    setScheduleDays(prev =>
                      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${scheduleDays.includes(dia)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                  {dia}
                </button>
              ))}
            </div>
          </div>

          {/* Horário início/fim */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleStart">Horário de início</Label>
              <select
                id="scheduleStart"
                value={scheduleStart}
                onChange={e => setScheduleStart(e.target.value)}
                title="Horário de início"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Selecione</option>
                {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleEnd">Horário de término</Label>
              <select
                id="scheduleEnd"
                value={scheduleEnd}
                onChange={e => setScheduleEnd(e.target.value)}
                title="Horário de término"
                disabled={!scheduleStart}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Selecione</option>
                {HORARIOS.filter(h => h > scheduleStart).map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          {/* Preview do horário */}
          {scheduleDays.length > 0 && scheduleStart && scheduleEnd && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-blue-700">
              📅 {scheduleDays.join(', ')}, {scheduleStart}–{scheduleEnd}
            </div>
          )}
        </div>

        {/* Vagas */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">Vagas de Bolsa</h2>
            <button
              type="button"
              onClick={addSlot}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <PlusCircle size={15} /> Adicionar vaga
            </button>
          </div>

          {slots.map((slot, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Vaga {index + 1}</span>
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Remover vaga"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Código da vaga</Label>
                  <Input
                    value={slot.slot_code}
                    onChange={e => updateSlot(index, 'slot_code', e.target.value)}
                    placeholder="Ex: B-001"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Horas semanais</Label>
                  <Input
                    type="number"
                    value={slot.weekly_hours}
                    onChange={e => updateSlot(index, 'weekly_hours', e.target.value)}
                    placeholder="Ex: 20"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Valor mensal (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={slot.monthly_value}
                    onChange={e => updateSlot(index, 'monthly_value', e.target.value)}
                    placeholder="Ex: 400.00"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Data de início</Label>
                  <Input
                    type="date"
                    value={slot.start_date}
                    onChange={e => updateSlot(index, 'start_date', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <Label className="text-xs">Data de término</Label>
                  <Input
                    type="date"
                    value={slot.end_date}
                    onChange={e => updateSlot(index, 'end_date', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-700 hover:bg-blue-800"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Publicar Projeto'}
          </Button>
        </div>
      </form>
    </div>
  )
}
