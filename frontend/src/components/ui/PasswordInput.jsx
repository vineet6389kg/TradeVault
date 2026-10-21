import React, { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

// a password box with a show / hide button
// forwardRef lets React Hook Form's register() connect to the real <input>
const PasswordInput = forwardRef(({ className = "", ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    // the top margin sits on this wrapper, so the button stays centered on the input
    <div className="relative mt-1.5">
      <input
        ref={ref}
        {...props}
        type={visible ? "text" : "password"}
        className={`block w-full rounded-lg border border-border bg-white py-2.5 pl-3.5 pr-11 text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
      />

      {/* type="button" stops it from submitting the form */}
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted transition-colors hover:text-fg focus-visible:text-primary"
      >
        {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
  );
});

export default PasswordInput;