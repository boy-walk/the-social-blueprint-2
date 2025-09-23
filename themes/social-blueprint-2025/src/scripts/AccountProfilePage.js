// pages/AccountEditProfilePage.jsx
import { AccountLayout } from "./AccountLayout";
import { AccountSettings } from "./AccountSettingsPage";
import { AccountChangePassword } from "./AccountChangePassword";

export function AccountEditProfilePage(props) {
  const { links, user } = props;
  return (
    <AccountLayout active="profile" links={links}>
      <AccountSettings user={user} />
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
