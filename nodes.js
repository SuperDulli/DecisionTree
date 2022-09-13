class Node {
  /*constructor(x, y){
    this.x = x;
    this.y = y;
    this.text = "";
    this.color = color(0);
  }*/
  constructor(text) {
    this.text = text;
    this.color = color(255);
  }

  show() {
    console.log("draw Node: ", this.text);
    stroke(0);
    fill(this.color);
    ellipse(0, 0, 200, 50);

    // text
    fill(0);
    textAlign(CENTER);
    text(this.text, 0, 0);
  }
}

class Branch {

  constructor(start, end, label, arrowSize, color) {
    this.start = start;
    this.end = end;
    this.label = label;
    this.arrowSize = arrowSize;
	this.color = color;
  }

  show() {
    push();
    stroke(0);
    fill(0);
    //translate(this.start.x, this.start.y);
    line(0, 0, this.end.x, this.end.y);
    rotate(this.end.heading());
    translate(this.end.mag() - this.arrowSize - 100, 0);
	fill(this.color);
    triangle(0, this.arrowSize / 2, 0, -this.arrowSize / 2, this.arrowSize, 0);
    pop();
  }
}

class Leaf extends Node{
  constructor(rows) {
    super(JSON.stringify(classCounts(rows)));
    this.predictions = classCounts(rows);
  }

  show() {
    console.log("drawing Leaf");
    super.show();
  }
}

class DecisionNode extends Node {
  /*
  A Decision Node asks a question.

  This holds a reference to the question, and to the two child nodes.
  */

  constructor(question,
              true_branch,
              false_branch) {
    super(question.toString());
    this.question = question;
    this.true_branch = true_branch;
    this.false_branch = false_branch;
  }

  show() {
    super.show();

    // true branch
    let c = color(0, 255, 0);
    let vec = createVector(0, 200);

    let tb = new Branch(createVector(0,0), vec.rotate(QUARTER_PI), "true", 10, c);
    tb.show();
    push();
    translate(vec.x, vec.y);
    if (!this.true_branch.hasOwnProperty("true_branch")) {
      console.log(this.true_branch, "leaf reached!");
      this.true_branch.show();
    }
    if (this.true_branch !== undefined) this.true_branch.show();

    pop();
    //this.true_branch.show();


    // false Branch
    c = color(255, 0, 0);
    let fb = new Branch(createVector(0,0), vec.rotate(-HALF_PI), "false", 10, c);
    fb.show();
    push();
    translate(vec.x, vec.y);
    //console.log(this.false_branch);
    if (!this.false_branch.hasOwnProperty("false_branch")) {
      console.log(this.false_branch, "leaf reached!");
      this.false_branch.show();
    }
    if (this.false_branch !== undefined) this.false_branch.show();
    pop();
  }
}
