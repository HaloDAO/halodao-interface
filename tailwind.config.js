module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka One', 'ui-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#471bb2',
          light: '#e8e4f5',
          lighter: '#D7CDF0',
          lightest: '#F3F2F8',
          dark: '#4F4F4F',
          hover: '#15006d',
          disabled: '#9182c6',
          gradientVia: '#5521B6',
          gradientTo: '#2DB7C4',
          gray: '#828282',
          lightGray: '#BDBDBD',
          purple: '#471BB2'
        },
        secondary: {
          DEFAULT: '#A38DD8',
          light: '#FA6F44',
          lighter: '#FFE6DE',
          lightest: '#F0EDFF',
          alternate: '#5E5E5E'
        },
        misc: {
          green: '#EDFFEF',
          yellow: '#EDAB01'
        },
        warning: {
          DEFAULT: '#FA6F44'
        },
        link: {
          DEFAULT: '#518cff',
          alternate: '#471bb2'
        },
        success: {
          DEFAULT: '#1BB233',
          alternate: '#56A86A'
        }
      },
      maxWidth: {
        container: '1040px'
      },
      borderRadius: {
        card: '10px',
        button: '20px'
      },
      height: {
        tokenInput: '80px'
      }
    }
  },
  variants: {
    extend: {
      ringWidth: ['active'],
      ringColor: ['active'],
      opacity: ['disabled'],
      borderColor: ['focus'],
      backgroundColor: ['focus']
    }
  },
  plugins: []
}
