const operators = {

  '+': {
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

  '-': {
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

  '*': {
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

  '/': {
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

  '%': {
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

  '^': {
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
