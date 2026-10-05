# Samen Thuis — nieuwe testrepository

Een schone, zelfstandige basis om de Samen Thuis-app laag voor laag opnieuw op te bouwen en te testen. Deze repository staat los van de bestaande app.

## Wat zit erin?

- **Laag 1 — achtergrond en layout:** donkerblauwe achtergrond (`#0d273e`), responsive shell, sidebar, topbar en mobiele ondernavigatie.
- **Laag 2 — design system:** centrale kleur- en maatvariabelen, kaarten, knoppen, tekstvelden, badges, meldingen en dialoogvenster.
- **Laag 3 — pagina-skeletten:** Vandaag, Agenda, Taken, Challenges, Weekmenu, Boodschappen, Voorraad, Woning, Budget, Date ideeën, Reizen, Extra en Instellingen.
- **Basisinteractie:** pagina-navigatie, testtaken toevoegen/afvinken/verwijderen, focus bewaren, snel toevoegen en lokale opslag.
- **Local-first:** geen Supabase-configuratie, geen externe API en geen externe JavaScript-bibliotheken.
- **Mobielvriendelijk:** geschikt als startpunt voor iPhone, iPad en laptop.

> Dit is bewust een testfundament, geen volledige migratie van de huidige app. De flexibele huishoudplanning uit v16 en de bestaande gegevensstructuur worden in een volgende stap gecontroleerd en geïmplementeerd; ze worden hier niet nagebootst alsof ze al af zijn.

## Lokaal testen

De app gebruikt gewone HTML, CSS en JavaScript; er is geen buildstap of package manager nodig.

1. Download of clone deze repository.
2. Open `index.html` in een moderne browser.
3. Voor testen als lokale webapp/PWA kun je ook GitHub Pages gebruiken: **Settings → Pages → Deploy from a branch → `main` → `/ (root)`**.
4. Open de gepubliceerde pagina op iPhone of iPad en kies indien gewenst **Deel → Zet op beginscherm**.

Browsers kunnen PWA-functies beperken wanneer je `index.html` rechtstreeks als `file://` opent. Voor normaal gebruik is GitHub Pages of een lokale statische server beter.

## Lokale opslag

De testgegevens worden opgeslagen onder de browser-key `samenThuisTestV1`. Ze worden niet automatisch gesynchroniseerd met andere apparaten. Wis de sitegegevens in de browser om de test opnieuw schoon te beginnen.

## Nieuwe repository aanmaken op GitHub

1. Maak op GitHub een **nieuwe lege repository**, bijvoorbeeld `samen-thuis-test`.
2. Upload de inhoud van deze ZIP (dus de bestanden en mappen binnen de map, niet de ZIP zelf) naar de root van die repository, of clone de lege repo en kopieer de bestanden erin.
3. Commit de eerste versie met bijvoorbeeld `Initial standalone test foundation`.
4. Schakel GitHub Pages in via **Settings → Pages** als je hem online wilt testen.
5. Laat de huidige Samen Thuis-repository ongemoeid. Werk alleen in deze nieuwe repository totdat de nieuwe basis gecontroleerd is.

## Bestandsstructuur

```text
samen-thuis-test-repository/
├── index.html
├── manifest.webmanifest
├── assets/
│   └── icon.svg
├── css/
│   ├── tokens.css       # kleuren, radii, spacing, schaduwen
│   ├── base.css         # basisregels en typografie
│   ├── components.css   # knoppen, kaarten, formulieren, meldingen
│   └── layout.css       # sidebar, pagina-indeling, responsive gedrag
├── js/
│   └── app.js           # navigatie en lokale testinteracties
└── docs/
    └── ROADMAP.md       # afgesproken opbouw in lagen
```

## Principes voor vervolgwerk

- Bestaande productie-app niet overschrijven.
- Eerst één laag afronden en testen, daarna pas verder.
- Houd stijlwaarden centraal in `css/tokens.css`.
- Houd HTML, CSS en JavaScript gescheiden.
- Geen Supabase of externe afhankelijkheden toevoegen zonder expliciete keuze.
- Bouw universele challenges en beloningen voor sport, lezen, leren, gewoontes en samen iets leuks doen — niet alleen schoonmaaktaken.
- Behoud de v16-logica voor flexibele taakfrequenties bij de latere functionele integratie.
