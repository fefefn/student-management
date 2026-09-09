import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage, getFieldErrors } from "../utils/errors";
import { validateRegister, type FormErrors } from "../utils/validation";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState<RegisterFormValues>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors<RegisterFormValues>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateRegister(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError(null);
    try {
      await register({ name: values.name.trim(), email: values.email.trim(), password: values.password });
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
      setErrors((current) => ({ ...current, ...getFieldErrors(error) }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Create an account</h1>
      <p className="mt-1 text-sm text-muted">Set up an admin login to start managing students.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {serverError && <Alert message={serverError} />}
        <Input label="Full name" name="name" autoComplete="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="Priya Verma" />
        <Input label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
        <Input label="Password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={handleChange} error={errors.password} hint="At least 6 characters" />
        <Input label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
