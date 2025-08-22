const colors = require("tailwindcss/colors")

module.exports = {
  content: [
    // otras rutas...
    './node_modules/vue-tailwind-wysiwyg-editor/**/*.{js,ts,vue}',
    './node_modules/vue-tailwind-datepicker/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'vtd-primary': colors.sky, // Light mode Datepicker color
        'vtd-secondary': colors.gray, // Dark mode Datepicker color
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    // otros plugins...
  ],
}
