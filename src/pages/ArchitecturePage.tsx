import { Card } from '../components/Card';

/** Interview-friendly architecture notes mirrored from backend design. */
export function ArchitecturePage(): React.JSX.Element {
  return (
    <div className="page-grid">
      <Card description="How backend guarantees safe at-least-once delivery." title="Architecture Model">
        <div className="architecture-flow" aria-label="architecture flow">
          <span>WebFlux API</span>
          <span>PostgreSQL jobs + outbox</span>
          <span>Kafka priority topics</span>
          <span>Redis leases</span>
          <span>Workers</span>
          <span>Retry topics / DLQ</span>
        </div>
      </Card>
      <Card title="Interview Gold Talking Points">
        <div className="info-grid">
          <article>
            <h3>Priority</h3>
            <p>Separate Kafka topics keep HIGH jobs from being blocked by LOW traffic.</p>
          </article>
          <article>
            <h3>Retries</h3>
            <p>Backoff topics make retry timing observable and avoid hot-loop failures.</p>
          </article>
          <article>
            <h3>Idempotency</h3>
            <p>Unique idempotency keys and side-effect receipts protect business operations.</p>
          </article>
          <article>
            <h3>Multi-instance</h3>
            <p>Redis leases reduce duplicate work; database uniqueness remains final guard.</p>
          </article>
        </div>
      </Card>
    </div>
  );
}
