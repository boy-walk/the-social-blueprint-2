// pages/AccountEditProfilePage.jsx
import { AccountLayout } from "./AccountLayout";
import { AccountSettings } from "./AccountSettingsPage";
import { AccountChangePassword } from "./AccountChangePassword";

export function AccountEditProfilePage(props) {
  const { links } = props; // { profileHref, passwordHref, logoutHref }
  return (
    <AccountLayout active="profile" links={links}>
      <AccountSettings {...props} />
    </AccountLayout>
  );
}

export function AccountChangePasswordPage(props) {
  const { links } = props;
  return (
    <AccountLayout active="password" links={links}>
      <AccountChangePassword {...props} />
    </AccountLayout>
  );
}
