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
  
  global.setInterval(async()=>{
    var item = await rbt.mission.load("cmd");
    if(item.rowid.length>0){
      console.log(`Command: ${o.data}`);
    }
  }, 5e3);
  
  global.setInterval(async()=>{
    var ok = await rbt.heartbeat();
    if(!ok){
      var sid = await rbt.connect();
      console.log(`Reconnect: ${sid}`);
    }
  }, 60e3);
};

main.load();
