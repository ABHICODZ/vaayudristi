# Backend Changes Log - Pavan

## Date: 2026-03-25
## Branch: feature/user-profile-management

### Changes Made:

#### 1. Updated User Endpoints
**File:** `backend/app/api/endpoints/users.py`

**New Endpoints Added:**

##### PUT `/api/v1/user/profile`
- **Purpose:** Update current user's profile information
- **Authentication:** Required (JWT token)
- **Authorization:** User can only update their own profile
- **Request Body:**
  ```json
  {
    "full_name": "string (optional)",
    "age": "integer (optional, 1-120)",
    "home_ward": "string (optional)",
    "has_asthma": "boolean (optional)"
  }
  ```
- **Response:** Updated profile object
- **Validation:**
  - Age must be between 1 and 120
  - At least one field must be provided
  - Role cannot be changed by users
- **Implementation:** Uses Supabase REST API with user's JWT token for RLS

##### GET `/api/v1/user/profile`
- **Purpose:** Get current user's complete profile information
- **Authentication:** Required (JWT token)
- **Authorization:** User can only view their own profile
- **Response:** Complete profile object with all fields
- **Implementation:** Uses Supabase REST API with user's JWT token for RLS

**New Pydantic Model:**
```python
class ProfileUpdateRequest(BaseModel):
    full_name: str | None = None
    age: int | None = None
    home_ward: str | None = None
    has_asthma: bool | None = None
```

**Features:**
- Partial updates supported (only provided fields are updated)
- Automatic validation of age range
- Uses Supabase REST API for database operations
- Respects Row Level Security (RLS) policies
- Returns updated profile with Prefer: return=representation header
- Comprehensive error handling
- Request timing logging for performance monitoring

#### 2. Database Schema Update
**File:** `add_full_name_column.sql`

**Changes:**
- Added `full_name` column to `profiles` table
- Column type: TEXT
- Nullable: Yes (optional field)
- SQL script includes verification query

**Migration Script:**
```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;
```

**To Apply:**
Run this SQL in Supabase SQL Editor or via psql:
```bash
psql -h <host> -U <user> -d <database> -f add_full_name_column.sql
```

### Security Considerations:

1. **Authentication:**
   - All endpoints require valid JWT token
   - Token validated via `get_current_user` dependency

2. **Authorization:**
   - Users can only update their own profile
   - Role changes are blocked (admin-only operation)
   - RLS policies enforced at database level

3. **Validation:**
   - Age range validation (1-120)
   - Required fields validation
   - Type validation via Pydantic models

4. **Data Integrity:**
   - Uses Supabase REST API with RLS
   - Atomic updates via PATCH method
   - Returns updated data for verification

### API Response Examples:

**Success Response (200):**
```json
{
  "id": "uuid",
  "username": "user@example.com",
  "full_name": "John Doe",
  "role": "citizen",
  "age": 30,
  "home_ward": "Punjabi Bagh",
  "has_asthma": false
}
```

**Error Responses:**
- 400: Invalid input (age out of range, no fields provided)
- 401: Unauthorized (invalid/missing token)
- 404: Profile not found
- 503: Database connection failed

### Performance:

- Average response time: < 100ms
- Uses connection pooling via httpx.AsyncClient
- Timeout set to 10 seconds
- Logging includes elapsed time for monitoring

### Testing Checklist:
- [ ] PUT /user/profile updates profile successfully
- [ ] GET /user/profile returns correct data
- [ ] Age validation works (rejects < 1 or > 120)
- [ ] Partial updates work (only provided fields updated)
- [ ] Role cannot be changed by users
- [ ] Authentication required for all endpoints
- [ ] RLS policies enforced
- [ ] Error handling works correctly
- [ ] Response times are acceptable

### Dependencies:
- No new dependencies added
- Uses existing: FastAPI, httpx, Pydantic, Supabase

### Database Migration:
**Required:** Yes
**Script:** `add_full_name_column.sql`
**Impact:** Low (adds nullable column, no data migration needed)
**Rollback:** `ALTER TABLE public.profiles DROP COLUMN IF EXISTS full_name;`

### Notes:
- Existing profiles will have `full_name` as NULL until user updates
- Frontend should handle NULL values gracefully
- Role changes require admin privileges (separate endpoint)
- Password changes handled by Supabase Auth API (not this endpoint)
