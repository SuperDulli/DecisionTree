class Question {
  constructor(column, value) {
    this.column = column;
    this.value = value;
    this.name = header[column];
  }

  match(example) {
    // Compare the feature value in an example to the value in this question
    let val = example[this.column];
    return val == this.value;
  }

  toString() {
    return `Is ${header[this.column]} == ${this.value}?`;
  }
}
