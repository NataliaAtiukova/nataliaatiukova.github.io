/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Initialize WOW.js Scrolling Animations
    new WOW().init();

})(jQuery); // End of use strict

const translations = {
  ru: {
    nav: {
      about: 'Обо мне',
      portfolio: 'Портфолио',
      contact: 'Контакты',
      policy: 'Политика',
    },
    header: {
      title: 'Добро пожаловать в портфолио мобильного разработчика',
      desc: 'Я Наталья Атьюкова, мобильный разработчик, создающий современные и удобные приложения для iOS и Android. Использую современные инструменты — Swift, SwiftUI, Kotlin, Firebase — чтобы разрабатывать мощные кроссплатформенные решения. Ознакомьтесь с моими проектами ниже или посетите мой GitHub!',
      btn: 'Подробнее',
    },
    // ... другие секции ...
  },
  en: {
    nav: {
      about: 'About Me',
      portfolio: 'Portfolio',
      contact: 'Contact',
      policy: 'Privacy Policy',
    },
    header: {
      title: 'Welcome to My Mobile Developer Portfolio',
      desc: "I'm Natalya Atyukova, a mobile developer focused on creating seamless and engaging applications for both iOS and Android platforms. Using modern tools including Swift, SwiftUI, Kotlin, and Firebase, I develop powerful cross-platform solutions. Explore my projects below or visit my GitHub repository to see my work!",
      btn: 'Learn More',
    },
    // ... другие секции ...
  }
};

function setLanguage(lang) {
  // Навигация
  document.getElementById('nav-about').textContent = translations[lang].nav.about;
  document.getElementById('nav-portfolio').textContent = translations[lang].nav.portfolio;
  document.getElementById('nav-contact').textContent = translations[lang].nav.contact;
  document.getElementById('nav-policy').textContent = translations[lang].nav.policy;
  // Тумблер
  document.getElementById('lang-ru').classList.toggle('active', lang === 'ru');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  // Header
  if (document.getElementById('header-title')) {
    document.getElementById('header-title').textContent = translations[lang].header.title;
    document.getElementById('header-desc').textContent = translations[lang].header.desc;
    document.getElementById('header-btn').textContent = translations[lang].header.btn;
  }
  // Footer policy
  if (document.getElementById('footer-policy')) {
    document.getElementById('footer-policy').textContent = (lang === 'ru') ? 'Политика конфиденциальности' : 'Privacy Policy';
  }
  // Footer language label
  if (document.getElementById('footer-lang-label')) {
    document.getElementById('footer-lang-label').textContent = (lang === 'ru') ? 'Язык страницы: Русский' : 'Page language: English';
  }
  // ... другие секции ...
}

window.addEventListener('DOMContentLoaded', function() {
  // RU/EN переключатель
  document.getElementById('lang-ru').onclick = function() { setLanguage('ru'); };
  document.getElementById('lang-en').onclick = function() { setLanguage('en'); };
});
