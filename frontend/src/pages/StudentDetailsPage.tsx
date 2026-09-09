import { Calendar, Clock, Mail, MapPin, Pencil, Phone, Trash2, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, buttonClasses } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useApi } from "../hooks/useApi";
import { studentService } from "../services/student.service";
import { getErrorMessage } from "../utils/errors";
import { calculateAge, capitalize, formatCurrency, formatDate, getInitials } from "../utils/formatters";

function DetailRow({ icon: Icon, label, value }: { icon?: typeof Mail; label: string; value: ReactNode }) {
  return (
    <div className="flex gap-3 py-3">
      {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-muted" />}
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="mt-0.5 break-words text-sm font-medium text-ink">{value}</dd>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <dl className="mt-2 divide-y divide-line">{children}</dl>
    </Card>
  );
}

export function StudentDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading, error, refetch } = useApi(() => studentService.getById(id), [id]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await studentService.remove(id);
      toast.success("Student deleted");
      navigate("/students", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  if (isLoading) return <LoadingState label="Loading student…" />;
  if (error || !student) {
    return (
      <div>
        <PageHeader title="Student" backTo={{ to: "/students", label: "Back to students" }} />
        <Card>
          <ErrorState message={error ?? "Student not found"} onRetry={refetch} />
        </Card>
      </div>
    );
  }

  const age = calculateAge(student.dateOfBirth);
  const course = student.course;

  return (
    <div>
      <PageHeader
        title="Student profile"
        backTo={{ to: "/students", label: "Back to students" }}
        actions={
          <>
            <Link to={`/students/${student._id}/edit`} className={buttonClasses("secondary")}>
              <Pencil className="size-4" />
              Edit profile
            </Link>
            <Button variant="danger" onClick={() => setIsConfirmOpen(true)} leftIcon={<Trash2 className="size-4" />}>
              Delete
            </Button>
          </>
        }
      />

      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-xl font-bold text-brand-700">
          {getInitials(student.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-ink">{student.name}</h2>
            <StatusBadge status={student.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {student.studentId} · {course?.name ?? "No course assigned"}
          </p>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section title="Student information">
          <DetailRow icon={Mail} label="Email" value={student.email} />
          <DetailRow icon={Phone} label="Phone" value={student.phone} />
          <DetailRow icon={User} label="Gender" value={capitalize(student.gender)} />
          <DetailRow icon={Calendar} label="Date of birth" value={`${formatDate(student.dateOfBirth)}${age !== null ? ` (${age} years)` : ""}`} />
          <DetailRow icon={MapPin} label="Address" value={student.address} />
        </Section>

        <Section title="Course information">
          {course ? (
            <>
              <DetailRow label="Course" value={course.name} />
              <DetailRow icon={Clock} label="Duration" value={course.duration ?? "—"} />
              <DetailRow label="Fees" value={course.fees !== undefined ? formatCurrency(course.fees) : "—"} />
              <DetailRow label="About the course" value={course.description ?? "—"} />
            </>
          ) : (
            <DetailRow label="Course" value="Not assigned" />
          )}
        </Section>

        <Section title="Enrollment details">
          <DetailRow label="Student ID" value={student.studentId} />
          <DetailRow icon={Calendar} label="Enrollment date" value={formatDate(student.enrollmentDate)} />
          <DetailRow label="Status" value={<StatusBadge status={student.status} />} />
          <DetailRow label="Record created" value={formatDate(student.createdAt)} />
          <DetailRow label="Last updated" value={formatDate(student.updatedAt)} />
        </Section>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete student"
        message={`This will permanently remove ${student.name} (${student.studentId}) and their enrollment details. This cannot be undone.`}
        confirmLabel="Delete student"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
