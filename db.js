// Databasen (Supabase). Den publika nyckeln når bara fujifilm_osa_status() och
// fujifilm_osa_svara(), aldrig själva listan.
var DB_URL = 'https://nkfxqteujqatmzwbnxrn.supabase.co';
var DB_KEY = 'sb_publishable_BWeioTLKbRV83mLM8oy9-w_uUhJr5zX';

function dbRpc(fn, args) {
  return fetch(DB_URL + '/rest/v1/rpc/' + fn, {
    method: 'POST',
    headers: { 'apikey': DB_KEY, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(args || {})
  }).then(function (res) {
    if (!res.ok) throw new Error('Databasen svarade ' + res.status);
    return res.json();
  });
}

// Frågan om anmälan är öppen startar direkt. Ger {oppen}, eller null om databasen
// inte svarar (då visas formuläret som vanligt).
var DB_STATUS = dbRpc('fujifilm_osa_status').catch(function (err) {
  console.error('Kunde inte kolla om anmälan är öppen:', err);
  return null;
});

// Besöksräknare utan cookies. Sparar bara tidpunkt, källa (utm_source eller värdnamnet
// besökaren kom från) och mobil/dator. Ingen IP-adress, inga id:n, inget sparas i webbläsaren.
(function () {
  if (navigator.webdriver) return; // automatiska webbläsare räknas inte
  var kalla = 'direkt';
  try {
    var utm = new URLSearchParams(location.search).get('utm_source');
    if (utm) kalla = utm;
    else if (document.referrer) {
      var host = new URL(document.referrer).hostname;
      if (host && host !== location.hostname) kalla = host;
    }
  } catch (e) {}
  var enhet = window.matchMedia('(max-width: 720px)').matches ? 'mobil' : 'dator';
  dbRpc('fujifilm_besok_logga', { p_kalla: kalla, p_enhet: enhet }).catch(function () {});
})();
