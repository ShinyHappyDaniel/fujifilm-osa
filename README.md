# FUJIFILM, OSA-sida

Statisk landningssida med OSA-formulär för ett FUJIFILM-event.
Byggd av Shiny Happy People efter designsystemet Fujifilm Imaging.

Live: https://fujifilm.shinyhappypeople.se/

## Struktur

```
index.html   Sidan
styles.css   All CSS, designsystemets tokens som variabler i :root
script.js    Formulärlogik: validering, ja/nej, tacktext, spamfälla
db.js        Koppling till databasen (Supabase), adress och publik nyckel
img/         Toppbild (hero.jpg, hero-mobile.jpg under 720 px), formulärbild och FUJIFILM X | GFX-loggan
CNAME        Egen domän för GitHub Pages
```

## Så sparas svaren

- Sidan anropar två funktioner i databasen: `fujifilm_osa_status` och `fujifilm_osa_svara`.
- Den publika nyckeln i `db.js` når bara de två funktionerna, aldrig listan med svar.
- Högst 150 personer, gäster inräknade. Är det fullt visar sidan "Eventet är fullbokat." Nej-svar tas alltid emot.
- Ett svar per e-postadress. Svarar samma adress igen skrivs det gamla svaret över.
- Sidvisningar räknas utan cookies via `fujifilm_besok_logga`: tidpunkt, källa och mobil eller dator. Inga IP-adresser.
- Anmälan stängs i databasen. Då visar sidan "Anmälan är stängd." i stället för formuläret.

## Ändra

Ändra filerna, höj `?v=` på länkarna till `styles.css`, `db.js` och `script.js` i `index.html`, pusha till `main`.

## Lokalt

```bash
npx serve .
```

Formuläret skriver till den riktiga databasen även lokalt.
