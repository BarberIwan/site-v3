#!/usr/bin/env bash
# Zet deploy/nginx/barberiwan.nl.conf live op de server, en draait zichzelf
# terug als er iets misgaat.
#
#   bash deploy/nginx/zet-live.sh        (als root op de server)
#
# 1. Zoekt het nginx-bestand dat nu barberiwan.nl bedient. Stopt zonder iets te
#    wijzigen als dat er niet precies één is, als er ook andere sites in staan,
#    of als het niet naar /var/www/html/site-v3/dist wijst.
# 2. Neemt de certificaatregels van certbot daaruit over.
# 3. Bewaart het oude bestand in /root/nginx-reserve/.
# 4. nginx -t, herladen, en een rookproef tegen deze server zelf.
# 5. Faalt een stap, dan komt het oude bestand terug en wordt nginx herladen.

set -euo pipefail

SJABLOON="$(cd "$(dirname "$0")" && pwd)/barberiwan.nl.conf"
SITE_ROOT=/var/www/html/site-v3/dist
RESERVE_DIR=/root/nginx-reserve
STEMPEL=$(date +%Y%m%d-%H%M%S)

stop() {
  echo "GESTOPT: $*" >&2
  echo "Er is niets veranderd." >&2
  exit 1
}

herlaad() {
  if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet nginx 2>/dev/null; then
    systemctl reload nginx
  else
    nginx -s reload
  fi
}

[ "$(id -u)" -eq 0 ] || stop "draai dit als root."
[ -f "$SJABLOON" ] || stop "$SJABLOON niet gevonden."
command -v nginx >/dev/null || stop "nginx niet gevonden."

# 1. Welk bestand bedient barberiwan.nl nu?
mapfile -t treffers < <(
  grep -lsE '^[[:space:]]*server_name[[:space:]][^;]*barberiwan\.nl' \
    /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf 2>/dev/null |
    xargs -r -n1 readlink -f | sort -u
)
[ "${#treffers[@]}" -eq 1 ] ||
  stop "verwachtte één nginx-bestand voor barberiwan.nl, vond er ${#treffers[@]}: ${treffers[*]:-geen}"
HUIDIG="${treffers[0]}"
echo "Huidig bestand: $HUIDIG"

andere=$(grep -oE '^[[:space:]]*server_name[[:space:]][^;]*' "$HUIDIG" |
  sed -E 's/^[[:space:]]*server_name//' | tr -s '[:blank:]' '\n' | sed '/^$/d' |
  grep -vxE 'barberiwan\.nl|www\.barberiwan\.nl' | sort -u | tr '\n' ' ' || true)
[ -z "$andere" ] || stop "$HUIDIG bedient ook andere namen ($andere); die zou dit script weghalen."

grep -qE "^[[:space:]]*root[[:space:]]+$SITE_ROOT/?;" "$HUIDIG" ||
  stop "$HUIDIG wijst niet naar $SITE_ROOT (root: $(grep -E '^[[:space:]]*(root|proxy_pass)[[:space:]]' "$HUIDIG" | tr -s ' ' | tr '\n' ' '))."
[ -f "$SITE_ROOT/index.html" ] && [ -f "$SITE_ROOT/404.html" ] ||
  stop "$SITE_ROOT mist index.html of 404.html; zet eerst de nieuwe build neer."

# 2. Certificaatregels van certbot overnemen.
certregels=$(grep -E '^[[:space:]]*((ssl_certificate|ssl_certificate_key|ssl_dhparam)[[:space:]]|include[[:space:]]+/etc/letsencrypt/)' "$HUIDIG" |
  sed -E 's/^[[:space:]]+//' | awk '!gezien[$0]++' || true)
cert=$(printf '%s\n' "$certregels" | awk '$1 == "ssl_certificate" { sub(/;.*/, "", $2); print $2; exit }')
sleutel=$(printf '%s\n' "$certregels" | awk '$1 == "ssl_certificate_key" { sub(/;.*/, "", $2); print $2; exit }')
[ -n "$cert" ] && [ -n "$sleutel" ] || stop "geen ssl_certificate en ssl_certificate_key gevonden in $HUIDIG."
[ -f "$cert" ] && [ -f "$sleutel" ] || stop "certificaat $cert of sleutel $sleutel bestaat niet."
certtekst=$(openssl x509 -noout -text -in "$cert" 2>/dev/null || true)
if ! grep -q 'DNS:www\.barberiwan\.nl' <<<"$certtekst"; then
  echo "LET OP: het certificaat dekt www.barberiwan.nl niet; https://www geeft dan een certificaatfout (zoals nu ook)."
fi

NIEUW=$(mktemp)
trap 'rm -f "$NIEUW"' EXIT
CERTREGELS="$certregels" awk '
  /^[ \t]*# ssl_certificate[ \t]/ {
    n = split(ENVIRON["CERTREGELS"], r, "\n")
    for (i = 1; i <= n; i++) if (r[i] != "") print "    " r[i]
    next
  }
  /^[ \t]*# ssl_certificate_key[ \t]/ { next }
  /^[ \t]*# include \/etc\/letsencrypt\// { next }
  { print }
' "$SJABLOON" >"$NIEUW"

# Zonder IPv6 in de huidige config ook geen IPv6 in de nieuwe: anders kan het
# herladen mislukken op een server zonder IPv6.
if ! grep -qE '^[[:space:]]*listen[[:space:]]+\[::\]' "$HUIDIG"; then
  sed -i '/^[[:space:]]*listen[[:space:]]\+\[::\]/d' "$NIEUW"
fi

# 3. Reserve bewaren, buiten de mappen die nginx inleest.
mkdir -p "$RESERVE_DIR"
RESERVE="$RESERVE_DIR/$(basename "$HUIDIG").$STEMPEL"
cp -a "$HUIDIG" "$RESERVE"
echo "Reserve: $RESERVE"

terug() {
  echo "MISLUKT: $*" >&2
  cat "$RESERVE" >"$HUIDIG"
  if nginx -t >/dev/null 2>&1 && herlaad; then
    sleep 2
    echo "TERUGGEZET: de oude instelling draait weer." >&2
  else
    echo "TERUGZETTEN LUKTE NIET. Stuur de uitvoer van: nginx -t" >&2
  fi
  exit 1
}

# 4. Nieuw bestand op dezelfde plek (een symlink in sites-enabled blijft heel).
cat "$NIEUW" >"$HUIDIG"
if ! uitvoer=$(nginx -t 2>&1); then
  echo "$uitvoer" >&2
  terug "nginx -t keurt de nieuwe instelling af."
fi
herlaad || terug "herladen van nginx mislukte."
sleep 2

# 5. Rookproef tegen deze server zelf (niet via internet of een proxy).
lokaal() {
  curl -sk --noproxy '*' --max-time 10 \
    --resolve barberiwan.nl:443:127.0.0.1 --resolve www.barberiwan.nl:443:127.0.0.1 \
    --resolve barberiwan.nl:80:127.0.0.1 --resolve www.barberiwan.nl:80:127.0.0.1 "$@"
}
fouten=()
verwacht() { # url verwachte-status [verwachte-doorverwijzing]
  local uit status doel
  uit=$(lokaal -o /dev/null -w '%{http_code} %{redirect_url}' "$1" || echo "000 ")
  status=${uit%% *}
  doel=${uit#* }
  if [ "$status" != "$2" ] || { [ -n "${3:-}" ] && [ "$doel" != "$3" ]; }; then
    fouten+=("$1 gaf $status $doel, verwacht $2 ${3:-}")
  else
    echo "  ok  $status  $1 ${3:+→ $3}"
  fi
}

echo "Rookproef:"
verwacht https://barberiwan.nl/ 200
verwacht https://barberiwan.nl/behandelingen-en-prijzen/ 200
verwacht https://barberiwan.nl/sitemap.xml 200
verwacht https://barberiwan.nl/haircuts 301 https://barberiwan.nl/haircuts/
verwacht https://barberiwan.nl/bestaat-niet 404
verwacht https://barberiwan.nl/terms 301 https://barberiwan.nl/algemene-voorwaarden/
verwacht https://www.barberiwan.nl/ 301 https://barberiwan.nl/
verwacht http://barberiwan.nl/contact/ 301 https://barberiwan.nl/contact/
verwacht http://www.barberiwan.nl/ 301 https://barberiwan.nl/
# Eerst in een variabele: grep -q in een pijp kan met pipefail vals alarm geven.
home=$(lokaal https://barberiwan.nl/ || true)
niet=$(lokaal https://barberiwan.nl/bestaat-niet || true)
grep -q '<h1' <<<"$home" || fouten+=("homepage bevat geen <h1>")
grep -q 'noindex' <<<"$niet" || fouten+=("404-pagina mist noindex")

[ "${#fouten[@]}" -eq 0 ] || terug "rookproef: ${fouten[*]}"

# Extra's: melden, niet terugdraaien.
koppen=$(lokaal -I -H 'Accept-Encoding: gzip' https://barberiwan.nl/ | tr -d '\r' || true)
js=$(grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' <<<"$home" | sed -n 1p || true)
echo "Extra:"
grep -qi '^strict-transport-security' <<<"$koppen" && echo "  ok  HSTS" || echo "  --  geen HSTS"
grep -qi '^content-security-policy' <<<"$koppen" && echo "  ok  CSP" || echo "  --  geen CSP"
grep -qi '^content-encoding: gzip' <<<"$koppen" && echo "  ok  gzip" || echo "  --  geen gzip op de HTML"
if [ -n "$js" ]; then
  jskoppen=$(lokaal -I -H 'Accept-Encoding: gzip' "https://barberiwan.nl$js" | tr -d '\r' || true)
  grep -qi '^content-encoding: gzip' <<<"$jskoppen" && echo "  ok  gzip op JavaScript" || echo "  --  geen gzip op JavaScript"
fi
fontkoppen=$(lokaal -I https://barberiwan.nl/fonts/montserrat.woff2 | tr -d '\r' || true)
grep -qi '^content-type: font/woff2' <<<"$fontkoppen" && echo "  ok  lettertype als font/woff2" || echo "  --  lettertype niet als font/woff2"

echo
echo "KLAAR. De nieuwe nginx-instelling draait."
echo "Terug naar de oude:  cat $RESERVE > $HUIDIG && nginx -t && systemctl reload nginx"
