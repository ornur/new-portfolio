import { Component } from "react";

export class Svg3dErrorBoundary extends Component<
  { children: React.ReactNode; onFallback: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onFallback();
  }

  render() {
    if (this.state.hasError) return null;

    return this.props.children;
  }
}
