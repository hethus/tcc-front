import React from "react";
import { InputHTMLAttributes } from "react";
import styles from "./styles.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  type?: string;
}

export function Input({ title, type, ...rest }: InputProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}:</div>
      <input className={styles.input} type={type} {...rest} />
    </div>
  );
}
