export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-pxtorem': {
      rootValue: 16,
      unitPrecision: 5,
      propList: [
        'font',
        'font-size',
        'line-height',
        'letter-spacing',
        'margin*',
        'padding*',
      ],
      selectorBlackList: [],
    },
  },
};
