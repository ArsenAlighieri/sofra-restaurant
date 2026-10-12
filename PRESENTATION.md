# Understand the code before your assessment

Use these points to study, then explain the implementation in your own words.

## HTML

`header` contains branding and `nav`; `main` holds primary content; `footer` holds location/hours. The single h1 states the page subject. Section h2s introduce major sections; menu h3s label categories; dish h4s name individual dishes. Each section references its heading with `aria-labelledby`.

`href="#menu"` scrolls to `id="menu"`. The same pattern connects reservation, story and location links. The skip link lets a keyboard user jump straight to main content. Images have descriptive alt text; ornamental arrows and stars are hidden from assistive technology.

## CSS

`box-sizing: border-box` includes padding and borders in declared sizes. The universal selector applies it to elements and pseudo-elements.

Custom properties in `:root` define the colour palette. For example, `background: var(--green)` uses the same green on buttons, the values strip and the footer.

Flexbox handles one-dimensional arrangements: navigation links, the header row and each dish name/price pair. `justify-content: space-between` separates a dish's name and price without positioning them manually.

Grid creates page columns: the hero, menu, story and footer. `repeat(3, minmax(0, 1fr))` makes three equal menu columns. The zero minimum permits columns to shrink instead of overflowing because of intrinsic content widths.

Below 700px the hero, menu and about sections switch to one column; the header navigation becomes its own row. The footer uses two columns and switches to one below 380px. The container uses a percentage width with safe side spacing. Images fit their containers and use `object-fit: cover`.

`clamp()` scales headings within minimum and maximum sizes. `:focus-visible` makes keyboard focus visible. `prefers-reduced-motion` disables smooth scrolling for visitors who request less motion.

## Booking and limitations

The main CTA is an anchor to the reservation section. The call button is a `tel:` link handled by the visitor's device. HTML and CSS alone cannot save or confirm a booking. Restaurant details are fictional and labelled accordingly.

## Demonstrate your understanding

1. Change one colour variable and explain every component it affects.
2. Show the menu at mobile and desktop widths and identify the Grid change.
3. Use Tab to reach the skip link and explain why it exists.
4. Add a dish with the same semantic structure and make a real commit.
5. Explain your own contributions and the scope of AI assistance honestly.
