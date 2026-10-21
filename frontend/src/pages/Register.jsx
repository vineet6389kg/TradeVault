import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import PasswordInput from "../components/ui/PasswordInput";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const Register = () => {
  const { user, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // already logged in with a real account, so skip this page (the demo user can still register)
  if (user && !user.isDemo) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (values) => {
    try {
      await registerUser(values.name, values.email, values.password);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start journaling your trades today."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-fg">Name</label>
          <input
            type="text"
            placeholder="Aarav Kumar"
            className={inputClass}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-loss">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-fg">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-loss">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-fg">Password</label>
          <PasswordInput
            placeholder="At least 6 characters"
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-loss">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-fg transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;