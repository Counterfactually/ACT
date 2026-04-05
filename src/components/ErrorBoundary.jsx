import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', padding: '24px',
          fontFamily: 'Nunito, sans-serif', background: '#f5eeff', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌸 Oops!</div>
          <h2 style={{ color: '#7c5e99', marginBottom: '12px' }}>Something went wrong</h2>
          <pre style={{
            background: '#fff', border: '1px solid #e0c8f8', borderRadius: '8px',
            padding: '12px 20px', fontSize: '0.8rem', color: '#c00', maxWidth: '600px',
            whiteSpace: 'pre-wrap', wordBreak: 'break-all', textAlign: 'left'
          }}>
            {this.state.error.message}
            {'\n'}
            {this.state.error.stack}
          </pre>
          <button
            style={{
              marginTop: '20px', padding: '12px 32px', background: '#C084FC',
              color: '#fff', border: 'none', borderRadius: '50px',
              fontSize: '1.1rem', cursor: 'pointer', fontFamily: 'inherit'
            }}
            onClick={() => this.setState({ error: null })}
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
