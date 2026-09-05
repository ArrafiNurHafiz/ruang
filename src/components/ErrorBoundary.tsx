import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  declare props: ErrorBoundaryProps;
  declare state: ErrorBoundaryState;
  setState!: (
    state:
      | Partial<ErrorBoundaryState>
      | ((prevState: ErrorBoundaryState) => Partial<ErrorBoundaryState>),
  ) => void;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Terjadi Kesalahan
            </h2>
            <p className="text-xs text-slate-600">
              Halaman gagal dirender karena error internal. Coba reset dan
              kembali ke beranda.
            </p>
            <pre className="text-[10px] text-left bg-slate-50 p-3 rounded-lg overflow-auto max-h-32 text-slate-500">
              {this.state.error?.message ?? "Unknown error"}
            </pre>
            <button
              onClick={this.handleReset}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm cursor-pointer"
            >
              Reset Halaman
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl text-sm cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
