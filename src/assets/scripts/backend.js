import AOS from 'aos';
import { sliderSwiper } from './sliders.js';
import { initSwiper } from './sliders.js';
import { initMapRest } from './map.js';
import { updateCartCount } from './cart.js';
import { updateCartList } from './cart.js';
import { deleteProduct } from './input.js';
import { appendProduct } from './input.js';
import { removeProduct } from './input.js';
import { scrollContent } from '../../app.js';

$(function() {
	restaurantsFilter();
	showMore();
	selectProject();
	eventsFilter();
	mainRestFilterRegion();
	mainRestFilterKitchen();
  mainRestFilterFeature();
	menuRestaurantSections();
	basket();
  restaurantsTabs();
  ckeckValidateCard();
  getLatLng();
  deliveryTabs();
});

function restaurantsFilter() {
	$('[data-type=filter-restaurants]').on('click', function() {
		$(this).addClass('active').siblings().removeClass('active');

		const container = $(this).parents('[data-type=main-carousel]');
		const kitchenId = $(this).attr('data-id');
		const kitchens = container.find('[data-type=kitchens');
		const itemsCont = container.find('[data-type=items_container]');

		$.ajax({
			type: 'POST',
			url: window.location.href,
			dataType: 'html',
			data: {
				kitchenId: kitchenId,
			},
			success: function(data) {
				itemsCont.remove();

				const itemsContResponse = $(data).find('[data-type=items_container]');

				kitchens.after(itemsContResponse);
				initSwiper();
			}
		});
	});
}

function showMore() {
	$(document).on('click', '[data-type=show_more_click]', function() {
		const container = $(this).parents('[data-type=main_container]');
		const itemsContainer = container.find('[data-type=items_container]');
		const url = $(this).attr('data-url');
		const pageNavBlock = container.find('[data-type=page_nav_block');
		let data = null;
		const path = window.location.pathname.split('/');

		if (path[1] == 'events') {
			data = JSON.parse(container.find('[data-type=show_more_click]').attr('data-filter'));
		} else {
			data = {
				ajax: true,
			};
		}

		if (url !== undefined) {
			$.ajax({
				type: 'POST',
				url: url,
				dataType: 'html',
				data: data,
				success: function(data) {
					pageNavBlock.remove();

					const itemsResponse = $(data).find('[data-type=item]');
					const pagenavResponse = $(data).find('[data-type=page_nav_block]');

					itemsContainer.append(itemsResponse);
					itemsContainer.after(pagenavResponse);
				}
			});
		}
	});
}

function selectProject() {
	$(document).on('click', '[data-type=select_project]', function(e) {
		e.preventDefault();

		const container = $(this).parents('[data-type=main_container]');
		const projectId = $(this).attr('data-id');
		const projectItemContainer = container.find('[data-type=item_container]');
		const selectProject = $(this).parents('[data-type=select_project_style]');
		const url = window.location.href;

		selectProject.addClass('active').siblings().removeClass('active');

		$.ajax({
			type: 'POST',
			url: url,
			dataType: 'html',
			data: {
				projectId: projectId,
			},
			success: function(data) {
				projectItemContainer.empty();

				const projectItemContainerResponse = $(data).find('[data-type=item_container]').children();

        projectItemContainer.append(projectItemContainerResponse);
        sliderSwiper();
			}
		});
	});
}

function eventsFilter() {
	$('[data-type=filter_events]').on('click', function() {
		$(this).addClass('active').siblings().removeClass('active');

		const container = $(this).parents('[data-type=main_container]');
		const sectionId = $(this).attr('data-sect-id');
		const sectContainer = container.find('[data-type=sections_events_container');
		const itemsCont = container.find('[data-type=items_container]');
		const pageNav = container.find('[data-type=page_nav_block]');

    container.find('.filter-global li.span').css({'width': `${$(this).width() + 40}px`, 'left': `${$(this).position().left}px`});

		$.ajax({
			type: 'POST',
			url: window.location.href,
			dataType: 'html',
			data: {
				sectionId: sectionId,
			},
			success: function(data) {
				itemsCont.remove();
				pageNav.remove();

				const itemsContResponse = $(data).find('[data-type=items_container]');
				const pageNavResponse = $(data).find('[data-type=page_nav_block]');

				sectContainer.after(itemsContResponse);
				itemsContResponse.after(pageNavResponse);
			}
		});
	});
}

function mainRestFilterRegion() {
	$('[data-type=restaurants-region-filter-select]').on('select2:select', function() {
		const container = $(this).parents('[data-type=main_container]');
		const kitchensSelect = container.find('[data-type=restaurants-kitchens-filter-select]');
		const itemsContainer = container.find('[data-type=items_container]');
    const itemsContainerMap = container.find('[data-type=items-container-map]');
		const regionId = $(this).val();
		const kitchensOption = container.find('[data-type=restaurants-kitchens-filter-select] option');
    const kitchensFiltBlock = container.find('[data-type=kitchens-filt-block]');
    const propFeatureBlock = container.find('[data-type=filter-feature]');
    const mapContainer =  container.find('[data-type=items-container-map]');

		$.ajax({
			type: 'POST',
			url: window.location.href,
			dataType: 'html',
			data: {
				regionId: regionId,
			},
			success: function(data) {
        itemsContainer.empty();
        itemsContainerMap.empty();
				kitchensOption.remove();
        propFeatureBlock.remove();

				const itemsContainerResponse = $(data).find('[data-type=items_container]').children(),
            itemsContainerMapResponse = $(data).find('[data-type=items-container-map]').children(),
            kitchensOptionResponse = $(data).find('[data-type=restaurants-kitchens-filter-select] option'),
            propFeatureBlockResponse = $(data).find('[data-type=filter-feature]');

        itemsContainer.append(itemsContainerResponse);
        itemsContainerMap.append(itemsContainerMapResponse);
        kitchensFiltBlock.after(propFeatureBlockResponse);

				kitchensSelect.append(kitchensOptionResponse);

				kitchensSelect.each(function() {
					$(this).val($(this).find('[selected]').val()).trigger('change');
				});

				if (mapContainer.hasClass('active')) {
          initMapRest();
          scrollContent();
        }
			}
		});
	});
}

function mainRestFilterKitchen() {
	$('[data-type=restaurants-kitchens-filter-select]').on('select2:select', function() {
		const container = $(this).parents('[data-type=main_container]');
		const itemsCont = container.find('[data-type=items_container]');
    const itemsContMap = container.find('[data-type=items-container-map]');
		const regionId = container.find('[data-type=restaurants-region-filter-select]').val();
    const kitchensFiltBlock = container.find('[data-type=kitchens-filt-block]');
    const propFeatureBlock = container.find('[data-type=filter-feature]');
    const mapContainer =  container.find('[data-type=items-container-map]');

		$.ajax({
			type: 'POST',
			url: window.location.href,
			dataType: 'html',
			data: {
				regionId: regionId,
				kitchenId: $(this).val(),
			},
			success: function(data) {
        const propFeatureBlockResponse = $(data).find('[data-type=filter-feature]');
        const itemsContResponse = $(data).find('[data-type=items_container]').children();
        const itemsContMapResponse = $(data).find('[data-type=items-container-map]').children();


        propFeatureBlock.remove();
        itemsCont.empty();
        itemsContMap.empty();

        kitchensFiltBlock.after(propFeatureBlockResponse);
        itemsCont.append(itemsContResponse);
        itemsContMap.append(itemsContMapResponse);

        if (mapContainer.hasClass('active')) {
          initMapRest();
          scrollContent();
        }
			}
		});
	});
}

function mainRestFilterFeature() {
  $(document).on('change', '[data-type=select-filter-feature]', function() {
    const obj = $(this);
    const container = obj.parents('[data-type=main_container]');
    const checkedFeature = container.find('[data-type=select-filter-feature]:checked');
    const itemsCont = container.find('[data-type=items_container]');
    const itemsContMap = container.find('[data-type=items-container-map]');
    let feautureIds = [];
    const regionId = container.find('[data-type=restaurants-region-filter-select]').val();
    const kitchenId = container.find('[data-type=restaurants-kitchens-filter-select]').val();
    const mapContainer =  container.find('[data-type=items-container-map]');

    checkedFeature.each(function (i) {
      feautureIds[i] = $(this).attr('data-id');
    });

    $.ajax({
      type: 'POST',
      url: window.location.href,
      dataType: 'html',
      data: {
        regionId: regionId,
        kitchenId: kitchenId,
        feautureIds: feautureIds,
      },
      success: function(data) {
        const itemsContResponse = $(data).find('[data-type=items_container]').children();
        const itemsContMapResponse = $(data).find('[data-type=items-container-map]').children();

        itemsCont.empty();
        itemsContMap.empty();

        itemsCont.append(itemsContResponse);
        itemsContMap.append(itemsContMapResponse);

        if (mapContainer.hasClass('active')) {
          initMapRest();
          scrollContent();
        }
      }
    });
  });
}

function menuRestaurantSections() {
	$('[data-type=select-menu-sections]').on('click', function(e) {
		e.preventDefault();

		const container = $(this).parents('[data-type=main_container]');
		const selectSection = $(this).parents('[data-type=select-section]');
		const sectId = $(this).attr('data-id');
		const itemsContainer = container.find('[data-type=items_container');
		const urlItem = container.find('[data-type=url-page-nav]');

		selectSection.addClass('active').siblings().removeClass('active');

		$.ajax({
			type: 'POST',
			url: window.location.href,
			dataType: 'html',
			data: {
				sectId: sectId,
			},
			success: function(data) {
        urlItem.remove();
				itemsContainer.children().remove();

				const itemsContainerResponse = $(data).children();
        const urlResponse = $(data).filter('[data-type=url-page-nav]');

        if (urlResponse) {
          itemsContainer.before(urlResponse);
        }

				itemsContainer.append(itemsContainerResponse);
			}
		});
	});
}

function basket() {
  $(document).on('click', '[data-type=cart]', function() {
    let curItem = $(this);
    let container = curItem.parents('[data-type=body]');
    let productId = curItem.attr('data-product-id');
    let productRKId = curItem.attr('data-r-keeper-id');
    let productNameEn = curItem.attr('data-product-name-en');
    let quantity = curItem.parents('.incDec').find('.cart-count').text();
    let type = curItem.attr('data-func-type');
    let restCode = curItem.attr('data-rest-code');
    let calculate = curItem.attr('data-calculate');
    let productsList = container.find('[data-type=products_list]');
    let discountCardProduct = curItem.attr('data-discount-card');
    let data = null;

    if (type == 'update') {
      data = {
        productId: productId,
        quantity: quantity,
        calculate: calculate,
        type: type,
      };
    } else if (type == 'delete') {
      data = {
        productId: productId,
        type: type,
      };
    } else {
      data = {
        productId: productId,
        productRKId: productRKId,
        productNameEn: productNameEn,
        discountCardProduct: discountCardProduct,
        type: type,
        restCode: restCode,
      };
    }

    $.ajax({
      type: 'POST',
      url: '/local/templates/main/include/ajax/basket.php',
      dataType: 'json',
      data: data,
      success: function(data) {
        if (data.success === true && data.redirect) {
          window.location.replace('/order/');

          return false;
        }

        if (data.success === true && !data.clear_basket) {
          if (type == 'add') {
            updateCartCount();
            updateCartList(curItem, productsList, data.basketProductId);
          } else if (type == 'delete') {
            deleteProduct(curItem);
          } else {
            if (calculate == '+') {
              appendProduct(curItem);
            } else {
              removeProduct(curItem);
            }
          }
        } else if (data.success === true && data.clear_basket) {
          container.find('[data-type=another-rest]').addClass('active');

          let dataAnotherRest = {
            productId: productId,
            productRKId: productRKId,
            productNameEn: productNameEn,
            discountCardProduct: discountCardProduct,
            restCode: restCode,
          };

          anotherRestaurant(dataAnotherRest, curItem, productsList);
        } else {
          console.log('???????????? ???????????????????? ????????????');
        }
      }
    });
  });
}

function anotherRestaurant(data, curItem, productsList) {
  $('[data-type=add-product-another-rest]').click(function (e) {
    e.preventDefault();

    $.ajax({
      type: 'POST',
      url: '/local/templates/main/include/ajax/basket_delete_all.php',
      dataType: 'json',
      data: data,
      success: function(r) {
        if (r.success === true && !r.redirect) {
          updateCartList(curItem, productsList, data.basketProductId, 'delete');
        } else if (r.success === true && r.redirect) {
          window.location.replace('/order/');
        } else {
          console.log('error');
        }
      }
    });
  });
}

function restaurantsTabs() {
  $('[data-type=restaurant-select-tab]').on('click', function () {
    let container = $(this).parents('[data-type=main_container]'),
      selector = $(this).attr('data-toggle-target'),
      tab = container.find(selector);

    tab.addClass('active').siblings().removeClass('active');

    if (tab.hasClass('map') && $('#restYMaps').children().length === 0) {
      initMapRest();
      scrollContent();
    }

    setTimeout(() => {
      AOS.refresh({
        offset: 50,
      });
    }, 400);
  });
}

function deliveryTabs() {
  $(document).on('click', '[data-type=delivery-tab]', function (e) {
    e.preventDefault();

    let body = $(this).parents('body'),
      deliveryPriceBlock = body.find('[data-type=container-delivery-price]'),
      deliveryPrice = deliveryPriceBlock.find('[data-type=delivery-price]'),
      deliveryPriceData = Number(deliveryPriceBlock.find('[data-type=delivery-price]').text()),
      orderPrice = body.find('[data-type=order-price]'),
      orderPriceData = Number(body.find('[data-type=order-price]').text()),
      totalPrice = body.find('[data-type=total]'),
      totalPriceData = Number(body.find('[data-type=total]').text()),
      tabContent = $(this).closest('.set-tab').find('.tab-content');

    $(this).addClass('active').siblings().removeClass('active');
    tabContent.removeClass('active').filter($(this).data('toggle-target')).addClass('active');

    if (!$(this).data('delivery')) {
      deliveryPriceBlock.hide();
      orderPrice.text(orderPriceData - deliveryPriceData);
      totalPrice.text(totalPriceData - deliveryPriceData);
    } else {
      deliveryPriceBlock.show();
      orderPrice.text(orderPriceData + deliveryPriceData);
      totalPrice.text(totalPriceData + deliveryPriceData);
    }
  });
}

function ckeckValidateCard() {
  $(document).on('click', '[data-type=check-valid-card]', function (e) {
    e.preventDefault();

    let mainContainer = $(this).parents('[data-type=cart-items-container]'),
      container = $(this).parents('[data-type=promo-container]').filter('.active'),
      errorBlock = container.find('[data-type=error-block]'),
      phone = container.find('input[name=phone]').data('phone'),
      loyaltyCard = container.find('input[name=number]').val(),
      type = 'loyalty',
      data = null;

    if (container.hasClass('promo-content')) {
      let promoCard = container.find('input[name=promo]').val();

      type = 'promo';

      data = {
        promoCard: promoCard,
      };
    } else {
      data = {
        card_number: loyaltyCard,
        phone: phone,
      };
    }

    $.ajax({
      type: 'POST',
      url: 'http://209.250.245.217:3000/site/discountcards/check',
      headers: {
        Authorization: 'Bearer b52c96bea30646abf8170f333bbd42b9',
      },
      dataType: 'json',
      data: data,
      success: function(r) {
        if (r.is_valid === false) {
          errorBlock.addClass('active');
          errorBlock.text(r.comment);

          setTimeout(function() {
            errorBlock.removeClass('active');
          }, 3000);
        } else {
          $.ajax({
            type: 'POST',
            url: window.location.href,
            dataType: 'html',
            data: {
              discount: type + '-' + r.discount_percent,
            },
            success: function(data) {
              mainContainer.empty();

              mainContainer.append($(data));
            }
          });
        }
      }
    });
  });
}

function getLatLng() {
  $('[data-type=get-coord]').on('click', function () {
    let obj = $(this),
      container = obj.parents('[data-type=coordinates-container]'),
      coordInp = container.find('[data-type=coord-inp]').val();

    if (coordInp) {
      $.ajax({
        type: 'POST',
        url: window.location.href,
        dataType: 'json',
        data: {
          dataCoord: coordInp,
        },
        success: function(data) {
          if (data.success === true) {
            let resultCoord = JSON.stringify(data.coordinates);

            if (!container.find('[data-type=coord-result]').length) {
              obj.after('<br>??????????????????: <input type="text" value="'+ resultCoord + '" data-type="coord-result">');
            } else {
              container.find('[data-type=coord-result]').val(resultCoord);
            }
          }
        }
      });
    }
  });
}
