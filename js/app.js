(function () {
  'use strict';

  var app = document.getElementById('app');
  var audio = document.getElementById('bgm');
  var bgmBtn = document.getElementById('bgm-btn');
  var bgmPlaying = false;

  function bySlug(slug) {
    return POKEMON.find(function (p) { return p.slug === slug; });
  }

  function typeBadges(types) {
    return types.map(function (t) {
      var meta = POKEMON_TYPES[t] || { ru: t, color: '#888' };
      return '<span class="type-badge" style="background:' + meta.color + '">' + meta.ru + '</span>';
    }).join(' ');
  }

  function homeHtml() {
    var cards = POKEMON.map(function (p) {
      return '' +
        '<a class="pokemon-card" href="#/' + p.slug + '" style="--type-color:' + (POKEMON_TYPES[p.types[0]] || { color: '#888' }).color + '">' +
          '<img src="' + p.image + '" alt="' + p.nameRu + '" loading="lazy">' +
          '<div class="card-body">' +
            '<span class="card-number">#' + String(p.number).padStart(3, '0') + '</span>' +
            '<h3>' + p.nameRu + '</h3>' +
            '<span class="card-en">' + p.nameEn + '</span>' +
            '<div class="type-badges">' + typeBadges(p.types) + '</div>' +
          '</div>' +
        '</a>';
    }).join('');

    return '' +
      '<h1 class="page-title">Всех их вместе соберем, всех их соберем!</h1>' +
      '<p class="lead"><span class="site-name">«Покемон»</span> (яп. покэтто монсута, англ. Pokemon, от англ. Pocket Monster — «карманный монстр») — сверхпопулярная медиафраншиза, созданная Сатоси Тадзири в 1996 году. Товарный знак «Покемон» принадлежит Nintendo, одной из крупнейших фирм-разработчиков компьютерных игр. «Покемон» впервые появился как пара игр, разработанных студией Game Freak, и после этого стал второй в мире по популярности серией компьютерных игр, уступив лишь другой серии игр Nintendo, Mario. По мотивам игр существует аниме, пользующееся колоссальным успехом в мире, а также манга, коллекционная карточная игра и прочие сопутствующие товары.</p>' +
      '<p class="lead">Само слово «покемон» обозначает вымышленное существо, обладающее сверхъестественными способностями. На данный момент существует свыше 1000 разновидностей покемонов. В вымышленной вселенной «Покемона» люди, называющиеся тренерами покемонов, обучают их для сражений с покемонами других тренеров. Бои проходят до момента, пока один из покемонов не падает без сознания или его тренер не сдаётся, — до смерти схватки не происходят никогда. Как правило, сильные и опытные тренеры покемонов пользуются уважением.</p>' +
      '<h2 class="section-title">Покедекс</h2>' +
      '<div class="pokemon-grid">' + cards + '</div>';
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
    var content = slug === '' ? homeHtml() : pokemonHtml(slug);
    app.innerHTML = content;

    var links = document.querySelectorAll('.nav a');
    links.forEach(function (a) {
      var href = a.getAttribute('href').replace(/^#\//, '');
      a.classList.toggle('selected', (href === '' ? '' : href) === slug);
    });

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
    if (bgmBtn) {
      bgmBtn.addEventListener('click', toggleAudio);
    }
    playAudio();
    document.addEventListener('click', unlockAudio, { once: false });
    document.addEventListener('touchstart', unlockAudio, { once: false });
  });
})();
