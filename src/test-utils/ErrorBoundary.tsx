import { Component, type PropsWithChildren } from 'react';

type ErrorBoundaryProps = PropsWithChildren<{
  onError: (error: unknown) => void;
}>;

// The test renderer reports render errors globally instead of rejecting
// `act`, so a boundary is the only way to observe them.
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
