const angleA = document.querySelector('#angle-a');
const angleB = document.querySelector('#angle-b');
const triangleSvg = document.querySelector('#triangle-svg');
const triangleShape = document.querySelector('#triangle-shape');
const svgNamespace = 'http://www.w3.org/2000/svg';
const arcColors = ['#ff8967', '#43b99b', '#8c68df'];
const radians = (degrees) => degrees * Math.PI / 180;

function makeSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(svgNamespace, tagName);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function updateTriangle() {
  const a = Number(angleA.value);
  const maximumB = 165 - a; // Keep angle C at least 15° so every selection is a valid triangle.
  angleB.max = String(maximumB);
  if (Number(angleB.value) > maximumB) angleB.value = String(maximumB);
  const b = Number(angleB.value);
  const c = 180 - a - b;
  document.querySelector('#out-a').textContent = `${a}°`;
  document.querySelector('#out-b').textContent = `${b}°`;
  document.querySelector('#out-c').textContent = `${c}°`;
  document.querySelector('#triangle-sum').textContent = `${a}° + ${b}° + ${c}° = 180°`;

  // Draw to scale, then tightly fit the SVG viewBox around the triangle and labels.
  const base = 400;
  const A = [base * Math.sin(radians(b)) / Math.sin(radians(a)) * Math.cos(radians(c)), -base * Math.sin(radians(b)) / Math.sin(radians(a)) * Math.sin(radians(c))];
  const B = [base, 0];
  const C = [0, 0];
  const vertices = [A, B, C];
  const angles = [a, b, c];
  triangleShape.setAttribute('points', vertices.map((point) => point.join(',')).join(' '));
  document.querySelector('#triangle-description').textContent = `Triangle A has angle ${a} degrees, angle B is ${b} degrees, and angle C is ${c} degrees. Their sum is 180 degrees.`;

  const groups = ['#angle-arcs', '#vertex-dots', '#angle-labels', '#vertex-labels'].map((selector) => document.querySelector(selector));
  groups.forEach((group) => group.replaceChildren());
  const [arcs, dots, angleLabels, vertexLabels] = groups;
  const bounds = vertices.map(([x, y]) => [x, y]);
  const centroid = vertices.reduce((sum, point) => [sum[0] + point[0] / 3, sum[1] + point[1] / 3], [0, 0]);

  vertices.forEach((vertex, index) => {
    const adjacent = vertices.filter((_, otherIndex) => otherIndex !== index);
    const directions = adjacent.map((point) => {
      const dx = point[0] - vertex[0]; const dy = point[1] - vertex[1];
      const length = Math.hypot(dx, dy);
      return [dx / length, dy / length];
    });
    const bisectorVector = [directions[0][0] + directions[1][0], directions[0][1] + directions[1][1]];
    const bisectorLength = Math.hypot(...bisectorVector);
    const bisector = [bisectorVector[0] / bisectorLength, bisectorVector[1] / bisectorLength];
    const radius = Math.min(37, Math.max(20, base * Math.sin(radians(angles[index])) * .13));
    const start = [vertex[0] + directions[0][0] * radius, vertex[1] + directions[0][1] * radius];
    const end = [vertex[0] + directions[1][0] * radius, vertex[1] + directions[1][1] * radius];
    const startAngle = Math.atan2(directions[0][1], directions[0][0]);
    const endAngle = Math.atan2(directions[1][1], directions[1][0]);
    const delta = ((endAngle - startAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    arcs.append(makeSvgElement('path', {
      d: `M ${start[0]} ${start[1]} A ${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${end[0]} ${end[1]}`,
      class: 'angle-arc', stroke: arcColors[index]
    }));

    const labelRadius = radius + 25;
    const anglePosition = [vertex[0] + bisector[0] * labelRadius, vertex[1] + bisector[1] * labelRadius];
    const angleText = makeSvgElement('text', { x: anglePosition[0], y: anglePosition[1], class: 'angle-text' });
    angleText.textContent = `${angles[index]}°`;
    angleLabels.append(angleText);
    bounds.push(anglePosition);

    dots.append(makeSvgElement('circle', { cx: vertex[0], cy: vertex[1], r: 6, class: 'vertex-dot' }));
    const outward = [vertex[0] - centroid[0], vertex[1] - centroid[1]];
    const outwardLength = Math.hypot(...outward);
    const vertexPosition = [vertex[0] + outward[0] / outwardLength * 35, vertex[1] + outward[1] / outwardLength * 35];
    const vertexText = makeSvgElement('text', { x: vertexPosition[0], y: vertexPosition[1], class: 'vertex-text' });
    vertexText.textContent = ['A', 'B', 'C'][index];
    vertexLabels.append(vertexText);
    bounds.push(vertexPosition);
  });

  const xValues = bounds.map(([x]) => x);
  const yValues = bounds.map(([, y]) => y);
  const padding = 55;
  const minX = Math.min(...xValues) - padding;
  const minY = Math.min(...yValues) - padding;
  const width = Math.max(...xValues) - Math.min(...xValues) + padding * 2;
  const height = Math.max(...yValues) - Math.min(...yValues) + padding * 2;
  triangleSvg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);

  const kind = [a, b, c].some((value) => value === 90) ? 'right-angled' : [a, b, c].some((value) => value > 90) ? 'obtuse' : 'acute';
  const description = kind === 'right-angled' ? 'one angle is exactly 90°.' : kind === 'obtuse' ? 'one angle is greater than 90°.' : 'all three angles are less than 90°.';
  document.querySelector('#triangle-type').textContent = `This is a ${kind} triangle: ${description}`;
}
angleA.addEventListener('input', updateTriangle);
angleB.addEventListener('input', updateTriangle);
document.querySelector('#reset-triangle').addEventListener('click', () => {
  angleA.value = '60';
  angleB.value = '60';
  updateTriangle();
});
updateTriangle();

const polygonNames = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 8: 'Octagon' };
function updatePolygon(sides) {
  const centerX = 150; const centerY = 125; const radius = 92;
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / sides;
    return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
  }).join(' ');
  document.querySelector('#polygon-shape').setAttribute('points', points);
  const name = polygonNames[sides];
  const angleSum = (sides - 2) * 180;
  document.querySelector('#shape-title').textContent = name;
  document.querySelector('#polygon-name').textContent = `REGULAR ${name.toUpperCase()}`;
  document.querySelector('#polygon-svg').setAttribute('aria-label', `Regular ${name.toLowerCase()} with ${sides} equal sides`);
  document.querySelector('#side-count').textContent = sides;
  document.querySelector('#angle-sum').textContent = `${angleSum}°`;
  document.querySelector('#each-angle').textContent = `${angleSum / sides}°`;
  document.querySelector('#diagonal-count').textContent = sides * (sides - 3) / 2;
}
document.querySelectorAll('.shape-choice').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.shape-choice').forEach((choice) => {
      const active = choice === button;
      choice.classList.toggle('active', active);
      choice.setAttribute('aria-pressed', String(active));
    });
    updatePolygon(Number(button.dataset.sides));
  });
});
updatePolygon(3);

const questions = [
  { text: 'What is the sum of the interior angles in a triangle?', options: ['90°', '180°', '270°', '360°'], answer: 1, explanation: 'A triangle’s three interior angles always add up to 180°.' },
  { text: 'How many diagonals can you draw in a quadrilateral?', options: ['0', '1', '2', '4'], answer: 2, explanation: 'A quadrilateral has 2 diagonals, each joining opposite vertices.' },
  { text: 'A triangle has angles 50° and 60°. What is its third angle?', options: ['60°', '70°', '80°', '90°'], answer: 1, explanation: '180° − 50° − 60° = 70°.' }
];
let questionIndex = 0;
let selectedAnswer = null;
let score = 0;
let answered = false;
const optionContainer = document.querySelector('#answer-options');
const nextButton = document.querySelector('#next-question');
function renderQuestion() {
  const question = questions[questionIndex];
  document.querySelector('#quiz-progress-text').textContent = `QUESTION ${questionIndex + 1} OF ${questions.length}`;
  document.querySelector('#progress-fill').style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  document.querySelector('#question-text').textContent = question.text;
  document.querySelector('#quiz-feedback').textContent = '';
  document.querySelector('#quiz-feedback').className = 'quiz-feedback';
  document.querySelector('#score-text').textContent = `Score: ${score}`;
  optionContainer.replaceChildren();
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'answer-option';
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => {
      if (answered) return;
      selectedAnswer = index;
      optionContainer.querySelectorAll('button').forEach((choice) => choice.classList.toggle('selected', choice === button));
      nextButton.disabled = false;
      nextButton.textContent = 'Check answer';
    });
    optionContainer.append(button);
  });
  selectedAnswer = null;
  answered = false;
  nextButton.disabled = true;
  nextButton.textContent = 'Check answer';
}
nextButton.addEventListener('click', () => {
  if (!answered) {
    if (selectedAnswer === null) return;
    answered = true;
    const question = questions[questionIndex];
    const correct = selectedAnswer === question.answer;
    if (correct) score += 1;
    optionContainer.querySelectorAll('button').forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add('correct');
      else if (index === selectedAnswer) button.classList.add('incorrect');
    });
    const feedback = document.querySelector('#quiz-feedback');
    feedback.textContent = `${correct ? 'Correct!' : 'Not quite.'} ${question.explanation}`;
    feedback.classList.add(correct ? 'good' : 'bad');
    document.querySelector('#score-text').textContent = `Score: ${score}`;
    nextButton.textContent = questionIndex === questions.length - 1 ? 'See results' : 'Next question';
  } else if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
  } else {
    document.querySelector('#quiz-progress-text').textContent = 'QUIZ COMPLETE';
    document.querySelector('#progress-fill').style.width = '100%';
    document.querySelector('#question-text').textContent = score === questions.length ? 'Excellent work—you’re a geometry star!' : score >= 2 ? 'Great job—you’re building strong geometry skills!' : 'Good try! Explore the activities above and give it another go.';
    optionContainer.replaceChildren();
    document.querySelector('#quiz-feedback').textContent = `You scored ${score} out of ${questions.length}.`;
    document.querySelector('#quiz-feedback').className = 'quiz-feedback good';
    nextButton.textContent = 'Try again';
    nextButton.onclick = () => {
      questionIndex = 0;
      score = 0;
      nextButton.onclick = null;
      renderQuestion();
    };
  }
});
renderQuestion();
