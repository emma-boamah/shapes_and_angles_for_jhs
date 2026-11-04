const svg = document.querySelector('#triangle-svg');
const shape = document.querySelector('#triangle-shape');
const angleA = document.querySelector('#angle-a');
const angleB = document.querySelector('#angle-b');
const NS = 'http://www.w3.org/2000/svg';
const colors = ['#ff8967', '#43b99b', '#8c68df'];
const rad = (degrees) => degrees * Math.PI / 180;
const svgElement = (tag, attrs = {}) => {
  const element = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
};

function drawTriangle() {
  const a = Number(angleA.value);
  const maxB = 165 - a; // Keep C at least 15° so every slider value makes a valid triangle.
  angleB.max = String(maxB);
  if (Number(angleB.value) > maxB) angleB.value = String(maxB);
  const b = Number(angleB.value);
  const c = 180 - a - b;
  document.querySelector('#out-a').textContent = `${a}°`;
  document.querySelector('#out-b').textContent = `${b}°`;
  document.querySelector('#out-c').textContent = `${c}°`;
  document.querySelector('#triangle-sum').textContent = `${a}° + ${b}° + ${c}° = 180°`;

  // Build a triangle with BC = 400 units. Its viewBox is recomputed below,
  // keeping every vertex, marker, and label in frame for narrow triangles.
  const side = 400;
  const A = [side * Math.sin(rad(b)) / Math.sin(rad(a)) * Math.cos(rad(c)), -side * Math.sin(rad(b)) / Math.sin(rad(a)) * Math.sin(rad(c))];
  const B = [side, 0];
  const C = [0, 0];
  const vertices = [A, B, C];
  const values = [a, b, c];
  shape.setAttribute('points', vertices.map((point) => point.join(',')).join(' '));
  document.querySelector('#triangle-description').textContent = `Triangle A has angle ${a} degrees, angle B is ${b} degrees, and angle C is ${c} degrees. Their sum is 180 degrees.`;

  const arcs = document.querySelector('#angle-arcs');
  const dots = document.querySelector('#vertex-dots');
  const angleLabels = document.querySelector('#angle-labels');
  const vertexLabels = document.querySelector('#vertex-labels');
  [arcs, dots, angleLabels, vertexLabels].forEach((group) => group.replaceChildren());
  const bounds = vertices.map((point) => [...point]);

  vertices.forEach((vertex, index) => {
    const other = vertices.filter((_, otherIndex) => otherIndex !== index);
    const unit = other.map((point) => {
      const dx = point[0] - vertex[0]; const dy = point[1] - vertex[1];
      const length = Math.hypot(dx, dy);
      return [dx / length, dy / length];
    });
    const bisectorLength = Math.hypot(unit[0][0] + unit[1][0], unit[0][1] + unit[1][1]);
    const bisector = [(unit[0][0] + unit[1][0]) / bisectorLength, (unit[0][1] + unit[1][1]) / bisectorLength];
    const arcRadius = Math.min(37, Math.max(20, side * Math.sin(rad(values[index])) * .13));
    const start = [vertex[0] + unit[0][0] * arcRadius, vertex[1] + unit[0][1] * arcRadius];
    const end = [vertex[0] + unit[1][0] * arcRadius, vertex[1] + unit[1][1] * arcRadius];
    const arc = svgElement('path', { d: `M ${start[0]} ${start[1]} A ${arcRadius} ${arcRadius} 0 0 0 ${end[0]} ${end[1]}`, class: 'angle-arc', stroke: colors[index] });
    arcs.append(arc);
    const labelRadius = arcRadius + 24;
    const labelPoint = [vertex[0] + bisector[0] * labelRadius, vertex[1] + bisector[1] * labelRadius];
    const angleText = svgElement('text', { x: labelPoint[0], y: labelPoint[1], class: 'angle-text' });
    angleText.textContent = `${values[index]}°`;
    angleLabels.append(angleText);
    bounds.push(labelPoint);

    const dot = svgElement('circle', { cx: vertex[0], cy: vertex[1], r: 6, class: 'vertex-dot' });
    dots.append(dot);
    const center = vertices.reduce((sum, point) => [sum[0] + point[0] / 3, sum[1] + point[1] / 3], [0, 0]);
    const outward = [vertex[0] - center[0], vertex[1] - center[1]];
    const outwardLength = Math.hypot(...outward);
    const vertexPoint = [vertex[0] + outward[0] / outwardLength * 35, vertex[1] + outward[1] / outwardLength * 35];
    const vertexText = svgElement('text', { x: vertexPoint[0], y: vertexPoint[1], class: 'vertex-text' });
    vertexText.textContent = ['A', 'B', 'C'][index];
    vertexLabels.append(vertexText);
    bounds.push(vertexPoint);
  });

  const xs = bounds.map(([x]) => x); const ys = bounds.map(([, y]) => y);
  const padding = 55;
  const minX = Math.min(...xs) - padding; const minY = Math.min(...ys) - padding;
  const width = Math.max(...xs) - Math.min(...xs) + padding * 2;
  const height = Math.max(...ys) - Math.min(...ys) + padding * 2;
  svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);

  const kind = [a, b, c].some((value) => value === 90) ? 'right-angled' : [a, b, c].some((value) => value > 90) ? 'obtuse' : 'acute';
  const description = kind === 'right-angled' ? 'one angle is exactly 90°.' : kind === 'obtuse' ? 'one angle is greater than 90°.' : 'all three angles are less than 90°.';
  document.querySelector('#triangle-type').textContent = `This is a ${kind} triangle: ${description}`;
}

angleA.addEventListener('input', drawTriangle);
angleB.addEventListener('input', drawTriangle);
document.querySelector('#reset-triangle').addEventListener('click', () => {
  angleA.value = '60'; angleB.value = '60'; drawTriangle();
});
drawTriangle();
