'use client'
 
// src/components/AnalyticsCharts.tsx
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
 
type Props = {
  categoryData: { name: string; value: number; color: string }[]
  applicationData: { name: string; value: number; color: string }[]
  slotBarData: { name: string; abertas: number; preenchidas: number; candidatos: number }[]
  teacherRanking: { name: string; projetos: number; vagas: number; aprovados: number }[]
}
 
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
      <span className="text-3xl">📊</span>
      <span>{message}</span>
    </div>
  )
}
 
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      {label && <p className="font-medium text-slate-700 mb-1">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-medium text-slate-700">{p.value}</span>
        </div>
      ))}
    </div>
  )
}
 
const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: d.payload.color }} />
        <span className="font-medium text-slate-700">{d.name}:</span>
        <span className="text-slate-500">{d.value}</span>
      </div>
    </div>
  )
}
 
export default function AnalyticsCharts({
  categoryData, applicationData, slotBarData,
}: Props) {
  const hasCategory = categoryData.some(d => d.value > 0)
  const hasApplications = applicationData.some(d => d.value > 0)
  const hasSlots = slotBarData.length > 0
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
      {/* Pizza — projetos por categoria */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-1">Projetos por Categoria</h2>
        <p className="text-xs text-slate-400 mb-5">Distribuição entre Pesquisa, Ensino e Extensão</p>
        <div style={{ height: 220 }}>
          {hasCategory ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Nenhum projeto cadastrado" />
          )}
        </div>
        {hasCategory && (
          <div className="flex justify-center gap-4 mt-2">
            {categoryData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* Pizza — candidaturas por status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-1">Candidaturas por Status</h2>
        <p className="text-xs text-slate-400 mb-5">Visão geral do funil de seleção</p>
        <div style={{ height: 220 }}>
          {hasApplications ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {applicationData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Nenhuma candidatura ainda" />
          )}
        </div>
        {hasApplications && (
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {applicationData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* Barras — vagas por projeto */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-2">
        <h2 className="font-semibold text-slate-700 mb-1">Vagas e Candidatos por Projeto</h2>
        <p className="text-xs text-slate-400 mb-5">Projetos ativos — vagas abertas, preenchidas e candidatos</p>
        <div style={{ height: 280 }}>
          {hasSlots ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slotBarData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '12px' }}
                />
                <Bar dataKey="abertas" name="Vagas Abertas" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="preenchidas" name="Preenchidas" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="candidatos" name="Candidatos" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Nenhum projeto ativo com vagas" />
          )}
        </div>
      </div>
 
    </div>
  )
}