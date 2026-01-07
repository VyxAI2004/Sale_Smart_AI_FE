# Cấu trúc Feature chuẩn cho dự án FE Production

## Tổng quan

Dự án này sử dụng cấu trúc **Feature-based architecture** để tổ chức code theo từng feature/business domain. Mỗi feature là một module độc lập, tự chứa tất cả các thành phần liên quan.

## Cấu trúc thư mục chuẩn

```
features/
  {feature-name}/
    ├── api/              # API calls và endpoints
    │   ├── {feature}-api.ts
    │   └── index.ts
    ├── components/       # UI components
    │   ├── {component-name}.tsx
    │   └── index.ts
    ├── hooks/           # Custom React hooks (feature-specific)
    │   ├── use-{feature}.ts
    │   └── index.ts
    ├── services/        # Business logic layer (optional)
    │   ├── {feature}-service.ts
    │   └── index.ts
    ├── types/           # TypeScript types (feature-specific)
    │   ├── {feature}.types.ts
    │   └── index.ts
    ├── constants/       # Constants và config (optional)
    │   └── {feature}.constants.ts
    ├── utils/           # Feature-specific utilities (optional)
    │   └── {feature}-utils.ts
    ├── data/            # Mock data, schemas (optional)
    │   └── schema.ts
    ├── index.ts         # Public exports - chỉ export những gì cần thiết
    └── {feature-name}.tsx  # Main page/component (nếu có)
```

## Quy tắc tổ chức

### 1. API Layer (`api/`)
- Chứa tất cả các API calls liên quan đến feature
- Sử dụng class-based hoặc function-based API clients
- Mỗi API file nên có JSDoc comments
- Export tất cả qua `api/index.ts`

**Ví dụ:**
```typescript
// api/product-api.ts
export class ProductApi {
  private static readonly BASE_PATH = '/products';
  
  static async getById(id: string): Promise<Product> {
    // ...
  }
}
```

### 2. Types (`types/`)
- Chứa tất cả TypeScript types/interfaces liên quan đến feature
- Tách riêng theo domain nếu feature lớn
- Export tất cả qua `types/index.ts`

### 3. Hooks (`hooks/`)
- Chứa custom React hooks sử dụng React Query, state management, etc.
- Mỗi hook nên có một mục đích rõ ràng
- Export tất cả qua `hooks/index.ts`

**Ví dụ:**
```typescript
// hooks/use-products.ts
export const useProducts = (projectId: string, params?: {...}) => {
  return useQuery({...});
};
```

### 4. Services (`services/`) - Optional
- Chứa business logic phức tạp
- Xử lý validation, transformation, error handling
- Tách biệt khỏi API layer và UI layer

### 5. Components (`components/`)
- Chứa tất cả UI components của feature
- Component nên nhỏ gọn, có thể tái sử dụng
- Export qua `components/index.ts`

### 6. Index.ts
- Chỉ export những gì cần thiết cho các feature khác sử dụng
- Không export internal implementation details
- Tổ chức exports theo nhóm: types, api, hooks, components

**Ví dụ:**
```typescript
// index.ts
// Types
export * from './types';

// API
export * from './api';

// Hooks
export * from './hooks';

// Components
export * from './components';
```

## Import Rules

### Trong cùng feature
- Sử dụng relative imports: `../hooks/use-products`
- Giúp code dễ di chuyển và refactor

### Từ feature khác
- Sử dụng absolute imports: `@/features/products`
- Import từ `index.ts` của feature: `import { useProducts } from '@/features/products'`

### Shared utilities
- Sử dụng `@/` prefix cho shared code: `@/components/ui`, `@/lib/utils`

## Ví dụ: Products Feature

```
features/products/
  ├── api/
  │   ├── product-api.ts
  │   ├── product-ai.api.ts
  │   ├── product-crawler.api.ts
  │   ├── product-review.api.ts
  │   ├── review-analysis.api.ts
  │   ├── trust-score.api.ts
  │   └── index.ts
  ├── components/
  │   ├── products-list.tsx
  │   ├── products-table.tsx
  │   ├── product-detail.tsx
  │   ├── crawler-interface.tsx
  │   ├── reviews-list.tsx
  │   ├── trust-score-card.tsx
  │   └── index.ts
  ├── hooks/
  │   ├── use-products.ts
  │   ├── use-product-ai.ts
  │   ├── use-product-crawler.ts
  │   ├── use-reviews.ts
  │   ├── use-review-analysis.ts
  │   ├── use-trust-score.ts
  │   └── index.ts
  ├── types/
  │   ├── product.types.ts
  │   ├── product-ai.types.ts
  │   ├── crawler.types.ts
  │   ├── review.types.ts
  │   ├── trust-score.types.ts
  │   └── index.ts
  └── index.ts
```

## Lợi ích

1. **Tính độc lập**: Mỗi feature tự chứa tất cả code liên quan
2. **Dễ bảo trì**: Tìm và sửa code nhanh chóng
3. **Dễ mở rộng**: Thêm feature mới không ảnh hưởng feature cũ
4. **Dễ test**: Test từng feature độc lập
5. **Dễ tái sử dụng**: Export rõ ràng những gì cần thiết
6. **Scalable**: Phù hợp với dự án lớn, nhiều developers

## Best Practices

1. **Đặt tên rõ ràng**: File và folder names phải mô tả đúng nội dung
2. **Single Responsibility**: Mỗi file chỉ làm một việc
3. **Export có chọn lọc**: Chỉ export public API, không export internal
4. **Consistent naming**: Follow naming conventions trong toàn bộ dự án
5. **Documentation**: Thêm JSDoc cho public APIs
6. **Type safety**: Sử dụng TypeScript đầy đủ, tránh `any`

## Code Quality Checks (Bắt buộc trước khi commit)

Sau khi hoàn thiện code, **phải chạy các lệnh sau để đảm bảo chất lượng code**:

### 1. ESLint Check
```bash
# Kiểm tra linting issues
pnpm eslint .

# Tự động fix các linting issues
pnpm eslint . --fix
```

**Mục đích**: Phát hiện và sửa các lỗi code style, unused variables, best practices violations

### 2. Format Check (Prettier)
```bash
# Kiểm tra formatting
pnpm format:check

# Tự động fix formatting
pnpm format
```

**Mục đích**: Đảm bảo code được format đúng theo Prettier config, nhất quán trong cả project

### 3. Type Check
```bash
# Kiểm tra TypeScript errors
pnpm build
```

**Mục đích**: Đảm bảo không có TypeScript errors trước khi commit

### ✅ Quy trình trước commit

Chạy tuần tự:
```bash
# 1. Fix linting issues
pnpm eslint . --fix

# 2. Fix formatting issues
pnpm format

# 3. Check type safety
pnpm build

# 4. Verify format check passes
pnpm format:check
```

Hoặc chạy tất cả cùng lúc (nếu có script trong package.json):
```bash
# Chạy tất cả checks
pnpm ci
```

### ⚠️ Lưu ý quan trọng

- **Không commit code** nếu `pnpm format:check` báo lỗi
- **Không commit code** nếu `pnpm build` có TypeScript errors
- **ESLint warnings** không là blocker nhưng nên fix để code sạch
- Nếu formatter/linter auto-fix không thành công, sửa manual và commit

## Data Sync Pattern (Derived State)

### Problem: Out-of-sync State
Khi dùng snapshot state cho selected items, data có thể out-of-sync sau khi refetch:
```typescript
// ❌ Anti-pattern - snapshot state
const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null)
// selectedTeam không update khi teams array refetch
```

### Solution: Derived State
Dùng ID state thay vì snapshot, compute selected object từ array:
```typescript
// ✅ Best practice - derived state
const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
const selectedTeam = selectedTeamId 
  ? teams.find(t => t.id === selectedTeamId) ?? null 
  : null
```

### Lợi ích
- **Auto-sync**: Khi `teams` array refetch → `selectedTeam` tự động update
- **Single source of truth**: Chỉ có 1 array, không duplicate data
- **No callbacks**: Không cần manual refetch callbacks
- **Less bugs**: Loại bỏ out-of-sync issues

### Data Flow Example

```typescript
// 1. Page component
const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
const { data: teams = [] } = useTeams(0, 100)

// Derived state - luôn sync với teams array
const selectedTeam = selectedTeamId 
  ? teams.find(t => t.id === selectedTeamId) ?? null 
  : null

// 2. Click detail → chỉ set ID
const handleShowDetail = (team: ITeam) => {
  setSelectedTeamId(team.id)  // ← Chỉ lưu ID
  setShowDetailDialog(true)
}

// 3. Edit member success
// - Hook invalidates query
// - Teams array refetch
// - selectedTeam auto-update (derived state recalculate)
// - Detail dialog auto-render với data mới
```

### Code Structure
```typescript
// ✅ Good
const [selectedId, setSelectedId] = useState<string | null>(null)
const selected = items.find(i => i.id === selectedId) ?? null
// Use `selected` in render - always fresh data

// ❌ Bad
const [selected, setSelected] = useState<Item | null>(null)
// selected is stale after refetch
```

### Khi nào dùng
- Khi component hiển thị thông tin từ list
- Khi có thể có refresh/refetch data
- Khi muốn auto-sync mà không cần callbacks
- Khi component open/close và data có thể thay đổi

## Query Management Pattern

**Xem chi tiết:** [QUERY_MANAGEMENT_PATTERN.md](QUERY_MANAGEMENT_PATTERN.md)

Đây là base practice chuẩn cho việc fetch, cache, và sync data. Pattern này đảm bảo:
- ✅ Chỉ refetch những query cần thiết (không full page reload)
- ✅ Data luôn sync qua derived state pattern
- ✅ Scoped invalidation (tránh invalidate toàn bộ)
- ✅ Component-level queries (component nào query data nó cần)

### Quick Summary

**Query Key Structure (Hierarchical):**
```typescript
QUERY_KEYS = {
  teams: {
    all: ['teams'],
    lists: () => ['teams', 'list'],
    list: (skip, limit) => ['teams', 'list', skip, limit],
    details: () => ['teams', 'detail'],
    detail: (id) => ['teams', 'detail', id],
  },
}
```

**Scoped Invalidation:**
```typescript
onSuccess: (data, variables) => {
  // ✅ Invalidate chỉ affected queries
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.teams.members(variables.teamId),
  })
}
```

**CRUD Operation & State Type:**
| CRUD | State | Why |
|------|-------|-----|
| **Create** | ❌ Derived, ✅ Snapshot | Form input tạm |
| **Read** | ✅ Derived | Luôn fresh |
| **Update** | ✅ Derived + ✅ Snapshot | Display + form |
| **Delete** | ✅ Derived | Auto cleanup |

Tham khảo [QUERY_MANAGEMENT_PATTERN.md](QUERY_MANAGEMENT_PATTERN.md) để xem đầy đủ: query key setup, invalidation mapping, component pattern, cache strategy, real-world examples, migration guide.
