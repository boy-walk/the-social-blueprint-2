import React, { useEffect, useRef } from "react";

export const NewsletterBanner = () => {
  const formId = "68bced8dbed9ca618cdd69c2";
  const ref = useRef(null);

  useEffect(() => {
    if (!window.fd) return; // rely on global loader in header.php
    if (!ref.current || ref.current.dataset.fdMounted) return;
    const id = `fd-form-${formId}`;
    ref.current.id = id;
    window.fd("form", { formId, containerEl: `#${id}` });
    ref.current.dataset.fdMounted = "1";
  }, []);

  return (
    <section className="bg-schemesPrimaryContainer text-schemesOnPrimaryContainer py-12 px-4 sm:px-8 lg:px-16 text-center rounded-3xl w-full">
      <div className="mx-auto">
        <div ref={ref} />
      </div>
    </section>
  );
};
