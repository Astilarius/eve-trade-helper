import systems from '../data/systems';
import regions from '../data/regions';
import items from '../data/items';
import FetchEveData from './FetchEveData';
import getNameTypeID from './getNameTypeID'

//download orders from all regions that we care about (where security >= 0)
async function FetchAllEveData(userData = {
  volume:null,
  capital:null,
  tax:null,
  system:null,
  sec:null,
}, setMsg, currentData){
  var sellOrders = [];
  var buyOrders = [];
  var expiresDate = new Date(localStorage.getItem('expiresDate'));
  var currentDate = new Date();
  console.log(localStorage);
  if (currentDate < expiresDate){
    console.log(`${currentDate} < ${expiresDate}`);
    var msg = currentData === undefined ? 'You can only load data every 5 minutes' : 'You can only load data every 5 minutes, using old data...';
    setMsg(msg)
    return currentData;
  }
  console.log(`${currentDate} > ${expiresDate}`);
  setMsg('Loading lots of buy orders from eve servers...(usually the longest part)');

  console.log(userData);
  expiresDate = new Date();
  expiresDate.setMinutes(expiresDate.getMinutes()+5);
  localStorage.setItem('expiresDate', expiresDate);
  console.log(`fetcher be fetchin'`);
  try{
    await Promise.all(regions.map(async (arrayItem) => {
      console.log(arrayItem);
      await FetchEveData(arrayItem, userData, false)
        .then(res=>{
          buyOrders = buyOrders.concat(res);
        });
    }));
  } catch(err){
    console.log(err)
  }
  console.log(`BUYS LOADED`)
  
  setMsg('Loading sell orders from eve servers...');
  console.log(userData);
  var user_system = systems.find(system => system.id === userData.system);
  console.log(user_system);
  var user_region = regions.find(region => region.id === user_system.system_region_id);
  console.log(user_region);
  await FetchEveData(user_region, true, userData)
    .then(res=>{
      sellOrders = sellOrders.concat(res);
      console.log(`SELLS LOADED`);
      setMsg('Sorting out orders that dont fit you...');
    })

  setMsg('Sorting out orders that dont fit you...');
  var undefined_items = [];
  console.log(userData);
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length} before sorting out stuff`);
  sellOrders = sellOrders.filter(order => order.system_id === userData.system);
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length} after sorting out sells not in users system`);
  sellOrders = sellOrders.filter(order => order.price < userData.capital);
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length} after sorting out sells that cost more than user has isk`);
  sellOrders = sellOrders.filter(order =>{
    var order_item = items.find(item => item.id === order.type_id);
    if (order_item === undefined){
      undefined_items.indexOf(order.type_id) === -1 ? undefined_items.push(order.type_id) : 0;
      return false
    };
    return order_item.volume < userData.volume
  });
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length} after sorting out sells with too high volume`);
  buyOrders = buyOrders.filter(order => {
    var order_item = items.find(item => item.id === order.type_id);
    if (order_item === undefined){
      undefined_items.indexOf(order.type_id) === -1 ? undefined_items.push(order.type_id) : 0;
      return false
    };
    return order_item.volume < userData.volume;
  });
  
  console.log(undefined_items);
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length} after sorting out buys  with too high volume`);
  buyOrders = userData.sec ? buyOrders.filter(order => {
    var order_system = systems.find(system => system.id === order.system_id);
    if (order_system === undefined){
      console.log(`undefined SYSTEM id = ${order.system_id}`);
      return false
    };
    return order_system.system_sec > 0.45;
  }) : buyOrders;
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length} after sorting out buys with too low security`);
  buyOrders = buyOrders.filter(buy_order => {
    var sell_order = sellOrders.find(sell_order => sell_order.type_id === buy_order.type_id);
    if (sell_order === undefined){
      return false
    };
    return true;
  });
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length} after sorting out buys with items that are not in sells`);
  sellOrders = sellOrders.filter(sell_order => {
    var buy_order = buyOrders.find(buy_order => buy_order.type_id === sell_order.type_id);
    if (buy_order === undefined){
      return false
    };
    return true;
  });
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length} after sorting out sells with items that are not in buys`);

  var sellData = sellOrders.reduce((r, a)=>{//creating sellData object
    r[a.type_id] = r[a.type_id] || [];
    r[a.type_id].push(a);
    return r;
  }, Object.create(null));
  for (var item in sellData){//sorting sellData in ascending order
    sellData[item] = sellData[item].sort((a,b)=>a.price-b.price);
  };
  var buyData = buyOrders.reduce((r, a)=>{//grouping buyData by system_id
      r[a.system_id] = r[a.system_id] || [];
      r[a.system_id].push(a);
      return r;
  }, Object.create(null));
  for(var system in buyData){//grouping buyData by type_id
    buyData[system] = buyData[system].reduce((r, a)=>{
        r[a.type_id] = r[a.type_id] || [];
        r[a.type_id].push(a);
        return r;
    }, Object.create(null));
  };

  return {sellData, buyData};
}

export default FetchAllEveData