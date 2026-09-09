import { School } from "lucide-react";
import { Outlet } from "react-router-dom";

/** Two-panel layout for login and registration. */
export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[5fr_7fr]">
      <aside className="hidden flex-col justify-between bg-sidebar p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/10">
            <School className="size-6" />
          </div>
          <span className="text-lg font-bold">Student Management</span>
        </div>
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight">
            Every student, course and enrollment, kept in one tidy place.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Add students, assign them to courses, track their status and find anyone in seconds.
          </p>
        </div>
        <p className="text-sm text-white/50">Student Management System</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar text-white">
              <School className="size-6" />
            </div>
            <span className="text-lg font-bold text-ink">Student Management</span>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
