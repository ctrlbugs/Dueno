import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { CUSTOMER_AVATAR_STACK } from "../../../../../data/siteAvatars";

type CustomerAvatarStackProps = {
  className?: string;
};

const CustomerAvatarStack = ({ className = "" }: CustomerAvatarStackProps) => (
  <div className={`avatar-list-stacked ${className}`.trim()}>
    {CUSTOMER_AVATAR_STACK.map((avatarSrc, index) => (
      <span
        key={avatarSrc}
        className="avatar avatar-md rounded-circle border-0 overflow-hidden"
      >
        <ImageWithBasePath
          src={avatarSrc}
          className="img-fluid rounded-circle customer-avatar-img"
          alt={`Dueno customer ${index + 1}`}
        />
      </span>
    ))}
  </div>
);

export default CustomerAvatarStack;
