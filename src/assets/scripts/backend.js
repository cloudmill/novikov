$(function() {
    restaurantsFilter();
    showMore();
    selectProject();
});

function restaurantsFilter() {
    $('[data-type=filter-restaurants]').on('click', function () {
        console.log('click');
    });
}

function showMore() {
    $(document).on('click', '[data-type=show_more_click]', function () {
        let container = $(this).parents('[data-type=main_container]'),
            itemsContainer = container.find('[data-type=items_container]'),
            url = $(this).attr('data-url'),
            pageNavBlock = container.find('[data-type=page_nav_block');

        if (url !== undefined) {
            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'html',
                data: {
                    ajax: true,
                },
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