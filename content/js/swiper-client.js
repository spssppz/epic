/**
 * @typedef {'bullets' | 'fraction' | 'progressbar' | 'custom'} SwiperPaginationType
 */

/**
 * @typedef {'horizontal' | 'vertical'} SwiperDirection
 */

/**
 * @typedef {'ru' | 'en'} SwiperLang
 */

/**
 * @typedef {Object} SwiperClientOptions
 * @property {string} selector
 * @property {boolean} [loop]
 * @property {number} [autoplayDelay]
 * @property {boolean} [autoplayDisableOnInteraction=true]
 * @property {boolean} [navigation]
 * @property {string} [navigationNextSelector='.swiper-button-next']
 * @property {string} [navigationPrevSelector='.swiper-button-prev']
 * @property {boolean} [pagination]
 * @property {string} [paginationSelector='.swiper-pagination']
 * @property {SwiperPaginationType} [paginationType='bullets']
 * @property {boolean} [paginationClickable=true]
 * @property {SwiperLang} [lang='ru']
 * @property {number} [speed=300]
 * @property {number} [spaceBetween=0]
 * @property {number | 'auto'} [slidesPerView=1]
 * @property {string} [effect]
 * @property {SwiperDirection} [direction='horizontal']
 * @property {Object<string, any>} [breakpoints]
 * @property {boolean} [centeredSlides]
 * @property {boolean} [freeMode]
 * @property {boolean} [grabCursor]
 * @property {Object<string, any>} [swiperOverrides]
 */

/**
 * Инициализирует один или несколько экземпляров Swiper на основе переданных опций.
 *
 * @param {SwiperClientOptions} options
 * @returns {Swiper[]} Массив созданных инстансов Swiper.
 */
function initSwiper(options) {
    if (typeof Swiper === 'undefined') {
        console.error(
            'Swiper library is NOT loaded or defined. ' +
            'Make sure swiper-bundle.js is included before swiper-client.js.'
        );
        return [];
    }

    const safeOptions = options || {};
    const selector = safeOptions.selector || '.swiper-container';

    /** @type {NodeListOf<HTMLElement>} */
    const swiperElements = document.querySelectorAll(selector);

    if (!swiperElements.length) {
        console.warn(`initSwiper: no elements found for selector "${selector}"`);
        return [];
    }

    const baseConfig = buildSwiperConfigFromOptions(safeOptions);
    const instances = [];

    swiperElements.forEach((element, index) => {
        try {
            const finalConfig = Object.assign(
                {},
                baseConfig,
                safeOptions.swiperOverrides || {}
            );

            const swiper = new Swiper(element, finalConfig);
            element.swiperInstance = swiper;
            instances.push(swiper);
        } catch (error) {
            console.error('Failed to initialize Swiper on element:', element, error);
        }
    });

    return instances;
}

/**
 * @param {SwiperClientOptions} opts
 * @returns {Object}
 */
function buildSwiperConfigFromOptions(opts) {
    /** @type {any} */
    const config = {};

    // loop
    if (typeof opts.loop === 'boolean') {
        config.loop = opts.loop;
    }

    // autoplay
    if (typeof opts.autoplayDelay === 'number') {
        config.autoplay = {
            delay: opts.autoplayDelay,
            disableOnInteraction:
                typeof opts.autoplayDisableOnInteraction === 'boolean'
                    ? opts.autoplayDisableOnInteraction
                    : true,
        };
    }

    // navigation
    if (opts.navigation) {
        config.navigation = {
            nextEl: opts.navigationNextSelector || '.swiper-button-next',
            prevEl: opts.navigationPrevSelector || '.swiper-button-prev',
        };
    }

    // pagination
    if (opts.pagination) {
        config.pagination = {
            el: opts.paginationSelector || '.swiper-pagination',
            type: opts.paginationType || 'bullets',
            clickable:
                typeof opts.paginationClickable === 'boolean'
                    ? opts.paginationClickable
                    : true,
        };
    }

    // a11y (аналог data-swiper-a11y при lang='ru')
    const lang = opts.lang || 'ru';
    config.a11y =
        lang === 'ru'
            ? {
                prevSlideMessage: 'Предыдущий слайд',
                nextSlideMessage: 'Следующий слайд',
                paginationBulletMessage: 'Перейти к слайду {{index}}',
            }
            : {
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
                paginationBulletMessage: 'Go to slide {{index}}',
            };

    // speed
    config.speed =
        typeof opts.speed === 'number' && !Number.isNaN(opts.speed)
            ? opts.speed
            : 300;

    // spaceBetween
    if (typeof opts.spaceBetween === 'number' && !Number.isNaN(opts.spaceBetween)) {
        config.spaceBetween = opts.spaceBetween;
    } else {
        config.spaceBetween = 0;
    }

    // slidesPerView
    if (opts.slidesPerView === 'auto') {
        config.slidesPerView = 'auto';
    } else if (typeof opts.slidesPerView === 'number') {
        config.slidesPerView = Number.isNaN(opts.slidesPerView)
            ? 1
            : opts.slidesPerView;
    } else {
        config.slidesPerView = 1;
    }

    // effect
    if (typeof opts.effect === 'string') {
        config.effect = opts.effect;
    }

    // direction
    config.direction = opts.direction || 'horizontal';

    // breakpoints
    if (opts.breakpoints && typeof opts.breakpoints === 'object') {
        config.breakpoints = opts.breakpoints;
    }

    // centeredSlides
    if (typeof opts.centeredSlides === 'boolean') {
        config.centeredSlides = opts.centeredSlides;
    }

    // freeMode
    if (typeof opts.freeMode === 'boolean') {
        config.freeMode = opts.freeMode;
    }

    // grabCursor
    if (typeof opts.grabCursor === 'boolean') {
        config.grabCursor = opts.grabCursor;
    }

    return config;
}

/* ===================== АВТО-ИНИЦИАЛИЗАЦИЯ ДЛЯ VIP SWIPER ===================== */

/**
 * Автоматический вызов initSwiper с конфигом, который раньше задавался
 * через data-атрибуты:
 *
 *  data-swiper-selector=".vip-status-list__swiper"
 *  data-swiper-navigation
 *  data-swiper-navigation-prev="#vip-status-nav-prev"
 *  data-swiper-navigation-next="#vip-status-nav-next"
 *  data-swiper-space-between="12"
 *  data-swiper-slides-per-view="auto"
 *  data-swiper-free-mode
 *  data-swiper-grab-cursor
 *  data-swiper-a11y
 *
 * Инициализация выполняется строго для экранов не менее 600px.
 */
document.addEventListener('DOMContentLoaded', function () {
    if (!window.matchMedia) return;

    const mq = window.matchMedia('(min-width: 600px)');

    // сюда складываешь конфиги для разных свайперов
    const swiperConfigs = [
        {
            selector: '.vip-status-list__container',
            navigation: true,
            navigationPrevSelector: '#vip-status-nav-prev',
            navigationNextSelector: '#vip-status-nav-next',
            spaceBetween: 8,
            slidesPerView: 'auto',
            freeMode: true,
            grabCursor: true,
            lang: 'ru',
        },
        // Game Block Recent
        {
            selector: '#game-block-recent .game-block__container',
            navigation: true,
            navigationPrevSelector: '#game-block-recent-prev',
            navigationNextSelector: '#game-block-recent-next',
            spaceBetween: 12,
            slidesPerView: 'auto',
            freeMode: true,
            grabCursor: true,
            lang: 'ru',
        },
        // Game Block Slots
        {
            selector: '#game-block-slots .game-block__container',
            navigation: true,
            navigationPrevSelector: '#game-block-slots-prev',
            navigationNextSelector: '#game-block-slots-next',
            spaceBetween: 12,
            slidesPerView: 'auto',
            freeMode: true,
            grabCursor: true,
            lang: 'ru',
        },
        // Game Block Live Games
        {
            selector: '#game-block-live .game-block__container',
            navigation: true,
            navigationPrevSelector: '#game-block-live-prev',
            navigationNextSelector: '#game-block-live-next',
            spaceBetween: 12,
            slidesPerView: 'auto',
            freeMode: true,
            grabCursor: true,
            lang: 'ru',
        },
        // Boost Wrap (без навигации)
        {
            selector: '.boost-wrap__container',
            navigation: false,
            spaceBetween: 8,
            slidesPerView: 'auto',
            freeMode: true,
            grabCursor: true,
            lang: 'ru',
        },
    ];

    /** @type {Swiper[]} */
    let swiperInstances = [];

    function enableSwipers() {
        // не создаём повторно, если уже есть экземпляры
        if (swiperInstances.length > 0) return;

        swiperConfigs.forEach(config => {
            const instances = initSwiper(config) || [];
            swiperInstances.push(...instances);
        });
    }

    function destroySwipers() {
        if (!swiperInstances.length) return;

        swiperInstances.forEach(instance => {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy(true, true);
            }
        });

        swiperInstances = [];
    }

    // первичная инициализация
    if (mq.matches) {
        enableSwipers();
    }

    // обработчик изменения ширины
    mq.addEventListener('change', e => {
        if (e.matches) {
            // >= 600px → включаем все свайперы по конфигам
            enableSwipers();
        } else {
            // < 600px → выключаем все свайперы
            destroySwipers();
        }
    });
});

