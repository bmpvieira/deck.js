(function($, pd, document, undefined) {
	'$:nomunge';
	
	var slides,
	$d = $(document),
	current,
	events = {
		change: 'pitchdeck.change'
	},
	options = {},
	methods = {
		init: function(elements, opts) {
			$.extend(options, $[pd].defaults, opts);
			slides = [];
			current = 0;
			
			if ($.isArray(elements)) {
				$.each(elements, function(i, e) {
					slides.push($(e));
				});
			}
			else {
				$(elements).each(function(i, e) {
					slides.push($(e));
				});
			}
			
			$d.bind('keydown', function(e) {
				switch (e.which) {
					case options.keys.next:
						methods.next();
						break;
					case options.keys.previous:
						methods.prev();
						break;
				}
			});
			
			updateStates();
		},
		
		go: function(index) {
			if (typeof index != 'number' || index < 0 || index >= slides.length) return;
			
			$d.trigger(events.change, [current, index]);
			current = index;
			updateStates();
		},
		
		next: function() {
			methods.go(current+1);
		},
		
		prev: function() {
			methods.go(current-1);
		},
		
		getSlide: function(index) {
			var i = index ? index : current;
			if (typeof i != 'number' || i < 0 || i >= slides.length) return null;
			return slides[i];
		},
		
		getSlides: function() {
			return slides;
		}
	};
	
	function updateStates() {
		var oc = options.classes,
		$container = $(options.selectors.container),
		old = $container.data('onSlide'),
		$all = $();
		
		// Container state
		$container.removeClass(oc.onPrefix + old)
			.addClass(oc.onPrefix + current)
			.data('onSlide', current);
		
		// Remove previous states
		$.each(slides, function(i, el) {
			$all = $all.add(el);
		});
		$all.removeClass([
			oc.before,
			oc.previous,
			oc.current,
			oc.next,
			oc.after
		].join(" "));
		
		// Add new states back in
		slides[current].addClass(oc.current);
		if (current > 0) {
			slides[current-1].addClass(oc.previous);
		}
		if (current + 1 < slides.length) {
			slides[current+1].addClass(oc.next);
		}
		if (current > 1) {
			$.each(slides.slice(0, current - 1), function(i, el) {
				el.addClass(oc.before);
			});
		}
		if (current + 2 < slides.length) {
			$.each(slides.slice(current+2), function(i, el) {
				el.addClass(oc.after);
			})
		}
	}
	
	$[pd] = function(method, arg) {
		if (methods[method]) {
			return methods[method](arg);
		}
		else {
			return methods.init(method, arg);
		}
	};
	
	$[pd].defaults = {
		classes: {
			after: 'pitchdeck-after',
			before: 'pitchdeck-before',
			current: 'pitchdeck-current',
			next: 'pitchdeck-next',
			onPrefix: 'on-slide-',
			previous: 'pitchdeck-previous'
		},
		
		selectors: {
			container: '.pitchdeck-container'
		},
		
		keys: {
			next: 39, // right arrow key
			previous: 37 // left arrow key
		}
	}
})(jQuery, 'pitchdeck', document);