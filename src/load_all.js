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


/**
 * render button box
 */
(function($) {
    if (!isIndex) return LOG.error('Must be on a grid view page, cant continue');

    var startNumbering = function(btn) {
        loadAllPages(function() {
            var totalEpisodes = numberEpisodes();
            btn.html(totalEpisodes +' Episodes found');
        });
    }

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

    var appendNumberingButton = function() {
        var numberEpisodesBtn = $('<button />', {
                id: 'calcButton',
                class: 'yt-uix-button sub-menu-back-button yt-uix-sessionlink yt-uix-button-default yt-uix-button-size-default yt-uix-button-has-icon yt-uix-button-empty'
            }).html('Number Episodes');
        
        numberEpisodesBtn.click(function() {
            numberEpisodesBtn
                .attr('disabled', true)
                .html('Loading pages...');
            
            startNumbering(numberEpisodesBtn);
        });
        
        LOG.info('Adding view of container to body.');
        $(numberEpisodesBtn).appendTo($('.branded-page-v2-subnav-container'));
    };
    
    appendNumberingButton();
})(jQuery);
