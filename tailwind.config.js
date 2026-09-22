/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3D',
        navyDeep: '#071422',
        navyBlob: '#0E2A4A',
        navyBlobSoft: '#123250',
        gold: '#F5A524',
        canvas: '#F4F5F8',
        ink: '#101828',
        mute: '#667085',
        line: '#E4E7EC',
        soft: '#F2F4F7',
        success: '#12B76A',
        danger: '#F04438',
        bannerBlue: '#EAF2F8',
        bannerBlueBorder: '#D0E4FA',
        bannerGreen: '#ECFDF3',
        bannerGreenBorder: '#A6F4C5',
        bannerGreenText: '#027A48',
        actionGreen: '#E8F5E9',
        actionGreenBorder: '#C8E6C9',
        actionOrange: '#FFF3E0',
        actionOrangeBorder: '#FFE0B2',
        actionBlue: '#E3F2FD',
        actionBlueBorder: '#BBDEFB',
        primaryLight : "#EAF2F8",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}