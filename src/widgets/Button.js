import React from "react";
import classes from "./Button.css";

const Button = ({ children, ...props }) => {
  return (
    <button {...props} className={classes.Btn}>
      {children}
    </button>
  );
};

export default Button;
