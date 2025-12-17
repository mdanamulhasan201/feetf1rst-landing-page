'use client'

import { Shield, Users, CheckCircle2, Lock } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function RolesList({ roles, selectedRole, onRoleSelect }) {
  return (
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200  px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-base font-semibold text-gray-900">Rollen</CardTitle>
        </div>
        <p className="text-xs text-gray-600 mt-0.5">{roles.length} Rollen verfügbar</p>
      </CardHeader>
      <CardContent className="p-3 space-y-2.5">
        {roles.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Shield className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p className="text-xs">Keine Rollen vorhanden</p>
          </div>
        ) : (
          roles.map((role) => {
            const isSelected = selectedRole?.id === role.id
            
            return (
              <div
                key={role.id}
                onClick={() => onRoleSelect(role)}
                className={`group relative p-3.5 rounded-lg border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.01] ${
                  isSelected
                    ? 'border-[#41A63E] bg-gradient-to-br from-blue-50 to-green-100/50 shadow-md shadow-green-500/15'
                    : 'border-gray-200 bg-white hover:border-[#41A63E] hover:shadow-sm'
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="h-1.5 w-1.5 bg-[#41A63E] rounded-full animate-pulse"></div>
                  </div>
                )}
                
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className={`p-1.5 rounded-md ${
                        isSelected ? 'bg-[#41A63E]' : 'bg-gray-100'
                      }`}>
                        <Shield className={`h-3.5 w-3.5 ${
                          isSelected ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className={`font-semibold text-sm ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {role.name}
                      </h3>
                    </div>
                    
                  </div>
                
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

