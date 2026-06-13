interface FieldProps { readonly id: string; readonly label: string; readonly hint?: string; readonly children: React.ReactNode; }
/** Accessible form field wrapper. */
export function Field({ id, label, hint, children }: FieldProps): React.JSX.Element { return <label className="field" htmlFor={id}><span>{label}</span>{children}{hint ? <small>{hint}</small> : null}</label>; }
