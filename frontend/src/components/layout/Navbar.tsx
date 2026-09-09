import { LogOut, Menu } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/formatters";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-ink lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
            {user ? getInitials(user.name) : "?"}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-ink">{user?.name}</p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
