import { useAuth } from "../../../context/AuthContext";
import StaffMessagesDropdown from "../../../shared/components/StaffMessagesDropdown";

type HeaderStaffMessagesDropdownProps = {
  className?: string;
};

const HeaderStaffMessagesDropdown = ({
  className = "",
}: HeaderStaffMessagesDropdownProps) => {
  const { user } = useAuth();

  const isAgent = user?.role === "agent" && user.agentStatus === "approved";
  const isAdmin = user?.role === "admin";

  if (!user || (!isAgent && !isAdmin)) return null;

  return (
    <StaffMessagesDropdown
      variant="header"
      mode={isAdmin ? "admin" : "agent"}
      userId={user.id}
      className={`topbar-messages ${className}`.trim()}
    />
  );
};

export default HeaderStaffMessagesDropdown;
