import type { ButtonHTMLAttributes } from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { readonly variant?: 'primary' | 'secondary' | 'danger'; }
/** Shared button with loading-safe disabled styling. */
export function Button({ className, variant = 'primary', ...props }: ButtonProps): React.JSX.Element { return <button className={`button button-${variant} ${className ?? ''}`} type="button" {...props} />; }
