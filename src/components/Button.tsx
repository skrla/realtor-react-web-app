import React from "react";

type ButtonPropsType = {
  text?: string;
  className?: string;
  secondary?: boolean;
  onClick?: () => void;
  loading?: boolean;
  type: "submit" | "reset" | "button" | undefined;
};

function Button({
  text,
  className,
  secondary,
  onClick,
  loading,
  type = "button",
}: ButtonPropsType) {
  return (
    <button
    onClick={onClick}
      className={`w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 ${className}`}
      type={type}
    >
      {text}
    </button>
  );
}

export default Button;
