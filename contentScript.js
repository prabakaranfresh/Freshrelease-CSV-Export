(function() {
    //All Code inside this only
    jQuery(document).ready(function () {

        
        var initExport = function(elem, func_name) {
            clearInterval(window.CSVExpLoadInt);
            window.CSVExpLoadInt = setInterval(function () {
                if (jQuery(elem).length) {
                    clearInterval(window.CSVExpLoadInt);
                    eval(func_name + '()');
                }
            }, 250)
        }

        var downloadCSV = function (content, title) {
            var csvContent = "data:text/csv;charset=utf-8," + content.replace(/\#/g, ' ');
            var dataurl = encodeURI(csvContent);
            var a = document.createElement("a");
            a.href = dataurl;
            a.target = "_blank";
            a.setAttribute("download", title + " - CSV Plugin Download.csv");
            var b = document.createEvent("MouseEvents");
            b.initEvent("click", false, true);
            a.dispatchEvent(b);
        }

        var alterBtnonViewUpdate = function () {
            jQuery('#csvExport').remove();
            jQuery('button[data-view="list-view"]').click(function () {
                initExport('#issue_sort', 'wiPageExport');
            });
        }

        var wiPageExport = function () {
            if (jQuery('.header-secondary.issues-filter').length && jQuery('#issue_sort').length) {
                if (jQuery('#csvExport').length) jQuery('#csvExport').remove();
                var btn = jQuery('<button id="csvExport" class="btn btn--primary" />').text('Export CSV');
                var li = document.createElement('li');
                li.className = "page-action__list--item";
                jQuery(li).append(btn);
                jQuery('.header-secondary.issues-filter #issue_sort').parent().prepend(li);
                setTimeout(function () {
                    if (jQuery('button[data-view="list-view"]').hasClass('app-icon-btn--active')) {
                        jQuery('button[data-view="kanban-view"]').click(function () {
                            alterBtnonViewUpdate();
                        });
                    }
                    else alterBtnonViewUpdate();
                },300);
                jQuery('#csvExport').click(function (params) {
                    var textLOTR = 'Key,Title,Assignee,Type,Priority,Status,Estimate\n';
                    jQuery(".lt-body tr").each(function () {
                        var assignee = jQuery(this).find('td:eq(1) > div').attr('aria-label');
                        var title = jQuery(this).find('.issue-title__content').text().trim().replace(/\"/g, '\\"');
                        var key = jQuery(this).find('.issue-title__key').text().trim();
                        var type = jQuery(this).find('.issue-type-name').text().trim();
                        var pri = jQuery(this).find('.status-indicator').parent().text().trim();
                        var status = jQuery(this).find('td:eq(5)').text().trim();
                        var est = jQuery(this).find('.issue-story-point').text().trim();

                        textLOTR += key + ',"' + title + '",' + assignee + ',' + type + ',' + pri + ',' + status + ',' + est + ',' + '\n';
                    });
                    downloadCSV(textLOTR, jQuery("#filterAction_dropdown p, .filter-label").text().trim());
                })
            }

        }

        var sprintPageExport = function () {
             if (jQuery('#newSprint').length) {
                    if (jQuery('#csvExport').length) jQuery('#csvExport').remove();
                    var btn = jQuery('<button id="csvExport" class="btn btn--primary" />').text('Export CSV');
                    jQuery('#newSprint').parent().prepend(btn);
                    jQuery('#csvExport').click(function (params) {
                        var textLOTR = 'Title,Key,Estimate\n';
                        jQuery(".cp-Panel-body-inner .issue-list-item").each(function () {
                            var sub = jQuery(this).find(".issue-title__content").text().trim().replace(/\"/g, '\\"');
                            var key = jQuery(this).find(".issue-list_key span").text().trim();
                            var est = jQuery(this).find(".issue-list_story-points span").text().trim();
                            textLOTR += '"' + sub + '",' + key + ',' + est + '\n';
                        });
                        downloadCSV(textLOTR, jQuery(".sprint-list--header__title").text().trim());
                    })
             }    
        }
         
        jQuery(document).on("click", ".nav-primary-list__item-link, a", function (e) {
            if (e.target.href != undefined) {
                if ((e.target.href).indexOf('/sprints/planning') >= 0) {
                    initExport('#newSprint', 'sprintPageExport');
                } else if ((e.target.href).indexOf('/issues/filter') >= 0 || (e.target.href).split('/').pop() == 'issues') {
                    initExport('#issue_sort', 'wiPageExport');
                } else if (jQuery('#csvExport').length) {
                    jQuery('#csvExport').remove();
                } 
            } else if (jQuery('#csvExport').length) {
                jQuery('#csvExport').remove();
            }
        });

        var checkForSprintBoard = function () {
            if (document.location.pathname == '/sprints/planning') {
                initExport('#newSprint', 'sprintPageExport');
            } else if ((document.location.pathname).indexOf('/issues/filter') >= 0) {
                initExport('#issue_sort', 'wiPageExport');
            } else if (jQuery('#csvExport').length) {
                jQuery('#csvExport').remove();
            }
        }

        checkForSprintBoard();

    });
})();