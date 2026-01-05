'use client'

import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import ProtectedRoute from '../../../components/auth/ProtectedRoute'
import { StoreManagementProvider } from '../../../context/StoreManagementContext'


const Layout = ({ children }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <StoreManagementProvider>
          {children}
        </StoreManagementProvider>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Layout