import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

export const buttonStyles = cva(
  "flex items-center justify-center gap-3 rounded-lg font-medium transition focus:ring-3 disabled:pointer-events-none [&>svg]:text-current!",
  {
    variants: {
      variant: {
        primary: "",
        danger: "",
        success: "",
        ghost: ""
      },
      appearance: {
        fill: "",
        outline: ""
      },
      iconOnly: {
        true: "",
        false: ""
      },
      size: {
        xs: "text-xs [&>svg]:size-5",
        sm: "text-sm [&>svg]:size-5",
        md: "[&>svg]:size-6",
        lg: "[&>svg]:size-6"
      }
    },
    compoundVariants: [
      {
        variant: ["primary", "danger", "success"],
        appearance: "fill",
        className:
          "text-neutral disabled:bg-neutral-100 disabled:text-neutral-400"
      },
      {
        variant: ["primary", "danger", "success"],
        appearance: "outline",
        // Disabled styles
        className:
          "disabled:bg-neutral border disabled:border-neutral-100 disabled:text-neutral-400"
      },
      {
        variant: "primary",
        appearance: "fill",
        className:
          "focus:ring-primary-500/20 bg-primary-500 hover:bg-primary-600 text-neutral"
      },
      {
        variant: "primary",
        appearance: "outline",
        className:
          "border-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-500/20"
      },
      {
        variant: "danger",
        appearance: "fill",
        className:
          "bg-danger hover:bg-danger-hover focus:ring-danger/20 text-danger-foreground"
      },
      {
        variant: "danger",
        appearance: "outline",
        className:
          "border-danger-outline bg-danger-muted text-danger-muted-body hover:bg-danger-muted-hover focus:ring-danger/20"
      },
      {
        variant: "success",
        appearance: "fill",
        className:
          "bg-success hover:bg-success-hover focus:ring-success/20 text-success-foreground"
      },
      {
        variant: "success",
        appearance: "outline",
        className:
          "border-success-outline bg-success-muted text-success-muted-body hover:bg-success-muted-hover focus:ring-success/20"
      },
      {
        variant: "ghost",
        className:
          "focus:ring-primary-400 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 focus:ring-2"
      },
      {
        iconOnly: true,
        size: "xs",
        className: "size-8"
      },
      {
        iconOnly: true,
        size: "sm",
        className: "size-10"
      },
      {
        iconOnly: false,
        size: ["xs", "sm"],
        className: "px-3.5"
      },
      {
        iconOnly: true,
        size: "md",
        className: "size-11"
      },
      {
        iconOnly: false,
        size: "md",
        className: "px-4"
      },
      {
        iconOnly: true,
        size: "lg",
        className: "size-12"
      },
      {
        iconOnly: false,
        size: "lg",
        className: "px-5"
      },
      {
        iconOnly: false,
        className: "py-2.5"
      }
    ],
    defaultVariants: {
      variant: "primary",
      appearance: "fill",
      iconOnly: false,
      size: "md"
    }
  }
);

type PropsType = ComponentProps<"button"> & {
  variant?: "primary" | "danger" | "success" | "ghost";
  appearance?: "fill" | "outline";
  iconOnly?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
};

export function Button({
  variant,
  appearance,
  iconOnly,
  size,
  children,
  className,
  ...props
}: PropsType) {
  return (
    <button
      type="button"
      className={cn(
        buttonStyles({
          variant,
          appearance,
          iconOnly,
          size
        }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
