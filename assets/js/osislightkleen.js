(function ($) {
	'use strict';

	/* Hero slider */
	var $slides = $('.olk-hero__slide');
	var $dots = $('.olk-hero__dot');
	var current = 0;
	var timer;

	function goTo(index) {
		if (!$slides.length) return;
		current = (index + $slides.length) % $slides.length;
		$slides.removeClass('is-active').eq(current).addClass('is-active');
		$dots.removeClass('is-active').eq(current).addClass('is-active');
	}

	function next() { goTo(current + 1); }
	function prev() { goTo(current - 1); }

	function startAutoplay() {
		stopAutoplay();
		timer = setInterval(next, 6000);
	}

	function stopAutoplay() {
		if (timer) clearInterval(timer);
	}

	if ($slides.length) {
		$dots.on('click', function () {
			goTo($(this).data('index'));
			startAutoplay();
		});
		$('.olk-hero__arrow--next').on('click', function () { next(); startAutoplay(); });
		$('.olk-hero__arrow--prev').on('click', function () { prev(); startAutoplay(); });
		startAutoplay();
	}

	/* Mobile nav */
	$('.olk-menu-toggle').on('click', function () {
		$('.olk-nav-wrap').toggleClass('is-open');
	});

	/* Active nav link */
	var path = window.location.pathname.split('/').pop() || 'index.html';
	$('.olk-nav a').each(function () {
		var href = $(this).attr('href');
		if (href === path || (path === '' && href === 'index.html')) {
			$(this).addClass('active');
		}
	});

})(jQuery);
