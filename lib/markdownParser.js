
// $( '.parseBtn' ).click(function() { parseMd() }.bind($('.parseBtn')) );
$( '.parseBtn' ).click(function() { parseMd($(this)) });

function parseMd(ctx) {
  console.log(ctx.attr('src'));
  let fileName = ctx.attr('id');
  let md_content = `# ${fileName}`; // fetch file from title here
  let html_content = markdown.toHTML(md_content);
  $( '#md' ).html(html_content);
}