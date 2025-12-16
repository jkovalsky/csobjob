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
- ověř, že výsledky vyhledávání obsahují pozici "Developer automatizovaných testů (m/ž)"

## Spuštění testů

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

## Robot Framework

Kromě implementace pomocí Playwrightu obsahuje tento repozitář také stejné testy napsané pomocí Robot Frameworku s využitím Browser knihovny.

### Spuštění Robot Framework testů

Nainstalujte všechny závislosti a nastavte testovací prostředí:
```bash
python3 -m venv venv && source venv/bin/activate && pip install -q -r requirements.txt && rfbrowser init
```

a pak už jenom spusťte testy pomocí:
```bash
source venv/bin/activate && robot tests/careers-test.robot
```

Paralelní běh testů je také možný:
```bash
source venv/bin/activate && pabot --testlevelsplit tests/careers-test.robot
```
## CI/CD

V repozitáři jsou také 2 workflow konfigurace pro GitHub Actions v `.github/workflows/playwright.yml` a `.github/workflows/robot.yml`,
které spouští Playwright i Robot Framework testy při každé Push operaci nebo vytvoření Pull Requestu.