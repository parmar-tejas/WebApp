$(document).ready(function (){
  $('.player-top-btns .view-songs').click(function(){
    $(this).addClass('input-visible');
    $(this).children('.custom-input').focus();
  });

  $(document).click(function (e){
    var btnContainer = $(".player-top-btns .view-songs, .song-list");

    if (!btnContainer.is(e.target) && btnContainer.has(e.target).length === 0){
      btnContainer.removeClass('input-visible');
      btnContainer.removeClass('results-visible');
      btnContainer.children('.custom-input').val('');
    }
  });

  $('.view-songs .custom-input').on('keypress', function(){
    if( $(this).val() ){
      $(this).parent().addClass('results-visible');
    }
  });

  (function($){
    $(window).on("load",function(){
        // $(".player-top-btns .song-list").mCustomScrollbar();
    });
  })(jQuery);
});