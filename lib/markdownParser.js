$( '.parseBtn' ).click(function() { parseMd($(this)) });

function parseMd(ctx) {
  console.log(ctx.attr('src'));
  $.get(
    ctx.attr('src'), 
    (data) => $( '#md' ).html(markdown.toHTML(data))
  );
}