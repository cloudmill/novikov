const $mainMenu = $('#mainMenu');
const $autoNav = $('#autoNav');
const $autoNavMore = $('#autoNavMore');
const $autoNavMoreList = $('#autoNavMoreList');
function autoNavMore() {
	let childNumber = 2;

	if ($(window).width() >= 320) {
		const $menuWidth = $mainMenu.width();
		const $autoNavWidth = $autoNav.width();
		if ($autoNavWidth > $menuWidth) {
			$autoNav
				.children(`li:nth-last-child(${childNumber})`)
				.prependTo($autoNavMoreList);
			autoNavMore();
		} else {
			const $autoNavMoreFirst = $autoNavMoreList
				.children('li:first-child')
				.width();
			if ($autoNavWidth + $autoNavMoreFirst < $menuWidth) {
				$autoNavMoreList.children('li:first-child').insertBefore($autoNavMore);
			}
		}
		if ($autoNavMoreList.children().length > 0) {
			$autoNavMore.show();
			childNumber = 2;
		} else {
			$autoNavMore.hide();
			childNumber = 1;
		}
	}
}
// INIT
autoNavMore();
$(window).resize(autoNavMore);
// MAIN MENU END
