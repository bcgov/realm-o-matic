import Typography from 'typography';

export const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.6,
  headerFontFamily: ['Noto Sans', 'Verdana', 'Arial', 'sans-serif'],
  bodyFontFamily: ['Noto Sans', 'Verdana', 'Arial', 'sans-serif'],
  scaleRatio: 2.074,
});

typography.injectStyles();
