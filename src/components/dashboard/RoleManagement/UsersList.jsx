'use client'

import { Users, UserPlus, UserX } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function UsersList({ 
  selectedRole, 
  roleUsers, 
  selectedUserFromRole,
  onUserSelect,
  onAssignUser,
  onRemoveUser,
  getUserEffectivePermissions
}) {
  if (!selectedRole) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Nutzer für {selectedRole.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {roleUsers.length} Nutzer zugewiesen
            </p>
          </div>
          <Button
            onClick={onAssignUser}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <UserPlus className="h-4 w-4" />
            Nutzer zuweisen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {roleUsers.length > 0 ? (
          <div className="space-y-2">
            {roleUsers.map((user) => {
              const isSelected = selectedUserFromRole?.id === user.id
              const effectivePermissions = getUserEffectivePermissions(user)
              const hasCustomPermissions = user.customPermissions && user.customPermissions.length > 0
              
              return (
                <div
                  key={user.id}
                  onClick={() => onUserSelect(user)}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-blue-200' : 'bg-blue-100'
                    }`}>
                      <Users className={`h-5 w-5 ${isSelected ? 'text-blue-700' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {hasCustomPermissions && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                          Custom Access
                        </span>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {effectivePermissions.length} Berechtigungen
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveUser(user.id)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Entfernen
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>Keine Nutzer zugewiesen</p>
            <Button
              onClick={onAssignUser}
              variant="outline"
              className="mt-4"
              size="sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ersten Nutzer zuweisen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

