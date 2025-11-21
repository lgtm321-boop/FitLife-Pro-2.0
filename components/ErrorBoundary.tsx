import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-surface border border-white/5 rounded-3xl text-center my-4 animate-fade-in shadow-soft">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
             <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-secondary mb-2">Ops! Algo deu errado.</h2>
          <p className="text-muted text-sm mb-6 max-w-xs mx-auto">Não foi possível carregar esta seção. Tente recarregar ou voltar ao início.</p>
          <button 
            onClick={this.handleReset}
            className="bg-primary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#00B587] transition-colors shadow-lg shadow-primary/20"
          >
            <RefreshCw className="w-4 h-4" /> Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}