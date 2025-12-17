'use client'

import React, { useState, useEffect } from 'react'
import { Shield, RotateCcw, Plus } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import RolesList from '../../../../components/dashboard/RoleManagement/RolesList'
import UsersList from '../../../../components/dashboard/RoleManagement/UsersList'
import PermissionsList from '../../../../components/dashboard/RoleManagement/PermissionsList'
import UserPermissionsView from '../../../../components/dashboard/RoleManagement/UserPermissionsView'
import CreateRoleModal from '../../../../components/dashboard/RoleManagement/CreateRoleModal'
import AssignUserModal from '../../../../components/dashboard/RoleManagement/AssignUserModal'
import ConfirmModal from '../../../../components/shared/ConfirmModal'
import { menuItems, mockUsers, getInitialRoles } from '../../../../components/dashboard/RoleManagement/constants'

export default function RoleManagement() {
  const [roles, setRoles] = useState(() => getInitialRoles(menuItems))
  const [selectedRole, setSelectedRole] = useState(roles[0] || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [permissions, setPermissions] = useState(selectedRole?.permissions || [])
  const [allUsers, setAllUsers] = useState(mockUsers)
  const [assignUserModalOpen, setAssignUserModalOpen] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [selectedUserFromRole, setSelectedUserFromRole] = useState(null)
  const [userSpecificPermissions, setUserSpecificPermissions] = useState([])
  const [userPermissionSearch, setUserPermissionSearch] = useState('')
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  // Update permissions when selected role changes
  useEffect(() => {
    if (selectedRole) {
      setPermissions(selectedRole.permissions || [])
    }
    setSelectedUserFromRole(null)
  }, [selectedRole])

  // Update user-specific permissions when selected user changes
  useEffect(() => {
    if (selectedUserFromRole) {
      const user = allUsers.find(u => u.id === selectedUserFromRole.id)
      if (user) {
        if (user.customPermissions && user.customPermissions.length > 0) {
          setUserSpecificPermissions(user.customPermissions)
        } else if (selectedRole) {
          setUserSpecificPermissions(selectedRole.permissions || [])
        } else {
          setUserSpecificPermissions([])
        }
      }
    }
  }, [selectedUserFromRole, allUsers, selectedRole])

  // Handle permission toggle
  const handlePermissionToggle = (menuId) => {
    if (!selectedRole) return

    const newPermissions = permissions.includes(menuId)
      ? permissions.filter(id => id !== menuId)
      : [...permissions, menuId]

    setPermissions(newPermissions)

    const updatedRole = { ...selectedRole, permissions: newPermissions }
    setSelectedRole(updatedRole)
    setRoles(roles.map(role =>
      role.id === selectedRole.id ? updatedRole : role
    ))
  }

  // Handle role selection
  const handleRoleSelect = (role) => {
    const roleUserIds = role.userIds || []
    const actualUserCount = allUsers.filter(u => roleUserIds.includes(u.id)).length
    const updatedRole = { ...role, userCount: actualUserCount }

    setSelectedRole(updatedRole)
    setPermissions(role.permissions)
  }

  // Restore default roles
  const handleRestoreDefaults = () => {
    setConfirmModalOpen(true)
  }

  const handleConfirmRestore = () => {
    const initialRoles = getInitialRoles(menuItems)
    setRoles(initialRoles)
    setSelectedRole(initialRoles[0])
    setPermissions(initialRoles[0].permissions)
    setConfirmModalOpen(false)
  }

  // Create new role
  const handleCreateNewRole = () => {
    if (newRoleName && newRoleName.trim()) {
      const newRole = {
        id: newRoleName.toLowerCase().replace(/\s+/g, '-'),
        name: newRoleName.trim(),
        userCount: 0,
        permissions: [],
        accessType: 'restricted',
        userIds: []
      }
      setRoles([...roles, newRole])
      setSelectedRole(newRole)
      setPermissions([])
      setNewRoleName('')
      setCreateRoleModalOpen(false)
    }
  }

  // Get users for selected role
  const getRoleUsers = () => {
    if (!selectedRole || !selectedRole.userIds) return []
    return allUsers.filter(user => selectedRole.userIds.includes(user.id))
  }

  // Get available users
  const getAvailableUsers = () => {
    if (!selectedRole) return []
    const roleUserIds = selectedRole.userIds || []
    return allUsers.filter(user =>
      !user.roleId || user.roleId === selectedRole.id || roleUserIds.includes(user.id)
    )
  }

  // Handle assign user to role
  const handleAssignUser = (userId) => {
    if (!selectedRole) return
    const user = allUsers.find(u => u.id === userId)
    if (!user) return

    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { ...u, roleId: selectedRole.id } : u
    )
    setAllUsers(updatedUsers)

    const updatedRoleUserIds = [...(selectedRole.userIds || []), userId]
    const updatedRole = {
      ...selectedRole,
      userIds: updatedRoleUserIds,
      userCount: updatedRoleUserIds.length
    }

    setSelectedRole(updatedRole)
    setRoles(roles.map(role =>
      role.id === selectedRole.id ? updatedRole : role
    ))
  }

  // Handle remove user from role
  const handleRemoveUser = (userId) => {
    if (!selectedRole) return
    const updatedRoleUserIds = (selectedRole.userIds || []).filter(id => id !== userId)
    const updatedRole = {
      ...selectedRole,
      userIds: updatedRoleUserIds,
      userCount: updatedRoleUserIds.length
    }

    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { ...u, roleId: null } : u
    )
    setAllUsers(updatedUsers)

    setSelectedRole(updatedRole)
    setRoles(roles.map(role =>
      role.id === selectedRole.id ? updatedRole : role
    ))
  }

  // Get effective permissions for a user
  const getUserEffectivePermissions = (user) => {
    if (user.customPermissions && user.customPermissions.length > 0) {
      return user.customPermissions
    }
    if (user.roleId && selectedRole) {
      return selectedRole.permissions || []
    }
    return []
  }

  // Handle user-specific permission toggle
  const handleUserSpecificPermissionToggle = (menuId) => {
    if (!selectedUserFromRole) return

    const newPermissions = userSpecificPermissions.includes(menuId)
      ? userSpecificPermissions.filter(id => id !== menuId)
      : [...userSpecificPermissions, menuId]

    setUserSpecificPermissions(newPermissions)

    setAllUsers(allUsers.map(user =>
      user.id === selectedUserFromRole.id
        ? { ...user, customPermissions: newPermissions }
        : user
    ))
  }

  const roleUsers = getRoleUsers()
  const availableUsers = getAvailableUsers()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Rollen & Zugriffsrechte</h1>
          </div>
          <p className="text-gray-600 ml-11">
            Bestimmen Sie, welche Mitarbeitenden welche Bereiche sehen und nutzen dürfen.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <Button
            variant="outline"
            onClick={handleRestoreDefaults}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Standardrollen wiederherstellen
          </Button>
          <Button
            onClick={() => setCreateRoleModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Neue Rolle erstellen
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Roles List */}
          <div className="lg:col-span-1">
            <RolesList
              roles={roles}
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
              menuItems={menuItems}
            />
          </div>

          {/* Right Panel - Permissions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Users Section */}
            <UsersList
              selectedRole={selectedRole}
              roleUsers={roleUsers}
              selectedUserFromRole={selectedUserFromRole}
              onUserSelect={setSelectedUserFromRole}
              onAssignUser={() => setAssignUserModalOpen(true)}
              onRemoveUser={handleRemoveUser}
              getUserEffectivePermissions={getUserEffectivePermissions}
            />

            {/* Permissions Section */}
            {selectedRole && !selectedUserFromRole && (
              <PermissionsList
                title={`Berechtigungen für ${selectedRole.name}`}
                permissions={permissions}
                menuItems={menuItems}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onPermissionToggle={handlePermissionToggle}
              />
            )}

            {/* User-Specific Permissions View */}
            {selectedRole && selectedUserFromRole && (
              <UserPermissionsView
                user={selectedUserFromRole}
                role={selectedRole}
                permissions={userSpecificPermissions}
                menuItems={menuItems}
                searchQuery={userPermissionSearch}
                onSearchChange={setUserPermissionSearch}
                onPermissionToggle={handleUserSpecificPermissionToggle}
                onBack={() => setSelectedUserFromRole(null)}
              />
            )}
          </div>
        </div>

        {/* Modals */}
        <CreateRoleModal
          open={createRoleModalOpen}
          onOpenChange={setCreateRoleModalOpen}
          roleName={newRoleName}
          onRoleNameChange={setNewRoleName}
          onCreateRole={handleCreateNewRole}
        />

        {selectedRole && (
          <AssignUserModal
            open={assignUserModalOpen}
            onOpenChange={setAssignUserModalOpen}
            selectedRole={selectedRole}
            availableUsers={availableUsers}
            searchQuery={userSearchQuery}
            onSearchChange={setUserSearchQuery}
            onAssignUser={handleAssignUser}
          />
        )}

        <ConfirmModal
          open={confirmModalOpen}
          onOpenChange={setConfirmModalOpen}
          title="Standardrollen wiederherstellen?"
          description="Möchten Sie die Standardrollen wirklich wiederherstellen? Alle Änderungen gehen verloren."
          confirmText="Wiederherstellen"
          cancelText="Abbrechen"
          variant="destructive"
          onConfirm={handleConfirmRestore}
        />
      </div>
    </div>
  )
}
