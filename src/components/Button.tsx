import React from "react";

type ButtonPropsType = {
  text?: string;
  className?: string;
  secondary?: boolean;
  onClick?: () => void;
  loading?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  children?: any;
};

function Button({
  text,
  className,
  secondary,
  onClick,
  loading,
  type = "button",
  children,
}: ButtonPropsType) {
  return (
    <button
      onClick={onClick}
      className={`transition duration-150 ease-in-out px-7 text-sm font-medium uppercase rounded shadow-md ${
        secondary
          ? "bg-white text-gray-700 border border-gray-300 my-6 py-2 hover:border-slate-600"
          : "w-full py-3 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:bg-blue-800"
      } ${className}`}
      type={type}
    >
      {children}
      {text}
    </button>
  );
}

export default Button;
