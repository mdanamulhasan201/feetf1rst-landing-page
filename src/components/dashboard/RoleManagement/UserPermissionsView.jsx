'use client'

import { ArrowLeft, User, Shield, Sparkles, Info } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import PermissionsList from './PermissionsList'

export default function UserPermissionsView({ 
  user,
  role,
  permissions,
  menuItems,
  searchQuery,
  onSearchChange,
  onPermissionToggle,
  onBack,
  isToggling = false
}) {
  const hasCustomPermissions = user.customPermissions && user.customPermissions.length > 0
  
  return (
    <div className="border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 py-3 px-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-1.5 border-gray-300 hover:bg-gray-50 text-xs h-7"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Zurück
              </Button>
              <div className="h-5 w-px bg-gray-300"></div>
              <div className="p-1.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md">
                <User className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Berechtigungen für {user.name}
                </CardTitle>
                <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  <span>Rolle: <span className="font-semibold text-blue-600">{role.name}</span></span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-10">
              {hasCustomPermissions ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-md">
                  <Sparkles className="h-3 w-3 text-yellow-600" />
                  <span className="text-xs font-semibold text-yellow-700">Benutzerdefinierte Berechtigungen</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
                  <Shield className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Rollen-Berechtigungen</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
       

        <PermissionsList
          title=""
          permissions={permissions}
          menuItems={menuItems}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onPermissionToggle={onPermissionToggle}
          isToggling={isToggling}
        />
      </CardContent>
    </div>
  )
}

