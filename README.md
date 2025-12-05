# csobjob
Demo automatického testu který ověřuje, že stránky ČSOB umožňují vyhledávání otevřených pozic.

## Obsah projektu

Projekt obsahuje 2 automatické testy, které postupně provedou následující akce:

### 1. Test "ČSOB pořád nabízí nějaká volná místa"
- otevři domovskou stránku ČSOB
- souhlas s použitím cookies
- klikni na odkaz "Kariéra v ČSOB a volná místa"
- klikni na tlačítko "Volná místa"
- ověř, že v nové záložce je nadpis s textem "Volná místa"
- ověř, že stránka zobrazuje alespoň jednu nabídku práce

### 2. Test "ČSOB kariérní stránka umožňuje vyhledávání pozic"
- otevři kariérní stránku ČSOB
- souhlas s použitím cookies
- vyfiltruj pozice podle klíčového slova "Test"
- ověř, že výsledky vyhledávání obsahují pozici "IT Test Manažer (m/ž)"

## Rychlý start

Požadavky:
- Node.js 18+ (pro Playwright)
- Docker (volitelně, doporučeno pro sdílení mezi různými systémy)

Nainstalujte závislosti a spusťte testy lokálně:

```bash
npm ci
npx playwright install
npx playwright test
```

Spusťte testy v režimu s GUI (zobrazí se okno prohlížeče) lokálně:

```bash
npx playwright test --headed
```

## Docker image (doporučeno pro sdílení)

Tento repozitář obsahuje `Dockerfile`, který vytváří image s předinstalovaným Node, Playwrightem a prohlížeči.

Sestavte image:

```bash
docker build -t csobjob-automation-demo .
```

Spusťte testy (headless režim):

```bash
docker run --rm csobjob-automation-demo
```

Spusťte testy v režimu s GUI (příklad pro Linux využívající váš X server):

```bash
# Na dobu spuštění je nutné povolit lokálnímu root uživateli přístup k X serveru
xhost +local:root
docker run --rm -e DISPLAY=:0 -v /tmp/.X11-unix:/tmp/.X11-unix --shm-size=1g csobjob-automation-demo npx playwright test --headed
xhost -local:root
```

Poznámky:
- Na macOS/Windows budete potřebovat X server (např. XQuartz) nebo spouštět headed testy přes kontejner s VNC.
- Docker image je založený na oficiálním Playwright image a obsahuje `npx playwright install --with-deps`, aby byly přítomny prohlížeče a závislosti.

## CI/CD

V repozitáři je workflow pro GitHub Actions v `.github/workflows/playwright.yml`, které spouští Playwright testy při Push operaci nebo vytvoření Pull Requestu.