import React from "react";
import { Props } from "./props.model";
import { icons } from "./icon-types";

export const Icon: React.FC<Props> = ({ name }) => {


  const IconSVG = icons[name];
  return <IconSVG style={{fill: "black"}} />;
};
