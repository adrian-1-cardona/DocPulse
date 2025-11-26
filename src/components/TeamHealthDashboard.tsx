'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TeamHealthSummary } from '../types'
import { cn, getScoreColor, getScoreRiskLevel } from '../lib/utils'

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
    if (score >= 80) return '#dc2626' // red-600
    if (score >= 60) return '#d97706' // yellow-600
    if (score >= 40) return '#2563eb' // blue-600
    return '#16a34a' // green-600
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Team Documentation Health
        </h3>
        <p className="text-sm text-gray-600">
          Average staleness scores across teams with document distribution breakdown
        </p>
      </div>

      <div className="mb-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Average Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className={cn('text-sm', getScoreColor(data.score))}>
                          Average Score: {Math.round(data.score)} ({getScoreRiskLevel(data.score)})
                        </p>
                        <p className="text-sm text-gray-600">Total Documents: {data.totalDocs}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <div>High Risk: {data.highRisk}</div>
                          <div>Medium Risk: {data.mediumRisk}</div>
                          <div>Low Risk: {data.lowRisk}</div>
                          <div>Excellent: {data.excellent}</div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <div key={team.teamName} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{team.teamName}</h4>
              <span className={cn('text-lg font-bold', getScoreColor(team.averageScore))}>
                {Math.round(team.averageScore)}
              </span>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{team.totalDocs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">High Risk:</span>
                <span className="font-medium">{team.highRiskDocs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Medium Risk:</span>
                <span className="font-medium">{team.mediumRiskDocs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Low Risk:</span>
                <span className="font-medium">{team.lowRiskDocs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Excellent:</span>
                <span className="font-medium">{team.excellentDocs}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}