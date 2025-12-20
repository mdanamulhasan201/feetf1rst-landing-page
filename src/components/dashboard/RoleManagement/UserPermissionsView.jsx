'use client'

import PermissionsList from './PermissionsList'

export default function UserPermissionsView({ 
  permissions,
  menuItems,
  searchQuery,
  onSearchChange,
  onPermissionToggle,
  isToggling = false
}) {
  return (
    <div className="border border-gray-200">
    
      <div className="p-3">
       
        <PermissionsList
          title=""
          permissions={permissions}
          menuItems={menuItems}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onPermissionToggle={onPermissionToggle}
          isToggling={isToggling}
        />
      </div>
    </div>
  )
}

