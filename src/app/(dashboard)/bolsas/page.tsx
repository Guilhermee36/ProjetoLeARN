import { createClient } from '@/lib/supabase/server'
import CategoryBadge from '@/components/CategoryBadge'
import BolsaCard from '@/components/BolsaCard'

export default async function BolsasPage() {
  const supabase = createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      category,
      location,
      schedule,
      status,
      profiles:teacher_id (
        full_name
      ),
      scholarship_slots (
        id,
        is_open,
        status
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const categories = ['all', 'teaching', 'research', 'extension'] as const
  const categoryLabel: Record<string, string> = {
    all: 'Todos',
    teaching: 'Ensino',
    research: 'Pesquisa',
    extension: 'Extensão',
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Bolsas Disponíveis</h1>
        <p className="text-slate-500 mt-1">
          Explore os projetos ativos de Ensino, Pesquisa e Extensão do IFRS Campus Sertão.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <span key={cat}>
            <CategoryBadge category={cat} label={categoryLabel[cat]} clickable />
          </span>
        ))}
      </div>

      {/* Grid de cards */}
      {!projects || projects.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-medium">Nenhum projeto ativo no momento.</p>
          <p className="text-sm mt-1">Aguarde a abertura de novos editais.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map(project => {
            const openSlots = project.scholarship_slots?.filter(
              (s: any) => s.status === 'open'
            ).length ?? 0

            return (
              <BolsaCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description ?? ''}
                category={project.category}
                teacherName={(project.profiles as any)?.full_name ?? 'Professor'}
                location={project.location ?? ''}
                schedule={project.schedule ?? ''}
                openSlots={openSlots}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}