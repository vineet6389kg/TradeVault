import React from "react";

// temporary page content, we replace it page by page
const PagePlaceholder = ({ title, text }) => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-fg">
        {title}
      </h1>
      <p className="mt-1 text-muted">{text}</p>

      <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center text-muted">
        Coming soon
      </div>
    </div>
  );
};

export default PagePlaceholder;