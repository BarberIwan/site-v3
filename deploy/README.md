# Uitrollen en nacontrole

## Bouwen

Vite 7 vraagt Node 20.19 of nieuwer. De pm2-config wijst naar Node 18.19 op de
server; bouw daar dus met een nieuwere Node, of bouw lokaal en zet alleen `dist/`
over.

```bash
npm ci
npm run build        # tsc, client-build, SSR-build en prerender
```

`dist/` bevat dan per pagina een map met een volledige `index.html`
(`/haircuts/index.html`, `/contact/index.html`, …), plus `404.html`,
`sitemap.xml`, `llms.txt` en `serve.json`.

## Uitrollen met GitHub Actions

`.github/workflows/deploy.yml` doet het hele rondje: bouwen met Node 22,
`dist/` naast de huidige versie zetten, omwisselen en een rookproef tegen de live
site. Mislukt de rookproef, dan zet hij de vorige versie terug. Starten:
Actions → "Deploy naar barberiwan.nl" → Run workflow.

Eenmalig instellen:

1. Maak op je eigen computer een sleutelpaar alleen voor deze deploy:
   `ssh-keygen -t ed25519 -C deploy-barberiwan -f deploy-barberiwan -N ""`
2. Zet de inhoud van `deploy-barberiwan.pub` op de server achteraan in
   `~/.ssh/authorized_keys` van de gebruiker die in `/var/www/html/site-v3` mag
   schrijven.
3. In GitHub, `site-v3` → Settings → Secrets and variables → Actions → New
   repository secret:
   - `DEPLOY_HOST`: `185.107.90.72`
   - `DEPLOY_USER`: die gebruiker (bijvoorbeeld `root`)
   - `DEPLOY_SSH_KEY`: de inhoud van `deploy-barberiwan` (de private key)
   - `DEPLOY_KNOWN_HOSTS`: de uitvoer van `ssh-keyscan -H 185.107.90.72`
4. Staat de site ergens anders dan `/var/www/html/site-v3/dist`? Zet dan onder
   Variables `DEPLOY_PATH` op de map boven `dist`.

Zonder secrets bouwt de workflow wel en zet hij de build als artefact
(`dist-<commit>`) klaar; die kun je downloaden en met de hand uploaden.

## Uitrollen met de hand

1. Zet `dist/` op de plek waar nginx naar kijkt (nu `/var/www/html/site-v3/dist`).
2. Dat werkt al met de huidige nginx (`try_files $uri $uri/ /index.html`):
   elke pagina is een map, `/haircuts` gaat met een 301 naar `/haircuts/`.
   Een onbekend adres krijgt dan nog de homepage-HTML met status 200; de browser
   toont wel de 404-pagina met `noindex`, en oude adressen (`/terms`, `/#/terms`,
   `/en/`) sturen door.
3. Daarna de server goed zetten met `deploy/nginx/barberiwan.nl.conf`:
   echte 404, 301's voor oude adressen, www naar zonder www, gzip, cache, HSTS en
   een CSP. Vergelijk eerst met `sudo nginx -T`, laat de certificaatregels staan,
   en herlaad pas na `sudo nginx -t`.
4. pm2 (`ecosystem.config.cjs`) is alleen nodig als nginx naar poort 3000
   doorstuurt. `serve` leest dan `dist/serve.json`.

## Controleren na de deploy

```bash
curl -s https://barberiwan.nl/ | grep -o '<h1[^>]*>' | head -1           # H1 staat in de HTML
curl -s https://barberiwan.nl/sitemap.xml | grep -c '<loc>'               # 7
curl -s -o /dev/null -w '%{http_code}\n' https://barberiwan.nl/haircuts/  # 200
curl -sI https://barberiwan.nl/haircuts | grep -i '^location'             # .../haircuts/
# Na de nieuwe nginx-config:
curl -s -o /dev/null -w '%{http_code}\n' https://barberiwan.nl/bestaat-niet         # 404
curl -sI https://www.barberiwan.nl/ | grep -i '^location'                           # https://barberiwan.nl/
curl -sI https://barberiwan.nl/terms | grep -i '^location'                          # /algemene-voorwaarden/
curl -sI -H 'Accept-Encoding: gzip' https://barberiwan.nl/ | grep -i content-encoding # gzip
```

Daarna in de browser:

- Rich Results Test: <https://search.google.com/test/rich-results?url=https%3A%2F%2Fbarberiwan.nl%2F>
  (verwacht: Lokaal bedrijf, Broodkruimels, Veelgestelde vragen; geen fouten).
- PageSpeed Insights op mobiel.
- Boek een testafspraak via de agenda op `/#afspraak` en annuleer hem weer.

## Search Console en Bing (eenmalig)

1. Search Console: voeg `barberiwan.nl` toe als domein en bevestig met het
   TXT-record bij Hostnet (DNS).
2. Dien `https://barberiwan.nl/sitemap.xml` in en vraag indexering aan voor de
   zeven pagina's.
3. Bing Webmaster Tools: importeer de site uit Search Console. Bing voedt ook
   ChatGPT-zoeken en DuckDuckGo.

## Buiten de site: bepaalt de lokale ranking het meest

1. **Google-bedrijfsprofiel**: adres, telefoon en openingstijden gelijk aan de
   site; website `https://barberiwan.nl/`; afspraaklink naar Salonized; diensten
   met dezelfde prijzen; regelmatig nieuwe foto's; reviews vragen en beantwoorden.
2. **Facebook** noemt nog Albrecht Durerweg 172 (Hairstudio Variaty) als adres.
   Zet daar Michelangelostraat 195, 1328 VX Almere.
3. **Hairstudio Variaty** (`/over-ons/ons-team`) noemt Barber Iwan nog, met boeken
   via Planetzelf. Vraag ze dat bij te werken of te verwijzen naar barberiwan.nl.
4. **E-mail**: `barberiwan.nl` heeft geen MX-record, dus `info@barberiwan.nl`
   ontvangt niets. Het adres staat daarom niet meer op de site. Zet mail aan bij
   Hostnet als je het wilt gebruiken; artikel 5 van de voorwaarden noemt e-mail.
5. **Repository**: deze repo is openbaar. Zet hem op privé.
