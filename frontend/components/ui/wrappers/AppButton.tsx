// components/ui/wrappers/appButton.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Reconstruct shadcn's ButtonProps ────────────────────────────────────────
type ShadcnButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }

// ─── Your custom variants ────────────────────────────────────────────────────
const appButtonVariants = cva("", {
    variants: {
        variant: {
            "destructive-custom":
                "[&_svg]:!size-auto h-auto text-foreground bg-destructive/10 dark:bg-destructive/10 hover:bg-destructive/20 dark:hover:bg-destructive/20 hover:text-(--color-destructive) dark:hover:text-(--color-destructive) disabled:opacity-50 ease-in-out active:scale-[0.98] duration-200",
            "remove-custom":
                "[&_svg]:!size-auto h-auto text-muted-foreground bg-transparent hover:text-destructive disabled:opacity-50 ease-in-out active:scale-[0.98] duration-200",
            "accent-custom":
                "[&_svg]:!size-auto h-auto text-accent-foreground bg-(--color-accent) hover:brightness-115 disabled:opacity-50 ease-in-out active:scale-[0.98] duration-200",
            "outline-accent-custom":
                "[&_svg]:!size-auto h-auto text-foreground bg-transparent border-border hover:bg-muted hover:text-accent hover:border-accent dark:hover:brightness-130 dark:hover:bg-muted/20 disabled:opacity-50 ease-in-out active:scale-[0.98] duration-200",
            "outline-custom":
                "[&_svg]:!size-auto h-auto text-foreground bg-secondary/50 border-border hover:bg-muted hover:border-(--color-border) dark:hover:bg-background disabled:opacity-50 ease-in-out active:scale-[0.98] duration-200",
            // Add more custom variants here:
        },
    },
})

type AppButtonCustomVariant = NonNullable<
    VariantProps<typeof appButtonVariants>["variant"]
>

type ShadcnVariant = NonNullable<
    VariantProps<typeof buttonVariants>["variant"]
>


// ─── Merged props ─────────────────────────────────────────────────────────────
type AppButtonProps = Omit<ShadcnButtonProps, "variant"> & {
    variant?: ShadcnVariant | AppButtonCustomVariant
}

// ─── Custom variant list (add here when you add to cva above) ────────────────
const CUSTOM_VARIANTS: AppButtonCustomVariant[] = ["destructive-custom", "accent-custom", "remove-custom", "outline-accent-custom", "outline-custom"]

// ─── Component ───────────────────────────────────────────────────────────────
export function AppButton({
    variant,
    className,
    ...props
}: AppButtonProps) {
    const isCustom = CUSTOM_VARIANTS.includes(variant as AppButtonCustomVariant)

    return (
        <Button
            variant={isCustom ? "default" : (variant as ShadcnVariant)}
            className={cn(
                isCustom &&
                appButtonVariants({ variant: variant as AppButtonCustomVariant }),
                className
            )}
            {...props}
        />
    )
}