import type { ButtonHTMLAttributes } from "react";

import { theme } from "@/theme/theme";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

export default function Button({
  children,
  fullWidth = false,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        width: fullWidth ? "100%" : undefined,
        height: 52,

        border: "none",

        borderRadius: theme.radius.md,

        background: theme.colors.primary,

        color: theme.colors.text,

        fontWeight: 700,

        fontSize: 15,

        cursor: "pointer",

        transition: "all .2s ease",

        boxShadow: theme.shadow.card,

        ...style,
      }}
    >
      {children}
    </button>
  );
}