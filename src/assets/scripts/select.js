import 'select2';
import 'jquery.easing';


$(() => {
	$('.select-template').each(function() {
		const select = $(this);
		const selectWrapper = select.closest('.select-wrapper');
		const selectWrapperStyles = getComputedStyle(selectWrapper[0]);
		if (selectWrapperStyles.position === 'static') {
			selectWrapper.css('position', 'relative');
		}

		select.select2({
			minimumResultsForSearch: Infinity,
			dropdownParent: selectWrapper,
			selectOnClose: true,
		});

		select.on('select2:select', event => {
			$('.catalogFilter--js span').text(event.params.data.text);
		});

		select.on('select2:open', () => {
			selectWrapper.css('z-index', '100000');

			const selectDropdown = selectWrapper.find('.select2-dropdown');

			selectDropdown.hide();
			const timeout = setTimeout(() => {
				selectDropdown.slideDown({ duration: 500, easing: 'easeInOutCubic' });

				clearTimeout(timeout);
			}, 0);
		});

		select.on('select2:closing', event => {
			event.preventDefault();

			const selectDropdown = selectWrapper.find('.select2-dropdown');

			const timeout = setTimeout(() => {
				selectWrapper.css('z-index', '');

				const select2 = selectWrapper.find('.select2');

				select2.addClass('closing');
				selectDropdown.slideUp(500, () => {
					const timeout2 = setTimeout(() => {
						select.select2('destroy');
						select.select2({
							minimumResultsForSearch: Infinity,
							dropdownParent: selectWrapper,
							selectOnClose: true,
						});
						select.removeClass('closing');

						selectWrapper.css('z-index', '');

						clearTimeout(timeout2);
					}, 200);
				});

				clearTimeout(timeout);
			}, 0);
		});
	});
});
