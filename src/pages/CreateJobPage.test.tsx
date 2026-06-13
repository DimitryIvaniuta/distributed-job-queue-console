import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { jobsApi } from '../api/jobsApi';
import { jobFixture } from '../test/fixtures';
import { renderWithProviders } from '../test/render';
import { CreateJobPage } from './CreateJobPage';

vi.mock('../api/jobsApi', () => ({ jobsApi: { createJob: vi.fn() } }));

describe('CreateJobPage', () => {
  it('validates JSON before calling backend', async () => {
    renderWithProviders(<CreateJobPage />);

    fireEvent.change(screen.getByLabelText(/Payload JSON/), { target: { value: '{broken' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Job' }));

    expect(await screen.findByText(/Invalid JSON payload/)).toBeInTheDocument();
    expect(jobsApi.createJob).not.toHaveBeenCalled();
  });

  it('rejects very large payloads before calling backend', async () => {
    renderWithProviders(<CreateJobPage />);

    fireEvent.change(screen.getByLabelText(/Payload JSON/), { target: { value: JSON.stringify({ data: 'x'.repeat(20_000) }) } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Job' }));

    expect(await screen.findByText(/Limit is/)).toBeInTheDocument();
    expect(jobsApi.createJob).not.toHaveBeenCalled();
  });

  it('submits a valid job request', async () => {
    vi.mocked(jobsApi.createJob).mockResolvedValue(jobFixture);

    renderWithProviders(<CreateJobPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Submit Job' }));

    await waitFor(() => expect(jobsApi.createJob).toHaveBeenCalledOnce());
    expect(await screen.findByText(/Job accepted safely/)).toBeInTheDocument();
  });
});
