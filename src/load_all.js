var isIndex = (0 < jQuery('.channels-content-item').size()) ? true : false;

var LOG = {
    info: function(text) { console.info('INFO:', text); },
    debug: function(text) { console.warn('DEBUG:', text); },
    error: function(text) { console.error('ERROR:', text); }
};

var loadAllPages = function(callback) {
    var load = function() {
        LOG.debug('Loading..');
        return jQuery('.load-more-button')[0].click();
    };
    
    var loop = setInterval(function() {
        if (0 === jQuery('.load-more-button').size()) {
            clearInterval(loop);
            LOG.debug('Done loading, running callback');
            if ('function' === typeof callback) callback();
            
            return;
        }
        
        if (0 === jQuery('.load-more-loading.hid').size()) {
            LOG.debug('not ready yet, skipping');
            return;
        }
        
        load();
    }, 100);

    load();
};

var numberEpisodes = function() {
    LOG.info('Calc started...');
    
    var listItems = jQuery('.channels-content-item');
    var totalFound = listItems.size();

    listItems.each(function(idx, item) {
        var number = totalFound - idx,
            obj = $(item).find('.yt-lockup-meta-info');
        
        $(item).find('a').attr('href',  $(item).find('a').attr('href') +'&id='+ number+ '&t='+$(item).find('.yt-lockup-title a').html()); 
        obj.prepend($('<li>'+number+'</li>'))
    });
    
    return totalFound;
};

var startNumbering = function(callback) {
    var btn = $('#calcButton')
                .attr('disabled', true)
                .html('Loading pages...');
    
    loadAllPages(function() {
        var totalEpisodes = numberEpisodes();
        btn.html(totalEpisodes +' Episodes found');
        
        if ('function' === typeof callback) callback(totalEpisodes);
    });
};

var startExport = function() {
    var listItems = jQuery('.channels-content-item');
    var totalFound = listItems.size();

    listItems.each(function(idx, item) {
        var number = jQuery(jQuery(item).find('.yt-lockup-meta-info li')[0]).html()
            title = jQuery(item).find('.yt-lockup-title a').html(),
            href = jQuery(item).find('.yt-lockup-title a').attr('href');
            
        href = 'https://youtube.com' + href.substr(0, href.indexOf('&'));
        console.log([number +' - '+ title, href]);
    });
};

/**
 * render button box
 */
(function($) {
    if (!isIndex) return LOG.error('Must be on a grid view page, cant continue');

    var appendNumberingButton = function() {
        var numberEpisodesBtn = $('<button />', {
                id: 'calcButton',
                class: 'yt-uix-button sub-menu-back-button yt-uix-sessionlink yt-uix-button-default yt-uix-button-size-default yt-uix-button-has-icon yt-uix-button-empty'
            }).html('Number Episodes');
        
        numberEpisodesBtn.click(function() {
            startNumbering();
        });
        
        LOG.info('Adding view of container to body.');
        $(numberEpisodesBtn).appendTo($('.branded-page-v2-subnav-container'));
    };
    
    var appendExportListButton = function() {
        var exportListBtn = $('<button />', {
                id: 'exportButton',
                class: 'yt-uix-button sub-menu-back-button yt-uix-sessionlink yt-uix-button-default yt-uix-button-size-default yt-uix-button-has-icon yt-uix-button-empty'
            }).html('Export Videos List');
        
        exportListBtn.click(function() {
            if ($('#calcButton').attr('disabled') === true) {
                startExport();
                return;
            }
            
            startNumbering(function() {
                startExport();
            });
        });
        
        LOG.info('Adding view of container to body.');
        $(exportListBtn).appendTo($('.branded-page-v2-subnav-container'));
    };
    
    appendNumberingButton();
    appendExportListButton();
})(jQuery);
