import systems from '../data/systems';
import FetchEveData from './FetchEveData';
import {buyData, sellData} from '../Body';

//download orders from all regions that we care about (where security >= 0)
async function FetchAllEveData(region){
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
    try{
      await regions.forEach(function (arrayItem) {
        console.log(arrayItem);
        FetchEveData(arrayItem, false);
      })
    } catch(err){
      console.log(err)
    }
    
    console.log(`size sell:${sellData.length} buy:${buyData.length}`);
    let low_security = 0;
    //test
    await Promise.all(buyData.map(async (order) => {
      let order_system = systems.find(system => system.id === order.system_id);
      if (typeof order_system === 'undefined') {
        return;
      }
      if(order_system < 0.5){// sort out all orders where security is too low
        let index = buyData.indexOf(order);
        low_security += 1;
        buyData.splice(index, 1);
        return;
      }
    }));
    // setCount(`sell:${sellData.length} buy:${buyData.length}`);
    console.log(`low security = ${low_security}`);
    console.log(`new size sell:${sellData.length} buy:${buyData.length}`);
  }

export default FetchAllEveData