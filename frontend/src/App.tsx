import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import { AuthProvider } from "./context/AuthContext";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { CoursesPage } from "./pages/CoursesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegisterPage } from "./pages/RegisterPage";
import { StudentDetailsPage } from "./pages/StudentDetailsPage";
import { StudentFormPage } from "./pages/StudentFormPage";
import { StudentsPage } from "./pages/StudentsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public pages - redirect to the dashboard when already logged in */}
          <Route element={<PublicOnlyRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Protected pages - require a valid session */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/students/new" element={<StudentFormPage />} />
              <Route path="/students/:id" element={<StudentDetailsPage />} />
              <Route path="/students/:id/edit" element={<StudentFormPage />} />
              <Route path="/courses" element={<CoursesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: "inherit", fontSize: "14px", borderRadius: "10px" },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
