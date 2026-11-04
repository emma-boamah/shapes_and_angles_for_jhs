const angleA = document.querySelector('#angle-a');
const angleB = document.querySelector('#angle-b');
const trianglePoints = { A: [200, 35], B: [350, 250], C: [50, 250] };
const toRad = (degrees) => degrees * Math.PI / 180;

function pointOnArc(vertex, startAngle, endAngle, radius) {
  const middle = (startAngle + endAngle) / 2;
  const start = [vertex[0] + radius * Math.cos(startAngle), vertex[1] + radius * Math.sin(startAngle)];
  const end = [vertex[0] + radius * Math.cos(endAngle), vertex[1] + radius * Math.sin(endAngle)];
  const sweep = endAngle - startAngle > Math.PI ? 1 : 0;
  return { d: `M ${start[0]} ${start[1]} A ${radius} ${radius} 0 ${sweep} 1 ${end[0]} ${end[1]}`, label: [vertex[0] + (radius + 23) * Math.cos(middle), vertex[1] + (radius + 23) * Math.sin(middle)] };
}

function updateTriangle() {
  const a = Number(angleA.value);
  const b = Number(angleB.value);
  const c = 180 - a - b;
  document.querySelector('#out-a').textContent = `${a}°`;
  document.querySelector('#out-b').textContent = `${b}°`;
  document.querySelector('#out-c').textContent = `${c}°`;
  document.querySelector('#label-a').textContent = `${a}°`;
  document.querySelector('#label-b').textContent = `${b}°`;
  document.querySelector('#label-c').textContent = `${c}°`;
  document.querySelector('#triangle-sum').textContent = `${a}° + ${b}° + ${c}° = 180°`;

  // Keep the visual triangle honest: its angles follow the selected values.
  const side = 300;
  const height = side * Math.sin(toRad(a)) * Math.sin(toRad(b)) / Math.sin(toRad(c));
  const baseY = 250;
  const baseX = 200;
  const xA = baseX - side * Math.sin(toRad(b)) * Math.cos(toRad(a)) / Math.sin(toRad(c));
  const yA = baseY - height;
  const points = `${xA},${yA} ${baseX + side / 2},${baseY} ${baseX - side / 2},${baseY}`;
  document.querySelector('#triangle-shape').setAttribute('points', points);

  // For the angle markers, derive each corner's adjacent ray directions.
  const vertices = [[xA, yA], [baseX + side / 2, baseY], [baseX - side / 2, baseY]];
  const values = [a, b, c];
  const arcIds = ['#arc-a', '#arc-b', '#arc-c'];
  const labelIds = ['#label-a', '#label-b', '#label-c'];
  vertices.forEach((v, i) => {
    const other = vertices.filter((_, j) => j !== i);
    let t1 = Math.atan2(other[0][1] - v[1], other[0][0] - v[0]);
    let t2 = Math.atan2(other[1][1] - v[1], other[1][0] - v[0]);
    let diff = (t2 - t1 + Math.PI * 2) % (Math.PI * 2);
    if (diff > Math.PI) { [t1, t2] = [t2, t1]; diff = Math.PI * 2 - diff; }
    const arc = pointOnArc(v, t1, t1 + diff, 27);
    document.querySelector(arcIds[i]).setAttribute('d', arc.d);
    const label = document.querySelector(labelIds[i]);
    const factor = values[i] < 35 ? 1.8 : 1;
    label.setAttribute('x', v[0] + (arc.label[0] - v[0]) * factor);
    label.setAttribute('y', v[1] + (arc.label[1] - v[1]) * factor);
  });

  const kind = [a, b, c].some((value) => value === 90) ? 'right-angled' : [a, b, c].some((value) => value > 90) ? 'obtuse' : 'acute';
  const description = kind === 'right-angled' ? 'one angle is exactly 90°.' : kind === 'obtuse' ? 'one angle is greater than 90°.' : 'all three angles are less than 90°.';
  document.querySelector('#triangle-type').textContent = `This is a ${kind} triangle: ${description}`;
}
angleA.addEventListener('input', updateTriangle);
angleB.addEventListener('input', updateTriangle);
document.querySelector('#reset-triangle').addEventListener('click', () => { angleA.value = 60; angleB.value = 60; updateTriangle(); });
updateTriangle();

const polygonNames = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 8: 'Octagon' };
function updatePolygon(sides) {
  const cx = 150; const cy = 125; const radius = 92;
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = -Math.PI / 2 + i * Math.PI * 2 / sides;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(' ');
  document.querySelector('#polygon-shape').setAttribute('points', points);
  const name = polygonNames[sides];
  const angleSum = (sides - 2) * 180;
  const eachAngle = angleSum / sides;
  const diagonals = sides * (sides - 3) / 2;
  document.querySelector('#shape-title').textContent = name;
  document.querySelector('#polygon-name').textContent = `REGULAR ${name.toUpperCase()}`;
  document.querySelector('#polygon-svg').setAttribute('aria-label', `Regular ${name.toLowerCase()} with ${sides} equal sides`);
  document.querySelector('#side-count').textContent = sides;
  document.querySelector('#angle-sum').textContent = `${angleSum}°`;
  document.querySelector('#each-angle').textContent = `${eachAngle}°`;
  document.querySelector('#diagonal-count').textContent = diagonals;
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
    nextButton.disabled = false;
    nextButton.onclick = () => { questionIndex = 0; score = 0; nextButton.onclick = null; renderQuestion(); };
  }
});
renderQuestion();
