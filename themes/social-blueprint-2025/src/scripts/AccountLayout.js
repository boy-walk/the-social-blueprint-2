import { AccountSidebar } from "./AccountSidebar";

export function AccountLayout({ children, active, links }) {
  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
        <div className="mx-auto lg:max-w-[1600px] px-0 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:gap-16">
            <AccountSidebar active={active} links={links} />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
