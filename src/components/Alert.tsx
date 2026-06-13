interface AlertProps { readonly tone: 'success' | 'error' | 'info' | 'warning'; readonly title: string; readonly children: React.ReactNode; }
/** Accessible status alert for network, validation and command outcomes. */
export function Alert({ tone, title, children }: AlertProps): React.JSX.Element { return <section className={`alert alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}><strong>{title}</strong><div>{children}</div></section>; }
