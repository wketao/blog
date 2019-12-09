import { createGlobalStyle } from 'styled-components';

export const IconFontStyle = createGlobalStyle`
//@font-face {
//  font-family: "iconfont";
//  src: url('./iconfont.eot'); /* IE9 */
//  src: url('./iconfont.eot') format('embedded-opentype'), /* IE6-IE8 */
//  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAANEAAsAAAAAB2AAAAL2AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqCQIImATYCJAMMCwgABCAFhG0HPRtzBhHVmxPIfiRkp4WXOast+2o0UkfiTRClDts7yY4CDFUmJT4QUh+a/pE75NYBsLStl2ahLxQ0Ut+6VnQnBuzGyx/3qmZMsfnuvsdl7oEBDG8N0B5tsZusBamg9zE2we7neQgQRhYVSNv2XfvisBibBJCpkyaMwqW02JpCwSH4JSetyk48nG7S28AO//flC5XiQPEMxs6e49uNpf4978PNymAlQ10UvPHMAHcODFABWJDhpdaBmDBagSFMEVu1Enwsgo4VCAKfq4p98x8eKALiY+RHAFCCMYX32NxYFg78s843APgwORLYPMKtoNgciYhIjlkSoSsbCs43pZmIzQ7iSHNxpFmFONeYqpFbdh5sCJvw9Gn/Z88GPHnS7/HjwZa4b8BOpj19umjzZSlm66qVFyNk0rMPA5686/cZYTGbDyfJgQPJsfv2JbLyYnVum3Xr4kpP7SrRdWvidqelrcrxeWny2vjZJ+MJui969KjO1Xmudp7GLEc8F2a+6quzZko/6TtrVl8QCcuGXf1mzUxuczKmZ4y9+eXrLWOykBWykrNy66O9B0lJD7yHHrLwtTE9Q85G/gx34UHLmZYg3EVADgDBZvPDLP4Xf8O8uv936ujqfy7cAvAy7uUu/0Sw0qpZCTgUWvPefJP1AazyAiNiLFAjt219GOoSaSgQZjohQGccb/vLE9V8EByJMSghZILBUYC2+ArwCKcKfBx1EEY5Hc6HE89sDGJDgTLWERBiuAFKFM1giOEO2uLfgEcS38AnRgyE0V/ibwynSFS9OxG2jAN0f9D9GIRl4F1QeEe5uJaSAp/yRoo6AEWaZxM3DEhj7IkfWTILEDR6uJKXoXMjTDQa7DlVzFOVZaLsm9J+9KsdJ8KWcYDuD7ofg3B78y7383eUi2uppqPC/EaKenoo0rwF+iYNrTqu5TXxI0tmAYJGD1diRmdGR5jKlxnsOVU9wlOVYTfRVprOL/fPtw8Iw1hsRMWIZTtZt8eTX5QsESm0HlcrAAA=') format('woff2'),
//  url('./iconfont.woff') format('woff'),
//  url('./iconfont.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
//  url('./iconfont.svg') format('svg'); /* iOS 4.1- */
//}

@font-face {
  font-family: 'iconfont';  /* project id 1551695 */
  src: url('//at.alicdn.com/t/font_1551695_4jmqlvjmenk.eot');
  src: url('//at.alicdn.com/t/font_1551695_4jmqlvjmenk.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1551695_4jmqlvjmenk.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1551695_4jmqlvjmenk.woff') format('woff'),
  url('//at.alicdn.com/t/font_1551695_4jmqlvjmenk.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1551695_4jmqlvjmenk.svg#iconfont') format('svg');
  url('//at.alicdn.com/t/font_1551695_4jmqlvjmenk.css')
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-guanbi:before {
  content: "\\e60c";
}

.icon-jia:before {
  content: "\\e60b";
}

.icon-icon-username:before {
  content: "\\e600";
}


`;


