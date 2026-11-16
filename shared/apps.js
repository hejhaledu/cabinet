/* =====================================================================
   CabiNet – seznam aplikací
   Jediné místo, kde se aplikace registrují. Odtud se plní rozcestník,
   nabídka aplikací u loga, patička i „Co je nového“.
   Novou aplikaci stačí přidat sem (a její složku do repozitáře).
   ===================================================================== */
window.SESTA = window.SESTA || {};
SESTA.brand = {
  name: 'CabiNet',
  version: '1.2',
  year: 2026,
  school: 'Základní škola Šestajovice, okres Praha-východ',
  author: 'Martin Hejhal'
};
/* Rozvrh vyučovacích hodin pro časovou osu na rozcestníku */
SESTA.bells = [
  ['8:00','8:45'], ['8:55','9:40'], ['10:00','10:45'], ['10:55','11:40'], ['11:50','12:35'],
  ['12:45','13:30'], ['13:40','14:25'], ['14:35','15:20'], ['15:30','16:15']
];
SESTA.apps = [
  {
    id: 'grid', name: 'GRID', path: 'grid/', icon: 'grid',
    desc: 'Krátké testy k rozstřižení',
    long: 'Krátký test na 4, 6 nebo 8 kopií na jednu A4 – vytisknout, rozstříhat, rozdat.',
    version: '1.2', year: 2026,
    changes: [
      { version: '1.2', date: '2026-11-16', items: [
        'Systém aplikací pro pedagogy se nově jmenuje CabiNet.'
      ]},
      { version: '1.1', date: '2026-11-16', items: [
        'Šířku levého sloupce lze upravit tažením jeho okraje (dvojklik vrátí výchozí).',
        'Po otevření je rozbalená jen první karta, výchozí je světlý režim.'
      ]},
      { version: '1.0', date: '2026-11-14', items: [
        'Nový jednotný vzhled CabiNet a společná hlavička.',
        'Zkušební režim s ukázkovým testem.',
        'Přepínání mezi aplikacemi bez ztráty rozpracované práce.'
      ]}
    ]
  },
  {
    id: 'zasedacka', name: 'ZASEDAČKA', path: 'zasedacka/', icon: 'desks',
    desc: 'Zasedací pořádek třídy',
    long: 'Rozmístění lavic, rozsazení žáků podle vztahů a zraku, tisk plánku.',
    version: '1.2', year: 2026,
    changes: [
      { version: '1.2', date: '2026-11-16', items: [
        'Systém aplikací pro pedagogy se nově jmenuje CabiNet.'
      ]},
      { version: '1.1', date: '2026-11-16', items: [
        'Tabule ve světlém režimu je světlá se žlutým okrajem.',
        'Šířku levého sloupce lze upravit tažením jeho okraje (dvojklik vrátí výchozí).',
        'Po otevření je rozbalená jen první karta, výchozí je světlý režim.'
      ]},
      { version: '1.0', date: '2026-11-14', items: [
        'Nový jednotný vzhled CabiNet a společná hlavička.',
        'Zkušební režim s ukázkovou třídou.',
        'Kontrola před tiskem (neusazení žáci).'
      ]}
    ]
  },
  {
    id: 'cestak', name: 'CESŤÁK', path: 'cestak/', icon: 'car',
    desc: 'Cestovní doklady',
    long: 'Vyplnění, výpočet náhrad a tisk cestovního dokladu.',
    version: '1.2', year: 2026,
    changes: [
      { version: '1.2', date: '2026-11-16', items: [
        'Systém aplikací pro pedagogy se nově jmenuje CabiNet.'
      ]},
      { version: '1.1', date: '2026-11-16', items: [
        'Upozornění: aplikace je ve vývoji, nepoužívejte ji pro oficiální doklady.',
        'Šířku levého sloupce lze upravit tažením jeho okraje (dvojklik vrátí výchozí).',
        'Po otevření je rozbalená jen první karta, výchozí je světlý režim.'
      ]},
      { version: '1.0', date: '2026-11-14', items: [
        'Nový jednotný vzhled CabiNet a společná hlavička.',
        'Zkušební režim se vzorovým dokladem.',
        'Kontrola před tiskem.'
      ]}
    ]
  }
];
