import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', margin: '2rem', borderRadius: '8px', border: '1px solid #ef4444' }}>
          <h2 style={{marginTop:0}}>Something went wrong!</h2>
          <pre style={{whiteSpace: 'pre-wrap', fontSize:'0.85rem', background: '#fff', padding:'1rem'}}>{this.state.error?.toString()}</pre>
          <pre style={{whiteSpace: 'pre-wrap', fontSize:'0.75rem', background: '#fff', padding:'1rem'}}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
