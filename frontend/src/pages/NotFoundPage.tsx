import { Link } from "react-router-dom";
import { buttonClasses } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold tracking-tight text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">This page does not exist</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The link may be broken or the page may have moved. Head back to the dashboard to keep going.
      </p>
      <Link to="/" className={`${buttonClasses("primary")} mt-8`}>
        Go to dashboard
      </Link>
    </div>
  );
}
