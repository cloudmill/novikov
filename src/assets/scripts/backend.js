import { initSwiper } from './sliders.js';

$(function() {
	restaurantsFilter();
	showMore();
	selectProject();
	eventsFilter();
	mainRestFilterRegion();
	mainRestFilterKitchen();
	menuRestaurantSections();
	scrollShowMore();
	addProduct();
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
			url: '/',
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
			url: '/events/',
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
		const otherContainer = container.find('[data-type=other_container]');
		const regionId = $(this).val();
		const kitchensOption = container.find('[data-type=restaurants-kitchens-filter-select] option');

		$.ajax({
			type: 'POST',
			url: '/restaurants/',
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

				ajaxFilterRestaurantsItems(dataFilter, itemsContainer, otherContainer);
			}
		});
	});
}

function ajaxFilterRestaurantsItems(data, itemsContainer, otherContainer) {
	$.ajax({
		type: 'POST',
		url: '/restaurants/',
		dataType: 'html',
		data: data,
		success: function(data) {
			itemsContainer.remove();

			const itemsContainerResponse = $(data).find('[data-type=items_container]');

			otherContainer.after(itemsContainerResponse);
		}
	});
}

function mainRestFilterKitchen() {
	$('[data-type=restaurants-kitchens-filter-select]').on('select2:select', function() {
		const container = $(this).parents('[data-type=main_container]');
		const itemsCont = container.find('[data-type=items_container]');
		const otherCont = container.find('[data-type=other_container]');
		const regionId = container.find('[data-type=restaurants-region-filter-select]').val();

		$.ajax({
			type: 'POST',
			url: '/restaurants/',
			dataType: 'html',
			data: {
				regionId: regionId,
				kitchenId: $(this).val(),
			},
			success: function(data) {
				itemsCont.remove();

				const itemsContResponse = $(data).find('[data-type=items_container]');

				otherCont.after(itemsContResponse);
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

				const itemsContainerResponse = $(data).find('[data-type=items_container]').children();

				itemsContainer.append(itemsContainerResponse);
			}
		});
	});
}

function addProduct() {
	$(document).on('click', '[data-type=add-product], [data-type=update-product]', function() {
		const productId = $(this).attr('data-product-id');
		const type = $(this).attr('data-type');
		let productSidebarId = null;
		let productName = null;
		const body = $(this).parents('[data-type=body]');
		const productsCount = body.find('[data-type=products_count]');
		let productsList = null;
		let data = null;
		let typeFunction = null;
		let quantity = null;
		let item = null;
		const orderPrice = body.find('[data-type=order-price]');
		const total = body.find('[data-type=total]');
		const headerCart = body.find('[data-type=page-header-cart]');

		if (type == 'add-product') {
			productName = $(this).attr('data-name');
			item = $('[data-type=item-block]').filter('[data-name=' + productName + ']');
			productsList = body.find('[data-type=products_list]');

			data = {
				productId: productId,
			};
		} else {
			productSidebarId = $(this).parents('[data-type=item-block]').attr('data-product-sidebar-id'),
			item = $(this).parents('[data-type=item-block], [data-name=' + productName + ']');
			quantity = $(this).attr('data-quantity');
			typeFunction = $(this).attr('data-type-function');

			data = {
				updateProductId: productId,
				quantity: quantity,
			};
		}
		$.ajax({
			type: 'POST',
			url: window.location.href,
			dataType: 'html',
			data: data,
			success: function(data) {
				productsCount.remove();

				const productsCountResponse = $(data).find('[data-type=products_count]');
				const orderPriceResponse = $(data).find('[data-type=order-price]');
				const totalResponse = $(data).find('[data-type=total]');
				const itemBlockResponse = $(data).find('[data-name=' + productName + ']');

				headerCart.append(productsCountResponse);

				if (type == 'add-product') {
					item.remove();
					productsList.prepend(itemBlockResponse);
				} else {
					const dataItemResponse = $(data).find('[data-product-sidebar-id=' + productSidebarId + ']').children();

					item.children().remove();
					item.append(dataItemResponse);
				}
				orderPrice.children().remove();
				orderPrice.append(orderPriceResponse);

				total.children().remove();
				total.append(totalResponse);
			}
		});
	});
}

function scrollShowMore() {
	// $(document).scroll(function () {
	//     let container = $(this).parents('[data-type=main_container]'),
	//         scroll =  $(window).scrollTop() + $(window).height(),
	//         footer = $('.page-footer'),
	//         offset = footer.offset().top,
	//         itemsContainer = container.find('[data-type=items_container]'),
	//         item = container.find('[data-type=item]'),
	//         loadMore = false,
	//         counter = 0,
	//         url = null;

	//     if (scroll > offset && counter == 0) {
	//         counter = 1;
	//         console.log('load');
	//         url = container.find('[dat-type=url-page-nav]');
	//         offset = item.offset();

	//         console.log(offset);

	//         if ($(this).scrollTop() >= offset - $(window).height()) {
	//             loadMore = true;

	//             $.ajax({
	//                 url: url,
	//                 type: 'POST',
	//                 data: {
	//                     ajax: true,
	//                 },
	//                 success: function(data) {
	//                     let itemsResponse = $(data).find('[data-type=item]');

	//                     itemsContainer.append(itemsResponse);

	//                     loadMore = false;
	//                 }
	//             });
	//         }
	//     }
	// });
}
