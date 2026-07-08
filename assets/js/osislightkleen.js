/* ==========================================================================
   Osislightkleen — Premium interactions (vanilla JS, no dependencies)
   ========================================================================== */
(function () {
	'use strict';

	var doc = document;
	var $ = function (s, ctx) { return (ctx || doc).querySelector(s); };
	var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(s)); };

	/* ---- Preloader (0–100%, waits for images) ---- */
	(function () {
		var preloader = $('#olk-preloader');
		var pctEl = $('#olk-preloader-pct');
		var barEl = $('#olk-preloader-bar');
		if (!preloader) {
			doc.body.classList.remove('is-loading');
			return;
		}

		doc.body.classList.add('is-loading');
		var progress = 0;
		var display = 0;
		var finished = false;
		var assetsDone = false;
		var rafId = 0;

		function setProgress(n) {
			progress = Math.max(progress, Math.min(100, Math.round(n)));
		}

		function paint() {
			display += (progress - display) * 0.18;
			if (assetsDone && display > 99.4) display = 100;
			var shown = Math.floor(display);
			if (pctEl) pctEl.textContent = shown + '%';
			if (barEl) barEl.style.width = shown + '%';
			if (display >= 100 && assetsDone) {
				finish();
				return;
			}
			rafId = requestAnimationFrame(paint);
		}

		function finish() {
			if (finished) return;
			finished = true;
			cancelAnimationFrame(rafId);
			if (pctEl) pctEl.textContent = '100%';
			if (barEl) barEl.style.width = '100%';
			window.setTimeout(function () {
				preloader.classList.add('is-done');
				doc.body.classList.remove('is-loading');
				doc.dispatchEvent(new CustomEvent('olk:ready'));
				window.setTimeout(function () {
					if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
				}, 600);
			}, 180);
		}

		function trackImages() {
			var imgs = $$('img');
			var total = imgs.length;
			var loaded = 0;

			function tick() {
				loaded += 1;
				if (total <= 0) {
					setProgress(100);
					assetsDone = true;
					return;
				}
				setProgress(Math.min(96, (loaded / total) * 96));
				if (loaded >= total) {
					setProgress(100);
					assetsDone = true;
				}
			}

			if (!total) {
				setProgress(100);
				assetsDone = true;
				return;
			}

			imgs.forEach(function (img) {
				if (img.complete && img.naturalWidth > 0) {
					tick();
					return;
				}
				var done = false;
				function once() {
					if (done) return;
					done = true;
					tick();
				}
				img.addEventListener('load', once);
				img.addEventListener('error', once);
			});
		}

		setProgress(4);
		paint();
		trackImages();

		window.addEventListener('load', function () {
			setProgress(100);
			assetsDone = true;
		});

		/* Safety: never soft-lock the page */
		window.setTimeout(function () {
			setProgress(100);
			assetsDone = true;
		}, 10000);
	})();

	/* ---- Header scroll state + scroll-to-top ---- */
	var header = $('.olk-header');
	var toTop = $('.olk-totop');
	function onScroll() {
		var y = window.pageYOffset;
		if (header) header.classList.toggle('is-stuck', y > 8);
		if (toTop) toTop.classList.toggle('is-visible', y > 600);
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
	if (toTop) toTop.addEventListener('click', function () {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	/* ---- Mobile drawer ---- */
	var drawer = $('.olk-drawer');
	var backdrop = $('.olk-backdrop');
	function openDrawer() { if (drawer) { drawer.classList.add('is-open'); backdrop.classList.add('is-open'); doc.body.style.overflow = 'hidden'; } }
	function closeDrawer() { if (drawer) { drawer.classList.remove('is-open'); backdrop.classList.remove('is-open'); doc.body.style.overflow = ''; } }
	var toggle = $('.olk-menu-toggle');
	if (toggle) toggle.addEventListener('click', openDrawer);
	var close = $('.olk-drawer__close');
	if (close) close.addEventListener('click', closeDrawer);
	if (backdrop) backdrop.addEventListener('click', closeDrawer);
	$$('.olk-drawer nav a').forEach(function (a) { a.addEventListener('click', closeDrawer); });

	/* ---- Active nav link ---- */
	var path = window.location.pathname.split('/').pop() || 'index.html';
	$$('.olk-nav a, .olk-drawer nav a').forEach(function (a) {
		var href = (a.getAttribute('href') || '').split('#')[0];
		if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
	});

	/* ---- Scroll reveal (after preloader so content isn't blank) ---- */
	function initReveals() {
		var reveals = $$('.reveal');
		if (!reveals.length) return;
		if ('IntersectionObserver' in window) {
			var io = new IntersectionObserver(function (entries) {
				entries.forEach(function (e) {
					if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
				});
			}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
			reveals.forEach(function (el) { io.observe(el); });
		} else {
			reveals.forEach(function (el) { el.classList.add('is-visible'); });
		}
	}
	if ($('#olk-preloader')) {
		doc.addEventListener('olk:ready', initReveals, { once: true });
	} else {
		initReveals();
	}

	/* ---- Animated counters ---- */
	function animateCount(el) {
		var target = parseFloat(el.getAttribute('data-count'));
		var suffix = el.getAttribute('data-suffix') || '';
		var decimals = (target % 1 !== 0) ? 1 : 0;
		var dur = 1600, start = null;
		function step(ts) {
			if (!start) start = ts;
			var p = Math.min((ts - start) / dur, 1);
			var eased = 1 - Math.pow(1 - p, 3);
			el.textContent = (eased * target).toFixed(decimals) + suffix;
			if (p < 1) requestAnimationFrame(step);
			else el.textContent = target.toFixed(decimals) + suffix;
		}
		requestAnimationFrame(step);
	}
	var counters = $$('[data-count]');
	if ('IntersectionObserver' in window && counters.length) {
		var cio = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
			});
		}, { threshold: 0.6 });
		counters.forEach(function (el) { cio.observe(el); });
	}

	/* ---- Testimonials slider ---- */
	(function () {
		var slides = $$('.olk-testi__slide');
		if (!slides.length) return;
		var dots = $$('.olk-testi__dot');
		var idx = 0, timer;
		function go(i) {
			idx = (i + slides.length) % slides.length;
			slides.forEach(function (s, n) { s.classList.toggle('is-active', n === idx); });
			dots.forEach(function (d, n) { d.classList.toggle('is-active', n === idx); });
		}
		function auto() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6500); }
		dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); auto(); }); });
		var next = $('.olk-testi__arrow--next'), prev = $('.olk-testi__arrow--prev');
		if (next) next.addEventListener('click', function () { go(idx + 1); auto(); });
		if (prev) prev.addEventListener('click', function () { go(idx - 1); auto(); });
		go(0); auto();
	})();

	/* ---- FAQ accordion ---- */
	$$('.olk-faq__q').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var item = btn.closest('.olk-faq__item');
			var ans = $('.olk-faq__a', item);
			var open = item.classList.contains('is-open');
			$$('.olk-faq__item').forEach(function (it) {
				it.classList.remove('is-open');
				$('.olk-faq__a', it).style.maxHeight = null;
			});
			if (!open) { item.classList.add('is-open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
		});
	});

	/* ---- Contact form (front-end) ---- */
	var form = $('#contact');
	if (form) {
		var submit = $('#submit');
		var fields = ['name', 'email', 'sub', 'message'];
		function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
		fields.forEach(function (id) {
			var el = $('#' + id);
			if (el) el.addEventListener('blur', function () {
				var bad = !el.value.trim() || (id === 'email' && !validEmail(el.value));
				el.classList.toggle('error', bad);
			});
		});
		if (submit) submit.addEventListener('click', function () {
			var ok = true;
			fields.forEach(function (id) {
				var el = $('#' + id);
				if (!el) return;
				var bad = !el.value.trim() || (id === 'email' && !validEmail(el.value));
				el.classList.toggle('error', bad);
				if (bad) ok = false;
			});
			if (!ok) return;
			var name = encodeURIComponent($('#name').value);
			var subject = encodeURIComponent($('#sub').value);
			var body = encodeURIComponent($('#message').value + '\n\nFrom: ' + $('#name').value + ' (' + $('#email').value + ')');
			var success = $('#success');
			if (success) { success.style.display = 'block'; }
			fields.forEach(function (id) { var el = $('#' + id); if (el) el.value = ''; });
			window.setTimeout(function () {
				window.location.href = 'mailto:info@osislightkleen.com?subject=' + subject + '&body=' + body;
			}, 400);
		});
	}

	/* ---- Newsletter (front-end acknowledgement) ---- */
	$$('.olk-newsletter').forEach(function (f) {
		f.addEventListener('submit', function (e) {
			e.preventDefault();
			var input = $('input', f);
			if (input && input.value.trim()) { input.value = ''; input.placeholder = 'Thank you — you are subscribed!'; }
		});
	});

	/* ---- Current year ---- */
	$$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

	/* ---- Works horizontal carousel (buttons only, no scrollbar) ---- */
	(function () {
		var track = $('#works-track');
		if (!track) return;
		var next = $('.olk-works__arrow--next');
		var prev = $('.olk-works__arrow--prev');
		var cards = $$('.olk-work-card', track);

		function step() {
			var first = cards[0];
			return first ? first.getBoundingClientRect().width + 18 : 300;
		}

		if (next) next.addEventListener('click', function () {
			track.scrollBy({ left: step(), behavior: 'smooth' });
		});
		if (prev) prev.addEventListener('click', function () {
			track.scrollBy({ left: -step(), behavior: 'smooth' });
		});
	})();
})();
