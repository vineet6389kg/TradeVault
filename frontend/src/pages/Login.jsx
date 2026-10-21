import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import PasswordInput from "../components/ui/PasswordInput";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // already logged in with a real account, so skip this page (the demo user can still log in)
  if (user && !user.isDemo) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password, values.rememberMe);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue to your journal."
      footer={
        <>
          New to TradeVault?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            placeholder="Your password"
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-loss">{errors.password.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            {...register("rememberMe")}
          />
          Remember me for 30 days
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-fg transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;