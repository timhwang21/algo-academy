$( '.parser' ).click(function() { parseMd($(this)) });

function parseMd(ctx) {
  $( '#md' ).css( "display", "block" );
  
  $.get(
    ctx.attr('id'), 
    (data) => $( '#md' ).html(markdown.toHTML(data))
  );

  $("html, body").animate({ scrollTop: $( '#md' ).offset().top - 25 }, 600);
  return false;
}