import { Link } from "react-router-dom";

type InboxNotificationBellProps = {
  to: string;
  count: number;
  label?: string;
};

const InboxNotificationBell = ({
  to,
  count,
  label = "Messages",
}: InboxNotificationBellProps) => (
  <Link to={to} className="nav-link position-relative inbox-notification-bell">
    <i className="ri-notification-3-line fs-22" />
    <span className="visually-hidden">{label}</span>
    {count > 0 && (
      <span className="inbox-notification-badge">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </Link>
);

export default InboxNotificationBell;
