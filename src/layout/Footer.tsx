/** Footer keeps the operational correctness model visible. */
export function Footer(): React.JSX.Element { return <footer className="app-footer"><span>No duplicate side effects: idempotency key + side-effect receipts.</span><span>Retry model: backoff topics + DLQ + replay.</span></footer>; }
