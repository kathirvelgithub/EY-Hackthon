# API Integration Layer - Complete ✅

Comprehensive API integration layer connecting Next.js frontend to backend services.

## Created Files

### 1. Environment Configuration
- **`.env.local`**: API URLs and mock data toggle

### 2. Core API Client
- **`lib/api-client.ts`**: Base HTTP client with error handling, timeouts, and response transformation

### 3. Service Layer (Facade Pattern)
- **`lib/services/telemetry-service.ts`**: Telemetry data fetching
- **`lib/services/maintenance-service.ts`**: Maintenance history and predicted issues
- **`lib/services/scheduler-service.ts`**: Appointment booking and slot management
- **`lib/services/ueba-service.ts`**: Security monitoring and UEBA events
- **`lib/services/ai-agents-service.ts`**: AI workflow orchestration
- **`lib/services/index.ts`**: Centralized service exports

### 4. React Hooks (Data Fetching)
- **`hooks/use-vehicle-data.ts`**: Telemetry, maintenance, DTC codes with auto-refresh
- **`hooks/use-ueba.ts`**: UEBA alerts and summary
- **`hooks/use-appointments.ts`**: Appointment booking state
- **`hooks/use-ai-agents.ts`**: AI workflow execution

## Architecture

```
Frontend Pages
     ↓
React Hooks (use-vehicle-data, use-ueba, etc.)
     ↓
Service Layer (telemetry-service, maintenance-service, etc.)
     ↓
API Client (api-client.ts)
     ↓
Backend APIs (localhost:5000, localhost:8000)
```

## Features

✅ **Automatic Fallback**: Uses mock data if APIs are unavailable
✅ **Error Handling**: Graceful degradation with console logging
✅ **Timeout Management**: Configurable request timeouts (15s default, 45s for AI)
✅ **Response Transformation**: Maps backend snake_case to frontend camelCase
✅ **TypeScript**: Full type safety with interfaces
✅ **Auto-refresh**: Optional polling for real-time updates

## Usage Example

```tsx
import { useTelemetry, useMaintenance } from '@/hooks/use-vehicle-data'

function VehicleDashboard({ vehicleId }: { vehicleId: string }) {
  const { data, loading, error } = useTelemetry(vehicleId, 5000) // refresh every 5s
  const { predictedIssues } = useMaintenance(vehicleId)

  if (loading) return <Spinner />
  if (error) return <Error message={error.message} />

  return (
    <div>
      <h1>Engine Temp: {data?.engineTemp}°C</h1>
      <IssuesList issues={predictedIssues} />
    </div>
  )
}
```

## Environment Variables

```bash
# Set in .env.local
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_AI_AGENTS_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_DATA=false  # Set to 'true' to use mock data
```

## Next Steps

1. Update page components to use new hooks
2. Test with live backend/agent servers
3. Add WebSocket support for real-time streaming
4. Implement proper authentication headers
5. Add request caching and optimistic updates
