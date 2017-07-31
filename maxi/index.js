const hot = require('o-hot');
const ajax = require('o-ajax');
const path = require('path');
const maxi = {};

maxi.host = "www.bimwook.com";
maxi.root = `https://${maxi.host}/woo/bin/center`;
maxi.name = "maxi";
maxi.token = "2250839142617566488522565944363424735718";
maxi.hot = hot;
maxi.ajax = ajax;
maxi.create = function(name, token){
  const that = this;
  let session = {};
  session.id = "";
  session.name = name;

  let rbt = {};
  rbt.timer = null;
  
  rbt.connect = async function(){
    let me = this;
    var o = await ajax.post(`${that.root}/connect.do`, `name=${hot.encoder.url(name)}&token=${hot.encoder.url(token)}`);
    console.log(o.text);
    try{
      let ret = JSON.parse(o.text);
      if(ret && ret.result){
        session.id = ret.sid;
        await this.session.save();
        return ret.sid;
      }
    }
    catch(e){
      console.log(e);
    }
    return "";
  };

  rbt.disconnect = function(){
    session.id = "";
    this.session.save();
  }

  rbt.heartbeat = async function(){
    let me = this;
    let o = await ajax.post(`${that.root}/heartbeat.do`, `name=${hot.encoder.url(name)}&sid=${hot.encoder.url(session.id)}`);
    try{
      let ret = JSON.parse(o.text);
      return (ret && ret.result);
    }
    catch(e) {
    }
    
    return false;
  }

  rbt.database = "";
  rbt.save = async function(summary, content){
    let bd = [];
    bd.push("robot.name=" + hot.encoder.url(name));
    bd.push("robot.sid=" + hot.encoder.url(session.id));
    bd.push("robot.dbase=" + hot.encoder.url(this.database));
    bd.push("summary=" + hot.encoder.url(summary));
    bd.push("content=" + hot.encoder.url(content));
    
    let o = await ajax.post(`${that.root}/dbases/save.do`, bd.join("&")); 
    try{
      let ret = JSON.parse(o.text);
      if(ret && ret.result){
        return ret.rowid;
      }
    }
    catch(e){
      console.log(e);
    }
    return "";
  }
  
  rbt.hash = async function(data){
    let bd = [];
    bd.push("robot.name=" + hot.encoder.url(name));
    bd.push("robot.dbase=" + hot.encoder.url(this.database));
    bd.push("content=" + hot.encoder.url(data));

    let o = await ajax.post(`${that.root}/dbases/hash.do`, bd.join("&")); 
    try{
      let ret = JSON.parse(o.text);
      if(ret){
        return ret;
      }
    }
    catch(e){
      console.log(e);
    }
    return {hash: "", count: 0};
  }
  
  rbt.session = {};
  rbt.session.load = async function(){
    session.id = await hot.read(path.join(__dirname, `sid-${session.name}.txt`));
    console.log("SESSION-LOAD: %s", session.id);
  }
  rbt.session.save = async function(){
    await hot.write(path.join(__dirname, `sid-${session.name}.txt`), session.id);
  }  
  
  rbt.mission = {};
  rbt.mission.load = async function(handler){
    let bd = [];
    bd.push("name=" + hot.encoder.url(name));
    bd.push("handler=" + hot.encoder.url(handler));
    let o = await ajax.get(`${that.root}/tasks/load.do?${bd.join('&')}`);
    let text = o.text;
    let m = {rowid:"", data:""};
    let p = text.indexOf('|');
    if(p>-1){
      m.rowid = text.slice(0,p);
      m.data = text.slice(p+1);
    }
    return m;
  };

  rbt.mission.push = async function(handler, data){
    let bd = [];
    bd.push("robot.name=" + hot.encoder.url(name));
    bd.push("robot.sid=" + hot.encoder.url(session.id));
    bd.push("handler=" + hot.encoder.url(handler));
    bd.push("data=" + hot.encoder.url(data));
    let o = await ajax.post(`${that.root}/tasks/push.do`, bd.join("&")); 
    try{
      let ret = JSON.parse(o.text||"{}");
      if(ret && ret.result){
        return ret.rowid;
      }
    }
    catch(e){
      console.log(e);
    }
    return "";
  };
  
  rbt.mission.remove = async function(rowid){
    let bd = [];
    bd.push("robot.name=" + hot.encoder.url(name));
    bd.push("robot.sid=" + hot.encoder.url(session.id));
    bd.push("rowid=" + hot.encoder.url(rowid));
    let o = await ajax.post(`${that.root}/tasks/remove.do`, bd.join("&")); 
    try{
      let ret = JSON.parse(o.text||"{}");
      if(ret && ret.result){
        return ret.rowid;
      }
    }
    catch(e){
      console.log(e);
    }
    return "";
  };
  
  rbt.mission.reset = async function(rowid){
    var bd = [];
    bd.push("robot.name=" + hot.encoder.url(name));
    bd.push("robot.sid=" + hot.encoder.url(session.id));
    bd.push("rowid=" + hot.encoder.url(rowid));
    let o = await ajax.post(`${that.root}/tasks/reset.do`, bd.join("&")); 
    try{
      let ret = JSON.parse(o.text||"{}");
      if(ret && ret.result){
        return ret.rowid;
      }
    }
    catch(e){
      console.log(e);
    }
    return "";
  }    
  
  rbt.name = function(){
    return name;
  }
  
  return rbt;
};

module.exports = maxi;
