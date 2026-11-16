import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="text-center px-4">
            <h1 className="text-6xl font-black text-primary mb-4">Oops!</h1>
            <p className="text-xl text-secondary mb-8">
              Something went wrong. Please try refreshing the page.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-lg bg-primary text-bg-primary font-semibold hover:opacity-90 transition-opacity"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="px-6 py-3 rounded-lg glass text-primary font-semibold hover:opacity-90 transition-opacity"
              >
                Go Home
              </a>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left max-w-2xl mx-auto">
                <summary className="cursor-pointer text-secondary mb-2">Error Details (Dev Only)</summary>
                <pre className="bg-gray-800 p-4 rounded text-sm text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
