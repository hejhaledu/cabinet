# ŠestaApp – aplikace pro pedagogy

Rozcestník a aplikace pro učitele ZŠ Šestajovice. Běží jako statický web na GitHub Pages, bez serveru a bez přihlašování.

## Struktura

```
index.html            rozcestník
shared/
  sesta.css           jediný zdroj vzhledu (barvy, písmo, hlavička, patička, nabídky, okna)
  sesta-shell.js      společné chování (hlavička, Nastavení, zkušební režim, soubory, kontrola před tiskem…)
  apps.js             seznam aplikací – název, popis, ikona, verze, rok, „Co je nového“
  fonts/              písmo Inter
  logo-skoly.png      logo školy
grid/index.html       GRID – krátké testy k rozstřižení
zasedacka/index.html  ZASEDAČKA – zasedací pořádek
cestak/index.html     CESŤÁK – cestovní doklady
```

Pravidla vzhledu a chování jsou v dokumentu projektu „ŠestaApp – styl a společná pravidla“.

## Nahrání na GitHub Pages

1. Obsah této složky nahrajte do kořene repozitáře (vč. složek `shared`, `grid`, `zasedacka`, `cestak`).
2. Settings → Pages → Deploy from a branch → `main` / root.
3. Při každé změně ve `shared/` zvyšte číslo `?v=1.1.0` u odkazů na sdílené soubory ve všech stránkách, aby prohlížeče kolegů nenačítaly starou verzi.

Aplikace je nutné zkoušet přes webový server (GitHub Pages nebo `python3 -m http.server`), ne dvojklikem na soubor – prohlížeč by na `file://` neotevřel složku jako stránku.

## Jak přidat novou aplikaci

1. Vytvořte složku, např. `los/index.html`.
2. V hlavičce stránky: skript s motivem, `<link rel="stylesheet" href="../shared/sesta.css?v=…">`.
3. Obsah aplikace vložte do `<main class="s-main">…</main>`.
4. Na konci načtěte `../shared/apps.js` a `../shared/sesta-shell.js` a zavolejte:

```js
SESTA.init({
  app: 'los',                       // id z apps.js
  subtitle: () => '…',              // kontext v podtitulku
  title: () => '…',                 // název dokumentu (do souboru)
  fileParts: () => ['…', SESTA.today()],
  serialize: () => data,            // co se uloží do .json
  load: data => { … },              // otevření souboru
  actions: {
    new: () => { … },
    pdf: [{ label: 'PDF', run: () => … }],
    print: () => { … }
  },
  check: kind => [ { text: 'Chybí…', level: 'err', go: () => … } ],
  trial: { sample: () => ukazka, get: () => data, set: d => { … } },
  empty: { host: '#plocha', text: 'Co se tu dělá.', test: () => prazdne, start: () => { … } },
  shortcuts: [ { label: 'Otočit', keys: 'R' } ],
  settings: () => [ { label: '…', icon: 'info', run: () => … } ],
  danger: () => [ { label: '…', icon: 'x', run: () => … } ]
});
```

5. Přidejte záznam do `shared/apps.js`.
6. Při každé úpravě volejte `SESTA.changed()` (stav „Neuloženo“); rozpracovaný stav ukládejte do `sessionStorage` (klíč `sesta:data:<id>`), aby přepnutí mezi aplikacemi nic neztratilo.

## Statistika a Správa (Firebase)

- Projekt Firebase `sestaapp` (tarif Spark), databáze Firestore, přihlášení e-mailem a heslem jen pro správce.
- `shared/sesta-firebase.js` posílá anonymní denní počítadla do kolekce `statistika` (jeden dokument = jedno počítadlo za den, např. `2026-11-16__grid__pdf__pocitac` s polem `n`). Bez knihoven, přes REST.
- Nic se neposílá při otevření ze souboru ani na `localhost` (vývoj).
- Stránka `sprava/` – přihlášení správce a přehled používání (7 / 30 / 90 dní). Odkaz je dole na rozcestníku.
- Pravidla přístupu (Firestore → Rules) povolují veřejnosti jen založit počítadlo s hodnotou 1 nebo k němu přičíst 1; číst smí jen správce (UID v pravidlech). Nová aplikace nevyžaduje změnu pravidel, pokud má id z malých písmen bez diakritiky.
