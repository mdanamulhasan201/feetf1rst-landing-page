'use client'

import { Search, CheckCircle2, XCircle, Shield } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { Switch } from '../../../components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function PermissionsList({ 
  title,
  permissions,
  menuItems,
  searchQuery,
  onSearchChange,
  onPermissionToggle,
  isToggling = false
}) {
  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const enabledCount = permissions.length
  const totalCount = menuItems.length
  const percentage = Math.round((enabledCount / totalCount) * 100)

  return (
    <div className="!shadow-none !border-none">
      <div className="py-3 px-4">
      <h3  className="text-base font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-3 ml-5.5">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full border border-green-200">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              <span className="text-xs font-semibold text-green-700">{enabledCount}</span>
              <span className="text-[10px] text-green-600">aktiv</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded-full border border-gray-200">
              <XCircle className="h-3 w-3 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">{totalCount - enabledCount}</span>
              <span className="text-[10px] text-gray-600">inaktiv</span>
            </div>
          </div>
          <div className="h-5 w-px bg-gray-300"></div>
          <div className="text-xs text-gray-600">
            <span className="font-semibold text-blue-600">{percentage}%</span> Zugriff gewährt
          </div>
        </div>
      </div>
      <div className="p-3">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Berechtigungen suchen..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
          </div>
        </div>

        {/* Permissions List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Menü-Zugriff verwalten
            </h3>
            {filteredMenuItems.length > 0 && (
              <span className="text-[10px] text-gray-500">
                {filteredMenuItems.length} {filteredMenuItems.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
              </span>
            )}
          </div>
          
          <div className="space-y-1.5">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              const isEnabled = permissions.includes(item.id)
              
              if (!Icon) {
                console.warn(`Icon not found for menu item: ${item.id}`)
                return null
              }
              
              return (
                <div
                  key={item.id}
                  className={`group flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.005] ${
                    isEnabled
                      ? 'border-green-200 bg-gradient-to-r from-green-50/50 to-white hover:border-green-300 hover:shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg transition-all duration-200 ${
                      isEnabled
                        ? 'bg-gradient-to-br from-green-100 to-green-200 shadow-sm'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon className={`h-4 w-4 transition-colors duration-200 ${
                        isEnabled ? 'text-green-700' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-sm block ${
                        isEnabled ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {item.label}
                      </span>
                      {isEnabled && (
                        <span className="inline-flex items-center gap-0.5 mt-0.5 text-[10px] text-green-700 font-medium">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Zugriff gewährt
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => onPermissionToggle(item.id)}
                      disabled={isToggling}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                </div>
              )
            })}
          </div>
          
          {filteredMenuItems.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
                <Search className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                Keine Ergebnisse gefunden
              </h3>
              <p className="text-xs text-gray-600">
                Versuchen Sie es mit einem anderen Suchbegriff.
              </p>
            </div>
          )}
        </div>
        </div>
    </div>
  )
}

