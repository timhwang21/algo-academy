md_content = "# Hello World";
html_content = markdown.toHTML( md_content);

$( '#parseMd' ).click(() => $( '#md' ).html(html_content));

