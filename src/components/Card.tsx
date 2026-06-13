interface CardProps { readonly title: string; readonly description?: string; readonly children: React.ReactNode; readonly actions?: React.ReactNode; }
/** Bank-console style panel with optional action region. */
export function Card({ title, description, children, actions }: CardProps): React.JSX.Element { return <section className="card"><div className="card-header"><div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>{actions ? <div className="card-actions">{actions}</div> : null}</div>{children}</section>; }
