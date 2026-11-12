# Raghav Krishna Ranganathan — Portfolio

Live: https://raghavkr17.github.io/portfolio/

Personal portfolio for a Human Centered Design & Engineering student at the University of Washington. Hand-built in plain HTML, CSS, and JavaScript: no framework, no build step, no trackers.

## Structure
```
index.html                 Homepage
work/mitcham.html          Case study: food-rescue marketplace
work/muzings.html          Case study: QA at an AI memory startup
work/airpods-case.html     Case study: AirPods case redesign (HCDE 316)
work/seniorguard.html      Case study: IoT elder-care monitoring
work/airpods-viewer.html   Interactive Three.js viewer (embedded)
assets/css/style.css       All styles (dark theme, motion, responsive)
assets/js/main.js          Interactions (reveals, cursor, particles, counters)
assets/img/                Images, favicon, social preview (og.png)
404.html                   Not-found page
```

## Accessibility
Semantic landmarks, skip link, visible focus rings, 44px touch targets, WCAG AA contrast, and every animation turns off under `prefers-reduced-motion`.

## Editing
Draft "To add" notes live inside the case-study pages and are hidden on the live site by `class="hide-todo"` on `<body>`. Remove that class locally to see them.

## Custom domain
When a domain is added, update the `/portfolio/` paths in `404.html` and the absolute URLs in the `<head>` meta tags.
