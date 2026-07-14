import type { ReactNode } from "react";

import { theme } from "@/theme/theme";

interface CardProps {
  children: ReactNode;
}

export default function Card({
  children,
}: CardProps) {
  return (
    <div
      style={{
        background: theme.colors.surface,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: theme.radius.lg,

        padding: theme.spacing.lg,

        boxShadow: theme.shadow.card,
      }}
    >
      {children}
    </div>
  );
}