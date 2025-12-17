'use client'

import { Users, UserPlus, UserX, Mail, Shield, Sparkles } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function UsersList({ 
  selectedRole, 
  roleUsers, 
  availableUsers,
  selectedUserFromRole,
  onUserSelect,
  onAssignUser,
  onRemoveUser,
  getUserEffectivePermissions
}) {
  if (!selectedRole) return null

  const isMitarbeiterRole = selectedRole?.id === 'mitarbeiter'
  const isAdminRole = selectedRole?.id === 'admin'
  const canAssign = !isMitarbeiterRole && !isAdminRole

  const usersToShow = isMitarbeiterRole ? (availableUsers || []) : roleUsers

  return (
    <Card className="border-gray-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 py-3 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Users className="h-4 w-4 text-[#41A63E]" />
              <CardTitle className="text-base font-semibold text-gray-900">
                Nutzer für {selectedRole.name}
              </CardTitle>
            </div>
            <p className="text-xs text-gray-600 ml-5.5">
              <span className="font-semibold text-[#41A63E]">{usersToShow.length}</span> Nutzer gefunden
            </p>
          </div>
          {canAssign && (
            <Button
              onClick={onAssignUser}
              className="flex items-center cursor-pointer gap-1.5 bg-gradient-to-r from-[#41A63E] to-[#41A63E] hover:from-[#41A63E] hover:to-[#41A63E] text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:shadow-md text-xs"
              size="sm"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Nutzer zuweisen
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {usersToShow.length > 0 ? (
          <div className="space-y-2.5">
            {usersToShow.map((user) => {
              const isSelected = selectedUserFromRole?.id === user.id
              const effectivePermissions = getUserEffectivePermissions(user)
  
              
              return (
                <div
                  key={user.id}
                  onClick={() => onUserSelect(user)}
                  className={`group relative flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.005] ${
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
                  
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className={`relative flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#41A63E] to-[#41A63E] shadow-sm' 
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-blue-200 group-hover:to-blue-300'
                    }`}>
                      <Users className={`h-5 w-5 ${
                        isSelected ? 'text-white' : 'text-gray-600 group-hover:text-[#41A63E]'
                      }`} />
                     
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className={`font-semibold text-sm ${
                          isSelected ? 'text-[#41A63E]' : 'text-gray-900'
                        }`}>
                          {user.name}
                        </p>
                       
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                     
                    </div>
                  </div>
                  
                  {/* Remove Button (not needed for Mitarbeiter role) */}
                  {!isMitarbeiterRole && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveUser(user.id)
                      }}
                      className="flex-shrink-0 ml-2 text-red-600 hover:text-white hover:bg-red-600 border-red-300 hover:border-red-600 transition-all duration-200 h-7 w-7 p-0"
                    >
                      <UserX className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-3">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">
              {isMitarbeiterRole ? 'Keine Partner gefunden' : 'Keine Nutzer zugewiesen'}
            </h3>
            {canAssign && (
              <>
                <p className="text-xs text-gray-600 mb-5 max-w-sm mx-auto">
                  Weisen Sie Nutzer zu dieser Rolle zu, um ihnen Zugriff zu gewähren.
                </p>
                <Button
                  onClick={onAssignUser}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm text-xs"
                  size="sm"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Ersten Nutzer zuweisen
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

