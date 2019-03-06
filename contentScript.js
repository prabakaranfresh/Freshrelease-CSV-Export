(function() {
    //All Code inside this only
    jQuery(document).ready(function () {
         var repositionBtn = function () {
             if(jQuery('#newSprint').length) {
                 var btnPositions = {
                     top: jQuery('#newSprint').offset().top,
                     left: jQuery('#newSprint').offset().left - jQuery('#newSprint').width() - 50
                 }
                 jQuery('#csvExport').css('position', 'absolute');
                 jQuery('#csvExport').css('top', btnPositions.top);
                 jQuery('#csvExport').css('left', btnPositions.left);
             }
         }

         var positionBtnWI = function () {
             if (jQuery('#issue_sort').length) {
                 var btnPositions = {
                     top: jQuery('#issue_sort').offset().top,
                     left: jQuery('#issue_sort').offset().left - jQuery('#csvExport').width() - 50
                 }
                 jQuery('#csvExport').css('position', 'absolute');
                 jQuery('#csvExport').css('top', btnPositions.top);
                 jQuery('#csvExport').css('left', btnPositions.left);
             }
         }

        var wiPageExport = function () {
            if (jQuery('#issue_sort').length) {
                if (jQuery('#csvExport').length) jQuery('#csvExport').remove();
                var btn = jQuery('<button id="csvExport" class="btn btn--primary" />').text('Export CSV');
                jQuery('body').append(btn);
                positionBtnWI();
                jQuery(window).on('resize', function () {
                    positionBtnWI();
                });
                setTimeout(function () {
                    if (jQuery('button[data-view="list-view"]').hasClass('app-icon-btn--active')) {
                        jQuery('button[data-view="kanban-view"]').click(function () {
                            jQuery('#csvExport').remove();
                        });
                        positionBtnWI();
                    }
                    else {
                        jQuery('#csvExport').remove();
                        jQuery('button[data-view="list-view"]').click(function () {
                            clearInterval(window.CSVExpLoadInt);
                            window.CSVExpLoadInt = setInterval(function () {
                                if (jQuery('#issue_sort').length) {
                                    clearInterval(window.CSVExpLoadInt);
                                    wiPageExport();
                                }
                            }, 250)
                        })
                    }
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
                    var csvContent = "data:text/csv;charset=utf-8," + textLOTR.replace(/\#/g, ' ');
                    var dataurl = encodeURI(csvContent);
                    var a = document.createElement("a");
                    a.href = dataurl;
                    a.target = "_blank";
                    a.setAttribute("download", jQuery(".sprint-list--header__title").text().trim() + " - CSV Plugin Download.csv");
                    var b = document.createEvent("MouseEvents");
                    b.initEvent("click", false, true);
                    a.dispatchEvent(b);
                })
            }

        }


         var sprintPageExport = function () {
             if (jQuery('#newSprint').length) {
                    if (jQuery('#csvExport').length) jQuery('#csvExport').remove();
                    var btn = jQuery('<button id="csvExport" class="btn btn--primary" />').text('Export CSV');
                    jQuery('body').append(btn);
                    repositionBtn();
                    jQuery(window).on('resize', function () {
                        repositionBtn();
                    });
                    jQuery('#csvExport').click(function (params) {
                        var textLOTR = 'Title,Key,Estimate\n';
                        jQuery(".cp-Panel-body-inner .issue-list-item").each(function () {
                            var sub = jQuery(this).find(".issue-title__content").text().trim().replace(/\"/g, '\\"');
                            var key = jQuery(this).find(".issue-list_key span").text().trim();
                            var est = jQuery(this).find(".issue-list_story-points span").text().trim();
                            textLOTR += '"' + sub + '",' + key + ',' + est + '\n';
                        });
                        var csvContent = "data:text/csv;charset=utf-8," + textLOTR.replace(/\#/g, ' ');
                        var dataurl = encodeURI(csvContent);
                        var a = document.createElement("a");
                        a.href = dataurl;
                        a.target = "_blank";
                        a.setAttribute("download", jQuery(".sprint-list--header__title").text().trim() + " - CSV Plugin Download.csv");
                        var b = document.createEvent("MouseEvents");
                        b.initEvent("click", false, true);
                        a.dispatchEvent(b);  
                    })
             }
            
         }


        var checkForSprintBoard = function () {
            if (document.location.pathname == '/sprints/planning') {
                window.CSVExpLoadInt = setInterval(function () {
                    if (jQuery('#newSprint').length) {
                        clearInterval(window.CSVExpLoadInt);
                        sprintPageExport();
                    }
                }, 250)
            } else if ((document.location.pathname).indexOf('/issues/filter') >= 0) {
                clearInterval(window.CSVExpLoadInt);
                window.CSVExpLoadInt = setInterval(function () {
                    if (jQuery('#issue_sort').length) {
                        clearInterval(window.CSVExpLoadInt);
                        wiPageExport();
                    }
                }, 250)
            } else if (jQuery('#csvExport').length) {
                jQuery('#csvExport').remove();
            }
        }
        checkForSprintBoard();
         
        jQuery(document).on("click", ".nav-primary-list__item-link, a", function (e) {
            if (e.target.href != undefined) {
                if ((e.target.href).indexOf('/sprints/planning') >= 0) {
                    clearInterval(window.CSVExpLoadInt);
                    window.CSVExpLoadInt = setInterval(function () {
                        if (jQuery('#newSprint').length) {
                            clearInterval(window.CSVExpLoadInt);
                            sprintPageExport();
                        }
                    }, 250)
                } else if ((e.target.href).indexOf('/issues/filter') >= 0 || (e.target.href).split('/').pop() == 'issues') {

                    clearInterval(window.CSVExpLoadInt);
                    window.CSVExpLoadInt = setInterval(function () {
                        if (jQuery('#issue_sort').length) {
                            clearInterval(window.CSVExpLoadInt);
                            wiPageExport();
                        }
                    }, 250)
                } else if (jQuery('#csvExport').length) {
                    jQuery('#csvExport').remove();
                } else if (jQuery('#csvExport').length) {
                    jQuery('#csvExport').remove();
                }
            }
        });

    })
        
       
    

})();