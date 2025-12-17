import { 
  LayoutDashboard, 
  MessageSquare, 
  Search, 
  UserPlus, 
  Link2 as Paperclip, 
  Foot as FootIcon, 
  Box, 
  Package, 
  Mail, 
  Calendar, 
  BarChart3, 
  Users, 
  Zap, 
  FileText, 
  Settings 
} from 'lucide-react'

// Menu items with icons - matching the sidebar
export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { id: 'teamchat', label: 'Teamchat', icon: MessageSquare, route: '/dashboard/teamchat' },
  { id: 'kundensuche', label: 'Kundensuche', icon: Search, route: '/dashboard/kundensuche' },
  { id: 'neukundenerstellung', label: 'Neukundenerstellung', icon: UserPlus, route: '/dashboard/neukundenerstellung' },
  { id: 'einlagenauftrage', label: 'Einlagenaufträge', icon: Paperclip, route: '/dashboard/einlagenauftrage' },
  { id: 'massschuhauftrage', label: 'Maßschuhaufträge', icon: FootIcon, route: '/dashboard/massschuhauftrage' },
  { id: 'massschafte', label: 'Maßschäfte', icon: FootIcon, route: '/dashboard/massschafte' },
  { id: 'produktverwaltung', label: 'Produktverwaltung', icon: Box, route: '/dashboard/produktverwaltung' },
  { id: 'sammelbestellungen', label: 'Sammelbestellungen', icon: Package, route: '/dashboard/sammelbestellungen' },
  { id: 'nachrichten', label: 'Nachrichten', icon: Mail, route: '/dashboard/nachrichten' },
  { id: 'terminkalender', label: 'Terminkalender', icon: Calendar, route: '/dashboard/terminkalender' },
  { id: 'monatsstatistik', label: 'Monatsstatistik', icon: BarChart3, route: '/dashboard/monatsstatistik' },
  { id: 'mitarbeitercontrolling', label: 'Mitarbeitercontrolling', icon: Users, route: '/dashboard/mitarbeitercontrolling' },
  { id: 'einlagencontrolling', label: 'Einlagencontrolling', icon: Zap, route: '/dashboard/einlagencontrolling' },
  { id: 'fuubungen', label: 'Fußübungen', icon: FootIcon, route: '/dashboard/fuubungen' },
  { id: 'musterzettel', label: 'Musterzettel', icon: FileText, route: '/dashboard/musterzettel' },
  { id: 'einstellungen', label: 'Einstellungen', icon: Settings, route: '/dashboard/settings' },
]

// Mock users data - replace with API call later
export const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', roleId: 'admin', customPermissions: [] },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', roleId: 'admin', customPermissions: ['dashboard', 'kundensuche'] },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', roleId: 'admin', customPermissions: [] },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', roleId: 'mitarbeiter', customPermissions: [] },
  { id: '5', name: 'Tom Brown', email: 'tom@example.com', roleId: 'mitarbeiter', customPermissions: ['dashboard', 'nachrichten'] },
  { id: '6', name: 'Emily Davis', email: 'emily@example.com', roleId: 'mitarbeiter', customPermissions: [] },
  { id: '7', name: 'David Wilson', email: 'david@example.com', roleId: null, customPermissions: [] },
  { id: '8', name: 'Lisa Anderson', email: 'lisa@example.com', roleId: null, customPermissions: [] },
]

// Initial roles data
export const getInitialRoles = (menuItems) => [
  {
    id: 'admin',
    name: 'Admin',
    userCount: 3,
    permissions: menuItems.map(item => item.id),
    accessType: 'full',
    userIds: ['1', '2', '3']
  },
  {
    id: 'mitarbeiter',
    name: 'Mitarbeiter',
    userCount: 3,
    permissions: ['dashboard', 'kundensuche', 'einlagenauftrage', 'nachrichten', 'terminkalender'],
    accessType: 'restricted',
    userIds: ['4', '5', '6']
  }
]

