/**
 * jQuery - QuickView plugin file.
 */
(function($)
{
    //OddsMenu class
    function QuickView($holder, settings)
    {
        this.holder = $holder;
        this.previewImage = this.holder.find('*[data-quick-view="previewImage"]');
        this.originalImageSrc = this.previewImage.attr('src');
        this.thumbs = this.holder.find('*[data-image]');
        this.quickNav = this.holder.find('*[data-quick-view="quickNav"]');
        this.settings = $.extend({}, $.fn.quickView.defaults, settings || {});
        this.actualIndex = 0;
        this.timer = null;
    }

    //QuickView class methods
    $.extend(QuickView.prototype,
    {
        /**
         * init QuickView
         */
        init:function()
        {
            //thumbs
            this.thumbs.each($.proxy(function(index, element) {
                var $element = $(element);
                $element.mouseenter($.proxy(function() {
                    this.show(index);
                }, this));
                $element.mouseleave($.proxy(function() {
                    this.clear();
                }, this));

                //preload image
                if($element.find('img').length == 0 && !$element.data('preload-image'))
                {
                    var image = new Image();
                    image.src = $element.data('image');
                }
            }, this));

            //activate first thumb
            if(this.thumbs.find('.active').length == 0)
            {
                $(this.thumbs[0]).addClass('active');
            }


            this.holder.css('float', 'left');
            var width = this.holder.outerWidth();
            this.holder.attr('style', '');
            this.holder.width(width);

            //quick nav
            if(this.quickNav.length > 0)
            {
                this.quickNav.css('left', (this.quickNav.parent().outerWidth() - this.quickNav.outerWidth()) / 2);
            }

            //autoplay
            if(this.settings.autoPlay.active)
            {
                this.previewImage.mouseenter($.proxy(this.play, this));
                this.previewImage.mouseleave($.proxy(this.stop, this));
            }
        },

        //show image
        show: function(index)
        {
            this.actualIndex = index;

            var element = $(this.thumbs[index]);
            this.thumbs.removeClass('active');
            element.addClass('active');

            if(element.find('img').length > 0)
            {
                this.previewImage.attr('src', element.find('img').attr('src'));
            }
            else if(element.data('preload-image'))
            {
                this.previewImage.attr('src', element.data('preload-image'));
            }
            this.previewImage.attr('src', element.data('image'));

        },

        //clear image
        clear: function()
        {
            if(this.settings.returnToFirst)
            {
                this.actualIndex = 0;
                this.thumbs.removeClass('active');
                $(this.thumbs[0]).addClass('active');
                this.previewImage.attr('src', this.originalImageSrc);
            }
        },

        //play
        play: function()
        {
            this.stop();
            this.timer = setInterval($.proxy(function() {
                this.show((this.actualIndex + 1) % this.thumbs.length);
            }, this), this.settings.autoPlay.delay);
            this.holder.addClass('play');
        },

        //stop
        stop: function()
        {
            if(this.timer) clearInterval(this.timer);
            this.clear();
            this.holder.removeClass('play');
        }


    });

    //plugin code
    $.extend($.fn,
    {
        quickView:function(options)
        {
            var ret;
            this.each(function()
            {
                var $this = $(this);

                var quickView =  $this.data('quickView');
                if (!quickView)
                {
					quickView = new QuickView($this, options);
                    quickView.init();
					$this.data('quickView', quickView);
				}
                ret = ret ? ret.add($this) : $this;
            });
            return ret;
        }

    });

     $.fn.quickView.defaults = {
         returnToFirst: true,
         autoPlay: {
            active: true,
            delay: 2000
         }
    };
})(jQuery);