import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';

const WithTheme = (WrappedComponent) => {
  class Theme extends React.Component {
    render() {
      return (
        <MuiThemeProvider theme={theme}>
          <WrappedComponent {...this.props} />
        </MuiThemeProvider>
      );
    }
  }

  return Theme;
};


export default WithTheme;