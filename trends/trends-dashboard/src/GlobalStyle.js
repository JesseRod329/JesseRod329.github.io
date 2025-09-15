
import { createGlobalStyle } from 'styled-components';
import { COLORS, FONTS } from './constants/terminal-theme';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    background-color: ${COLORS.background};
    color: ${COLORS.text};
    font-family: ${FONTS.mono};
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${COLORS.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${COLORS.border};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${COLORS.textSecondary};
  }
`;

export default GlobalStyle;
