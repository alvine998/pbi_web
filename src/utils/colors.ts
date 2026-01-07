// Color mapping helper for custom colors
export const getColorStyle = (colorName: string): React.CSSProperties => {
  const colorMap: Record<string, string> = {
    "bg-primary": "var(--color-primary)",
    "bg-secondary": "var(--color-secondary)",
    "bg-success": "var(--color-success)",
    "bg-info": "var(--color-info)",
    "bg-danger": "var(--color-danger)",
    "bg-warning": "var(--color-warning)",
    "text-primary": "var(--color-primary)",
    "text-secondary": "var(--color-secondary)",
    "text-success": "var(--color-success)",
    "text-info": "var(--color-info)",
    "text-danger": "var(--color-danger)",
    "text-warning": "var(--color-warning)",
    "text-dark-gray": "var(--color-dark-gray)",
    "text-gray": "var(--color-gray-custom)",
  };

  if (colorName.startsWith("bg-")) {
    return { backgroundColor: colorMap[colorName] || colorName };
  } else if (colorName.startsWith("text-")) {
    return { color: colorMap[colorName] || colorName };
  }

  return {};
};
