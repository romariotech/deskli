import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
export { default as Button } from './Button.vue'
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-colors duration-120 disabled:pointer-events-none disabled:bg-disabled-bg disabled:text-disabled-fg [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
        outline:
          'border-input bg-background text-foreground hover:bg-secondary',
        secondary: 'bg-secondary text-secondary-foreground hover:border-input',
        ghost: 'text-foreground hover:bg-secondary',
        link: 'text-brand-text underline underline-offset-4 hover:decoration-2',
        destructive:
          'bg-destructive text-destructive-foreground hover:outline hover:outline-destructive hover:outline-offset-2',
        'destructive-soft':
          'border-danger-border bg-danger-bg text-danger-fg hover:underline',
      },
      size: {
        default: 'h-[var(--control-height)] px-3',
        md: 'h-[var(--control-height)] px-3',
        sm: 'h-8 px-3',
        xs: 'h-8 px-3',
        lg: 'h-11 px-4',
        icon: 'size-[var(--control-height)]',
        'icon-xs': 'size-8',
        'icon-sm': 'size-8',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
