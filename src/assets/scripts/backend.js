import { initSwiper } from './sliders.js'

$(function() {
    restaurantsFilter();
    showMore();
    selectProject();
    eventsFilter();
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