import { Card } from "react-bootstrap";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  variant: string;
};

const StatCard = ({ title, value, change, icon, variant }: StatCardProps) => (
  <Card className={`widget-flat ${variant}`}>
    <Card.Body>
      <div className="float-end">
        <i className={`${icon} widget-icon`} />
      </div>
      <h6 className="text-uppercase mt-0 text-white">{title}</h6>
      <h2 className="my-2 text-white">{value}</h2>
      {change && (
        <p className="mb-0 text-white">
          <span className="badge bg-white bg-opacity-25">{change}</span>
        </p>
      )}
    </Card.Body>
  </Card>
);

export default StatCard;
