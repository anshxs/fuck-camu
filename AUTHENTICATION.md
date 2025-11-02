# Authentication Flow

## How It Works

The MyCamu API uses **session-based authentication** with cookies. Here's how we handle it:

### 1. Login Flow
```
Browser → /api/proxy?endpoint=/login/validate → MyCamu Server
                                                      ↓
                                         Sets session cookies
                                                      ↓
Browser ← x-session-cookie header ← Proxy extracts cookies
```

**Steps:**
1. User submits email/password to login page
2. Request goes to `/api/proxy?endpoint=/login/validate`
3. Proxy forwards request to MyCamu server
4. MyCamu responds with session cookies in `Set-Cookie` headers
5. Proxy extracts these cookies and returns them in custom `x-session-cookie` header
6. Client stores cookie in localStorage

### 2. Authenticated Requests
```
Browser sends x-session-cookie header
        ↓
/api/proxy receives x-session-cookie
        ↓
Converts to Cookie header for MyCamu
        ↓
MyCamu authenticates request
```

**Steps:**
1. Client reads session cookie from localStorage
2. Adds it as `x-session-cookie` header to all API requests
3. Proxy receives request and converts `x-session-cookie` → `Cookie` header
4. Forwards request to MyCamu with authentication cookie
5. MyCamu validates session and returns data

## Why This Approach?

- **CORS Bypass**: Browser can't send cookies cross-origin, so we proxy through Next.js
- **Cookie Persistence**: Storing in localStorage allows cookies to persist across page reloads
- **Security**: Session cookies are only stored client-side, never exposed to other domains

## Key Files

- **`/app/api/proxy/route.ts`**: Proxy that handles cookie forwarding
- **`/lib/api.ts`**: 
  - `ApiService`: Adds `x-session-cookie` header to all requests
  - `StorageService`: Saves/retrieves session cookie from localStorage
- **`/app/login/page.tsx`**: Extracts and stores session cookie after login

## Testing

After login, check:
```javascript
// In browser console
localStorage.getItem('sessionCookie')
// Should show: "cookie_name=value; another_cookie=value"
```

## Error Handling

If you get `401 Unauthorized - API is not open`:
1. Check if session cookie exists: `StorageService.getSessionCookie()`
2. Verify cookie is being sent: Check Network tab → Request Headers → `x-session-cookie`
3. Try logging in again to get a fresh session cookie
