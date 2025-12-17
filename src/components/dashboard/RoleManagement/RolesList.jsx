'use client'

import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function RolesList({ roles, selectedRole, onRoleSelect, menuItems }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rollen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {roles.map((role) => {
          const isSelected = selectedRole?.id === role.id
          const isFullAccess = role.permissions.length === menuItems.length
          
          return (
            <div
              key={role.id}
              onClick={() => onRoleSelect(role)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.userCount} Nutzer</p>
                </div>
                <Button
                  variant={isFullAccess ? "default" : "outline"}
                  size="sm"
                  className={`ml-2 ${
                    isFullAccess
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  {isFullAccess ? 'Voller Zugriff' : 'Eingeschränkt'}
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

