/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:'#2E6FF2',
        secondary:'#26488C',
        dark:'#0D1526',
        tertiary:'#1D3759',
        light:'#A7BDD9',
        theme:{
          steelBlue:'#A9BED9',
          brightBlue:'#3084F2',
          mutedBlue:'#27538C',
          darkBlue:'#1E3E59',
          lightGray:'#F2F2F2',
          linkColor:'#3758f9',
          cardLinkColor:'#006eff',
          successColor:'#27ae60',
          errorColor:'#1e8449'
        },
        border:{
          darkBorder:'#1D3758',
          lightBorder:'#2E6FF1'
        },
        primaryDark:'#0F1626',
        dashboardGray:'#E5E5E5',
        dashboardDark:'#0E1011',
        dashboardSide:'rgb(39 50 55)',
        dashboardHead:'#406bc5'
      },
      fontSize:{
        error:['12px','16px'],
        xss:['13px','17px'],
        xs:['14px','21px'],
        sm:['16px','24px'],
        base:['18px','27px'],
        lg:['22px','30px'],
        xl:['24px','34px'],
        '2xl':['28px','40px'],
        '3xl':['32px','46px'],
        '4xl':['36px','52px'],
        '5xl':['40px','58px']
      },
      boxShadow:{
        shadowSm: '0px 0px 6px 1px rgb(71 71 71)',
        blackShadow:'0px 0px 7px 2px rgba(0,0,0,0.3)',
        hoverBlackShadow:'0px 1px 9px 4px rgba(109,109,109,0.29)',
        buttonShadow:'0 4px 9px rgba(39, 174, 96, .15)',
        buttonHoverShadow:'rgba(39, 174, 96, .2) 0 6px 12px',
        bounceButtonShadow:'#222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px',
        buttonWhiteShadow:''
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}