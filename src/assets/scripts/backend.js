import { initSwiper } from './sliders.js'

$(function() {
    restaurantsFilter();
    showMore();
    selectProject();
    eventsFilter();
    mainRestFilterRegion();
    mainRestFilterKitchen();
});

function restaurantsFilter() {
    $('[data-type=filter-restaurants]').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        
        let container = $(this).parents('[data-type=main-carousel]'),
            kitchenId = $(this).attr('data-id'),
            kitchens = container.find('[data-type=kitchens'),
            itemsCont = container.find('[data-type=items_container]');

        $.ajax({
            type: 'POST',
            url: '/',
            dataType: 'html',
            data: {
                kitchenId: kitchenId,
            },
            success: function (data) {
                itemsCont.remove();

                let itemsContResponse = $(data).find('[data-type=items_container]');
                
                kitchens.after(itemsContResponse);
                initSwiper();
            }
        });
    });
}

function showMore() {
    $(document).on('click', '[data-type=show_more_click]', function () {
        let container = $(this).parents('[data-type=main_container]'),
            itemsContainer = container.find('[data-type=items_container]'),
            url = $(this).attr('data-url'),
            pageNavBlock = container.find('[data-type=page_nav_block'),
            data = null,
            path = window.location.pathname.split('/');

        if (path[1] == 'events') {
            data = JSON.parse(container.find('[data-type=show_more_click]').attr('data-filter'));
        } else {
            data = {
                ajax: true,
            }
        }

        if (url !== undefined) {
            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'html',
                data: data,
                success: function (data) {
                    pageNavBlock.remove();

                    let itemsResponse = $(data).find('[data-type=item]'),
                        pagenavResponse = $(data).find('[data-type=page_nav_block]');
                    
                    itemsContainer.append(itemsResponse);
                    itemsContainer.after(pagenavResponse);
                }
            });
        }
    });
}

function selectProject() {
    $(document).on('click', '[data-type=select_project]', function (e) {
        e.preventDefault();

        let container = $(this).parents('[data-type=main_container]'),
            projectId = $(this).attr('data-id'),
            projectListContainer = container.find('[data-type=project_list_container]'),
            projectItemContainer = container.find('[data-type=item_container]'),
            selectProject = $(this).parents('[data-type=select_project_style]'),
            url = window.location.href;

        selectProject.addClass('active').siblings().removeClass('active');

        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'html',
            data: {
                projectId: projectId,
            },
            success: function (data) {
                projectItemContainer.remove();

                let projectItemContainerResponse = $(data).find('[data-type=item_container]');
                
                projectListContainer.after(projectItemContainerResponse);
            }
        });
    });
}

function eventsFilter() {
    $('[data-type=filter_events]').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        
        let container = $(this).parents('[data-type=main_container]'),
            sectionId = $(this).attr('data-sect-id'),
            sectContainer = container.find('[data-type=sections_events_container'),
            itemsCont = container.find('[data-type=items_container]'),
            pageNav = container.find('[data-type=page_nav_block]');

        $.ajax({
            type: 'POST',
            url: '/events/',
            dataType: 'html',
            data: {
                sectionId: sectionId,
            },
            success: function (data) {
                itemsCont.remove();
                pageNav.remove();

                let itemsContResponse = $(data).find('[data-type=items_container]'),
                    pageNavResponse = $(data).find('[data-type=page_nav_block]');
                
                sectContainer.after(itemsContResponse);
                itemsContResponse.after(pageNavResponse);
            }
        });
    });
}

function mainRestFilterRegion() {
    $('[data-type=restaurants-region-filter-select]').on('select2:select', function () {
        let container = $(this).parents('[data-type=main_container]'),
            kitchensSelect = container.find('[data-type=restaurants-kitchens-filter-select]'),
            itemsContainer = container.find('[data-type=items_container]'),
            otherContainer = container.find('[data-type=other_container]'),
            regionId = $(this).val(),
            kitchensOption = container.find('[data-type=restaurants-kitchens-filter-select] option');

        $.ajax({
            type: 'POST',
            url: '/restaurants/',
            dataType: 'html',
            data: {
                regionId: regionId,
            },
            success: function (data) {
                kitchensOption.remove();

                let kitchensOptionResponse = $(data).find('[data-type=restaurants-kitchens-filter-select] option');

                kitchensSelect.append(kitchensOptionResponse);

                kitchensSelect.each(function () {
                    $(this).val($(this).find('[selected]').val()).trigger('change');
                });

                let dataFilter = {
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
        success: function (data) {
            itemsContainer.remove();

            let itemsContainerResponse = $(data).find('[data-type=items_container]');

            otherContainer.after(itemsContainerResponse);
        }
    });
}

function mainRestFilterKitchen() {
    $('[data-type=restaurants-kitchens-filter-select]').on('select2:select', function () {
        let container = $(this).parents('[data-type=main_container]'),
            itemsCont = container.find('[data-type=items_container]'),
            otherCont = container.find('[data-type=other_container]'),
            regionId = container.find('[data-type=restaurants-region-filter-select]').val();

        $.ajax({
            type: 'POST',
            url: '/restaurants/',
            dataType: 'html',
            data: {
                regionId: regionId,
                kitchenId: $(this).val(),
            },
            success: function (data) {
                itemsCont.remove();

                let itemsContResponse = $(data).find('[data-type=items_container]');
                
                otherCont.after(itemsContResponse);
            }
        });
    });
}