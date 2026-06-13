import { expect, test } from '@playwright/test';

const targetUrl = process.env['E2E_TARGET_URL'] ?? '/';
const job = {
  id: '11111111-1111-4111-8111-111111111111',
  idempotencyKey: 'transfer-2026-0001',
  type: 'BANK_TRANSFER_SETTLEMENT',
  priority: 'HIGH',
  status: 'QUEUED',
  attempt: 0,
  maxAttempts: 4,
  nextRetryAt: null,
  resultJson: null,
  errorMessage: null,
  traceId: 'trace-2026-0001',
  createdAt: '2026-06-06T08:00:00Z',
  updatedAt: '2026-06-06T08:00:00Z',
  completedAt: null,
};

test.beforeEach(async ({ page }) => {
  await page.route('**/actuator/health', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ status: 'UP' }) });
  });
  await page.route('**/api/v1/jobs/stats', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ countsByStatus: { ACCEPTED: 1, QUEUED: 4, PROCESSING: 2, RETRY_SCHEDULED: 3, SUCCEEDED: 12, DLQ: 1 } }),
    });
  });
  await page.route('**/api/v1/jobs/idempotency/**', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(job) });
  });
  await page.route('**/api/v1/jobs/*/replay', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ...job, status: 'QUEUED', priority: 'HIGH' }) });
  });
  await page.route('**/api/v1/jobs', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(job), status: 201 });
  });
});

test('shows dashboard counters', async ({ page }) => {
  await page.goto(targetUrl);

  await expect(page.getByRole('heading', { name: 'Distributed Job Queue Console' })).toBeVisible();
  await expect(page.getByText('Backend UP')).toBeVisible();
  await expect(page.getByText('Total Jobs')).toBeVisible();
  await expect(page.getByText('23')).toBeVisible();
});

test('creates a high-priority job', async ({ page }) => {
  await page.goto(targetUrl);

  await page.getByRole('link', { name: /Submit Job/ }).click();
  await page.getByRole('button', { name: 'Submit Job' }).click();

  await expect(page.getByText('Command accepted')).toBeVisible();
  await expect(page.getByText(job.id)).toBeVisible();
});

test('looks up job by idempotency key', async ({ page }) => {
  await page.goto(targetUrl);

  await page.getByRole('link', { name: /Lookup & Audit/ }).click();
  await page.getByRole('button', { name: 'Lookup by Idempotency Key' }).click();

  await expect(page.getByText(job.id)).toBeVisible();
  await expect(page.getByText('BANK_TRANSFER_SETTLEMENT')).toBeVisible();
});

test('schedules DLQ replay', async ({ page }) => {
  await page.goto(targetUrl);

  await page.getByRole('link', { name: /DLQ Replay/ }).click();
  await page.getByLabel('DLQ Job ID').fill(job.id);
  await page.getByRole('button', { name: 'Replay DLQ Job' }).click();

  await expect(page.getByText('Replay scheduled')).toBeVisible();
  await expect(page.getByText(job.traceId)).toBeVisible();
});
