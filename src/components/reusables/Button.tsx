import { FiArrowUpRight } from "react-icons/fi";
import { FC } from "react";

interface TButtonProps {
 arrow?: boolean;
 text: string;
 link: string;
 color?: string;
 bgColor?: string;
 hoverTextColor?: string;
 hoverBgColor?: string;
 ariaLabel?: string;
}

interface ButtonProps {
 onClick?: () => void;
 className?: string;
 children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export const MyFillButton: FC<TButtonProps> = ({
 arrow = true,
 text,
 link,
 color = "white",
 bgColor = "#E6292C",
 hoverTextColor = "white",
 hoverBgColor = "#E6292C",
 ariaLabel,
}) => {
  const isExternal =
    link.startsWith("http") ||
    link.startsWith("mailto:") ||
    link.startsWith("tel:");

  const buttonStyle = {
    color: color,
    backgroundColor: bgColor,
  };

 const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = hoverBgColor;
    e.currentTarget.style.color = hoverTextColor;
 };

 const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = bgColor;
    e.currentTarget.style.color = color;
 };

  const className =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold leading-none font-uber transition-colors duration-300 sm:py-4 sm:text-[16px]";

  return (
    <a
      href={link}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel || text}
      className={className}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
      {arrow && <FiArrowUpRight className="h-4 w-4" />}
    </a>
  );
};

export const MyOutlinedButton: FC<TButtonProps> = ({
 arrow = true,
 text,
 link,
 color = "#1A1A1A",
 bgColor = "transparent",
 hoverTextColor = "white",
 hoverBgColor = "#1A1A1A",
 ariaLabel,
}) => {
  const isExternal =
    link.startsWith("http") ||
    link.startsWith("mailto:") ||
    link.startsWith("tel:");

  const buttonStyle = {
    color: color,
    backgroundColor: bgColor,
    borderColor: color,
  };

 const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = hoverBgColor;
    e.currentTarget.style.color = hoverTextColor;
 };

 const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = bgColor;
    e.currentTarget.style.color = color;
 };

  const className =
    "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-[15px] font-semibold leading-none font-uber transition-colors duration-300 sm:py-4 sm:text-[16px]";

  return (
    <a
      href={link}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel || text}
      className={className}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
      {arrow && <FiArrowUpRight className="h-4 w-4" />}
    </a>
  );
};
