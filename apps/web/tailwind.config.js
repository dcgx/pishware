// tailwind.config.js
module.exports = {
  content: [
    // otras rutas...
    './node_modules/vue-tailwind-wysiwyg-editor/**/*.{js,ts,vue}',
  ],
  plugins: [
    require('@tailwindcss/typography'),
    // otros plugins...
  ],
}
