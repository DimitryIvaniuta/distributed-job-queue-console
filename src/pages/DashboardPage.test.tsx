import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { jobsApi } from '../api/jobsApi';
import { statsFixture } from '../test/fixtures';
import { renderWithProviders } from '../test/render';
import { DashboardPage } from './DashboardPage';

vi.mock('../api/jobsApi', () => ({ jobsApi: { stats: vi.fn() } }));

describe('DashboardPage', () => {
  it('renders backend stats', async () => {
    vi.mocked(jobsApi.stats).mockResolvedValue(statsFixture);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('Total Jobs')).toBeInTheDocument();
    expect(await screen.findByText('23')).toBeInTheDocument();
    expect(await screen.findByText('RETRY_SCHEDULED')).toBeInTheDocument();
  });
});
