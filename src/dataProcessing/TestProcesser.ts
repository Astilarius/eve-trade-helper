import items from '../data/items'
import systems from '../data/systems'

async function ProcessOrders(buyOrders:{[key:number]:Array<{
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
}>}, sellData:Array<{
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
}>, userData:{
    volume:number,
    capital:number,
    tax:number,
    system:number,
    sec:boolean,
  }) {

}

export default ProcessOrders;