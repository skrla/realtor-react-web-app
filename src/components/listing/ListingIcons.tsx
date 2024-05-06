import React from "react";

type ListingIconsProps = {
  children: any;
};

export default function ListingIcons({ children }: ListingIconsProps) {
  return <li className="flex items-center whitespace-nowrap">{children}</li>;
}
