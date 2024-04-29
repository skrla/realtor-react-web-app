import { IconType } from "react-icons";

type IconProps = {
  IconName: IconType;
  size?: number;
  className?: string;
  loading?: boolean;
  onClick?: () => void;
};

function Icon({ IconName, size, className, loading, onClick }: IconProps) {
  return (
    <IconName
      size={size}
      onClick={onClick}
      className={`text-xl cursor-pointer ${className}`}
    />
  );
}

export default Icon;
