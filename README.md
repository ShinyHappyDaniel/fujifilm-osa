# FUJIFILM X Summit AW, OSA-sida

Statisk landningssida med OSA-formulär för FUJIFILM X Summit AW (After Watching),
Studio Perra, Maria Skolgata 83, onsdagen den 2 december 2026, 18:00 till 21:00.
Byggd av Shiny Happy People efter designsystemet Fujifilm Imaging.

Live: https://fujifilm.shinyhappypeople.se/

## Struktur

```
index.html   Sidan
styles.css   All CSS, designsystemets tokens som variabler i :root
script.js    Formulärlogik: validering, ja/nej, tacktext, spamfälla
db.js        Koppling till databasen (Supabase), adress och publik nyckel
img/         Toppbild, formulärbild och FUJIFILM X | GFX-loggan
CNAME        Egen domän för GitHub Pages
```

## Så sparas svaren

- Sidan anropar två funktioner i databasen: `fujifilm_osa_status` och `fujifilm_osa_svara`.
- Den publika nyckeln i `db.js` når bara de två funktionerna, aldrig listan med svar.
- Ett svar per e-postadress. Svarar samma adress igen skrivs det gamla svaret över.
- Anmälan stängs i databasen. Då visar sidan "Anmälan är stängd." i stället för formuläret.

## Ändra

Ändra filerna, höj `?v=` på länkarna till `styles.css`, `db.js` och `script.js` i `index.html`, pusha till `main`.

## Lokalt

```bash
npx serve .
```

Formuläret skriver till den riktiga databasen även lokalt.
