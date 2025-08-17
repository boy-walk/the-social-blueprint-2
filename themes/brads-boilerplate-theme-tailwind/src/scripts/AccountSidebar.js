// components/account/AccountSidebar.jsx
import { SmileyStickerIcon, LockKeyIcon, SignOutIcon } from "@phosphor-icons/react";
import { Button } from "./Button";

export function AccountSidebar({ active = "profile", links }) {
  const items = [
    { key: "profile", label: "Profile", href: links.profileHref, Icon: SmileyStickerIcon },
    { key: "password", label: "Change Password", href: links.passwordHref, Icon: LockKeyIcon },
  ];

  const IconBadge = ({ children }) => (
    <span className="inline-flex items-center justify-center rounded-full p-2">
      {children}
    </span>
  );

  return (
    <nav className="flex gap-3 overflow-x-auto lg:overflow-visible lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-16 p-1 lg:mb-0 mb-4 scrollbar-hidden">
      {items.map(({ key, label, href, Icon }) => {
        const isActive = active === key;
        return (
          <Button
            key={key}
            label={label}
            icon={
              <IconBadge>
                <Icon size={24} weight="bold" />
              </IconBadge>
            }
            size="xs"
            shape="pill"
            variant={isActive ? "tonal" : "text"}
            className="w-full justify-start shrink-0"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = href;
            }}
          />
        );
      })}

      {/* Logout */}
      <Button
        label="Log out"
        icon={
          <IconBadge>
            <SignOutIcon size={24} weight="bold" />
          </IconBadge>
        }
        size="xs"
        shape="pill"
        variant="text"
        className="w-full justify-start shrink-0"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = links.logoutHref;
        }}
      />
    </nav>
  );
}
