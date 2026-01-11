'use client'

import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'

export function MVPBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-amber-50 border border-amber-200 p-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start space-x-3">
        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-amber-800">
            <strong>MVP Notice:</strong> Files are processed locally in your browser and not stored on a server. 
            Use Export/Import to save your workspace state.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-amber-600 hover:text-amber-700 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
