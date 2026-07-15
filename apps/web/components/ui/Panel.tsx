import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

import { theme } from "@/theme/theme";

interface PanelProps
  extends HTMLAttributes<HTMLDivElement> {
  title?: string;

  children: ReactNode;

  contentStyle?: CSSProperties;
}

export default function Panel({
  title,
  children,

  style,
  className,

  contentStyle,

  ...props
}: PanelProps) {
  return (
    <div
      className={className}
      style={{
        background:
          theme.colors.surface,

        border: `1px solid ${theme.colors.border}`,

        borderRadius:
          theme.radius.lg,

        overflow: "hidden",

        boxShadow:
          theme.shadow.card,

        ...style,
      }}
      {...props}
    >
      {title && (
        <div
          style={{
            padding:
              "16px 20px",

            borderBottom: `1px solid ${theme.colors.border}`,

            color:
              theme.colors.text,

            fontWeight: 700,

            fontSize: 16,
          }}
        >
          {title}
        </div>
      )}

      <div
        style={{
          padding: 20,

          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}