import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Captured error in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-3">Đã có lỗi xảy ra</h2>
            <pre className="text-left text-sm text-gray-700 overflow-auto" style={{maxHeight: '400px'}}>{String(this.state.error)}</pre>
            <p className="mt-4 text-sm text-gray-500">Mở Developer Console để biết thêm thông tin.</p>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
