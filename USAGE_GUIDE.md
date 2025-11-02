# MIET Portal - Quick Start Guide

## 🚀 How to Run

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser** and navigate to:
```
http://localhost:3000
```

## 🔐 Login

You'll be automatically redirected to the login page.

### Test Credentials (from your example):
- **Email**: `2025d2r048@mietjammu.in`
- **Password**: `Vishwas@2008`

## 📱 Features After Login

Once logged in, you'll see:

### 1. **Student Profile**
- Full name and photo placeholder
- Email address
- Application and Admission numbers
- Course and semester details

### 2. **Attendance Overview**
- **Overall Attendance**: Total attendance percentage across all subjects
- **Current Month**: This month's attendance
- **Total Subjects**: Number of enrolled subjects

### 3. **Subject-wise Attendance**
Complete table showing:
- Subject name and code
- Classes present/absent
- Total classes
- Attendance percentage with color coding:
  - 🟢 Green: 75% or above (Safe)
  - 🟡 Yellow: 60-74% (Warning)
  - 🔴 Red: Below 60% (Critical)

### 4. **Academic Details**
- Department name and code
- Academic year
- Section
- Program type
- Current status

### 5. **Personal Information**
- Date of birth
- Gender
- Father's and Mother's names
- Contact number
- Address

## 🔄 Data Flow

1. **Login** → Calls `/login/validate` API
2. **Fetch Institute Data** → Calls `/api/institute/getInstDtls`
3. **Fetch Student Progress** → Calls `/api/studentprog/getStudProg`
4. **Fetch Attendance** → Calls `/api/Attendance/getDtaForStupage`
5. **Store in localStorage** → All data saved for offline access
6. **Redirect to Dashboard** → Display all information

## 💾 Local Storage

All data is stored in your browser's localStorage:
- Persists across page refreshes
- Cleared on logout
- Available offline after initial load

## 🚪 Logout

Click the **Logout** button in the top-right corner to:
- Clear all stored data
- Return to login page

## 🛠️ Development

### File Structure
```
app/
  ├── login/page.tsx       # Login page
  ├── dashboard/page.tsx   # Main dashboard
  └── page.tsx            # Root (redirects to login)
lib/
  └── api.ts              # API & Storage services
types/
  └── api.ts              # TypeScript types
components/
  └── loading.tsx         # Loading components
```

### Adding New Features

**To add a new API endpoint:**
1. Add types in `types/api.ts`
2. Add service method in `lib/api.ts`
3. Call from component

**To add a new page:**
1. Create folder in `app/`
2. Add `page.tsx` file
3. Import and use API services

## 🐛 Troubleshooting

### "Login failed" error
- Check internet connection
- Verify credentials are correct
- Check if MyCamu API is accessible

### Data not showing
- Check browser console for errors
- Verify localStorage has data
- Try logging out and logging in again

### API CORS errors
- MyCamu API must allow cross-origin requests
- May need to use a proxy in production

## 📦 Production Build

To create a production build:
```bash
npm run build
npm start
```

## 🔒 Security Notes

- Never commit credentials to version control
- localStorage is not encrypted
- Consider using httpOnly cookies for production
- Implement proper session management
- Add CSRF protection

## 📝 Notes

- This is a student portal demo
- All API responses are stored locally
- No backend authentication layer currently
- Credentials are sent directly to MyCamu API

## 🎨 Customization

### Colors
Edit Tailwind classes in components:
- Blue theme: `bg-blue-600`, `text-blue-600`
- Change to any Tailwind color

### Layout
All components use Tailwind CSS
- Responsive by default
- Mobile-friendly design

## 📞 Support

For issues or questions:
- Check browser console for errors
- Review API response structure
- Verify MyCamu API is accessible
