# Assignment checklist

| Requirement | Evidence / status |
| --- | --- |
| Single responsive page | `dist/index.html`; 7 viewport widths checked |
| Plain HTML5/CSS3, no frameworks | No JavaScript, packages or framework styles in the site |
| Hero | `.hero` section with the only h1 and main booking CTA |
| Menu instead of product grid | 3 semantic articles: starters, mains, desserts; 9 dishes |
| Reservation as main CTA | Header + hero booking links; reservation section with tel link |
| About | `#about` section |
| Footer with hours/location | `#visit`, address and opening-hours definition list |
| Semantic landmarks | header, nav, main, section, article, footer |
| One h1 | Browser DOM count = 1 at all tested widths |
| Working navigation links | All fragment targets exist; menu and reservation clicks checked |
| Global border-box | Universal selector and both pseudo-elements; browser computed style checked |
| Own colour variables | `:root` tokens in styles.css |
| Real Flexbox | Header, nav, hero CTA row, dish name/price row, footer bottom |
| Real Grid | Hero, menu, about and footer |
| No horizontal scroll | scrollWidth = viewport width at 320/375/390/768/1024/1440/1920px |
| Small real Git commits | See `git log --oneline`; no artificial dates or fabricated activity |
| Own GitHub repo | Created and pushed using the authenticated owner's GitHub CLI |
| Team of 4–5, shared look | Group must arrange and document this |
| Weekly meetings/debugging | Group must arrange and document this |
| Everyone codes independently | Each member must implement separately; do not share this code for copying |
| Explain your own code | Study and adapt the code; see PRESENTATION.md |

The booking action is a static demonstration, not a database-backed booking system. The assignment specifies HTML/CSS only, so no fabricated form submission or success message is shown.
