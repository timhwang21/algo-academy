$( '.parser' ).click(function() { parseMd($(this)) });

function parseMd(ctx) {
  $.get(
    ctx.attr('id'), 
    (data) => $( '#md' ).html(markdown.toHTML(data))
  );
}