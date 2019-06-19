import { css } from 'styled-components';
import normalize from 'styled-normalize';
import theme from './theme';

export default css`
  ${normalize} /* stylelint-disable-line max-empty-lines */

  @font-face {
    font-family: 'Roboto';
    src: url('${require('../assets/fonts/Roboto-Bold.ttf')}') format('truetype');
    font-style: normal;
    font-weight: 700;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${require('../assets/fonts/Roboto-Regular.ttf')}') format('truetype');
    font-style: normal;
    font-weight: 400;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${require('../assets/fonts/Roboto-Light.ttf')}') format('truetype');
    font-style: normal;
    font-weight: 300;
  }

  html,
  body {
    background: ${theme.backgroundColor};
    font-family: 'Roboto', sans-serif;
    height: 100%;
    width: 100%;
  }
`;
