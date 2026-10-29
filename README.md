# Indo-Afrik website

A static website for Indo-Afrik, an export, import and freight logistics company. It is plain HTML, CSS and a little JavaScript, with no build step, so it can be hosted anywhere (Netlify, Vercel, GitHub Pages, cPanel).

The design uses the **Wayfind** theme from [Hallmark](https://github.com/Nutlope/hallmark). It looks like airport and rail signage: cool grey paper, blue-black ink, square 2px borders and Chivo Mono throughout. The theme's cobalt is replaced by the brand orange `#F04A2A`.

## Pages

| Page | File | Contents |
| --- | --- | --- |
| Home | `index.html` | Hero with the freight board, the five freight modes, the seven product lines, the four shipment stages, a quote prompt |
| About us | `about.html` | What the company does: sourcing, freight forwarding, customs and documents, delivery |
| Products | `products.html` | Clothes, LPG Machines, Agricultural Equipment, Medical Equipment, Furniture, Shoes, Ladies' Lingerie (each one has an anchor, e.g. `products.html#shoes`) |
| Services | `services.html` | Air Freight, Sea Freight, Rail Logistics, Road Transport, Courier (e.g. `services.html#courier`) |
| Contact us | `contact.html` | Contact details and a quote request form; `contact.html?topic=shoes` preselects the topic |

The Products and Services menus open on hover or keyboard focus. Phones get a single Menu button.

## Logo files (`assets/brand/`)

The mark is a square orange plate with two opposed arrows: export out, import in. The wordmark is Chivo Mono ExtraBold, converted to outlines, so the SVGs need no font installed.

| Use | SVG | PNG (`assets/brand/png/`) |
| --- | --- | --- |
| Primary / navbar logo (horizontal, transparent) | `logo-primary.svg` | `logo-primary.png` (2308 x 400) |
| Dark version, for light backgrounds | `logo-dark.svg` | `logo-dark.png` |
| White/light version, for dark backgrounds | `logo-light.svg` | `logo-light.png` |
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
- **Photographs** are stand-ins from Wikimedia Commons (credited in each page's footer), loaded straight from Wikimedia. Replace them with your own photos: put the files in `assets/img/`, then change the `src` (and remove the `srcset`) on the matching `<img>` inside each `data-slot` figure. LPG Machines and Courier have no stand-in photo; they show a signage panel until you add one.
- **Copy.** The product and service descriptions are a first draft written from the category names. Check each line against what you actually supply and offer.

## Editing

All pages share `assets/css/site.css`, which imports `tokens.css` (colours, type, spacing) and `base.css`. To change the brand colour, edit `--color-accent` in `tokens.css`. The header and footer are repeated in each HTML file, so a menu change needs to be made in all five.
