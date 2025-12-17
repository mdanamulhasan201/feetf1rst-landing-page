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
import { getAllPartners } from '../../../../apis/authApis'
import { getAllPermissions, postAllPermissions } from '../../../../apis/roleManagementApis'

export default function RoleManagement() {
  const [roles, setRoles] = useState(() => getInitialRoles(menuItems))
  const [selectedRole, setSelectedRole] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [permissions, setPermissions] = useState([])
  const [allUsers, setAllUsers] = useState(mockUsers)
  const [assignUserModalOpen, setAssignUserModalOpen] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [selectedUserFromRole, setSelectedUserFromRole] = useState(null)
  const [userSpecificPermissions, setUserSpecificPermissions] = useState([])
  const [userPermissionSearch, setUserPermissionSearch] = useState('')
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [isTogglingPermission, setIsTogglingPermission] = useState(false)

  // Load all partners once and use them as "users" for Mitarbeiter role
  useEffect(() => {
    const fetchPartnersForRoleManagement = async () => {
      try {
        const response = await getAllPartners({ page: 1, limit: 1000, search: '' })
        const partnersData = response?.data || []

        // Normalize partners to user-like objects (id, name, email, etc.)
        const partnerUsers = partnersData.map((partner) => ({
          id: partner.id,
          name: partner.name,
          email: partner.email,
          roleId: partner.roleId || null,
          customPermissions: [],
        }))

        setAllUsers((prev) => {
          // Prefer API partners; fall back to previous users if API empty
          return partnerUsers.length > 0 ? partnerUsers : prev
        })

        // Clear default Mitarbeiter assignments so they can be managed via API-based users
        setRoles((prevRoles) =>
          prevRoles.map((role) => {
            if (role.id === 'mitarbeiter') {
              return {
                ...role,
                userIds: role.userIds && role.userIds.length > 0 ? role.userIds : [],
                userCount: role.userIds && role.userIds.length > 0 ? role.userIds.length : 0,
              }
            }
            return role
          })
        )
      } catch (error) {
        console.error('Failed to load partners for role management:', error)
      }
    }

    fetchPartnersForRoleManagement()
  }, [])

  // Update permissions when selected role changes
  useEffect(() => {
    if (selectedRole) {
      setPermissions(selectedRole.permissions || [])
    }
    setSelectedUserFromRole(null)
  }, [selectedRole])

  // Helper function to load permissions from API
  const loadUserPermissionsFromAPI = async (userId) => {
    if (!selectedRole || selectedRole.id !== 'mitarbeiter') return null

    try {
      const response = await getAllPermissions(userId)
      
      // Handle different response structures
      // Response could be: { success: true, data: {...} } or just the data object
      const apiData = response?.data || response

      if (!apiData) {
        console.warn('No data received from getAllPermissions API')
        return []
      }

      // Two possible shapes:
      // 1) Object with boolean flags per key (dashboard, teamchat, ...)
      // 2) Array of { title, action, path, nested: [] }

      let effectivePermissions = []

      if (Array.isArray(apiData)) {
        // Array with title/action
        effectivePermissions = menuItems
          .filter((item) =>
            apiData.some(
              (entry) =>
                entry.title === item.label && entry.action === true
            )
          )
          .map((item) => item.id)
      } else if (typeof apiData === 'object' && apiData !== null) {
        // Boolean map shape - handle both 'fuubungen' and 'fusubungen' keys
        effectivePermissions = menuItems
          .filter((item) => {
            const key = item.id === 'fuubungen' ? 'fusubungen' : item.id
            // Check both the mapped key and original key for safety
            return apiData[key] === true || apiData[item.id] === true
          })
          .map((item) => item.id)
      }

      return effectivePermissions
    } catch (error) {
      console.error('Failed to load feature access for partner:', error)
      throw error
    }
  }

  // Clear permissions when no user selected
  useEffect(() => {
    if (!selectedUserFromRole) {
      setUserSpecificPermissions([])
    }
  }, [selectedUserFromRole])

  // Update user-specific permissions when selected user changes (Mitarbeiter - API based)
  useEffect(() => {
    if (!selectedUserFromRole || !selectedRole || selectedRole.id !== 'mitarbeiter') {
      return
    }

    const loadPartnerPermissions = async () => {
      try {
        const effectivePermissions = await loadUserPermissionsFromAPI(selectedUserFromRole.id)
        if (effectivePermissions !== null) {
          setUserSpecificPermissions(effectivePermissions)
        }
      } catch (error) {
        console.error('Failed to load feature access for partner:', error)
        // On error, set empty permissions
        setUserSpecificPermissions([])
      }
    }

    loadPartnerPermissions()
  }, [selectedUserFromRole?.id, selectedRole?.id])

  // Update user-specific permissions when selected user changes (non-Mitarbeiter - local/role based)
  useEffect(() => {
    if (!selectedUserFromRole || !selectedRole || selectedRole.id === 'mitarbeiter') {
      return
    }

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
    setSelectedRole(null)
    setPermissions([])
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

    // For Mitarbeiter: show all partners that are not yet assigned to this role
    if (selectedRole.id === 'mitarbeiter') {
      return allUsers.filter(user => !roleUserIds.includes(user.id))
    }

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
  const handleUserSpecificPermissionToggle = async (menuId) => {
    if (!selectedUserFromRole || isTogglingPermission) return

    // Store previous state for rollback
    const previousPermissions = [...userSpecificPermissions]
    
    // Optimistically update UI
    const newPermissions = userSpecificPermissions.includes(menuId)
      ? userSpecificPermissions.filter(id => id !== menuId)
      : [...userSpecificPermissions, menuId]

    setUserSpecificPermissions(newPermissions)
    setIsTogglingPermission(true)

    // Update local user state
    setAllUsers(prevUsers => prevUsers.map(user =>
      user.id === selectedUserFromRole.id
        ? { ...user, customPermissions: newPermissions }
        : user
    ))

    // Persist permissions for Mitarbeiter via feature-access API (partner-based)
    if (selectedRole?.id === 'mitarbeiter') {
      try {
        const body = {}

        menuItems.forEach((item) => {
          const key =
            item.id === 'fuubungen'
              ? 'fusubungen'
              : item.id
          body[key] = newPermissions.includes(item.id)
        })

        await postAllPermissions(selectedUserFromRole.id, body)
      } catch (error) {
        console.error('Failed to update feature access for partner:', error)
        // Rollback on error
        setUserSpecificPermissions(previousPermissions)
        setAllUsers(prevUsers => prevUsers.map(user =>
          user.id === selectedUserFromRole.id
            ? { ...user, customPermissions: previousPermissions }
            : user
        ))
        // You might want to show a toast/notification here
      } finally {
        setIsTogglingPermission(false)
      }
    } else {
      // For non-Mitarbeiter roles, no API call needed
      setIsTogglingPermission(false)
    }
  }

  const roleUsers = getRoleUsers()
  const availableUsers = getAvailableUsers()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-[#41A63E] to-[#41A63E] rounded-lg shadow-md shadow-green-500/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
                  Rollen & Zugriffsrechte
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Bestimmen Sie, welche Mitarbeitenden welche Bereiche sehen und nutzen dürfen.
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleRestoreDefaults}
                className="flex items-center gap-2 cursor-pointer border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Standardrollen wiederherstellen</span>
                <span className="sm:hidden">Wiederherstellen</span>
              </Button>
              <Button
                onClick={() => setCreateRoleModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-[#41A63E] to-[#41A63E] hover:from-[#41A63E] hover:to-[#41A63E] text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/40"
              >
                <Plus className="h-4 w-4" />
                Neue Rolle erstellen
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
            {selectedRole && (
              <UsersList
                selectedRole={selectedRole}
                roleUsers={roleUsers}
                availableUsers={availableUsers}
                selectedUserFromRole={selectedUserFromRole}
                onUserSelect={setSelectedUserFromRole}
                onAssignUser={() => setAssignUserModalOpen(true)}
                onRemoveUser={handleRemoveUser}
                getUserEffectivePermissions={getUserEffectivePermissions}
              />
            )}

            {/* User-Specific Permissions View - Only shows when user is selected */}
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
                isToggling={isTogglingPermission}
              />
            )}

            {/* Empty State - No Role Selected */}
            {!selectedRole && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                    Wählen Sie eine Rolle aus
                  </h3>
                  <p className="text-sm text-gray-600 mb-5">
                    Wählen Sie eine Rolle aus der Liste aus, um deren Berechtigungen zu verwalten.
                  </p>
                  <Button
                    onClick={() => setCreateRoleModalOpen(true)}
                    className="bg-gradient-to-r from-[#41A63E] to-[#41A63E] hover:from-[#41A63E] hover:to-[#41A63E] text-white text-sm"
                    size="sm"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Erste Rolle erstellen
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State - Role Selected but No User Selected */}
            {selectedRole && !selectedUserFromRole && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                    Wählen Sie einen Nutzer aus
                  </h3>
                  <p className="text-sm text-gray-600">
                    Wählen Sie einen Nutzer aus der Liste aus, um dessen Berechtigungen zu verwalten.
                  </p>
                </div>
              </div>
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

        {selectedRole && selectedRole.id !== 'mitarbeiter' && selectedRole.id !== 'admin' && (
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
