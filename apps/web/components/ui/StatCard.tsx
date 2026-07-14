import { theme } from "@/theme/theme";

interface StatCardProps {
  label: string;
  value: string | number;
}

export default function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div
      style={{
        background: theme.colors.surfaceLight,

        borderRadius: theme.radius.md,

        padding: theme.spacing.md,
      }}
    >
      <div
        style={{
          color: theme.colors.textMuted,

          fontSize: 12,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 8,

          fontSize: 24,

          fontWeight: 800,

          color: theme.colors.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}