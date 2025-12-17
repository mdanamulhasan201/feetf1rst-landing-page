'use client'

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
          <DialogTitle>Neue Rolle erstellen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Rollenname
            </label>
            <Input
              type="text"
              placeholder="z.B. Manager, Editor, etc."
              value={roleName}
              onChange={(e) => onRoleNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreate()
                }
              }}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              Geben Sie einen Namen für die neue Rolle ein.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!roleName || !roleName.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Rolle erstellen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

