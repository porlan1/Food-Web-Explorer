export default function tickParser(num) {
  var exponent = Number(num.toExponential().split(/[+,-]/)[1]);
  if (exponent === 0) {
    return num.toString().substr(0,4);
  } else if (exponent > 3) {
    if (num.toExponential().split('+').length > 1) {
      return Number(num/Math.pow(10,exponent)).toString().substr(0,3)+'e+'+exponent;
    } else {
      return Number(num*Math.pow(10,exponent)).toString().substr(0,3)+'e-'+exponent;
    }
  } else {
    if (num.toExponential().split('+').length > 1) {
      return (Math.round(num*Math.pow(10,exponent))/Math.pow(10,exponent)).toString().substr(0,exponent+3);
    } else {
      return (Math.round(num*Math.pow(10,exponent))/Math.pow(10,exponent)).toString().substr(0,exponent+3);
    }
  }
}