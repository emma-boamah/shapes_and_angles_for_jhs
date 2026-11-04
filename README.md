# Shapes & Angles for JHS

An interactive, browser-based geometry learning tool for Junior High School students. Explore triangle angle sums, classify triangles, investigate regular polygons, and check understanding with a short quiz.

## Features

- **Interactive triangle explorer:** adjust two angles with sliders and see the third calculated from the 180° triangle angle-sum rule.
- **Triangle classification:** get instant feedback for acute, right-angled, and obtuse triangles.
- **Polygon lab:** explore regular triangles, quadrilaterals, pentagons, hexagons, and octagons.
- **Shape facts:** see the number of sides, interior angle sum, each regular interior angle, and number of diagonals.
- **Quick quiz:** three multiple-choice questions with explanations and a score.
- Responsive layout, keyboard-friendly controls, and no build step or JavaScript dependencies.

## Run locally

Clone the repository and open `index.html` in a current web browser. Alternatively, serve the folder with any static web server:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

In the repository, open **Settings → Pages**, choose the `main` branch and `/ (root)` as the publishing source, and save. Once published, the tool will be available at:

`https://emma-boamah.github.io/shapes_and_angles_for_jhs/`

## Embed in Digilearn

After GitHub Pages is enabled, the standalone tool can be embedded in a Digilearn lesson using an iframe, or linked as an external activity:

```html
<iframe
  src="https://emma-boamah.github.io/shapes_and_angles_for_jhs/"
  title="Shapes and Angles interactive geometry tool"
  width="100%"
  height="850"
  loading="lazy"
  style="border:0; border-radius:12px"
></iframe>
```

Check the Digilearn Content Security Policy and iframe settings before embedding. If embedding is blocked or the layout should be more tightly integrated, the files can instead be moved into the Digilearn Laravel app and served from there.

## Learning maths used

For an *n*-sided polygon:

- Interior angle sum: `(n − 2) × 180°`
- Each interior angle of a regular polygon: `((n − 2) × 180°) ÷ n`
- Number of diagonals: `n × (n − 3) ÷ 2`

The triangle explorer uses `C = 180° − A − B`.

## Project files

- `index.html` — accessible page structure and learning activities
- `styles.css` — responsive visual design
- `script.js` — triangle, polygon, and quiz interactions
