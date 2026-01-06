# Query Management Pattern (Tanstack Query)

## Tổng quan

Đây là base practice chuẩn cho việc fetch, cache, và sync data trong dự án. Mục đích là:
- ✅ Tránh full page reloads
- ✅ Sync data mà không cần manual callbacks
- ✅ Tối ưu performance (chỉ refetch cần thiết)
- ✅ Tránh stale/out-of-sync data

---

## 1. Query Key Strategy

### Problem
```typescript
// ❌ BAD: Generic keys
const { data: teams } = useQuery({
  queryKey: ['teams'],  // Mỗi mutation đều invalidate toàn bộ
  queryFn: () => api.getTeams(),
})
```

### Solution: Hierarchical Query Keys

```typescript
// features/teams/hooks/query-keys.ts
export const QUERY_KEYS = {
  teams: {
    // Root key
    all: ['teams'] as const,
    
    // List queries (paginated)
    lists: () => [...QUERY_KEYS.teams.all, 'list'] as const,
    list: (skip: number, limit: number) => 
      [...QUERY_KEYS.teams.lists(), skip, limit] as const,
    
    // Detail queries
    details: () => [...QUERY_KEYS.teams.all, 'detail'] as const,
    detail: (id: string) => 
      [...QUERY_KEYS.teams.details(), id] as const,
    
    // Members queries
    memberLists: () => [...QUERY_KEYS.teams.all, 'members'] as const,
    members: (teamId: string) => 
      [...QUERY_KEYS.teams.memberLists(), teamId] as const,
    member: (teamId: string, memberId: string) => 
      [...QUERY_KEYS.teams.members(teamId), memberId] as const,
  },
  
  users: {
    all: ['users'] as const,
    lists: () => [...QUERY_KEYS.users.all, 'list'] as const,
    list: (skip: number, limit: number) => 
      [...QUERY_KEYS.users.lists(), skip, limit] as const,
    detail: (id: string) => 
      [...QUERY_KEYS.users.all, 'detail', id] as const,
  },
}
```

### Key Structure Visualization

```
['teams']                          ← Root key (tất cả teams queries)
├── ['teams', 'list']              ← All paginated lists
│   ├── ['teams', 'list', 0, 100]   ← Page 1
│   ├── ['teams', 'list', 100, 100] ← Page 2
│   └── ...
├── ['teams', 'detail']            ← All detail queries
│   ├── ['teams', 'detail', 'id-1']  ← Team 1 detail
│   ├── ['teams', 'detail', 'id-2']  ← Team 2 detail
│   └── ...
└── ['teams', 'members']           ← All member queries
    ├── ['teams', 'members', 'team-1']  ← Team 1 members
    └── ...
```

### Partial Key Matching Benefits

```typescript
// ✅ Invalidate tất cả list queries (mọi pagination)
queryClient.invalidateQueries({
  queryKey: ['teams', 'list'],
})

// ✅ Invalidate chỉ team-1 detail
queryClient.invalidateQueries({
  queryKey: ['teams', 'detail', 'team-1'],
})

// ✅ Invalidate tất cả teams-related queries
queryClient.invalidateQueries({
  queryKey: ['teams'],
})

// ❌ KHÔNG làm
queryClient.invalidateQueries() // Invalidate EVERYTHING
```

---

## 2. Scoped Invalidation Pattern

### Rule: Invalidate only affected queries

```typescript
// features/teams/hooks/use-update-team-member.ts
export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: UpdateMemberPayload) => 
      api.updateTeamMember(payload),
    onSuccess: (data, variables) => {
      // ✅ SCOPE 1: Member data changed
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.teams.members(variables.teamId),
      })
      
      // ✅ SCOPE 2: Team detail might have member count
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.teams.detail(variables.teamId),
      })
      
      // ❌ NOT affected - don't invalidate
      // - teams list (member update không ảnh hưởng list)
      // - users list (không liên quan)
    },
  })
}

export const useDeleteTeam = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (teamId: string) => api.deleteTeam(teamId),
    onSuccess: (_, teamId) => {
      // ✅ SCOPE 1: Team deleted → list count changed
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.teams.lists(),
      })
      
      // ✅ SCOPE 2: Remove from cache
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.teams.detail(teamId),
      })
      
      // ✅ SCOPE 3: Clean member queries
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.teams.members(teamId),
      })
    },
  })
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => 
      api.createTeam(payload),
    onSuccess: () => {
      // ✅ SCOPE: New team added → list changed
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.teams.lists(),
      })
      
      // ❌ Detail queries không ảnh hưởng (new team, ko detail yet)
    },
  })
}
```

### Action → Invalidation Scope Mapping Table

| Action | Invalidate | NOT Invalidate | Why |
|--------|------------|---|-----|
| **Create member** | `teams.members(teamId)` | `teams.list`, `teams.detail` | Member added to team, nhưng team info ko change |
| **Update member** | `teams.members(teamId)` | `teams.list` | Member detail change |
| **Delete member** | `teams.members(teamId)` | `teams.list`, `teams.detail` | Member removed từ list |
| **Create team** | `teams.lists()` | `users.list` | Team added → list count +1 |
| **Update team** | `teams.detail(teamId)` | `teams.list` | Team info change nhưng list ko affected |
| **Delete team** | `teams.lists()` | `users.list` | Team deleted → list count -1 |
| **Archive team** | `teams.detail(teamId)` | `teams.list` | Status change |
| **Add team member** | `teams.members(teamId)` | `users.list` | Member list changed |
| **Invite user** | `users.detail(userId)` | `users.list` | User info updated |

---

## 3. Component-Level Query Pattern

### Principle: Each component queries data it needs

```typescript
// ❌ WRONG: Fetch everything at page level
const TeamsPage = () => {
  // Fetch teams, members, details tất cả tại đây
  const { data: teams } = useQuery({
    queryKey: QUERY_KEYS.teams.all,
    queryFn: () => api.getAllTeamsWithMembers(), // Lớn, slow
  })
  
  return <TeamsList teams={teams} />
}

// ✅ RIGHT: Component-specific queries
const TeamsPage = () => {
  // Page: chỉ query teams list
  const [skip, setSkip] = useState(0)
  const { data: teams = [] } = useQuery({
    queryKey: QUERY_KEYS.teams.list(skip, 100),
    queryFn: () => api.getTeams(skip, 100),
  })
  
  return <TeamsList teams={teams} onSelect={handleSelect} />
}

const TeamDetailDialog = ({ teamId }: { teamId: string }) => {
  // Dialog: query riêng team detail
  const { data: team } = useQuery({
    queryKey: QUERY_KEYS.teams.detail(teamId),
    queryFn: () => api.getTeamDetail(teamId),
  })
  
  // Dialog: query riêng members
  const { data: members = [] } = useQuery({
    queryKey: QUERY_KEYS.teams.members(teamId),
    queryFn: () => api.getTeamMembers(teamId),
  })
  
  return <TeamDetail team={team} members={members} />
}

const EditMemberDialog = ({ teamId, memberId }: Props) => {
  // Form data từ parent props hoặc từ members list
  // Nếu cần full member detail, query riêng:
  const { data: member } = useQuery({
    queryKey: QUERY_KEYS.teams.member(teamId, memberId),
    queryFn: () => api.getTeamMember(teamId, memberId),
    enabled: !!memberId, // Chỉ query khi có memberId
  })
  
  // Form state (snapshot - OK)
  const [form, setForm] = useState<EditPayload>({...member})
  
  return <Form data={form} onChange={setForm} />
}
```

### Benefits
- Page refetch → Dialog không bị refetch (nếu ko liên quan)
- Member update → Chỉ members list refetch, page list ko affected
- Multiple dialogs mở → Mỗi dialog query riêng (ko chạy ko load)

---

## 4. Derived State Pattern (CRUD)

### CRUD Operations & State Type Guide

| Operation | State Type | Why | Example |
|-----------|------------|-----|---------|
| **Create** | ❌ Derived | ✅ Snapshot | Form input tạm, ko lấy từ DB |
| **Read** | ✅ Derived | ❌ Snapshot | Luôn fresh từ array |
| **Update** | ✅ Derived + ✅ Snapshot | - | Display = derived, Form = snapshot |
| **Delete** | ✅ Derived | ❌ Snapshot | Auto cleanup khi item xóa khỏi array |

```typescript
// ✅ Display: Derived state (always fresh from array)
const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
const selectedTeam = teams.find(t => t.id === selectedTeamId) ?? null

// ❌ NOT snapshot state
// const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null)
// selectedTeam gets stale after refetch

// ✅ Form input: Snapshot state (form tạm)
const [formData, setFormData] = useState<EditPayload>({
  name: selectedTeam?.name ?? '',
  role: selectedTeam?.role ?? '',
})

// Update form when derived state changes
useEffect(() => {
  if (selectedTeam) {
    setFormData({
      name: selectedTeam.name,
      role: selectedTeam.role,
    })
  }
}, [selectedTeam])
```

### Delete Operation Auto-Cleanup

```typescript
const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

// Derived state - when teams update, selectedTeam auto-update
const selectedTeam = teams.find(t => t.id === selectedTeamId) ?? null

const handleDelete = async (teamId: string) => {
  await deleteTeam(teamId)
  // API success → queryClient.invalidateQueries(['teams', 'list'])
  // Teams array refetch
  // selectedTeam auto-compute → becomes null (deleted item không tìm thấy)
  // ✅ Auto cleanup, no manual setState needed
}
```

---

## 5. Cache Strategy

```typescript
useQuery({
  queryKey: QUERY_KEYS.teams.detail(teamId),
  queryFn: () => api.getTeamDetail(teamId),
  
  // Data old → refetch
  staleTime: 5 * 60 * 1000, // 5 minutes
  
  // Cache bao lâu trước garbage collect
  gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  
  // Optional: retry logic
  retry: 2,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
})
```

### Common Cache Times

```typescript
// List queries - medium cache
staleTime: 2 * 60 * 1000,    // 2 minutes
gcTime: 10 * 60 * 1000,      // 10 minutes

// Detail queries - longer cache
staleTime: 5 * 60 * 1000,    // 5 minutes
gcTime: 30 * 60 * 1000,      // 30 minutes

// Real-time data - short cache
staleTime: 0,                 // Always stale
gcTime: 5 * 60 * 1000,       // 5 minutes

// Rarely-changing data - long cache
staleTime: 60 * 60 * 1000,   // 1 hour
gcTime: 24 * 60 * 60 * 1000, // 24 hours
```

---

## 6. Implementation Checklist

### For Each Feature

- [ ] Create `hooks/query-keys.ts` with hierarchical keys
- [ ] Define query keys for all query types (list, detail, nested)
- [ ] Create `hooks/use-{feature}.ts` hooks for each query
- [ ] Create mutation hooks for CRUD operations
- [ ] Add scoped invalidation in `onSuccess` callbacks
- [ ] Map out action → invalidation scope
- [ ] Use component-level queries (not everything at page)
- [ ] Use derived state for displaying selected items
- [ ] Use snapshot state only for form inputs
- [ ] Set appropriate cache times based on data freshness needs

### Example: Teams Feature

```
features/teams/
├── hooks/
│   ├── query-keys.ts ← Hierarchical keys
│   ├── use-teams.ts ← List query
│   ├── use-team-detail.ts ← Detail query
│   ├── use-team-members.ts ← Members query
│   ├── use-create-team.ts ← Create mutation + invalidation
│   ├── use-update-team.ts ← Update mutation + invalidation
│   ├── use-delete-team.ts ← Delete mutation + invalidation
│   ├── use-create-member.ts ← Add member + invalidation
│   ├── use-update-member.ts ← Edit member + invalidation
│   └── use-delete-member.ts ← Remove member + invalidation
├── components/
│   ├── teams-page.tsx ← Derived state + list query
│   ├── team-detail-dialog.tsx ← Detail/members queries
│   ├── edit-member-dialog.tsx ← Snapshot state + mutation
│   └── ...
└── index.ts
```

---

## 7. Anti-Patterns to Avoid

```typescript
// ❌ 1. Invalidate everything
queryClient.invalidateQueries()

// ❌ 2. Manual refetch in callbacks
onSuccess: () => {
  refetch() // Use invalidation instead
}

// ❌ 3. Store snapshots for display
const [selectedTeam, setSelectedTeam] = useState<ITeam>(team)
// Will be stale after refetch

// ❌ 4. Query everything at page level
const { data: everything } = useQuery({
  queryKey: ['all'],
  queryFn: () => api.getEverything(),
})

// ❌ 5. No cache strategy
useQuery({
  queryKey: [...],
  queryFn: [...],
  // staleTime and gcTime not set
})

// ❌ 6. Query inside loops
teams.map(team => {
  const { data } = useQuery({ // ❌ Bad
    queryKey: [team.id],
    queryFn: () => api.getTeamDetail(team.id),
  })
})
// Use QUERY_KEYS.teams.detail(team.id) properly instead

// ❌ 7. Inconsistent key structure
['teams', 'all']
['teams_list', 0, 100]
['team_detail', 'id']
// Mix of patterns - use hierarchical consistently
```

---

## 8. Best Practices Summary

### ✅ DO

1. **Hierarchical Query Keys** - Root → Category → Specific
2. **Scoped Invalidation** - Only invalidate affected queries
3. **Component Queries** - Component owns its data fetching
4. **Derived State** - ID state + compute from array
5. **Cache Strategy** - Set appropriate staleTime/gcTime
6. **Action Mapping** - Document action → invalidation scope
7. **Conditional Queries** - `enabled: !!id` for optional queries
8. **TypeScript Keys** - Use `as const` for type safety

### ❌ DON'T

1. **Global Invalidation** - Don't `invalidateQueries()`
2. **Manual Refetch** - Use invalidation pattern
3. **Snapshot Display State** - Use derived state
4. **Monolithic Queries** - Query only needed data
5. **Stale Cache** - Set appropriate cache times
6. **Mixed Key Patterns** - Be consistent
7. **Query in Loops** - Use proper key per item
8. **No Error Handling** - Set retry strategies

---

## 9. Real-World Examples

### Example 1: Update Member & Sync

```typescript
// Page
const TeamsPage = () => {
  const [teamId, setTeamId] = useState<string | null>(null)
  const { data: teams = [] } = useQuery({
    queryKey: QUERY_KEYS.teams.list(0, 100),
    queryFn: () => api.getTeams(0, 100),
  })
  
  return (
    <>
      <TeamsList teams={teams} onSelect={setTeamId} />
      {teamId && <TeamDetailDialog teamId={teamId} />}
    </>
  )
}

// Dialog
const TeamDetailDialog = ({ teamId }: { teamId: string }) => {
  const { data: members = [] } = useQuery({
    queryKey: QUERY_KEYS.teams.members(teamId),
    queryFn: () => api.getTeamMembers(teamId),
  })
  
  const [editingId, setEditingId] = useState<string | null>(null)
  
  return (
    <>
      <MembersList members={members} onEdit={setEditingId} />
      {editingId && (
        <EditMemberDialog
          teamId={teamId}
          memberId={editingId}
          onClose={() => setEditingId(null)}
        />
      )}
    </>
  )
}

// Edit Dialog
const EditMemberDialog = ({ teamId, memberId, onClose }: Props) => {
  const { data: member } = useQuery({
    queryKey: QUERY_KEYS.teams.member(teamId, memberId),
    queryFn: () => api.getTeamMember(teamId, memberId),
    enabled: !!memberId,
  })
  
  const [form, setForm] = useState<Partial<Member>>({})
  const mutation = useUpdateTeamMember()
  
  useEffect(() => {
    if (member) {
      setForm({ name: member.name, role: member.role })
    }
  }, [member])
  
  const handleSubmit = async () => {
    await mutation.mutateAsync({
      teamId,
      memberId,
      ...form,
    })
    // Mutation onSuccess:
    // - invalidateQueries(['teams', 'members', teamId])
    // - TeamDetailDialog re-queries members
    // - Members list auto-updates
    // - EditMemberDialog auto-closes or member data auto-updates
    onClose()
  }
  
  return <Form data={form} onSubmit={handleSubmit} />
}

// Hook
export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload) => api.updateTeamMember(payload),
    onSuccess: (_, variables) => {
      // Scoped: Only affected queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.teams.members(variables.teamId),
      })
    },
  })
}
```

### Data Flow

```
1. User clicks Edit Member
   ↓
2. EditMemberDialog opens
   ↓
3. Form pre-filled (useEffect + derived from query)
   ↓
4. User submits form
   ↓
5. useUpdateTeamMember mutation fires
   ↓
6. API call completes
   ↓
7. onSuccess: invalidateQueries(['teams', 'members', teamId])
   ↓
8. TeamDetailDialog's useQuery automatically refetches
   ↓
9. Members array updates
   ↓
10. EditMemberDialog auto-updates or closes
```

---

## 10. Migration Guide

### From Old Pattern to New Pattern

**Before:**
```typescript
const [teams, setTeams] = useState<Team[]>([])
const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

const handleRefreshTeams = async () => {
  const data = await api.getTeams()
  setTeams(data)
}

const handleSelectTeam = (team: Team) => {
  setSelectedTeam(team)
}

const handleUpdateMember = async () => {
  await api.updateMember(...)
  await handleRefreshTeams() // Manual refetch
  // But selectedTeam is still stale!
}
```

**After:**
```typescript
// Hook
const { data: teams = [] } = useQuery({
  queryKey: QUERY_KEYS.teams.list(0, 100),
  queryFn: () => api.getTeams(0, 100),
})

// Derived state
const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
const selectedTeam = teams.find(t => t.id === selectedTeamId) ?? null

const handleSelectTeam = (team: Team) => {
  setSelectedTeamId(team.id) // Only ID
}

const handleUpdateMember = async () => {
  await mutation.mutateAsync(...)
  // onSuccess automatically invalidates and refetches
  // selectedTeam auto-updates
}
```

---

## Conclusion

Pattern này giúp:
- ✅ No stale data bugs
- ✅ No manual callbacks
- ✅ Scoped refetch (ko full page reload)
- ✅ Scalable & maintainable
- ✅ Better performance

Áp dụng cho tất cả CRUD features!
