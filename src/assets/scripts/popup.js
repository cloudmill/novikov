import jBox from 'jbox';
import { deliveryMap } from './search.js';


// eslint-disable-next-line no-new
new jBox('Image');

const myModal = new jBox('Modal', {
  attach: '.myModal',
  content: $('#mapMe'),
  closeButton: false,
  onOpen: function () {
    if ($('#map').children().length === 0) {
      deliveryMap();
    }
  },
});

const myModalPromo = new jBox('Modal', {
  attach: '.promo--js',
  content: $('#promo'),
  closeButton: false,
});

$('.close-popup--js').click(function() {
  myModal.close();
  myModalPromo.close();
});

export { myModal };
