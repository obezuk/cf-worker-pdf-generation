window = { document: { createElementNS: () => { return {} } } };
navigator = {};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
});

function _arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function handleRequest(event) {

  var jsPDF = __webpack_require__(1)

  var doc = new jsPDF({
    "orientation": "p",
    "unit": "mm",
    "format": "a4"
  });

  var xmargin = 25.4;
  var ymargin = 25.4;

  var imgResponse = await fetch('https://regmedia.co.uk/2017/06/26/cloudflarelogo.jpg', {
    "cf": {
      "cacheTtl": 9999999999999999999
    }
  });

  var imgData = _arrayBufferToBase64(await imgResponse.arrayBuffer());
  doc.addImage(imgData, 'JPEG', xmargin, ymargin);

  var date = new Date();
  var message = 'Hi, This PDF was generated in a Cloudflare Worker from ' + event.request.cf.colo + ' at ' + date + '.';

  doc.setFontSize(12)
  doc.text(message, xmargin + 0, ymargin + 100, {
    "maxWidth": 159.2
  });

  doc.text('The URL you entered was: ' + event.request.url, xmargin + 0, ymargin + 120);

  var output = doc.output('arraybuffer');

  var headers = new Headers();
  headers.set('Content-Type', '	application/pdf');

  return new Response(output, {
    "headers": headers
  });

}