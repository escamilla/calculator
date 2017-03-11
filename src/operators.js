const operators = {

  add: {
    checkArgs(operands) {
      return operands.length >= 2 &&
        operands.every((operand) => operand.type === 'number');
    },
    method(operands) {
      return {
        type: 'number',
        value: operands.reduce((acc, operand) => {
          return acc + operand.value;
        }, 0)
      };
    }
  },

  sub: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand.type === 'number');
    },
    method(operands) {
      return {
        type: 'number',
        value: operands[0].value - operands[1].value
      };
    },
  },

  mul: {
    checkArgs(operands) {
      return operands.length >= 2 &&
        operands.every((operand) => operand.type === 'number');
    },
    method(operands) {
      return {
        type: 'number',
        value: operands.reduce((acc, operand) => {
          return acc * operand.value;
        }, 1)
      };
    },
  },

  div: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand.type === 'number');
    },
    method(operands) {
      return {
        type: 'number',
        value: operands[0].value / operands[1].value
      };
    },
  },

  mod: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand.type === 'number');
    },
    method(operands) {
      return {
        type: 'number',
        value: operands[0].value % operands[1].value
      };
    },
  },

  pow: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand.type === 'number');
    },
    method(operands) {
      return {
        type: 'number',
        value: Math.pow(operands[0].value, operands[1].value)
      };
    }
  }

};

module.exports = operators;
