# Peer Discovery Frontend Documentation

## Overview

This document covers the React components and hooks for the Peer Discovery System frontend. The components provide a complete user interface for finding, connecting with, and managing peer relationships.

## Components

### PeerDiscovery

The main component that provides a comprehensive peer discovery interface.

**Location:** `components/peers/PeerDiscovery.tsx`

**Features:**
- Tabbed interface for different peer-related views
- Search functionality with filters
- Connection management
- Recommendation display
- Pending requests handling
- Statistics dashboard

**Props:** None (uses internal state and hooks)

**Usage:**
```tsx
import PeerDiscovery from '@/components/peers/PeerDiscovery'

export default function PeersPage() {
  return <PeerDiscovery />
}
```

### PeerActivityFeed

Displays a feed of peer activities with engagement options.

**Location:** `components/peers/PeerActivityFeed.tsx`

**Features:**
- Real-time activity feed
- Activity type categorization
- Like, comment, share actions
- Infinite scroll loading
- Time-based sorting

**Props:** None

**Usage:**
```tsx
import PeerActivityFeed from '@/components/peers/PeerActivityFeed'

export default function ActivityPage() {
  return <PeerActivityFeed />
}
```

### PeerSettings

Comprehensive settings interface for peer discovery preferences.

**Location:** `components/peers/PeerSettings.tsx`

**Features:**
- Profile visibility controls
- Privacy settings
- Notification preferences
- Discovery preferences
- Recommendation settings

**Props:** None

**Usage:**
```tsx
import PeerSettings from '@/components/peers/PeerSettings'

export default function SettingsPage() {
  return <PeerSettings />
}
```

### PeerCard

Reusable card component for displaying peer information.

**Location:** `components/peers/PeerCard.tsx`

**Props:**
```typescript
interface PeerCardProps {
  user?: User
  peer?: Peer
  recommendation?: PeerRecommendation
  onConnect?: (userId: string) => void
  onMessage?: (userId: string) => void
  onViewProfile?: (userId: string) => void
  onAcceptRequest?: (userId: string) => void
  onDeclineRequest?: (userId: string) => void
  showActions?: boolean
  compact?: boolean
}
```

**Usage:**
```tsx
import PeerCard from '@/components/peers/PeerCard'

<PeerCard
  user={userData}
  onConnect={(userId) => handleConnect(userId)}
  onViewProfile={(userId) => viewProfile(userId)}
  compact
/>
```

### PeerSearch

Advanced search component with filters and results display.

**Location:** `components/peers/PeerSearch.tsx`

**Props:**
```typescript
interface PeerSearchProps {
  onConnect?: (userId: string) => void
  onViewProfile?: (userId: string) => void
  showFilters?: boolean
  placeholder?: string
  maxResults?: number
}
```

**Usage:**
```tsx
import PeerSearch from '@/components/peers/PeerSearch'

<PeerSearch
  onConnect={handleConnect}
  showFilters
  maxResults={10}
/>
```

## Hooks

### usePeerDiscovery

Main hook that provides all peer discovery functionality.

**Location:** `hooks/usePeerDiscovery.ts`

**Returns:**
```typescript
{
  // Data
  connections: Peer[]
  recommendations: PeerRecommendation[]
  pendingRequests: { sent: Peer[], received: Peer[] }
  activityFeed: PeerActivity[]
  stats: PeerStats | null
  settings: PeerSettings | null
  loading: boolean
  error: string | null

  // Actions
  getConnections: () => Promise<void>
  getRecommendations: () => Promise<void>
  getPendingRequests: () => Promise<void>
  getActivityFeed: (before?: string) => Promise<void>
  getStats: () => Promise<void>
  getSettings: () => Promise<void>
  searchPeers: (query: string, filters?: SearchFilters) => Promise<User[]>
  sendFriendRequest: (peerId: string, message?: string) => Promise<any>
  respondToFriendRequest: (requesterId: string, response: 'accept' | 'decline', message?: string) => Promise<any>
  blockPeer: (peerId: string) => Promise<any>
  removeConnection: (peerId: string) => Promise<any>
  markRecommendationAsViewed: (recommendationId: string) => Promise<void>
  markRecommendationAsActioned: (recommendationId: string) => Promise<void>
  deleteRecommendation: (recommendationId: string) => Promise<void>
  updateSettings: (newSettings: Partial<PeerSettings>) => Promise<any>
  logActivity: (activity: Omit<PeerActivity, '_id' | 'createdAt'>) => Promise<any>
  generateRecommendations: (limit?: number) => Promise<any>
  clearError: () => void
}
```

**Usage:**
```tsx
import { usePeerDiscovery } from '@/hooks/usePeerDiscovery'

function MyComponent() {
  const { connections, loading, sendFriendRequest } = usePeerDiscovery()

  const handleConnect = async (peerId: string) => {
    try {
      await sendFriendRequest(peerId, 'Hi! I\'d like to connect.')
    } catch (error) {
      console.error('Failed to send request:', error)
    }
  }

  return (
    // JSX
  )
}
```

### Specialized Hooks

#### usePeerConnections
```typescript
const { connections, loading, error, refetch } = usePeerConnections()
```

#### usePeerRecommendations
```typescript
const { 
  recommendations, 
  loading, 
  error, 
  refetch, 
  markAsViewed, 
  markAsActioned, 
  delete, 
  generate 
} = usePeerRecommendations()
```

#### usePeerActivityFeed
```typescript
const { 
  activityFeed, 
  loading, 
  error, 
  refetch, 
  loadMore, 
  logActivity 
} = usePeerActivityFeed()
```

#### usePeerStats
```typescript
const { stats, loading, error, refetch } = usePeerStats()
```

#### usePeerSettings
```typescript
const { settings, loading, error, refetch, update } = usePeerSettings()
```

#### usePeerSearch
```typescript
const { search, loading, error } = usePeerSearch()

const results = await search('john', { level: 'undergraduate' })
```

## Pages

### Main Peer Discovery Page

**Location:** `app/peers/page.tsx`

```tsx
import PeerDiscovery from '@/components/peers/PeerDiscovery'

export default function PeersPage() {
  return <PeerDiscovery />
}
```

### Settings Page

**Location:** `app/peers/settings/page.tsx`

```tsx
import PeerSettings from '@/components/peers/PeerSettings'

export default function PeerSettingsPage() {
  return <PeerSettings />
}
```

### Activity Feed Page

**Location:** `app/peers/activity/page.tsx`

```tsx
import PeerActivityFeed from '@/components/peers/PeerActivityFeed'

export default function PeerActivityPage() {
  return <PeerActivityFeed />
}
```

## UI Components Used

The peer discovery components use these shadcn/ui components:

- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Button`
- `Input`
- `Badge`
- `Avatar`, `AvatarFallback`, `AvatarImage`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Switch`
- `Label`
- `Slider`
- `Separator`

## Icons

The components use Lucide React icons:

- `Users`, `Search`, `UserPlus`, `Clock`, `TrendingUp`, `Settings`
- `BookOpen`, `GraduationCap`, `MapPin`, `Trophy`, `Award`, `Target`
- `Heart`, `MessageCircle`, `Share2`, `Star`, `Eye`, `EyeOff`
- `Shield`, `Globe`, `Lock`, `Bell`, `Filter`, `X`, `Loader2`

## Styling

The components use Tailwind CSS classes with consistent design patterns:

- **Colors:** Follow the design system color palette
- **Spacing:** Consistent spacing using Tailwind's spacing scale
- **Typography:** Consistent font sizes and weights
- **Responsive:** Mobile-first responsive design
- **States:** Hover, focus, and disabled states

## State Management

The components use React hooks for state management:

- **Local State:** useState for component-specific state
- **Server State:** Custom hooks for API data
- **Global State:** Can be integrated with Redux/Zustand if needed

## Error Handling

Components include comprehensive error handling:

- **API Errors:** Display error messages to users
- **Loading States:** Show loading indicators during API calls
- **Empty States:** Show helpful messages when no data is available
- **Validation:** Form validation for user inputs

## Performance Considerations

- **Memoization:** Components use React.memo where appropriate
- **Debouncing:** Search inputs are debounced to reduce API calls
- **Pagination:** Large datasets use pagination or infinite scroll
- **Lazy Loading:** Images and heavy content are lazy loaded
- **Caching:** API responses are cached where appropriate

## Accessibility

- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **Screen Readers:** Proper ARIA labels and semantic HTML
- **Focus Management:** Proper focus handling in modals and forms
- **Color Contrast:** Sufficient color contrast for readability
- **Alternative Text:** Images have descriptive alt text

## Testing

The components are designed to be testable:

- **Unit Tests:** Jest and React Testing Library for component logic
- **Integration Tests:** API integration testing
- **E2E Tests:** Playwright or Cypress for full user flows
- **Accessibility Tests:** axe-core for accessibility compliance

## Internationalization

Components support internationalization:

- **Text Strings:** All user-facing text can be translated
- **Date/Time:** Localized date and time formatting
- **Numbers:** Localized number formatting
- **RTL Support:** Right-to-left language support

## Browser Support

The components support modern browsers:

- **Chrome/Chromium:** Latest version
- **Firefox:** Latest version
- **Safari:** Latest version
- **Edge:** Latest version
- **Mobile:** iOS Safari and Chrome Mobile

## Future Enhancements

Planned improvements to the frontend:

- **Real-time Updates:** WebSocket integration for live updates
- **Advanced Filters:** More sophisticated filtering options
- **Bulk Actions:** Select and act on multiple peers
- **Analytics Dashboard:** Detailed peer network analytics
- **Mobile App:** React Native mobile application
- **PWA Features:** Offline support and push notifications

## Troubleshooting

### Common Issues

1. **Components Not Rendering**
   - Check imports and exports
   - Verify component props
   - Check for TypeScript errors

2. **API Calls Failing**
   - Check network connectivity
   - Verify API endpoints
   - Check authentication status

3. **State Not Updating**
   - Check dependency arrays in useEffect
   - Verify state update functions
   - Check for stale closures

4. **Performance Issues**
   - Check for unnecessary re-renders
   - Verify memoization usage
   - Profile with React DevTools

### Debug Tips

- Use React DevTools to inspect component state
- Check browser network tab for API calls
- Use console.log for debugging (remove in production)
- Enable TypeScript strict mode for better error catching

---

## Summary

The Peer Discovery frontend provides a comprehensive, accessible, and performant user interface for managing peer relationships. The modular component architecture allows for easy customization and extension while maintaining consistency across the application.
