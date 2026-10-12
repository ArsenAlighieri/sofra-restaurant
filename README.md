# Sofra — restaurant website

A responsive, single-page restaurant website built with **plain HTML5 and CSS3**. No JavaScript, frameworks, build tools or runtime external dependencies. Sofra is a fictional restaurant; the menu, prices, opening hours, location and phone number are example content.

## Open the website

Open `dist/index.html` directly in a browser. Alternatively, run `python -m http.server 8080 --directory dist` from this folder and visit `http://localhost:8080`.

## Files

- `dist/index.html` — English content, semantic landmarks and working anchor links.
- `dist/styles.css` — colour variables, global border-box, Flexbox, Grid and responsive styles.
- `dist/assets/` — locally stored photographs; see `ASSETS.md` for sources.
- `CHECKLIST.md` — assignment requirements and verification results.
- `PRESENTATION.md` — explanations to study before the assessment.

## Reservation behaviour

The main “Book a table” CTA links to the reservation section. “Call to book a table” uses an HTML `tel:` link to open a compatible phone application. This project has no server and does not store or confirm reservations. The example UK number is fictional. Replace it and the example address before using this as a real restaurant website.

## Independent work and Git history

This implementation was prepared with AI assistance. Follow your course's AI policy, understand the code, make your own contributions, and explain the assistance honestly at assessment. The actual small commits record this preparation session; they do not represent weeks of student work.

The group must have 4–5 members, agree on a shared project/look, meet during the week and help each other debug. Each member must write their own code and use their own GitHub repository. Do not distribute this implementation for teammates to copy. Group participation and the individual presentation cannot be completed by the website itself.

## Make your own changes

Change colours in `:root`, edit dishes in the three menu articles, or adjust spacing in the media queries. After checking your change:

```sh
git add dist/index.html dist/styles.css
git commit -m "Describe your actual change"
git push
```

## Verification

Chromium browser checks passed at 320, 375, 390, 768, 1024, 1440 and 1920 CSS pixels: no horizontal overflow, all images loaded, one h1, valid fragment destinations, English language, global border-box and rendered Grid/Flexbox layouts. Navigation, reservation href, keyboard skip link and reduced-motion behaviour passed. Mobile and desktop screenshots were visually reviewed.

No claim of testing every browser or physical device is made. No real reservation service is included.
