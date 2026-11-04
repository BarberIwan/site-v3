# Lokale SEO: alles buiten de website

De site staat technisch goed. Of je bovenaan komt bij "kapper almere" en in het
kaartblok van Google, hangt nu vooral af van drie dingen buiten de site: het
Google-bedrijfsprofiel, overal hetzelfde adres en telefoonnummer, en reviews.

Zoekgedrag (Google Trends, NL, afgelopen 12 maanden): "kapper almere" heeft
ruim drie keer zoveel zoekinteresse als "barber almere"; "kapper almere stad" is
de grootste verwante zoekterm. Gebruik dus "kapper" en "Almere Stad" in teksten.

## 1. Eén schrijfwijze, overal (NAP)

Gebruik deze gegevens letterlijk, op elke plek:

```
Barber Iwan
Michelangelostraat 195
1328 VX Almere
06-27403607
https://barberiwan.nl/
```

| Plek | Status (oktober 2026) | Actie |
|---|---|---|
| Google-bedrijfsprofiel | onbekend | controleren met stap 2 hieronder |
| Facebook (facebook.com/barberiwan) | **fout**: Albrecht Durerweg 172, 1328 TM | adres aanpassen |
| Hairstudio Variaty, teampagina | **verouderd**: boeken via Planetzelf | vragen om bij te werken of te linken naar barberiwan.nl |
| Treatwell | klopt | niets |
| Fresha | klopt | niets |
| Instagram (@barberiwan) | adres niet gecontroleerd | adres en link barberiwan.nl in de bio |
| Bing Places | waarschijnlijk niet aangemeld | importeren uit Google (stap 4) |
| Apple Business Connect | waarschijnlijk niet aangemeld | aanmelden (stap 4) |

## 2. Google-bedrijfsprofiel

Openen via <https://business.google.com/>.

- **Naam:** `Barber Iwan`. Geen extra woorden als "kapper Almere" in de naam; dat
  is tegen de regels van Google en kan het profiel kosten.
- **Hoofdcategorie:** de categorie voor barbershops (in het Nederlands meestal
  "Barbier"). **Extra categorieën:** "Kapper" en, als die er staat, "Kinderkapper".
- **Website:** `https://barberiwan.nl/?utm_source=google&utm_medium=organic&utm_campaign=bedrijfsprofiel`
  (zo zie je later in de statistieken wat het profiel oplevert).
- **Afspraaklink:** `https://barber-iwan-1.salonized.com/widget_bookings/new`
- **Openingstijden:** di t/m za 09:00–17:00, ma en zo gesloten. Feestdagen apart
  invullen.
- **Diensten met prijs:** knippen of fade €32 · knippen + baard €40 · baard €20 ·
  kinderen 1–4 jaar €22 · kinderen 5–12 jaar €27 · VIP late night knippen €50 ·
  VIP late night knippen + baard €65.
- **Kenmerken:** op afspraak, pinnen, contant.

**Bedrijfsomschrijving** (past binnen 750 tekens):

> Barber Iwan is kapper en barber in Almere Stad, in de wijk Tussen de Vaarten.
> Iwan staat sinds 1994 aan de schaar en knipt alle haartypes: Europees,
> Aziatisch, Black en Mixed hair. Je kunt bij hem terecht voor strakke fades en
> tapers, klassieke herenkapsels, line-ups, geschoren figuren, baard trimmen en
> kinderkapsels. Iwan werkt uitsluitend op afspraak, zodat er voor ieder kapsel
> tijd en aandacht is. Boek online of bel 06-27403607.

**Foto's** (het profiel met de meeste echte foto's wint): voorgevel en ingang,
de salon binnen, Iwan aan het werk, en elke week twee à drie nieuwe haircuts.
Zelfde foto's als op de site mag. Een goed portret van Iwan zet je ook op de
site, in plaats van de stockfoto die er nu niet meer staat.

**Berichten** (elke week of twee één): bijvoorbeeld
1. "Nieuw: VIP late night. Niet overdag kunnen? Kijk in de agenda welke late
   tijden vrij zijn." + knop *Afspraak maken*.
2. Een haircut van de week met de naam van de stijl ("Mid fade met krullen").
3. "Kinderen knippen vanaf €22, rustig en vlot." + foto.
4. Feestdagen en vakantie: aangepaste tijden.

**Vragen en antwoorden:** zet zelf de vijf meest gestelde vragen erin, met de
antwoorden van de site (afspraak, prijzen, parkeren, kinderen, krullend haar).

## 3. Reviews

Reviews op Google wegen het zwaarst voor het kaartblok.

- Haal in het profiel de link **Reviews krijgen** op en maak er een QR-code van
  voor bij de kassa of de spiegel.
- Vraag het aan iedere tevreden klant, direct na de knipbeurt. Tekst voor een
  appje:

  > Dank je wel voor je bezoek! Als je tevreden bent, zou een korte review op
  > Google me enorm helpen: [link]. Tot de volgende keer, Iwan

- Beantwoord elke review binnen een paar dagen, ook de korte. Noem af en toe de
  behandeling ("Fijn dat je fade goed zit!").
- Nooit iets geven in ruil voor een review en nooit alleen tevreden klanten
  vragen; beide zijn tegen de regels van Google.

## 4. Search Console, Bing en Apple

1. **Google Search Console** (<https://search.google.com/search-console>):
   eigendom `barberiwan.nl` toevoegen als *domein*, bevestigen met het TXT-record
   bij Hostnet (DNS-beheer), dan de sitemap `https://barberiwan.nl/sitemap.xml`
   indienen en voor de tien pagina's *Indexering aanvragen*.
2. **Bing Webmaster Tools** (<https://www.bing.com/webmasters>): *Importeren uit
   Google Search Console*. Bing voedt ook ChatGPT-zoeken en DuckDuckGo. Na elke
   deploy meldt de site zich vanzelf bij Bing via IndexNow.
3. **Bing Places** (<https://www.bingplaces.com/>): importeren uit het
   Google-bedrijfsprofiel.
4. **Apple Business Connect** (<https://businessconnect.apple.com/>): voor Apple
   Kaarten en Siri; zelfde gegevens als hierboven.

## 5. Meten

Elke maand even kijken:

- Search Console → *Prestaties*: vertoningen en klikken voor "kapper almere",
  "barber almere", "fade almere", "kinderkapper almere".
- Bedrijfsprofiel → *Prestaties*: zoekopdrachten, routeverzoeken, telefoontjes
  en klikken op de website.
- Aantal Google-reviews en het gemiddelde.

Koppel Search Console en het bedrijfsprofiel ook aan Supermetrics; dan kan Claude
die cijfers ophalen en er een maandoverzicht van maken.
