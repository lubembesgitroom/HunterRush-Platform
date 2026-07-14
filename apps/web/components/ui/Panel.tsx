import type { ReactNode } from "react";

import { theme } from "@/theme/theme";

interface PanelProps {
  title?: string;
  children: ReactNode;
}

export default function Panel({
  title,
  children,
}: PanelProps) {
  return (
    <div
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        overflow: "hidden",
        boxShadow: theme.shadow.card,
      }}
    >
      {title && (
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${theme.colors.border}`,
            color: theme.colors.text,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {title}
        </div>
      )}

      <div style={{ padding: 20 }}>
        {children}
      </div>
    </div>
  );
}