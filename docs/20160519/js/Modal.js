// モジュール化
var Modal = (function() {

  var self = {};

  self.open = function() {
    self.genOverlay();

    var $open = $('#open');
    var $popup = $('<div class="popup">');
    var $txt = $('<p class="txt">HELLO WORLD.</p>');
    var $close = $('<div id="close" class="btn close">CLOSE</div>');

    $popup.hide();

    $open.after($popup);
    $popup.append($txt);
    $popup.append($close);

    $popup.fadeIn();

  }

  self.close = function() {
    $(".popup, #overlay").fadeOut(function(){
        $(this).remove();
    });
  }

  self.genOverlay = function() {
    var $overlay = $('<div id="overlay"></div>');
    $overlay.hide();
    $('body').prepend($overlay);
    $overlay.fadeIn();
  }

  return self;

})();
