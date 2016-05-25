// e.g., BrowserPolicy.content.allowOriginForAll( 's3.amazonaws.com' );
BrowserPolicy.content.allowSameOriginForAll();
BrowserPolicy.content.allowFontDataUrl(); // Carregar fontes
BrowserPolicy.content.disallowInlineScripts(); // Desabilita a tag <script> no html
BrowserPolicy.content.disallowEval(); // nao permite uso de eval
BrowserPolicy.content.allowOriginForAll('*.googleapis.com');
BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
//BrowserPolicy.content.disallowInlineStyles()
BrowserPolicy.content.allowOriginForAll('*.cloudflare.com/');