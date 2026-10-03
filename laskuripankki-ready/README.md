# Laskuripankki

Valmis staattinen suomenkielinen laskurisivusto, jonka voi julkaista GitHub Pagesilla.

## Sisältö
- Prosenttilaskuri
- Alennuslaskuri
- ALV-laskuri
- Keskiarvolaskuri
- Korkolaskuri
- Päivämäärälaskuri
- Ikälaskuri
- Aikaerolaskuri
- Yksikkömuunnin
- Kilometrikorvauslaskuri
- Palkkalaskuri
- Budjettilaskuri
- Opiskelutuntilaskuri
- Mainospaikat
- Tietosuoja- ja käyttöehtosivut
- robots.txt + sitemap.xml

## Julkaisu GitHub Pagesilla

1. Tee GitHubissa uusi **public** repository nimeltä `laskuripankki`.
2. Lataa kaikki tämän kansion tiedostot repositoryyn.
3. Repository → Settings → Pages.
4. Valitse Source: **GitHub Actions** tai julkaisu repositoryn haarasta GitHubin nykyisen Pages-asetuksen mukaan.
5. Avaa GitHubin näyttämä Pages-osoite.
6. Vaihda `index.html`, `robots.txt` ja `sitemap.xml` -tiedostoista `YOUR-USERNAME` omaan käyttäjänimeesi.

## AdSense

Sivusto sisältää valmiit paikat mainoksille, mutta mainokset eivät ala näkyä vain lataamalla tämän projektin. AdSense vaatii oman tilin, sivuston tarkistuksen/hyväksynnän sekä Googlen antaman mainoskoodin.

Kun saat AdSensesta oman koodin:
1. Lisää Googlen antama sivuston vahvistus-/AdSense-koodi `index.html`-tiedoston `<head>`-osaan.
2. Lisää Googlen antama mainosyksikön koodi mainospaikkojen tilalle.
3. Päivitä `ads.txt` Googlen antamalla rivillä.
4. Suomessa/EU:ssa käytä AdSensessa Googlen Privacy & messaging -ratkaisua tai muuta Googlen vaatimukset täyttävää suostumusratkaisua ennen personoitujen mainosten käyttöönottoa.
5. Korvaa `privacy.html` -sivulla oleva yhteystieto omalla oikealla yhteystiedolla.

## Tärkeä sisältöhuomio

Älä täytä sivua massalla geneeristä, kopioitua tai pelkästään automaattisesti tuotettua tekstiä. Lisää omia, hyödyllisiä ohjeita ja esimerkkejä laskureihin, jotta sivusto tarjoaa oikeaa lisäarvoa käyttäjälle.

## Vapaa hosting

GitHub Pages sopii tähän, koska kyseessä on HTML/CSS/JavaScript-pohjainen staattinen sivusto.

## Tekninen rakenne

- `index.html` – käyttöliittymä
- `assets/style.css` – ulkoasu
- `assets/app.js` – laskurien toiminta
- `privacy.html` – tietosuojapohja
- `terms.html` – käyttöehtopohja
- `robots.txt`
- `sitemap.xml`
- `ads.txt`

Tämä projekti ei sisällä maksullisia API-kutsuja tai backend-palvelinta.
