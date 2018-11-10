import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    useNextVariants: true,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

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