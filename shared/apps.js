/* =====================================================================
   ŠestaApp – seznam aplikací
   Jediné místo, kde se aplikace registrují. Odtud se plní rozcestník,
   nabídka aplikací u loga, patička i „Co je nového“.
   Novou aplikaci stačí přidat sem (a její složku do repozitáře).
   ===================================================================== */
window.SESTA = window.SESTA || {};
SESTA.brand = {
  name: 'ŠestaApp',
  version: '1.0',
  year: 2026,
  school: 'Základní škola Šestajovice, okres Praha-východ',
  author: 'Martin Hejhal'
};
SESTA.apps = [
  {
    id: 'grid', name: 'GRID', path: 'grid/', icon: 'grid',
    desc: 'Krátké testy k rozstřižení',
    long: 'Krátký test na 4, 6 nebo 8 kopií na jednu A4 – vytisknout, rozstříhat, rozdat.',
    version: '1.0', year: 2026,
    changes: [
      { version: '1.0', date: '2026-11-14', items: [
        'Nový jednotný vzhled ŠestaApp a společná hlavička.',
        'Zkušební režim s ukázkovým testem.',
        'Přepínání mezi aplikacemi bez ztráty rozpracované práce.'
      ]}
    ]
  },
  {
    id: 'zasedacka', name: 'ZASEDAČKA', path: 'zasedacka/', icon: 'desks',
    desc: 'Zasedací pořádek třídy',
    long: 'Rozmístění lavic, rozsazení žáků podle vztahů a zraku, tisk plánku.',
    version: '1.0', year: 2026,
    changes: [
      { version: '1.0', date: '2026-11-14', items: [
        'Nový jednotný vzhled ŠestaApp a společná hlavička.',
        'Zkušební režim s ukázkovou třídou.',
        'Kontrola před tiskem (neusazení žáci).'
      ]}
    ]
  },
  {
    id: 'cestak', name: 'CESŤÁK', path: 'cestak/', icon: 'car',
    desc: 'Cestovní doklady',
    long: 'Vyplnění, výpočet náhrad a tisk cestovního dokladu.',
    version: '1.0', year: 2026,
    changes: [
      { version: '1.0', date: '2026-11-14', items: [
        'Nový jednotný vzhled ŠestaApp a společná hlavička.',
        'Zkušební režim se vzorovým dokladem.',
        'Kontrola před tiskem.'
      ]}
    ]
  }
];
