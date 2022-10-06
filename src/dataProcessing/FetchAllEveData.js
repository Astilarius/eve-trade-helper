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
}){
  var sellOrders = [];
  var buyOrders = [];
  var expiresDate = new Date(localStorage.getItem('expiresDate'));
  var currentDate = new Date();
  console.log(localStorage);
  if (currentDate < expiresDate){
    console.log(`${currentDate} < ${expiresDate}`);
    // sellOrders = localStorage.getItem('sellOrders');
    // buyOrders = localStorage.getItem('buyOrders');
    return null;
  }
  console.log(`${currentDate} > ${expiresDate}`);

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
    // await regions.forEach(function (arrayItem) {
    //   console.log(arrayItem);
    //   FetchEveData(arrayItem, false)
    //     .then(res=>{
    //       buyOrders = buyOrders.concat(res);
    //     });
    // })
  } catch(err){
    console.log(err)
  }
  console.log(`BUYS LOADED`)
  
  console.log(userData);
  var user_system = systems.find(system => system.id === userData.system);
  console.log(user_system);
  var user_region = regions.find(region => region.id === user_system.system_region_id);
  console.log(user_region);
  await FetchEveData(user_region, true, userData)
    .then(res=>{
      sellOrders = sellOrders.concat(res);
      console.log(`SELLS LOADED`);
    })
  // localStorage.setItem('sellOrders', sellOrders);
  // localStorage.setItem('buyOrders', buyOrders);
  console.log(userData);
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length}`);
  sellOrders = sellOrders.filter(order => order.system_id === userData.system);
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length}`);
  sellOrders = sellOrders.filter(order => order.price < userData.capital);
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length}`);
  sellOrders = sellOrders.filter(order => function(){
    var order_item = items.find(item => item.id === order.type_id);
    if (order_item === undefined){
      console.log(order.type_id);
      getNameTypeID(order.type_id)
        .then(res => {
          items.push({
            id: res.type_id,
            market_group_id: res.market_group_id,
            name: res.name,
            volume: res.volume,
            group_id: res.group_id,
          })
        });
      return false
    };
    return order_item.volume < userData.volume
  });
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length}`);
  buyOrders = buyOrders.filter(order => {
    var order_item = items.find(item => item.id === order.type_id);
    if (order_item === undefined){

      console.log(order.type_id);
      return false
    };
    return order_item.volume < userData.volume;
  });
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length}`);
  buyOrders = buyOrders.filter(order => {
    var order_system = systems.find(system => system.id === order.system_id);
    if (order_system === undefined){
      console.log(order.system_id);
      return false
    };
    return order_system.system_sec > 0.45;
  });
  console.log(`sellOrders = ${sellOrders.length} buyOrders = ${buyOrders.length}`);
  return {sellOrders, buyOrders};
}

export default FetchAllEveData