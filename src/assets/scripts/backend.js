import { initSwiper } from './sliders.js';
import { initMapRest } from './map.js';
import { updateCartCount } from './cart.js';
import { updateCartList } from './cart.js';
import { deleteProduct } from './input.js';
import { appendProduct } from './input.js';
import { removeProduct } from './input.js';

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
		const projectListContainer = container.find('[data-type=project_list_container]');
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
				projectItemContainer.remove();

				const projectItemContainerResponse = $(data).find('[data-type=item_container]');

				projectListContainer.after(projectItemContainerResponse);
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

		$.ajax({
			type: 'POST',
			url: window.location.href,
			dataType: 'html',
			data: {
				regionId: regionId,
			},
			success: function(data) {
				kitchensOption.remove();

				const kitchensOptionResponse = $(data).find('[data-type=restaurants-kitchens-filter-select] option');

				kitchensSelect.append(kitchensOptionResponse);

				kitchensSelect.each(function() {
					$(this).val($(this).find('[selected]').val()).trigger('change');
				});

				const dataFilter = {
					regionId: regionId,
					kitchenId: kitchensSelect.val(),
				};

				ajaxFilterRestaurantsItems(dataFilter, itemsContainer, itemsContainerMap, kitchensFiltBlock, propFeatureBlock);
			}
		});
	});
}

function ajaxFilterRestaurantsItems(data, itemsContainer, itemsContainerMap, kitchensFiltBlock, propFeatureBlock) {
	$.ajax({
		type: 'POST',
		url: window.location.href,
		dataType: 'html',
		data: data,
		success: function(data) {
			itemsContainer.empty();
      itemsContainerMap.empty();
      propFeatureBlock.remove();

			const itemsContainerResponse = $(data).find('[data-type=items_container]').children();
      const itemsContainerMapResponse = $(data).find('[data-type=items-container-map]').children();
			const propFeatureBlockResponse = $(data).find('[data-type=filter-feature]');

      itemsContainer.append(itemsContainerResponse);
      itemsContainerMap.append(itemsContainerMapResponse);
      kitchensFiltBlock.after(propFeatureBlockResponse);

      initMapRest();
		}
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

        initMapRest();
			}
		});
	});
}

function mainRestFilterFeature() {
  $(document).on('click', '[data-type=filter-feature-select]', function() {
    const container = $(this).parents('[data-type=main_container]');
    const parentsButton = $(this).parents('[data-type=filter-feature]');
    const itemsCont = container.find('[data-type=items_container]');
    const itemsContMap = container.find('[data-type=items-container-map]');
    const feautureId = $(this).attr('data-id');
    const regionId = container.find('[data-type=restaurants-region-filter-select]').val();
    const kitchenId = container.find('[data-type=restaurants-kitchens-filter-select]').val();

    console.log(parentsButton.find('input:checkbox'));

    $.ajax({
      type: 'POST',
      url: window.location.href,
      dataType: 'html',
      data: {
        regionId: regionId,
        kitchenId: kitchenId,
        feautureId: feautureId,
      },
      success: function(data) {
        const itemsContResponse = $(data).find('[data-type=items_container]').children();
        const itemsContMapResponse = $(data).find('[data-type=items-container-map]').children();

        itemsCont.empty();
        itemsContMap.empty();

        itemsCont.append(itemsContResponse);
        itemsContMap.append(itemsContMapResponse);

        initMapRest();
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

		selectSection.addClass('active').siblings().removeClass('active');

		$.ajax({
			type: 'POST',
			url: window.location.href,
			dataType: 'html',
			data: {
				sectId: sectId,
			},
			success: function(data) {
				itemsContainer.children().remove();

				const itemsContainerResponse = $(data).children();

				itemsContainer.append(itemsContainerResponse);
			}
		});
	});
}

function basket() {
  $(document).on('click', '[data-type=cart]', function() {
    let curItem = $(this);
    let container = curItem.parents('[data-type=main_container]');
    let productId = curItem.attr('data-product-id');
    let productNameEn = curItem.attr('data-product-name-en');
    let quantity = curItem.parents('.incDec').find('.cart-count').text();
    let type = curItem.attr('data-func-type');
    let restCode = curItem.attr('data-rest-code');
    let calculate = curItem.attr('data-calculate');
    let productsList = container.find('[data-type=products_list]');
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
        productNameEn: productNameEn,
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
        if (data.success === true) {
          if (type == 'add') {
            updateCartCount();
            updateCartList(curItem, productsList);
          } else if (type == 'delete') {
            deleteProduct(curItem);
          } else {
            if (calculate == '+') {
              appendProduct(curItem);
            } else {
              removeProduct(curItem);
            }
          }
        } else if (data.success == 'another restaurant') {
          container.find('[data-type=another-rest]').addClass('active');

          anotherRestaurant(container, productId, productNameEn, restCode, curItem, productsList);
        } else {
          console.log('Ошибка добавление товара');
        }
      }
    });
  });
}

function anotherRestaurant(container, productId, productNameEn, restCode, curItem, productsList) {
  $('[data-type=add-product-another-rest]').click(function (e) {
    e.preventDefault();

    $.ajax({
      type: 'POST',
      url: '/local/templates/main/include/ajax/basket_delete_all.php',
      dataType: 'json',
      data: {
        productId: productId,
        productNameEn: productNameEn,
        restCode: restCode,
      },
      success: function(data) {
        if (data.success === true) {
          updateCartList(curItem, productsList, 'delete');
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
