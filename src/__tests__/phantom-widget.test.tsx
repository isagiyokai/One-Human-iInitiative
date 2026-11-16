import { render, screen, fireEvent } from '@testing-library/react';
import { PhantomHelpWidget } from '@/components/phantom/PhantomHelpWidget';
import { useReducedMotion } from '@/hooks/useReducedMotion';

jest.mock('@/hooks/useReducedMotion');

describe('Phantom Help Widget', () => {
  const mockUseReducedMotion = useReducedMotion as jest.Mock;

  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders help button', () => {
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    expect(button).toBeInTheDocument();
  });

  it('opens tutorial panel when button clicked', () => {
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    fireEvent.click(button);
    expect(screen.getByText('Phantom Wallet Tutorial')).toBeInTheDocument();
  });

  it('closes tutorial panel when close button clicked', () => {
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    fireEvent.click(button);
    const closeButton = screen.getByRole('button', { name: /close tutorial/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText('Phantom Wallet Tutorial')).not.toBeInTheDocument();
  });

  it('closes tutorial panel when backdrop clicked', () => {
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    fireEvent.click(button);
    // Find the backdrop - it's a fixed div with z-40
    const backdrop = document.querySelector('.fixed.inset-0.z-40');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);
    expect(screen.queryByText('Phantom Wallet Tutorial')).not.toBeInTheDocument();
  });

  it('applies reduced motion class when prefers reduced motion', () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    expect(button).not.toHaveClass('animate-pulse-subtle');
  });

  it('applies animation class when no reduced motion', () => {
    mockUseReducedMotion.mockReturnValue(false);
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    expect(button).toHaveClass('animate-pulse-subtle');
  });

  it('renders tutorial steps', () => {
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    fireEvent.click(button);
    expect(screen.getByText('Welcome to the Tutorial')).toBeInTheDocument();
  });

  it('navigates to next step', () => {
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    fireEvent.click(button);
    const nextButton = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextButton);
    expect(screen.getByText('Install Phantom Wallet')).toBeInTheDocument();
  });

  it('navigates to previous step', () => {
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    fireEvent.click(button);
    const nextButton = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextButton);
    const prevButton = screen.getByRole('button', { name: /previous step/i });
    fireEvent.click(prevButton);
    expect(screen.getByText('Welcome to the Tutorial')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    fireEvent.click(button);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '10');
  });

  it('respects reduced motion in tutorial panel', () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<PhantomHelpWidget />);
    const button = screen.getByRole('button', { name: /open phantom wallet tutorial/i });
    fireEvent.click(button);
    const panel = screen.getByRole('dialog');
    expect(panel).not.toHaveClass('animate-slide-up');
  });
});