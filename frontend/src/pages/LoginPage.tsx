import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../types";
import { getErrorMessage } from "../utils/errors";
import { validateLogin, type FormErrors } from "../utils/validation";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  const [values, setValues] = useState<LoginCredentials>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors<LoginCredentials>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError(null);
    try {
      await login({ email: values.email.trim(), password: values.password });
      toast.success("Welcome back");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Log in</h1>
      <p className="mt-1 text-sm text-muted">Enter your details to access the admin panel.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {serverError && <Alert message={serverError} />}
        <Input label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
        <Input label="Password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={handleChange} error={errors.password} placeholder="••••••••" />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </p>
    </div>
  );
}
