(function () {
  'use strict';

  var app = document.getElementById('app');
  var audio = document.getElementById('bgm');
  var bgmBtn = document.getElementById('bgm-btn');
  var bgmPlaying = false;
  var dexMenu = document.getElementById('dex-menu');

  function bySlug(slug) {
    return POKEMON.find(function (p) { return p.slug === slug; });
  }

  function buildDexMenu() {
    if (!dexMenu) return;
    var list = POKEMON.map(function (p) {
      return '' +
        '<a class="dex-item" href="#/' + p.slug + '">' +
          '<img src="' + p.image + '" alt="" loading="lazy">' +
          '<span class="dex-text">' +
            '<span class="dex-name">' + p.nameRu + '</span>' +
            '<span class="dex-num">#' + String(p.number).padStart(3, '0') + '</span>' +
          '</span>' +
        '</a>';
    }).join('');
    dexMenu.innerHTML = '<input type="search" class="dex-search" placeholder="Поиск покемона…">' +
      '<div class="dex-list">' + list + '</div>' +
      '<a class="dex-all" href="#/dex">Весь покедекс (' + POKEMON.length + ') →</a>';
  }

  function filterDex() {
    if (!dexMenu) return;
    var q = (dexMenu.querySelector('.dex-search').value || '').toLowerCase();
    dexMenu.querySelectorAll('.dex-item').forEach(function (item) {
      item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }

  function setupDexDropdown() {
    var btn = document.querySelector('.nav-dropdown-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      dexMenu.classList.toggle('open', !open);
      if (!open) {
        var s = dexMenu.querySelector('.dex-search');
        if (s) { s.value = ''; s.focus(); filterDex(); }
      }
    });
    dexMenu.addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('.dex-item') || e.target.closest('.dex-all')) {
        btn.setAttribute('aria-expanded', 'false');
        dexMenu.classList.remove('open');
      }
    });
    dexMenu.querySelector('.dex-search').addEventListener('input', filterDex);
    document.addEventListener('click', function () {
      btn.setAttribute('aria-expanded', 'false');
      dexMenu.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        btn.setAttribute('aria-expanded', 'false');
        dexMenu.classList.remove('open');
      }
    });
  }

  function typeBadges(types) {
    return types.map(function (t) {
      var meta = POKEMON_TYPES[t] || { ru: t, color: '#888' };
      return '<span class="type-badge" style="background:' + meta.color + '">' + meta.ru + '</span>';
    }).join(' ');
  }

  function cardHtml(p) {
    return '' +
      '<div class="card-wrap">' +
        '<a class="pokemon-card" href="#/' + p.slug + '" style="--type-color:' + (POKEMON_TYPES[p.types[0]] || { color: '#888' }).color + '">' +
          '<img src="' + p.image + '" alt="' + p.nameRu + '" loading="lazy">' +
          '<div class="card-body">' +
            '<span class="card-number">#' + String(p.number).padStart(3, '0') + '</span>' +
            '<h3>' + p.nameRu + '</h3>' +
            '<span class="card-en">' + p.nameEn + '</span>' +
            '<div class="type-badges">' + typeBadges(p.types) + '</div>' +
          '</div>' +
        '</a>' +
        '<button type="button" class="cry-btn" data-cry="cries/' + p.slug + '.ogg" title="Крик: ' + p.nameRu + '">🔊</button>' +
      '</div>';
  }

  function playCry(src) {
    if (!src) return;
    var a = document.getElementById('cry-audio');
    if (!a) {
      a = document.createElement('audio');
      a.id = 'cry-audio';
      document.body.appendChild(a);
    }
    a.src = src;
    a.volume = 0.9;
    a.play().catch(function () { /* автоплей может быть заблокирован */ });
  }

  function homeHtml() {
    var featured = POKEMON.filter(function (p) { return p.featured; });
    var cards = featured.map(cardHtml).join('');

    return '' +
      '<h1 class="page-title">Всех их вместе соберем, всех их соберем!</h1>' +
      '<p class="lead"><span class="site-name">«Покемон»</span> (яп. покэтто монсута, англ. Pokemon, от англ. Pocket Monster — «карманный монстр») — сверхпопулярная медиафраншиза, созданная Сатоси Тадзири в 1996 году. Товарный знак «Покемон» принадлежит Nintendo, одной из крупнейших фирм-разработчиков компьютерных игр. «Покемон» впервые появился как пара игр, разработанных студией Game Freak, и после этого стал второй в мире по популярности серией компьютерных игр, уступив лишь другой серии игр Nintendo, Mario. По мотивам игр существует аниме, пользующееся колоссальным успехом в мире, а также манга, коллекционная карточная игра и прочие сопутствующие товары.</p>' +
      '<p class="lead">Само слово «покемон» обозначает вымышленное существо, обладающее сверхъестественными способностями. На данный момент существует свыше 1000 разновидностей покемонов. В вымышленной вселенной «Покемона» люди, называющиеся тренерами покемонов, обучают их для сражений с покемонами других тренеров. Бои проходят до момента, пока один из покемонов не падает без сознания или его тренер не сдаётся, — до смерти схватки не происходят никогда. Как правило, сильные и опытные тренеры покемонов пользуются уважением.</p>' +
      '<h2 class="section-title">Самые популярные</h2>' +
      '<div class="pokemon-grid">' + cards + '</div>' +
      '<p class="dex-hint">Весь покедекс из ' + POKEMON.length + ' покемонов — на странице <a href="#/dex">«Весь покедекс»</a>.</p>';
  }

  function parseNum(s) {
    var m = String(s).replace(',', '.').match(/(\d+\.?\d*)/);
    return m ? parseFloat(m[1]) : 0;
  }

  function dexHtml() {
    var types = Object.keys(POKEMON_TYPES).sort(function (a, b) {
      return POKEMON_TYPES[a].ru.localeCompare(POKEMON_TYPES[b].ru, 'ru');
    });

    var familyIds = [];
    POKEMON.forEach(function (p) {
      if (familyIds.indexOf(p.family) === -1) familyIds.push(p.family);
    });
    familyIds.sort(function (a, b) {
      var minA = Math.min.apply(null, POKEMON.filter(function (p) { return p.family === a; }).map(function (p) { return p.number; }));
      var minB = Math.min.apply(null, POKEMON.filter(function (p) { return p.family === b; }).map(function (p) { return p.number; }));
      return minA - minB;
    });
    var familyOptions = familyIds.map(function (id) {
      var first = POKEMON.filter(function (p) { return p.family === id; })
        .sort(function (a, b) { return a.number - b.number; })[0];
      return '<option value="' + id + '">' + first.nameRu + '</option>';
    }).join('');

    var typeOptions = types.map(function (t) {
      return '<option value="' + t + '">' + POKEMON_TYPES[t].ru + '</option>';
    }).join('');

    return '' +
      '<h1 class="page-title">Покедекс</h1>' +
      '<p class="lead">Все ' + POKEMON.length + ' покемонов. Используйте фильтры, чтобы найти нужного.</p>' +
      '<div class="dex-panel">' +
        '<label class="dex-filter">' +
          '<span>Поиск</span>' +
          '<input type="search" id="df-search" placeholder="Имя покемона…">' +
        '</label>' +
        '<label class="dex-filter">' +
          '<span>Тип</span>' +
          '<select id="df-type"><option value="">Любой</option>' + typeOptions + '</select>' +
        '</label>' +
        '<label class="dex-filter">' +
          '<span>Семейство</span>' +
          '<select id="df-family"><option value="">Любое</option>' + familyOptions + '</select>' +
        '</label>' +
        '<label class="dex-filter dex-check">' +
          '<input type="checkbox" id="df-basic">' +
          '<span>Только базовые формы</span>' +
        '</label>' +
        '<label class="dex-filter">' +
          '<span>Рост не выше <output id="df-h-out"></output> м</span>' +
          '<input type="range" id="df-height" min="0" max="30" value="30" step="0.5">' +
        '</label>' +
        '<label class="dex-filter">' +
          '<span>Вес не выше <output id="df-w-out"></output> кг</span>' +
          '<input type="range" id="df-weight" min="0" max="1000" value="1000" step="10">' +
        '</label>' +
        '<button type="button" class="dex-reset" id="df-reset">Сбросить</button>' +
      '</div>' +
      '<p class="dex-count" id="df-count"></p>' +
      '<div class="pokemon-grid" id="df-grid"></div>';
  }

  function setupDexPage() {
    var search = document.getElementById('df-search');
    var type = document.getElementById('df-type');
    var fam = document.getElementById('df-family');
    var basic = document.getElementById('df-basic');
    var h = document.getElementById('df-height');
    var w = document.getElementById('df-weight');
    var reset = document.getElementById('df-reset');
    if (!search || !type || !fam || !basic || !h || !w) return;

    var grid = document.getElementById('df-grid');
    var count = document.getElementById('df-count');
    var hOut = document.getElementById('df-h-out');
    var wOut = document.getElementById('df-w-out');

    var basicSlugs = {};
    POKEMON.forEach(function (p) {
      if (!basicSlugs[p.family] || p.number < basicSlugs[p.family].number) {
        basicSlugs[p.family] = p;
      }
    });

    function apply() {
      var q = search.value.trim().toLowerCase();
      var t = type.value, f = fam.value, b = basic.checked;
      var hMax = parseFloat(h.value), wMax = parseFloat(w.value);
      hOut.textContent = hMax;
      wOut.textContent = wMax;

      var shown = POKEMON.filter(function (p) {
        if (q && (p.nameRu.toLowerCase().indexOf(q) === -1) && (p.nameEn.toLowerCase().indexOf(q) === -1)) return false;
        if (t && p.types.indexOf(t) === -1) return false;
        if (f && p.family !== f) return false;
        if (b && basicSlugs[p.family].slug !== p.slug) return false;
        if (parseNum(p.height) > hMax) return false;
        if (parseNum(p.weight) > wMax) return false;
        return true;
      });

      grid.innerHTML = shown.map(cardHtml).join('');
      count.textContent = 'Показано: ' + shown.length + ' из ' + POKEMON.length;
    }

    function onChange() { apply(); }
    [search, type, fam, basic, h, w].forEach(function (el) {
      el.addEventListener('input', onChange);
      el.addEventListener('change', onChange);
    });
    reset.addEventListener('click', function () {
      search.value = ''; type.value = ''; fam.value = '';
      basic.checked = false; h.value = 30; w.value = 1000;
      apply();
    });
    apply();
  }

  function pokemonHtml(slug) {
    var p = bySlug(slug);
    if (!p) return '<h1 class="page-title">Покемон не найден</h1><p class="lead">Такого покемона нет в нашем покедексе.</p>';

    var sections = p.sections.map(function (s) {
      return '<section class="pokemon-section">' +
        '<h2>' + s.title + '</h2>' +
        '<p>' + s.text + '</p>' +
        '</section>';
    }).join('');

    return '' +
      '<div class="pokemon-header">' +
        '<div class="pokemon-image" style="--type-color:' + (POKEMON_TYPES[p.types[0]] || { color: '#888' }).color + '">' +
          '<img src="' + p.image + '" alt="' + p.nameRu + '" loading="lazy">' +
        '</div>' +
        '<div class="pokemon-info">' +
          '<button type="button" class="cry-btn cry-btn-static" data-cry="cries/' + p.slug + '.ogg" title="Крик: ' + p.nameRu + '">🔊</button>' +
          '<span class="card-number">#' + String(p.number).padStart(3, '0') + '</span>' +
          '<h1 class="pokemon-name">' + p.nameRu + '</h1>' +
          '<span class="pokemon-en">' + p.nameEn + '</span>' +
          '<div class="type-badges">' + typeBadges(p.types) + '</div>' +
          '<dl class="stats">' +
            '<div><dt>Рост</dt><dd>' + p.height + '</dd></div>' +
            '<div><dt>Вес</dt><dd>' + p.weight + '</dd></div>' +
            '<div><dt>Номер</dt><dd>#' + String(p.number).padStart(3, '0') + '</dd></div>' +
          '</dl>' +
        '</div>' +
      '</div>' +
      '<p class="lead pokemon-intro">' + p.intro + '</p>' +
      '<div class="pokemon-sections">' + sections + '</div>';
  }

  function render() {
    var slug = (location.hash || '#/').replace(/^#\//, '');
    var content;
    if (slug === '') {
      content = homeHtml();
    } else if (slug === 'dex') {
      content = dexHtml();
    } else {
      content = pokemonHtml(slug);
    }
    app.innerHTML = content;

    if (slug === 'dex') {
      setupDexPage();
    }

    var links = document.querySelectorAll('.nav a');
    links.forEach(function (a) {
      var href = a.getAttribute('href').replace(/^#\//, '');
      a.classList.toggle('selected', (href === '' ? '' : href) === slug);
    });

    var dexBtn = document.querySelector('.nav-dropdown-btn');
    if (dexBtn) {
      dexBtn.classList.toggle('selected', slug === 'dex');
    }

    window.scrollTo(0, 0);
  }

  function playAudio() {
    if (!audio) return;
    audio.volume = 0.5;
    var p = audio.play();
    if (p !== undefined) {
      p.then(function () {
        bgmPlaying = true;
        updateBgmBtn();
      }).catch(function () {
        audio.muted = true;
        audio.play().catch(function () { /* ждём первый клик */ });
      });
    }
  }

  function stopAudio() {
    if (!audio) return;
    audio.pause();
    bgmPlaying = false;
    updateBgmBtn();
  }

  function toggleAudio() {
    if (!audio) return;
    if (bgmPlaying || !audio.paused) {
      stopAudio();
    } else {
      playAudio();
    }
  }

  function updateBgmBtn() {
    if (!bgmBtn) return;
    bgmBtn.textContent = bgmPlaying ? '♪' : '∅';
  }

  function unlockAudio() {
    if (!audio) return;
    if (audio.muted) {
      audio.muted = false;
      playAudio();
    }
  }

  window.addEventListener('hashchange', render);
  window.addEventListener('DOMContentLoaded', function () {
    render();
    buildDexMenu();
    setupDexDropdown();
    if (bgmBtn) {
      bgmBtn.addEventListener('click', toggleAudio);
    }
    playAudio();
    document.addEventListener('click', unlockAudio, { once: false });
    document.addEventListener('touchstart', unlockAudio, { once: false });
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.cry-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        playCry(btn.getAttribute('data-cry'));
      }
    });
  });
})();
