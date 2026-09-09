# Student Management System – Frontend

React admin dashboard built with **Vite, TypeScript, Tailwind CSS v4, React Router and Axios**.

## Setup

```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

## Scripts

| Command             | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                    |
| `npm run build`     | Type-check and build for production (`dist/`)|
| `npm run preview`   | Preview the production build locally         |
| `npm run typecheck` | Type-check only                              |

## Structure

```
src/
├── components/
│   ├── ui/          Button, Input, Select, Modal, ConfirmDialog, Pagination, states…
│   ├── layout/      Sidebar, Navbar
│   ├── students/    StudentForm, StudentTable, StudentFilters
│   ├── courses/     CourseForm, CourseCard
│   └── dashboard/   StatCard, RecentStudents, StatusBreakdown
├── pages/           Login, Register, Dashboard, Students, StudentForm, StudentDetails, Courses, NotFound
├── layouts/         DashboardLayout (sidebar shell), AuthLayout
├── context/         AuthContext (session state, login/register/logout)
├── hooks/           useAuth, useApi, useDebounce
├── services/        Axios instance + typed API calls per resource
├── types/           Shared TypeScript types
└── utils/           formatters, validation, error helpers, constants
```

See the root [README](../README.md) for the full project overview.
