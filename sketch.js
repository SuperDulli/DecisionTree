const trainingData = [
  [true, true, true, false, true, false],
  [true, true, true, false, true, false],
  [true, false, true, false, false, false],
  [true, false, false, false, true, false],
  [true, false, true, true, false, true],
  [true, true, true, false, false, false],
  [true, true, true, false, true, false],
  [true, false, true, false, true, false],
  [true, false, false, false, false, true],
  [true, true, false, false, true, true],
  [true, false, true, false, true, false],
  [true, true, true, true, true, true],
  [false, true, true, true, false, true],
  [false, false, false, true, true, false],
  [false, false, false, true, false, true],
  [false, true, false, true, false, true],
  [false, false, false, true, true, false],
  [false, false, true, true, false, true],
  [false, true, false, true, false, false],
  [false, true, false, true, false, true]
];

const header = ["like", "easy", "applied", "practical", "theoretical", "early"];

const data2 = [
  //sunny, overcast, rainy
  [true, true, false, false, false],
  [true, true, true, true],
  [true, true, true, false, false]
];

let tree;

function setup() {
  createCanvas(800, 800);

  console.log(typeof trainingData, trainingData);
  let counts = classCounts(trainingData);
  console.log(counts);

  let q = new Question(3, true);
  console.log(q.match(trainingData[0]));

  let p = partition(trainingData, q);
  console.log(p);

  let bs = findBestSplit(trainingData);
  console.log(bs);

  tree = buildTree(trainingData);
  console.log(tree);
  noLoop();
}

function draw() {
  background(220);
  translate(width / 2, 50);
  tree.show();
}

function classCounts(rows) {
  // Counts the number of each type of example in a dataset.
  let counts = {};
  rows.map(row => {
    let label = row[0]; // first column is the label
    if (!(label in counts)) counts[label] = 1;
    else counts[label] += 1;
  });
  return counts;
}

function partition(rows, question) {
  /*
  Partitions a dataset.

    For each row in the dataset, check if it matches the question. If
    so, add it to 'true rows', otherwise, add it to 'false rows'.
  */
  let trueRows = [],
    falseRows = [];
  rows.map(row => {
    if (question.match(row)) trueRows.push(row);
    else falseRows.push(row);
  });
  return {trueRows, falseRows};
}

function entropy(rows) {
  let counts = classCounts(rows);
  let entrp = 0;
  for (let label in counts) {
    let lblProp = counts[label] / rows.length;
    entrp += lblProp * entropy2(lblProp);
  }
  return -entrp;
}

const entropy2 = prop => {
  if (prop == 1 || prop == 0) return 0;
  return prop * Math.log2(prop) + (1 - prop) * Math.log2((1 - prop));
};

function infoGain(left, right, currentUncertainty) {
  /*
  Information Gain.

     The uncertainty of the starting node, minus the weighted impurity of
     two child nodes.
  */
  let p = left.length / (left.length + right.length);
  return currentUncertainty - p * entropy(left) - (1 - p) * entropy(right);
}

function findBestSplit(rows) {
  let bestGain = 0;
  let bestQuestion = null;
  let currentUncertainty = entropy(rows);
  let n = rows.length - 1;

  for (let col = 1; col < rows[0].length; col++) { //for each feature
    let values = [];
    for (let row of rows) values.push(row[col]);
    values = values.filter(onlyUnique);

    for (let val of values) { // for each value
      let question = new Question(col, val);
      let part = partition(rows, question);
      // try splitting the set
      let trueRows = part.trueRows, falseRows = part.falseRows;
      //skip if it doesn't divide it
      if (trueRows.length == 0 || falseRows.length == 0) continue;

      let gain = infoGain(trueRows, falseRows, currentUncertainty);
      if (gain >= bestGain) {
        bestGain = gain;
        bestQuestion = question;
      }


    }
  }
  return {bestGain, bestQuestion};
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function buildTree(rows) {
  let bestSplit = findBestSplit(rows);
  console.log(bestSplit);
  let gain = bestSplit.bestGain, question = bestSplit.bestQuestion;

  if (gain == 0) return new Leaf(rows);

  let part = partition(rows, question);
  let trueRows = part.trueRows, falseRows = part.falseRows;

  let trueBranch = buildTree(trueRows);

  let falseBranch = buildTree(falseRows);

  return new DecisionNode(question, trueBranch, falseBranch);
}

const transpose = array => array[0].map((col, i) => array.map(row => row[i]));

const count = (array, item) => array.filter(v => v == item).length;
