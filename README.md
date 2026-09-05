# Hôtel Aguelmam — Site statique cPanel

## Installation

1. Décompressez le fichier ZIP.
2. Uploadez **tout le contenu** du dossier `hotel-aguelmam/` dans le dossier `public_html/` de votre cPanel (via File Manager ou FTP).
3. Visitez votre domaine — le site est en ligne.

## Structure

- `index.html`, `a-propos.html`, `chambres.html`, `restaurant.html`, `galerie.html`, `services.html`, `reservation.html`, `contact.html`
- `assets/css/style.css` — thème Rouge Premium (#B71C1C)
- `assets/js/main.js` — menu, galeries, lightbox
- `assets/js/reservation.js` — validation + récap + envoi Email/WhatsApp
- `assets/images/` — 19 photos
- `.htaccess` — URLs propres, compression, cache
- `robots.txt`, `sitemap.xml`

## Personnalisation

- **Email de contact** : `assets/js/reservation.js` → `HOTEL_EMAIL`
- **WhatsApp** : `assets/js/reservation.js` → `HOTEL_WA` (format E.164 sans le +)
- **Tarifs** : `assets/js/reservation.js` → objet `ROOMS`, et sections HTML correspondantes.
- **Sitemap** : remplacez `aguelmam.example` par votre domaine réel.

## Fonctionnalités

- 8 pages responsive (mobile + desktop)
- 4 chambres avec galerie photo interactive (3 vues chacune)
- Réservation avec validation stricte + récapitulatif + envoi Email/WhatsApp + impression
- Carte Google Maps intégrée
- URLs propres via `.htaccess`
"# hooo" 
