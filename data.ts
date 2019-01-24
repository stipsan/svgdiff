export const defaultSvg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
<defs>
  <path id="favorite-heart-b" d="M16.013 26.005c.553 0 .866-.476 1.757-1.409 1.114-1.165 2.188-2.252 2.968-3.068 2.303-2.409 3.208-3.323 3.851-4.036 1.708-1.896 1.93-4.53.771-6.529C23.9 8.443 21.723 8 20.552 8c-1.171 0-2.008.443-3.487 1.582l-1.025.946-.998-.946C13.438 8.229 12.277 8 11.531 8c-.622 0-3.218 0-4.891 2.963-1.221 2.162-.583 4.825.972 6.529.279.305 1.427 1.491 3.418 3.627.802.86 1.937 2.042 2.772 2.94.474.509 1.657 1.946 2.21 1.946z"/>
  <filter id="favorite-heart-a" width="139.8%" height="144.4%" x="-19.9%" y="-22.2%" filterUnits="objectBoundingBox">
    <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="shadowSpreadOuter1"/>
    <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
    <feMorphology in="SourceAlpha" radius="1" result="shadowInner"/>
    <feOffset in="shadowInner" result="shadowInner"/>
    <feComposite in="shadowOffsetOuter1" in2="shadowInner" operator="out" result="shadowOffsetOuter1"/>
    <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1"/>
    <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0.04 0 0 0 0 0.07 0 0 0 0.25 0"/>
  </filter>
</defs>
<g fill="none" fill-rule="evenodd">
  <use fill="#000" filter="url(#favorite-heart-a)" xlink:href="#favorite-heart-b"/>
  <use stroke="#FFF" stroke-width="2" xlink:href="#favorite-heart-b"/>
  <path fill="#545F70" fill-opacity=".2" d="M16.283 24.72c.08-.084.58-.624.762-.815.645-.675 2.667-2.753 2.968-3.068-.358.375 3.405-3.542 3.83-4.015 1.383-1.534 1.616-3.689.65-5.358C23.475 9.71 22.02 9 20.548 9c-.847 0-1.473.293-2.808 1.317l-1.713 1.581-.68-.644-.953-.908C13.21 9.346 12.315 9 11.53 9c-.598 0-1.084.063-1.684.3-.912.361-1.707 1.04-2.337 2.155-.93 1.646-.545 3.845.84 5.363-.017-.019 2.07 2.181 3.411 3.619.34.363.527.562 1.446 1.532l.014.015c.619.652.976 1.031 1.313 1.394.037.04.602.67.8.88.113.12.218.227.317.324.157.153.295.275.407.36.056-.05.13-.122.227-.223z"/>
</g>
</svg>
`
