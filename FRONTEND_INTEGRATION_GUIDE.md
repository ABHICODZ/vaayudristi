# Frontend Integration Guide

## Quick Integration Steps

### 1. Add Debug Panel to App

**File**: `web-frontend/src/App.tsx`

```tsx
import { useState, useEffect } from 'react';
import { DebugPanel } from './components/DebugPanel';

function App() {
  const [debugOpen, setDebugOpen] = useState(false);

  // Toggle debug panel with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDebugOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {/* Your existing app content */}
      
      {/* Debug Panel */}
      <DebugPanel isOpen={debugOpen} onClose={() => setDebugOpen(false)} />
      
      {/* Debug Toggle Button (bottom-left) */}
      <button
        onClick={() => setDebugOpen(!debugOpen)}
        className="fixed bottom-4 left-4 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 z-50"
        title="Toggle Debug Panel (Ctrl+Shift+D)"
      >
        🐛
      </button>
    </>
  );
}
```

### 2. Replace Fetch Calls with API Client

**Before**:
```tsx
const response = await fetch(`${API_URL}/api/v1/admin/analytics/overview`, {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
```

**After**:
```tsx
import { apiClient } from '../lib/apiClient';

const result = await apiClient.get('/api/v1/admin/analytics/overview', {
  headers: { Authorization: `Bearer ${token}` }
});

if (result.error) {
  console.error('API Error:', result.error);
  // Show error to user
} else {
  const data = result.data;
  const metadata = result.metadata; // Contains sources, timestamp, query_time_ms
}
```

### 3. Add Data Source Indicators

**File**: `web-frontend/src/pages/AdvancedAdminDashboard.tsx`

```tsx
import { DataSourceIndicator } from '../components/DataSourceIndicator';

function AdvancedAdminDashboard() {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiClient.get('/api/v1/admin/analytics/overview');
      if (result.data) {
        setMetadata(result.metadata);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Show data sources at top of dashboard */}
      {metadata && (
        <DataSourceIndicator
          sources={metadata.sources.map(s => ({
            name: s,
            type: s.includes('waqi') ? 'waqi' : s.includes('ml') ? 'ml' : 'supabase',
            status: 'active'
          }))}
          lastUpdated={metadata.timestamp}
          queryTime={metadata.query_time_ms}
          className="mb-4"
        />
      )}
      
      {/* Rest of dashboard */}
    </div>
  );
}
```

### 4. Add Confidence Indicators to Map

**File**: `web-frontend/src/components/LeafletMap.tsx`

```tsx
import { ConfidenceIndicator } from './DataSourceIndicator';

// In your marker popup:
<Popup>
  <div>
    <h3>{ward.name}</h3>
    <p>AQI: {ward.aqi}</p>
    
    {/* Add confidence indicator */}
    <ConfidenceIndicator 
      confidence={ward.dominant_source.includes('WAQI') ? 'real' : 'interpolated'}
      className="mt-2"
    />
  </div>
</Popup>
```

### 5. Add Loading States with Metadata

```tsx
function DataComponent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await apiClient.get('/api/v1/dashboard/wards');
      
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
        setMetadata(result.metadata);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-spin">⏳</div>
        <span>Loading data from WAQI sensors and ML inference...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-800">Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {/* Show data source info */}
      {metadata && (
        <div className="text-xs text-gray-500 mb-2">
          Last updated: {new Date(metadata.timestamp).toLocaleString()}
          {metadata.ml_ready === false && (
            <span className="text-yellow-600 ml-2">
              ⚠ ML cache still loading, showing partial data
            </span>
          )}
        </div>
      )}
      
      {/* Your data display */}
      {data && <YourDataComponent data={data} />}
    </div>
  );
}
```

## Testing the Integration

### 1. Test Debug Panel
- Press `Ctrl+Shift+D` or click 🐛 button
- Make some API calls
- Verify logs appear in debug panel
- Check request/response details
- Test filters (all, request, response, error)

### 2. Test API Client
- Make API calls and verify retries on failure
- Check timeout handling (set timeout to 1ms to test)
- Verify error messages are user-friendly
- Check performance metrics in debug panel

### 3. Test Data Source Indicators
- Verify all data sources show correct status
- Check timestamp updates
- Verify query time displays correctly
- Test with different API endpoints

### 4. Test Error Handling
- Disconnect network and verify error messages
- Test with invalid API endpoints
- Verify retry logic works
- Check error visibility in debug panel

## Environment Variables

Make sure these are set in your `.env` file:

```env
VITE_API_URL=https://vayudrishti-backend-906923550075.us-central1.run.app
VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Deployment Checklist

- [ ] All fetch calls replaced with apiClient
- [ ] Debug panel integrated in App.tsx
- [ ] Data source indicators added to dashboards
- [ ] Confidence indicators added to map
- [ ] Loading states show data source info
- [ ] Error messages are user-friendly
- [ ] Environment variables configured
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in production build
- [ ] Debug panel works in production

## Quick Deploy Command

```bash
cd web-frontend
npm install
npm run build

# Deploy to Cloud Run
gcloud run deploy vayudrishti-frontend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --port 80 \
  --project gee-data-490807 \
  --set-env-vars "VITE_API_URL=https://vayudrishti-backend-906923550075.us-central1.run.app,VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY"
```

---

**Note**: The backend is already deployed with all improvements. Frontend integration is optional but recommended for production transparency and debugging.
