import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PasswordInput from "../ui/PasswordInput";

const PasswordForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await api.put("/users/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password updated");
      reset(); // clears all three boxes
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-white p-6"
    >
      <h2 className="text-lg font-bold text-fg">Change password</h2>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-fg">Current password</label>
          <PasswordInput
            autoComplete="current-password"
            {...register("currentPassword", {
              required: "Enter your current password",
            })}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-loss">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-fg">New password</label>
            <PasswordInput
              autoComplete="new-password"
              {...register("newPassword", {
                required: "Enter a new password",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-loss">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-fg">Confirm new password</label>
            <PasswordInput
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Confirm your new password",
                // compares with what was typed in the "new password" box
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-loss">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-fg hover:bg-primary-hover disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;