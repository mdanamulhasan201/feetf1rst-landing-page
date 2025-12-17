'use client'

import { Plus, Shield } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog'

export default function CreateRoleModal({ 
  open, 
  onOpenChange, 
  roleName, 
  onRoleNameChange, 
  onCreateRole 
}) {
  const handleClose = () => {
    onOpenChange(false)
  }

  const handleCreate = () => {
    if (roleName && roleName.trim()) {
      onCreateRole()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-gradient-to-br from-[#41A63E] to-[#41A63E] rounded-md">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Neue Rolle erstellen
            </DialogTitle>
          </div>
          <p className="text-xs text-gray-600 ml-8">
            Erstellen Sie eine neue Rolle mit benutzerdefinierten Berechtigungen.
          </p>
        </DialogHeader>
        <div className="space-y-3 py-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Rollenname
            </label>
            <Input
              type="text"
              placeholder="z.B. Manager, Editor, Moderator..."
              value={roleName}
              onChange={(e) => onRoleNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreate()
                }
              }}
              autoFocus
              className="h-9 text-sm border-gray-300 focus:border-[#41A63E] focus:ring-[#41A63E]"
            />
            <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
              <span>💡</span>
              <span>Geben Sie einen aussagekräftigen Namen für die neue Rolle ein.</span>
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-300 hover:bg-gray-50 text-xs h-8"
            size="sm"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!roleName || !roleName.trim()}
            className="bg-gradient-to-r from-[#41A63E] to-[#41A63E] hover:from-[#41A63E] hover:to-[#41A63E] text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs h-8"
            size="sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Rolle erstellen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

