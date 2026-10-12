import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './App.css';

class Boundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  reset = () => { sessionStorage.clear(); location.reload(); };
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="login-wrap"><section className="glass login">
        <h2>Something went wrong</h2>
        <p className="muted">{String(this.state.error.message)}</p>
        <button className="btn primary" onClick={this.reset}>Reset and reload</button>
      </section></div>
    );
  }
}

createRoot(document.getElementById('root')).render(<Boundary><App /></Boundary>);
