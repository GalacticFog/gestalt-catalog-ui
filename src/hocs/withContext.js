import React from 'react';

export default function withContext(WrappedComponent) {
  return class extends React.PureComponent {
    state = {
      context: {},
    }
    
    componentDidMount() {
      window.addEventListener('message', this.msgHandler);
      window.parent.postMessage('ready', '*');
    }

    componentWillUnmount() {
      window.removeEventListener('message', this.msgHandler);
    }

    msgHandler = ({ data }) => {
      this.setState(() => ({
        context: { ...data },
      }));
    }

    render() {
      return <WrappedComponent {...this.state} {...this.props} />;
    }
  }
}