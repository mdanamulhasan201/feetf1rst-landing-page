'use client'

import { Search, Users, UserPlus, UserCheck } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog'

export default function AssignUserModal({ 
  open, 
  onOpenChange, 
  selectedRole, 
  availableUsers, 
  searchQuery,
  onSearchChange,
  onAssignUser 
}) {
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nutzer zu {selectedRole?.name} zuweisen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search Users */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Nutzer suchen..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Available Users List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isAssigned = selectedRole?.userIds?.includes(user.id)
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isAssigned
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isAssigned ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Users className={`h-5 w-5 ${
                          isAssigned ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    {isAssigned ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <UserCheck className="h-5 w-5" />
                        <span className="text-sm font-medium">Zugewiesen</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => onAssignUser(user.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Zuweisen
                      </Button>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Keine Nutzer gefunden</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

