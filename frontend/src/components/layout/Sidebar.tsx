import { BookOpen, GraduationCap, LayoutDashboard, School, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: GraduationCap, end: false },
  { to: "/courses", label: "Courses", icon: BookOpen, end: false },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-ink/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-white transition-transform duration-200",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
              <School className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="whitespace-nowrap text-sm font-bold">Student Management</p>
              <p className="text-xs text-white/60">Admin panel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-sidebar-hover hover:text-white"
                )
              }
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-xs text-white/50">
          Manage students, courses and enrollments in one place.
        </div>
      </aside>
    </>
  );
}
