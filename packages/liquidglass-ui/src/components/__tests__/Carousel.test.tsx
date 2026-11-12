import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from '../Carousel';

describe('Carousel', () => {
  it('renders slides', () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );
    
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('navigates with arrow buttons', async () => {
    const { container } = render(
      <Carousel showArrows>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    
    const slides = container.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides[0]).toHaveAttribute('aria-hidden', 'true');
    expect(slides[1]).toHaveAttribute('aria-hidden', 'false');
  });

  it('supports keyboard navigation', () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    
    const carousel = screen.getByRole('region');
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
  });

  it('shows dot indicators', () => {
    render(
      <Carousel showDots>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );
    
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);
  });

  it('navigates via dot click', async () => {
    render(
      <Carousel showDots>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );
    
    const dots = screen.getAllByRole('tab');
    await userEvent.click(dots[2]);
    
    expect(dots[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('loops when enabled', async () => {
    const { container } = render(
      <Carousel loop>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);
    
    const slides = container.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides[1]).toHaveAttribute('aria-hidden', 'false');
  });

  it('disables loop when loop=false', async () => {
    render(
      <Carousel loop={false}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    
    expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel');
    
    const slides = screen.getAllByRole('group', { hidden: true });
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide');
    expect(slides[0]).toHaveAttribute('aria-label', 'Slide 1 of 2');
  });

  it('hides arrows when not enough slides', () => {
    render(
      <Carousel showArrows slidesToShow={3}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
  });
});
