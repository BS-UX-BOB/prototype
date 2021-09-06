/**
 * Autocomplete wrapper.
 *
 * @author Htmlstream
 * @version 1.0
 *
 */
;(function ($) {  //(function ($){} (jQuery)) -> means immediate invoked function execution (IIFE) in jQuery
  'use strict';

  $.widget('custom.localcatcomplete', $.ui.autocomplete, {
    _create: function () {  //underscore is for object's property or method that is private
      this._super();       //super is only accessible from inside of the object
      this.widget().menu('option', 'items', '> :not(.ui-autocomplete-category)');
    },
    _renderItem: function (ul, item) {  //this method is only visible inside of the function
      var category = item.category ? '<span class="hd-doc-search-category">' + item.category + '</span>' : '',
        innerText = category + '<span class="hd-doc-search-label">' + item.label + '</span>';

      if (item.url) {
        return $('<li><a href="' + window.location.protocol + '//' + window.location.host + '/' + window.location.pathname.split('/')[1] + '/' + item.url + '">' + innerText + '</a></li>')
          .appendTo(ul);
      } else {
        return $('<li>' + item.label + '</li>')
          .appendTo(ul);
      }
    }
  });

  $.HSCore.components.HSLocalSearchAutocomplete = {
    /**
     *
     *
     * @var Object _baseConfig
     */
    _baseConfig: { //private property of the object
      minLength: 2
    },

    /**
     *
     *
     * @var jQuery pageCollection
     */
    pageCollection: $(),

    /**
     * Initialization of Autocomplete wrapper.
     *
     * @param String selector (optional)
     * @param Object config (optional)
     *
     * @return jQuery pageCollection - collection of initialized items.
     */

    init: function (selector, config) {
      //init will help in instantiating object properties. init is like a constructor call in classes
      //init also used for the function if you dont want to instantiate and call at same time

      this.collection = selector && $(selector).length ? $(selector) : $();
      if (!$(selector).length) return;

      this.config = config && $.isPlainObject(config) ?
        $.extend({}, this._baseConfig, config) : this._baseConfig;

      this.config.itemSelector = selector;

      this.initAutocomplete();

      return this.pageCollection;


    },

    initAutocomplete: function () {  //this function is local to the main function but this is never called here
      //Variables
      var $self = this,
        config = $self.config,
        collection = $self.pageCollection;

      //Actions
      this.collection.each(function (i, el) { //each makes looping over DOM elements
        var $this = $(el),
          dataUrl = $this.data('url');

        $.getJSON(dataUrl, function (data) { // getJSON is for fetching data over API i.e sending GET request
          $this.localcatcomplete({
            appendTo: $this.parent(),
            delay: 0,
            source: data,
            select: function (event, ui) {
              window.location = window.location.protocol + '//' + window.location.host + '/' + window.location.pathname.split('/')[1] + '/' + ui.item.url;
            }
          });
        });

        //Actions
        collection = collection.add($this);
      });
    }

  };

})(jQuery);
