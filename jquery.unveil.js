/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      var self = this;
      var source = this.getAttribute(attrib);
      var placeholderImage = this.getAttribute("src");
      var img = new Image();
      source = source || this.getAttribute("data-src");
      img.src = source;
      img.onload = function() {
        if(this.width < 2 || this.height < 2) {
          //in case server sends back a junk 1x1 image. Sometimes, done by Google Servers
          self.setAttribute('src', placeholderImage);

        } else {
          self.setAttribute('src', source);
          if (typeof callback === "function") callback.call(self);
        }
      };

      img.onerror = function() {
        self.setAttribute('src', placeholderImage);
      };

    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.scroll(unveil);
    $w.resize(unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
