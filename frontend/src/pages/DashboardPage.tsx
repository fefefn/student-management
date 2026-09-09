import { BookOpen, GraduationCap, Plus, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { RecentStudents } from "../components/dashboard/RecentStudents";
import { StatCard } from "../components/dashboard/StatCard";
import { StatusBreakdown } from "../components/dashboard/StatusBreakdown";
import { buttonClasses } from "../components/ui/Button";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { dashboardService } from "../services/dashboard.service";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading, error, refetch } = useApi(() => dashboardService.getStats(), []);

  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.name.split(" ")[0] ?? "there"}`}
        description="Here is what is happening across your students and courses."
        actions={
          <>
            <Link to="/courses" className={buttonClasses("secondary")}>
              <BookOpen className="size-4" />
              Manage courses
            </Link>
            <Link to="/students/new" className={buttonClasses("primary")}>
              <Plus className="size-4" />
              Add student
            </Link>
          </>
        }
      />

      {isLoading && <LoadingState label="Loading dashboard…" />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {stats && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total students" value={stats.totalStudents} icon={Users} to="/students" />
            <StatCard label="Active students" value={stats.activeStudents} icon={UserCheck} to="/students?status=active" accent="emerald" />
            <StatCard label="Graduated" value={stats.statusBreakdown.graduated} icon={GraduationCap} to="/students?status=graduated" accent="amber" />
            <StatCard label="Total courses" value={stats.totalCourses} icon={BookOpen} to="/courses" accent="slate" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentStudents students={stats.recentStudents} />
            </div>
            <StatusBreakdown breakdown={stats.statusBreakdown} total={stats.totalStudents} />
          </div>
        </div>
      )}
    </div>
  );
}
