const hot = {};
const fs = require("fs");

hot.now = function(format){
  var d = new Date();
  var ret = format;
  if (!(typeof (ret) == "string"))
  {
    ret = "yyyy-mm-dd hh:nn:ss";
  }
  return ret
    .replace(/yyyy/ig, d.getFullYear())
    .replace(/mm/ig, ("00" + (d.getMonth() + 1)).slice(-2))
    .replace(/dd/ig, ("00" + d.getDate()).slice(-2))
    .replace(/hh/ig, ("00" + d.getHours()).slice(-2))
    .replace(/nn/ig, ("00" + d.getMinutes()).slice(-2))
    .replace(/ss/ig, ("00" + d.getSeconds()).slice(-2))
    .replace(/zzz/ig, ("000" + d.getMilliseconds()).slice(-3))  
};

hot.uuid = function(){
  var rowid = [];
  for (var i = 0; i < 40; i++) {
    rowid.push(Math.floor(Math.random() * 10));
  }
  return rowid.join("");
};

hot.read = function(filename){
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function(error, data){
      resolve((data||"").toString());
    });
  });
};

hot.write = function(filename, data){
  return new Promise(function (resolve, reject) {
    fs.writeFile(filename, data, function(error){
      resolve(!error);
    });
  });
};


module.exports = hot;
