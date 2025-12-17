'use client'

import { X } from 'lucide-react'
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
  onBack
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Berechtigungen für {user.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {permissions.length} von {menuItems.length} Bereichen aktiviert
              <span className="ml-2 text-xs text-gray-500">
                (Rolle: {role.name})
              </span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
          >
            <X className="h-4 w-4 mr-1" />
            Zurück zur Rolle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Info Banner */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Hinweis:</strong> Diese Berechtigungen überschreiben die Rollen-Berechtigungen für {user.name}. 
            Wenn keine benutzer-spezifischen Berechtigungen gesetzt sind, werden die Rollen-Berechtigungen verwendet.
          </p>
        </div>

        <PermissionsList
          title=""
          permissions={permissions}
          menuItems={menuItems}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onPermissionToggle={onPermissionToggle}
        />
      </CardContent>
    </Card>
  )
}

