import systems from '../data/systems';
import regions from '../data/regions';
import FetchEveData from './FetchEveData';

//download orders from all regions that we care about (where security >= 0)
async function FetchAllEveData(userData){
  var sellOrders = [];
  var buyOrders = [];
  var expiresDate = new Date(localStorage.getItem('expiresDate'));
  var currentDate = new Date();
  console.log(localStorage);
  if (currentDate < expiresDate){
    console.log(`${currentDate} < ${expiresDate}`);
    return;
  }
  console.log(`${currentDate} > ${expiresDate}`);

  expiresDate = new Date();
  expiresDate.setMinutes(expiresDate.getMinutes()+5);
  localStorage.setItem('expiresDate', expiresDate);
  console.log(`fetching be fetchin'`);
  try{
    await Promise.all(regions.map(async (arrayItem) => {
      console.log(arrayItem);
      FetchEveData(arrayItem, false)
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
  //sort out lowSec if user wants to
  if(userData.sec){
    let low_security = 0;
    let high_volume = 0;
    console.log(`buyOrders size:${buyOrders.length}`);
    await Promise.all(buyOrders.map(async (order) => {
      let order_system = systems.find(system => system.id === order.system_id);
      if (typeof order_system === 'undefined') {
        return;
      }
      if(order_system < 0.45){// sort out all orders where security is too low
        let index = buyOrders.indexOf(order);
        low_security += 1;
        buyOrders.splice(index, 1);
        return;
      }
      let order_item = items.find(item => item.id === order.type_id);
      if (typeof order_system === 'undefined') {
        return;
      }
      if(order_item.volume > userData.volume){// sort out all orders where item volume is too high
        let index = buyOrders.indexOf(order);
        high_volume += 1;
        buyOrders.splice(index, 1);
        return;
      }
    }));
    console.log(`low security = ${low_security}`);
    console.log(`high volume = ${high_volume}`);
    console.log(`buyOrders size:${buyOrders.length}`);
  }
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
  return {sellOrders, buyOrders};
}

export default FetchAllEveData