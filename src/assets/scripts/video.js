$('#play').click(function() {
	const $video = $('#video');
	$(this).fadeOut('500');
	$video.get(0).play();
	$video.attr('controls', '');
});
