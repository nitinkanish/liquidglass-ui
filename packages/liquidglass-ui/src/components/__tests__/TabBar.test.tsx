import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabBar } from '../TabBar';

const items = [
  { value: 'home', label: 'Home' },
  { value: 'search', label: 'Search' },
  { value: 'profile', label: 'Profile' },
];

describe('TabBar', () => {
  it('renders tabs', () => {
    render(<TabBar items={items} aria-label="Main" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('selects the first tab by default', () => {
    render(<TabBar items={items} aria-label="Main" />);
    expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onValueChange when a tab is clicked', async () => {
    const onValueChange = vi.fn();
    render(<TabBar items={items} aria-label="Main" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Search' }));
    expect(onValueChange).toHaveBeenCalledWith('search');
  });

  it('supports controlled value', () => {
    const { rerender } = render(
      <TabBar items={items} aria-label="Main" value="home" onValueChange={() => {}} />
    );
    expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    rerender(
      <TabBar items={items} aria-label="Main" value="profile" onValueChange={() => {}} />
    );
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
  });

  it('supports uncontrolled defaultValue', async () => {
    render(<TabBar items={items} aria-label="Main" defaultValue="search" />);
    expect(screen.getByRole('tab', { name: 'Search' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
  });

  it('moves selection with arrow keys', async () => {
    const onValueChange = vi.fn();
    render(
      <TabBar items={items} aria-label="Main" value="home" onValueChange={onValueChange} />
    );
    screen.getByRole('tab', { name: 'Home' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith('search');
  });

  it('keeps indicator data-index in sync with selection', async () => {
    render(<TabBar items={items} aria-label="Main" defaultValue="home" />);
    expect(screen.getByTestId('tabbar-indicator')).toHaveAttribute('data-index', '0');
    await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));
    expect(screen.getByTestId('tabbar-indicator')).toHaveAttribute('data-index', '2');
  });
});
