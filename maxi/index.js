const hot = require('o-hot');
const ajax = require('o-ajax');

const main = {};

main.load = async function(){
  var url = "https://www.bimwook.com/woo/about.do";
  var o = await ajax.get(url);
  console.log( "  [%s] %s", hot.now(), hot.uuid() );
  console.log(o.text);
};

main.load();