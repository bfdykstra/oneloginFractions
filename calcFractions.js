// Write a command line program in the language of your choice that will take operations on fractions as an input 
// and produce a fractional result.
// Legal operators shall be *, /, +, - (multiply, divide, add, subtract)
// Operands and operators shall be separated by one or more spaces
// Mixed numbers will be represented by whole_numerator/denominator. e.g. "3_1/4"
// Improper fractions and whole numbers are also allowed as operands 
// Example run:
// ? 1/2 * 3_3/4
// = 1_7/8

// ? 2_3/8 + 9/8
// = 3_1/2


/*
  Given two numbers, a and b, and a valid operator, return the result of the operation
*/
function calcRaw(a, operator, b) {
  if (isNaN(parseFloat(a, 10)) || isNaN(parseFloat(b, 10))) throw Error(`non numeric input given: ${a}, ${b}`)

  switch (operator) {
    case '*':
      return parseFloat(a, 10) * parseFloat(b, 10);
      break;
    case '/':
      return parseFloat(a, 10) / parseFloat(b, 10);
      break;
    case '+':
      return parseFloat(a, 10) + parseFloat(b, 10);
      break;
    case '-':
      return parseFloat(a, 10) - parseFloat(b, 10);
      break;
    default:
      throw Error(`Please provide a legal operator from [*, /, +, - ]. Given: ${operator}`)
      break;
  }
}

/* 
  Find the greatest common devisor for two numbers a and b
*/
function greatestCommonDevisor(a, b){
  if (!b) return a;

  return greatestCommonDevisor(b, a % b)

}
    
/* 
  Convert a floating point number to the string representation of a fraction.
  Doesn't do great with irrational numbers ie. 0.33333333 gives "3333333333333333/10000000000000000"
  instead of 1/3.
*/
function toFrac(float) {
  // good ole stack overflow coming in handy: 
  // https://stackoverflow.com/questions/23575218/convert-decimal-number-to-fraction-in-javascript-or-closest-fraction
  const len = float.toString().length - 2;

  let denominator = Math.pow(10, len);
  let numerator = float * denominator;
  
  const divisor = greatestCommonDevisor(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;

  return `${Math.floor(numerator)}/${Math.floor(denominator)}`;
}


/*
  Given a floating point number, convert it to the string representation of a fraction
*/
function floatToFrac(float) {

  const positive = float >= 0 ? float : float * -1
  let result;
  
  // fraction less than 1
  if (positive < 1) {
    result =  toFrac(positive);
  // mixed number
  } else if (positive % 1 !== 0) {
    const whole = Math.floor(positive).toString();
    const remainder = positive % 1;
    result = `${whole}_${toFrac(remainder)}`
  // whole number
  } else if (positive % 1 === 0) {
    result = positive.toString()
  }
  
  return (float >= 0 ? result : `-${result}`)
  
}


/*
  Given a string representation of a fraction, 
  convert to a float
*/
function fracToFloat(frac) {
  const [a, b, ...rest] = frac.split('_')

  if (rest.length) throw Error(`Please provide a number in the valid format. The given input was: ${frac}`)
  
  let aRaw;
  let bRaw;
  // the fraction is negative
  if (a[0] === '-') {

    // if a is a fraction, split it up in to [num, "/", den]
    const [positiveA, operator, positiveB] = a.slice(1).split('')
    aRaw = a.includes('/') ? calcRaw(-1 * positiveA, operator, positiveB) : parseFloat(a, 10)

    const [x, op, y] = b ? b.split('') : [0, '+', 0]
    bRaw = calcRaw(-1 * x, op, y)

  } else {
    aRaw = a.includes('/') ? calcRaw(...a.split('')) : parseFloat(a, 10)
    bRaw = b ? calcRaw(...b.split('')) : 0
  }
 
  
  const result = calcRaw(aRaw, '+', bRaw)

  return result
  
}

/*
  Given a command line argument calculate the result of operations
  on the given fractions
  Example run:
  1/2 * 3_3/4 = 1_7/8
  2_3/8 + 9/8 = 3_1/2
*/
function calcFractions(argArr) {
  const [a, operator, b] = argArr

  const result = calcRaw(fracToFloat(a), operator, fracToFloat(b))
  console.log(`${a} ${operator} ${b} = ${floatToFrac(result)}`)
}


function drive() {
  const expression = process.argv[2] // assumption is that input is a single string
  const split = expression.trim().split(/\s+/); // split on whitespace, trim anything extra

  return calcFractions(split)
}

drive()


