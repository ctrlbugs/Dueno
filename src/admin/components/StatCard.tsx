import { Card } from "react-bootstrap";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  variant: string;
};

const StatCard = ({ title, value, change, icon, variant }: StatCardProps) => (
  <Card className={`dueno-stat-card widget-flat ${variant}`}>
    <Card.Body>
      <i className={`dueno-stat-card__icon ${icon}`} aria-hidden="true" />
      <div className="dueno-stat-card__content">
        <h6 className="text-uppercase mt-0 text-white">{title}</h6>
        <h2 className="my-2 text-white">{value}</h2>
        {change ? (
          <p className="mb-0 text-white">
            <span className="badge bg-white bg-opacity-25">{change}</span>
          </p>
        ) : null}
      </div>
    </Card.Body>
  </Card>
);

export default StatCard;
