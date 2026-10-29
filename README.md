# indo2afri website

A static website for indo2afri, an export, import and freight logistics company. It is plain HTML, CSS and a little JavaScript, with no build step, so it can be hosted anywhere (Netlify, Vercel, GitHub Pages, cPanel).

The design is custom: a deep navy hero with a live dotted world map (trade lanes pulse both ways between India, Africa, Europe, the Gulf and Asia), bright sections of rounded cards, tinted product tiles and line icons, with the brand orange `#F04A2A` as the accent. Type is Unbounded for headings, Onest for text and JetBrains Mono for trade codes (HS chapters, container sizes, Incoterms), all from Google Fonts.

## Pages

| Page | File | Contents |
| --- | --- | --- |
| Home | `index.html` | Hero with the freight board, the five freight modes, the seven product lines, the four shipment stages, a quote prompt |
| About us | `about.html` | What the company does: sourcing, freight forwarding, customs and documents, delivery |
| Products | `products.html` | Clothes, LPG Machines, Agricultural Equipment, Medical Equipment, Furniture, Shoes, Ladies' Lingerie (each one has an anchor, e.g. `products.html#shoes`) |
| Services | `services.html` | Air Freight, Sea Freight, Rail Logistics, Road Transport, Courier (e.g. `services.html#courier`) |
| Contact us | `contact.html` | Contact details and a quote request form with mode, route, Incoterm and ready date; `contact.html?topic=shoes` preselects the topic |

The Products and Services menus open on hover or keyboard focus. Phones get a single Menu button.

## Logo files (`assets/brand/`)

The mark is a square orange plate with two opposed arrows: export out, import in. The wordmark is set in lowercase Jost, widely spaced, and converted to outlines, so the SVGs need no font installed.

| Use | SVG | PNG (`assets/brand/png/`) |
| --- | --- | --- |
| Primary / navbar logo (horizontal, orange wordmark, transparent; works on light and dark) | `logo-primary.svg` | `logo-primary.png` (2308 x 400) |
| Dark version (ink wordmark), for light backgrounds | `logo-dark.svg` | `logo-dark.png` |
| White version (white wordmark), for dark backgrounds | `logo-light.svg` | `logo-light.png` |
| Footer, monochrome white | `logo-mono-white.svg` | `logo-mono-white.png` |
| Monochrome black (print, stamps) | `logo-mono-black.svg` | `logo-mono-black.png` |
| Stacked badge, light backgrounds | `logo-stacked-dark.svg` | `logo-stacked-dark.png` |
| Stacked badge, dark backgrounds | `logo-stacked-light.svg` | `logo-stacked-light.png` |
| Stacked badge, monochrome white | `logo-stacked-mono-white.svg` | `logo-stacked-mono-white.png` |
| App icon / favicon (mark only, square) | `icon.svg`, `mark.svg`, `favicon.ico` (16, 32, 48) | `icon-512.png`, `icon-192.png`, `apple-touch-icon.png` (180), `favicon-16/32/48.png` |
| Mark, monochrome white | `mark-mono-white.svg` | `mark-mono-white-512.png` |

Colours: orange `#F04A2A`, ink `#10141C`, white `#FFFFFF`. Ink text on orange passes WCAG AA contrast. White on orange does not for small text, so buttons use ink text.

## Before going live

- **Contact details.** The email, phone and office address show as dashed "to be added" boxes on the contact page and in the footer of every page. Search for `class="fill"` and replace them.
- **The quote form** is not connected to anything yet, and it tells the visitor so. Set `data-endpoint` on the `<form>` in `contact.html` to a form service URL (Formspree, Netlify Forms, Basin, or your own server) and it will post there.
- **Photographs.** The site uses icons and the route map instead of photos, so it works with nothing to license. Real photos of your cargo, warehouse or team can be added to the product and service cards later.
- **Copy.** The product and service descriptions are a first draft written from the category names. Check each line against what you actually supply and offer.

## Editing

All pages share `assets/css/style.css` (colours, type and spacing are tokens at the top of the file) and `assets/js/main.js` (route maps, menu, form). The map dots in `assets/js/land-dots.js` are generated from Natural Earth land data. To change the brand colour, edit `--orange` in `style.css`. The header and footer are repeated in each HTML file, so a menu change needs to be made in all five.
