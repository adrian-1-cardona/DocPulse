'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { TeamHealthSummary } from '../types'
import { cn, getScoreRiskLevel } from '../lib/utils'

interface TeamHealthDashboardProps {
  teams: TeamHealthSummary[]
  className?: string
}

export function TeamHealthDashboard({ teams, className }: TeamHealthDashboardProps) {
  const chartData = teams.map(team => ({
    name: team.teamName,
    score: team.averageScore,
    totalDocs: team.totalDocs,
    highRisk: team.highRiskDocs,
    mediumRisk: team.mediumRiskDocs,
    lowRisk: team.lowRiskDocs,
    excellent: team.excellentDocs
  }))

  const getBarColor = (score: number): string => {
    if (score >= 80) return '#ef4444'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#3b82f6'
    return '#10b981'
  }

  const getScoreStyle = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 60) return 'text-amber-600'
    if (score >= 40) return 'text-blue-600'
    return 'text-emerald-600'
  }

  return (
    <div className={cn('bg-white border border-zinc-200 rounded-lg', className)}>
      <div className="p-5 border-b border-zinc-100">
        <h3 className="text-sm font-medium text-zinc-900">Team Health</h3>
        <p className="text-xs text-zinc-500 mt-0.5">Average staleness scores by team</p>
      </div>

      <div className="p-5">
        <div className="h-48 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: '#71717a' }}
                axisLine={{ stroke: '#e4e4e7' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {teams.map((team) => (
            <div key={team.teamName} className="p-3 bg-zinc-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-700 truncate">{team.teamName}</span>
                <span className={cn('text-sm font-semibold', getScoreStyle(team.averageScore))}>
                  {Math.round(team.averageScore)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                <span>{team.totalDocs} docs</span>
                <span>·</span>
                <span className="text-red-500">{team.highRiskDocs} high</span>
                <span>·</span>
                <span className="text-emerald-500">{team.excellentDocs} ok</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}