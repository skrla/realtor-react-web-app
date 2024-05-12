import React from "react";

type CreateListingLabelPropsType = {
  text: string;
};

export default function CreateListingLabel({
  text,
}: CreateListingLabelPropsType) {
  return <p className="text-lg mt-6 font-semibold">{text}</p>;
}
