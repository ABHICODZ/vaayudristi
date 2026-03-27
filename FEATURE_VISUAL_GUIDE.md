# User Profile Feature - Visual Guide

## 🎯 What You'll See

### 1. Profile Avatar (Before)
```
┌─────────────────────────────────────────┐
│  [Logo] ATMOSPHERIC COMMAND             │
│                                         │
│                    [U] Citizen Auth  ←  │ Not clickable
└─────────────────────────────────────────┘
```

### 2. Profile Avatar (After)
```
┌─────────────────────────────────────────┐
│  [Logo] ATMOSPHERIC COMMAND             │
│                                         │
│                    [U] Citizen Auth  ←  │ ✨ Now clickable!
│                        ↑                │    Hover effect
│                    Click here!          │    Opens modal
└─────────────────────────────────────────┘
```

---

## 📱 Profile Modal Layout

```
╔═══════════════════════════════════════════════════════════╗
║  [U]  User Profile                              [X]       ║
║       user@example.com                                    ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ✅ Profile updated successfully!                        ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ FULL NAME                                           │ ║
║  │ [John Doe                                    ]      │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ AGE                                                 │ ║
║  │ [30                                          ]      │ ║
║  │ Used for personalized air quality recommendations   │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ HOME WARD                                           │ ║
║  │ [Punjabi Bagh                            ▼]        │ ║
║  │ Your primary residential area in Delhi              │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ RESPIRATORY HEALTH CONDITION                        │ ║
║  │ [Asthma                                  ▼]        │ ║
║  │ Helps provide personalized health alerts            │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ ACCOUNT ROLE                                        │ ║
║  │ CITIZEN                              Read-only      │ ║
║  │ Contact administrator to change your role           │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │         💾 SAVE CHANGES                             │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ─────────────────────────────────────────────────────── ║
║                                                           ║
║  🔒 Change Password                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🔐 Password Change Section (Expanded)

```
╔═══════════════════════════════════════════════════════════╗
║  🔒 Cancel Password Change                               ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ NEW PASSWORD                                        │ ║
║  │ [••••••••                                    ]      │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ CONFIRM PASSWORD                                    │ ║
║  │ [••••••••                                    ]      │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │         🔓 UPDATE PASSWORD                          │ ║
║  └─────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🎨 Design Features

### Colors
- **Primary:** Cyan (#22d3ee) - Buttons, highlights
- **Secondary:** Blue (#3b82f6) - Gradients
- **Success:** Emerald (#10b981) - Success messages
- **Error:** Rose (#f43f5e) - Error messages
- **Background:** Slate-900 (#0f172a) - Modal background
- **Border:** Slate-700 (#334155) - Input borders

### Animations
- **Modal Entry:** Scale up + fade in (0.3s)
- **Modal Exit:** Scale down + fade out (0.3s)
- **Success Message:** Slide down from top
- **Button Hover:** Glow effect + scale 1.05
- **Input Focus:** Border color change to cyan

### Typography
- **Headers:** Bold, uppercase, tracking-wide
- **Labels:** Small, uppercase, slate-400
- **Input Text:** White, medium weight
- **Help Text:** Extra small, slate-500

---

## 📊 User Flow Diagram

```
┌─────────────┐
│   User      │
│  Dashboard  │
└──────┬──────┘
       │
       │ Click Avatar
       ▼
┌─────────────┐
│   Profile   │
│   Modal     │
│   Opens     │
└──────┬──────┘
       │
       │ Edit Fields
       ▼
┌─────────────┐
│   Update    │
│   Profile   │
└──────┬──────┘
       │
       │ Click Save
       ▼
┌─────────────┐
│  API Call   │
│  PUT /user/ │
│   profile   │
└──────┬──────┘
       │
       │ Success
       ▼
┌─────────────┐
│   Success   │
│   Message   │
└──────┬──────┘
       │
       │ Auto-close (1.5s)
       ▼
┌─────────────┐
│  Dashboard  │
│  (Updated)  │
└─────────────┘
```

---

## 🔄 State Management

### Component States
```typescript
// Form Data
{
  full_name: string,
  age: number,
  home_ward: string,
  health_condition: string,
  has_asthma: boolean
}

// UI States
{
  loading: boolean,
  error: string | null,
  success: boolean,
  showPasswordChange: boolean
}

// Password Data
{
  newPassword: string,
  confirmPassword: string
}
```

---

## 🎯 Interactive Elements

### Clickable Areas
1. **Profile Avatar** → Opens modal
2. **Close Button (X)** → Closes modal
3. **Save Changes Button** → Submits form
4. **Change Password Link** → Expands password section
5. **Update Password Button** → Updates password
6. **Modal Background** → Closes modal (optional)

### Hover Effects
1. **Profile Avatar** → Border glow (cyan)
2. **Buttons** → Shadow glow + scale
3. **Inputs** → Border color change
4. **Close Button** → Background opacity

---

## 📱 Responsive Design

### Desktop (> 768px)
- Modal width: 600px (max-w-2xl)
- Full form layout
- All fields visible

### Tablet (768px - 1024px)
- Modal width: 90% viewport
- Adjusted padding
- Stacked layout

### Mobile (< 768px)
- Modal width: 95% viewport
- Reduced padding
- Compact form fields
- Touch-friendly buttons

---

## ✨ Special Features

### 1. Auto-fill from Profile
- Loads existing user data
- Pre-populates all fields
- Shows current values

### 2. Real-time Validation
- Age: 1-120 range
- Password: Min 6 characters
- Required fields checked
- Instant error feedback

### 3. Smart Health Tracking
- Health condition → has_asthma flag
- Automatic conversion
- Used for AQI alerts

### 4. Success Feedback
- Green success banner
- Check icon animation
- Auto-dismiss after 1.5s
- Modal auto-closes

### 5. Error Handling
- Red error banner
- Error icon
- Clear error messages
- Stays visible until dismissed

---

## 🔧 Technical Implementation

### Frontend Stack
```
UserProfileModal.tsx
├── React Hooks (useState, useEffect)
├── Framer Motion (animations)
├── Tailwind CSS (styling)
└── Supabase Client (password)
```

### Backend Stack
```
users.py
├── FastAPI (endpoints)
├── Pydantic (validation)
├── httpx (HTTP client)
└── Supabase REST API
```

### Data Flow
```
User Input
    ↓
Form State
    ↓
API Request (PUT /user/profile)
    ↓
Backend Validation
    ↓
Database Update (Supabase)
    ↓
Response
    ↓
UI Update
    ↓
Success Message
```

---

## 🎬 Animation Timeline

```
0.0s  │ Modal appears (opacity: 0 → 1, scale: 0.9 → 1)
      │
0.3s  │ Modal fully visible
      │
      │ [User edits form]
      │
      │ Click "Save Changes"
      │
0.0s  │ Loading spinner appears
      │
0.1s  │ API call sent
      │
0.2s  │ Response received
      │
0.3s  │ Success message slides in
      │
1.8s  │ Modal starts closing
      │
2.1s  │ Modal fully closed
```

---

## 📋 Field Specifications

### Full Name
- Type: Text input
- Max length: 255 characters
- Optional: Yes
- Validation: None (free text)

### Age
- Type: Number input
- Range: 1-120
- Optional: No
- Validation: Integer, within range

### Home Ward
- Type: Dropdown select
- Options: 70+ Delhi wards
- Optional: No
- Default: Punjabi Bagh

### Health Condition
- Type: Dropdown select
- Options: 7 conditions
- Optional: No
- Default: No respiratory conditions

### Role
- Type: Display only
- Editable: No
- Values: citizen, admin
- Note: Admin-only change

---

## 🎨 Color Palette

```
Primary Colors:
├── Cyan-400:  #22d3ee  (Highlights)
├── Cyan-500:  #06b6d4  (Borders)
├── Cyan-600:  #0891b2  (Buttons)
└── Blue-600:  #2563eb  (Gradients)

Background Colors:
├── Slate-900: #0f172a  (Modal)
├── Slate-800: #1e293b  (Inputs)
└── Slate-950: #020617  (Overlay)

Status Colors:
├── Emerald-400: #34d399  (Success)
├── Rose-400:    #fb7185  (Error)
└── Amber-400:   #fbbf24  (Warning)

Text Colors:
├── White:       #ffffff  (Primary)
├── Slate-200:   #e2e8f0  (Secondary)
├── Slate-400:   #94a3b8  (Labels)
└── Slate-500:   #64748b  (Help text)
```

---

**Created:** 2026-03-25  
**Branch:** feature/user-profile-management  
**Status:** Complete
