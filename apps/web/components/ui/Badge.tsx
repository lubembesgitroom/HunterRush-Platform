import type { ReactNode } from "react";

import { theme } from "@/theme/theme";

interface BadgeProps {
  children: ReactNode;
  color?: string;
}

export default function Badge({
  children,
  color = theme.colors.primary,
}: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        padding: "6px 14px",

        borderRadius: 999,

        background: color,

        color: "#fff",

        fontWeight: 700,

        fontSize: 12,
      }}
    >
      {children}
    </span>
  );
}