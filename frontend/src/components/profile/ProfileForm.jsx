import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const ProfileForm = () => {
  const { user, updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ defaultValues: { name: user.name, email: user.email } });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.put("/users/profile", values);
      updateUser(data.user);
      reset({ name: data.user.name, email: data.user.email }); // form is clean again
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-white p-6"
    >
      <h2 className="text-lg font-bold text-fg">Your details</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-fg">Name</label>
          <input
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
            className={inputClass}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-loss">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        {/* disabled until you change something */}
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-fg hover:bg-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;