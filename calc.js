$(function() {
  const app = new Controller(new Model(), new View());
})

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindNumInput(this.handleNum.bind(this));
    this.model.bindUpdateScreen(this.updateScreen.bind(this));
    this.view.bindOpInput(this.handleOp.bind(this));
    this.view.bindClear(this.handleClear.bind(this));
    this.view.bindClearEntry(this.handleClearEntry.bind(this));
    this.view.bindNeg(this.handleNeg.bind(this));
    this.view.bindEqual(this.handleEqual.bind(this));
  }

  handleNum(num) {
    this.model.numInput(num);
  }

  updateScreen() {
    this.view.updateScreen(this.model.entry, this.model.operation);
  }

  handleOp(op) {
    this.model.opInput(op);
  }

  handleClear() {
    this.model.clear();
  }

  handleClearEntry() {
    this.model.clearEntry();
  }

  handleNeg() {
    this.model.neg();
  }

  handleEqual() {
    this.model.equal();
  }
}

class Model {
  constructor() {
    this.entry = '0';
    this.operation = [];
    this.postOp = true;
  }

  numInput(num) {
    if (num === '.' && this.entry.includes('.')) {
      return;
    } else if (this.postOp && num !== '.') {
      this.entry = num;
    } else if (num === '.' && (this.entry === '0' || this.postOp)) {
      this.entry = '0.';
    } else {
      this.entry += num;
    }
    this.postOp = false;
    this.updateScreen();
  }

  calculateTotal() {
    let total = 0;
    let currentOperation;

    for (let val of this.operation) {
      if (isNaN(Number(val))) {
        currentOperation = val;
      } else {
        switch (currentOperation) {
          case '+':
            total += Number(val);
            break;
          case '-':
            total -= Number(val);
            break;
          case 'x':
            total *= Number(val);
            break;
          case '/':
            total /= Number(val);
            break;
          case '%':
            total %= Number(val);
            break;
          default:
            total = Number(val);
        }
      }
    }

    return String(total);
  }

  clear() {
    this.entry = '0';
    this.operation = [];
    this.postOp = true;

    this.updateScreen();
  }

  clearEntry() {
    this.entry = '0';
    this.postOp = true;

    this.updateScreen();
  }

  bindUpdateScreen(callback) {
    this.updateScreen = callback;
  }

  opInput(op) {
    this.operation.push(this.entry, op);
    this.entry = this.calculateTotal();
    this.updateScreen();
    this.postOp = true;
  }

  neg() {
    if (this.entry !== '0' && !this.entry.includes('-')) {
      this.entry = '-' + this.entry;
    } else if (this.entry.includes('-')) {
      this.entry = this.entry.slice(1);
    }

    this.updateScreen();
  }

  equal() {
    this.operation.push(this.entry);
    let total = this.calculateTotal();
    this.clear();

    this.entry = total;
    this.updateScreen();
  }
}

class View {
  constructor() {
    this.$entry = $('#ent-window');
    this.$operation = $('#op-window')
    this.$numbers = $('.num');
    this.$ops = $('.op');
    this.$ce = $('#ce');
    this.$c = $('#c');
    this.$neg = $('#neg');
    this.$dec = $('#dec');
    this.$equal = $('#equal');
  }

  bindNumInput(handler) {
    this.$numbers.on('click', event => {
      let number = $(event.target).text();
      handler(number);
    })
  }

  updateScreen(entry, operation) {
    this.$entry.text(entry);
    this.$operation.text(operation.join(' '));
  }

  bindOpInput(handler) {
    this.$ops.on('click', event => {
      let op = $(event.target).text();
      handler(op);
    })
  }

  bindClear(handler) {
    this.$c.on('click', event => {
      handler();
    })
  }

  bindClearEntry(handler) {
    this.$ce.on('click', event => {
      handler();
    })
  }

  bindNeg(handler) {
    this.$neg.on('click', event => {
      handler();
    })
  }

  bindEqual(handler) {
    this.$equal.on('click', event => {
      handler();
    })
  }
}