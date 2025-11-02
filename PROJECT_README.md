# MIET Student Portal

A Next.js-based student portal for Model Institute of Engineering & Technology (MIET) that integrates with MyCamu API.

## Features

- **Secure Login**: Authenticates students using MyCamu credentials
- **Student Dashboard**: Displays comprehensive student information
- **Attendance Tracking**: Shows overall and subject-wise attendance
- **Academic Details**: Course, semester, and program information
- **Personal Information**: Student profile and contact details
- **Data Persistence**: Uses localStorage for offline data access

## Project Structure

```
miet/
├── app/
│   ├── login/
│   │   └── page.tsx          # Login page with authentication
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard with student data
│   ├── page.tsx              # Root page (redirects to login)
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── api.ts                # API service and storage utilities
├── types/
│   └── api.ts                # TypeScript type definitions
└── package.json
```

## API Integration

The portal integrates with the following MyCamu APIs:

1. **Login Validation**: `POST /login/validate`
   - Authenticates user credentials
   - Returns login details and progression data

2. **Institute Details**: `POST /api/institute/getInstDtls`
   - Fetches institute information

3. **Student Progression**: `POST /api/studentprog/getStudProg`
   - Gets student academic progression data

4. **Attendance Data**: `POST /api/Attendance/getDtaForStupage`
   - Retrieves overall and subject-wise attendance

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Login

Use your MIET credentials:
- Email: your.email@mietjammu.in
- Password: Your MyCamu password

## Features Breakdown

### Login Page (`/login`)
- Email and password authentication
- Loading state during API calls
- Error handling and display
- Automatic data fetching after successful login
- Redirects to dashboard upon completion

### Dashboard Page (`/dashboard`)
- **Student Profile Card**: Name, email, application number, admission number
- **Attendance Overview**: 
  - Overall attendance percentage
  - Current month attendance
  - Total subjects count
- **Subject-wise Attendance Table**:
  - Subject name and code
  - Present/Absent/Total classes
  - Attendance percentage with color coding
- **Academic Details**: Department, course, semester, section
- **Personal Details**: DOB, gender, parents' info, contact details

### Data Storage
All API responses are stored in localStorage:
- `loginData`: Complete login response
- `instituteData`: Institute details
- `studentProgData`: Student progression information
- `attendanceData`: Attendance records
- `isAuthenticated`: Authentication flag

### Security
- Authentication check on dashboard
- Automatic redirect to login if not authenticated
- Logout functionality to clear all stored data

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **localStorage**: Client-side data persistence

## API Response Handling

All API responses follow this structure:
```typescript
{
  output: {
    data: { ... },
    errors: null | string
  }
}
```

Error handling is implemented at the service level with appropriate user feedback.

## Future Enhancements

Potential features to add:
- Time table view
- Assignment tracking
- Fee payment integration
- Profile editing
- Push notifications
- Mobile app version
- Offline mode with service workers

## Development

### Type Safety
All API responses have TypeScript interfaces defined in `types/api.ts`.

### API Service
The `ApiService` class in `lib/api.ts` handles all API communication.

### Storage Service
The `StorageService` class manages localStorage operations with type-safe getters and setters.

## License

This project is for educational purposes for MIET students.
