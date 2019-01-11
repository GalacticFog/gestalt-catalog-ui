import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import lightBlue from '@material-ui/core/colors/lightBlue';

export default createMuiTheme({
  palette: {
    primary: blue,
    secondary: lightBlue,
  },
  typography: {
    useNextVariants: true,
    // Use the system font instead of the default Roboto font.
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
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: '1.16667em',
      color: 'rgba(0, 0, 0, 0.64)',
    },
    subtitle1: {
      color: 'rgba(0, 0, 0, 0.64)',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.46429em',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    caption: {
      color: 'rgba(0, 0, 0, 0.40)',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
  },
});