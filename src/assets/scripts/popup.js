import jBox from 'jbox';


// eslint-disable-next-line no-new
new jBox('Image');

const myModal = new jBox('Modal', {
	attach: '.myModal',
	content: $('#mapMe'),
	closeButton: false,
});

$('.close-popup--js').click(function() {
	myModal.close();
});

export { myModal };
