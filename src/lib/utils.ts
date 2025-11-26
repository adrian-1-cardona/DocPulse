import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return Math.round(score).toString()
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-red-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-blue-600'
  return 'text-green-600'
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 80) return 'bg-red-100 text-red-800 border-red-200'
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  if (score >= 40) return 'bg-blue-100 text-blue-800 border-blue-200'
  return 'bg-green-100 text-green-800 border-green-200'
}

export function getScoreRiskLevel(score: number): string {
  if (score >= 80) return 'High Risk'
  if (score >= 60) return 'Medium Risk'
  if (score >= 40) return 'Low Risk'
  return 'Excellent'
}