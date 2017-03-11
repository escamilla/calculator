const operators = {

  '+'(operands) {
    return {
      type: 'number',
      value: operands.reduce((acc, operand) => {
        return acc + operand.value;
      }, 0)
    };
  },

  '-'(operands) {
    return {
      type: 'number',
      value: operands[0].value - operands[1].value
    };
  },

  '*'(operands) {
    return {
      type: 'number',
      value: operands.reduce((acc, operand) => {
        return acc * operand.value;
      }, 1)
    };
  },

  '/'(operands) {
    return {
      type: 'number',
      value: operands[0].value / operands[1].value
    };
  }

};

module.exports = operators;
