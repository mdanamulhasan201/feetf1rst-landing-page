'use client'

import { Search, Users, UserPlus, UserCheck, Shield, Mail } from 'lucide-react'
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
  const assignedCount = selectedRole?.userIds?.length || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Nutzer zuweisen
              </DialogTitle>
              <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5">
                <Shield className="h-3 w-3" />
                <span>Rolle: <span className="font-semibold text-blue-600">{selectedRole?.name}</span></span>
                <span className="mx-1.5">•</span>
                <span>{assignedCount} zugewiesen</span>
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
          {/* Search Users */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Nach Name oder E-Mail suchen..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Available Users List */}
          <div className="space-y-2 flex-1 overflow-y-auto pr-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isAssigned = selectedRole?.userIds?.includes(user.id)
                return (
                  <div
                    key={user.id}
                    className={`group flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                      isAssigned
                        ? 'border-green-200 bg-gradient-to-r from-green-50 to-white'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`relative flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isAssigned 
                          ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-sm' 
                          : 'bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-blue-200 group-hover:to-blue-300'
                      }`}>
                        <Users className={`h-5 w-5 ${
                          isAssigned ? 'text-white' : 'text-gray-600 group-hover:text-blue-700'
                        }`} />
                        {isAssigned && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <UserCheck className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm mb-0.5 ${
                          isAssigned ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    {isAssigned ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-md border border-green-200">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">Zugewiesen</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => onAssignUser(user.id)}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm transition-all duration-200 text-xs h-8"
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1" />
                        Zuweisen
                      </Button>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
                  <Search className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                  Keine Nutzer gefunden
                </h3>
                <p className="text-xs text-gray-600">
                  Versuchen Sie es mit einem anderen Suchbegriff.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="border-t border-gray-200 pt-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 hover:bg-gray-50 text-xs h-8"
            size="sm"
          >
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

