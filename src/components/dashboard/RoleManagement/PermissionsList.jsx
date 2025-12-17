'use client'

import { Search } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { Switch } from '../../../components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function PermissionsList({ 
  title,
  permissions,
  menuItems,
  searchQuery,
  onSearchChange,
  onPermissionToggle
}) {
  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          {permissions.length} von {menuItems.length} Bereichen aktiviert
        </p>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Menüpunkt suchen..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Permissions List */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Menü-Zugriff verwalten
          </h3>
          <div className="space-y-3">
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
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => onPermissionToggle(item.id)}
                  />
                </div>
              )
            })}
          </div>
          
          {filteredMenuItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Keine Menüpunkte gefunden
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

