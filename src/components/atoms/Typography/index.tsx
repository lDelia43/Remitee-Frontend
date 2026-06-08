import type { ReactNode } from "react";

type Variant = "h1" | "h2" | "h3" | "h4" | "body" | "body-sm" | "caption" | "label";

const variantStyles: Record<Variant, string> = {
  h1: "text-3xl font-bold tracking-tight",
  h2: "text-2xl font-semibold tracking-tight",
  h3: "text-xl font-semibold",
  h4: "text-lg font-medium",
  body: "text-base",
  "body-sm": "text-sm",
  caption: "text-xs text-[--muted]",
  label: "text-sm font-medium",
};

const variantElements: Record<Variant, keyof React.JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "span",
  label: "label",
};

interface TypographyProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  htmlFor?: string;
}

export const Typography = ({
  variant = "body",
  children,
  className = "",
  as,
  htmlFor,
}: TypographyProps) => {
  const Tag = (as || variantElements[variant]) as React.ElementType;
  const base = variantStyles[variant];
  return (
    <Tag className={`${base} ${className}`} htmlFor={htmlFor}>
      {children}
    </Tag>
  );
};
