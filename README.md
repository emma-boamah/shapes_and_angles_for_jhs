# Shapes & Angles for JHS

An interactive, browser-based geometry learning tool for Junior High School students. Explore triangle angle sums, classify triangles, investigate regular polygons, and check understanding with a short quiz.

## Activities

- **Triangle Explorer** — [open the full-page interactive triangle explorer](triangle-explorer.html). It gives the diagram a large, responsive area and automatically adjusts the view so every vertex and angle label remains visible.
- **Polygon Lab** — explore regular triangles, quadrilaterals, pentagons, hexagons, and octagons, with side counts, angle sums, and diagonal counts.
- **Quick Quiz** — answer multiple-choice questions with explanations and a score.

## Run locally

Clone the repository and open `index.html` or `triangle-explorer.html` in a current web browser. Alternatively, serve the folder with any static web server:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000` and open `triangle-explorer.html` for the enlarged explorer.

## Publish with GitHub Pages

In the repository, open **Settings → Pages**, choose the `main` branch and `/ (root)` as the publishing source, and save. Once published, the main tool will be available at:

`https://emma-boamah.github.io/shapes_and_angles_for_jhs/`

The full-page triangle explorer will be at:

`https://emma-boamah.github.io/shapes_and_angles_for_jhs/triangle-explorer.html`

## Embed in Digilearn

After GitHub Pages is enabled, the standalone tool can be embedded in a Digilearn lesson using an iframe, or linked as an external activity:

```html
<iframe
  src="https://emma-boamah.github.io/shapes_and_angles_for_jhs/triangle-explorer.html"
  title="Interactive triangle angle explorer"
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

- `index.html` — main learning activities
- `styles.css` — main responsive visual design
- `script.js` — polygon and quiz interactions, plus the main-page triangle
- `triangle-explorer.html` — dedicated large-screen triangle explorer
- `triangle-explorer.css` — explorer-specific responsive layout
- `triangle-explorer.js` — triangle geometry and auto-fit viewBox
