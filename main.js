const maxi = require('./maxi');
const hot = maxi.hot;
const ajax = maxi.ajax;
var main = {};
main.load = async function(){
  var rbt = maxi.create("maxi", "2250839142617566488522565944363424735718");
  await rbt.session.load();
  if(!await rbt.heartbeat()){
    var sid = await rbt.connect();
    console.log(sid);
  }
  rbt.database = "log";
  await rbt.save('start', hot.now());
  
  var o = await ajax.post('https://omuen.com/woo/bin/ajax.do','');
  rbt.database = "cache";
  await rbt.save('omuen', o.text);
  console.log(o.text);
};

main.load();
