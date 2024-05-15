import React from "react";

type ButtonPropsType = {
  text?: string;
  id?: string;
  value?: string | number;
  className?: string;
  secondary?: boolean;
  onClick?: (e: any) => void;
  loading?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  children?: any;
};

function Button({
  text,
  id,
  value,
  className,
  secondary,
  onClick,
  loading,
  type = "button",
  children,
}: ButtonPropsType) {
  return (
    <button
      id={id}
      value={value}
      onClick={onClick}
      className={`transition duration-150 ease-in-out px-7 text-sm font-medium uppercase rounded shadow-md ${
        secondary
          ? "bg-white text-gray-700 border border-gray-300  py-2 hover:border-slate-600 hover:shadow-lg focus:shadow-lg active:shadow-lg"
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
