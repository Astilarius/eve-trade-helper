import FetchEveData from '../FetchEveData';
import regions from '../../data/regions';

// Array<{
//     duration:number, 
//     is_buy_orde:boolean,
//     issued:string,
//     location_id:number,
//     min_volume:number,
//     order_id:number,
//     price:number,
//     range:string,
//     system_id:number,
//     type_id:number,
//     volume_remain:number,
//     volume_total:number,
// }>

async function FetchAllEveData(userData = {
    volume:null,
    capital:null,
    tax:null,
    system:null,
    sec:null,
  }, setMsg:Function, currentOrders:{ sellData:Array<Array<{
    duration:number, 
    is_buy_orde:boolean,
    issued:string,
    location_id:number,
    min_volume:number,
    order_id:number,
    price:number,
    range:string,
    system_id:number,
    type_id:number,
    volume_remain:number,
    volume_total:number,
}>>, buyData:Array<Array<{
    duration:number, 
    is_buy_orde:boolean,
    issued:string,
    location_id:number,
    min_volume:number,
    order_id:number,
    price:number,
    range:string,
    system_id:number,
    type_id:number,
    volume_remain:number,
    volume_total:number,
}>> }){
    var sellOrders:Array<Array<{
        duration:number, 
        is_buy_orde:boolean,
        issued:string,
        location_id:number,
        min_volume:number,
        order_id:number,
        price:number,
        range:string,
        system_id:number,
        type_id:number,
        volume_remain:number,
        volume_total:number,
    }>> = [];
    var buyOrders:Array<Array<{
        duration:number, 
        is_buy_orde:boolean,
        issued:string,
        location_id:number,
        min_volume:number,
        order_id:number,
        price:number,
        range:string,
        system_id:number,
        type_id:number,
        volume_remain:number,
        volume_total:number,
    }>> = [];
    var expiresDate:Date = new Date(localStorage.getItem('expiresDate'));
    var currentDate:Date = new Date();
    console.log(localStorage);
    if (currentDate < expiresDate){
      console.log(`${currentDate} < ${expiresDate}`);
      console.log(currentOrders);
      var msg = (currentOrders === undefined) ? `You can only load data every 5 minutes, next time - ${expiresDate}` : "You can only load data every 5 minutes, using old data...";
      setMsg(msg);
      return currentOrders;
    }
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
    try{
        await Promise.all(regions.map(async (arrayItem) => {
            console.log(arrayItem);
            await FetchEveData(arrayItem, userData, true)
            .then(res=>{
                sellOrders = sellOrders.concat(res);
            });
    }));
    } catch(err){
        console.log(err)
    }
    return {'sellOrders':sellOrders,'buyOrders':buyOrders};
}

export default FetchAllEveData