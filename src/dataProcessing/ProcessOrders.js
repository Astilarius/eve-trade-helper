import items from '../data/items'

function ProcessOrders(buyData, sellData, userData) {
    for (var system in buyData){
      buyData[system] = {//adding 'profit' property to each buyData system
        'items':buyData[system],
        'id':Number(system),
        'profit':0,
        'cart':[],
      };
      if(Object.keys(buyData[system]['items']).length === 0){//deleting system if there are no items
        console.log('system deleted');
        delete buyData[system];
        continue;
      }
      for (var item in buyData[system]['items']){
        var tempitem = items.find(i => i.id == Number(item));
        if (tempitem === undefined){
            console.log(item);
            delete buyData[system]['items'][Number(item)];
            continue;
        }
        buyData[system]['items'][Number(item)] = {//adding properties to each item in system
          'orders': buyData[system]['items'][Number(item)],
          'id': Number(item),
          'name': tempitem.name,
          'volume': tempitem.volume,
          'profit': 0,
          'vol_profit': 0,
        };
        buyData[system]['items'][Number(item)]['orders'] = buyData[system]['items'][Number(item)]['orders'].sort((a, b)=>b.price - a.price);
        if (sellData[Number(item)] === undefined){
          console.log(sellData[Number(item)]);
          delete sellData[Number(item)];
          continue;
        }
        buyData[system]['items'][Number(item)]['profit'] = buyData[system]['items'][Number(item)]['orders'][0]['price']*(1-userData.tax) - sellData[Number(item)][0]['price'];
        
        if(buyData[system]['items'][Number(item)]['profit'] <= 0){//deleting item if it's profit is < 0
          // console.log(`${buyData[system]['items'][Number(item)]['profit']} = ${buyData[system]['items'][Number(item)]['orders'][0]['price']} *(1 - ${userData.tax}) - ${sellData[item][0]['price']}`)
          delete buyData[system]['items'][Number(item)];
          continue;
        }
        buyData[system]['items'][Number(item)]['vol_profit'] = buyData[system]['items'][Number(item)]['profit'] / buyData[system]['items'][item]['volume'];
    //   }
    // }
    // console.log(buyData);
      }
      if(Object.keys(buyData[system]['items']).length === 0){//deleting system if it has no items
        delete buyData[system];
        continue;
      }
      var tempvol = userData.volume;//copying user's volume 
      var lowest_volume = Math.min(...Object.keys(buyData[system]['items'])
        .map(o => buyData[system]['items'][o].volume));
      while (tempvol > lowest_volume) // until we used up all the volume
        {
            if(Object.keys(buyData[system]['items']).length === 0){//skipping system if it has no items
              break;
            }
            //finding item with max profit / volume
            var item = Object.keys(buyData[system]['items'])
              .map(o => buyData[system]['items'][o])
              .reduce((prev, current) => (+prev.vol_profit > +current.vol_profit) ? prev : current);
            if(sellData[Number(item.id)] === undefined){//deleting item if there are no orders
              delete buyData[system]['items'][Number(item.id)];
              delete sellData[Number(item.id)];
              continue;
            }
            var buy = buyData[system]['items'][Number(item.id)]['orders'][0];
            var sell = sellData[Number(item.id)][0];
            // console.log(buy);
            if (sell === undefined){
              console.log(sellData[Number(item.id)]);
              sellData[Number(item.id)].splice(0, 1);
              continue;
            }
            if (buy === undefined){
              console.log(buyData[system]['items'][Number(item.id)]['orders']);
              buyData[system]['items'][Number(item.id)]['orders'].splice(0, 1);;
              continue;
            }
            // console.log(buy);
            // console.log(buyData[system]);
            // console.log(buyData[system]['items'][buy.type_id]);
            if (buy['volume_remain'] < sell['volume_remain'])//if buy has less amount than sell
            {
              buyData[system]['profit'] += buyData[system]['items'][buy.type_id]['profit'] * buy['volume_remain'];//adding its profit to system's profit
              buyData[system]['cart'].push({
                'name':buyData[system]['items'][buy.type_id]['name'],
                'amount':buy['volume_remain'],
              });
              console.log(`${buyData[system]['profit']} = ${buyData[system]['items'][buy.type_id]['profit']} * ${buy['volume_remain']}`);
              tempvol -= item.volume * buy['volume_remain'];//decreasing remaining volume
              sellData[Number(item.id)][0]['volume_remain'] -= buy['volume_remain'];//decreasing remaining amount in sell
              buyData[system]['items'][Number(item.id)]['orders'].splice(0, 1);//deleting buy order
            }
            else if (sell['volume_remain'] < buy['volume_remain'])//if sell has less amount than buy
            {
              buyData[system]['profit'] += buyData[system]['items'][buy.type_id]['profit'] * sell['volume_remain'];//adding its profit to system's profit
              buyData[system]['cart'].push({
                'name':buyData[system]['items'][buy.type_id]['name'],
                'amount':sell['volume_remain'],
              });
              console.log(`${buyData[system]['profit']} = ${buyData[system]['items'][buy.type_id]['profit']} * ${buy['volume_remain']}`);
              tempvol -= item.volume * sell['volume_remain'];//decreasing remaining volume
              buyData[system]['items'][Number(item.id)]['orders'][0]['volume_remain'] -= sell['volume_remain'];//decreasing remaining amount in buy
              sellData[Number(item.id)].splice(0, 1);//deleting sell order
            } 
            else //if buy and sell amount is equal
            {
              buyData[system]['profit'] += buyData[system]['items'][buy.type_id]['profit'] * buy['volume_remain'];//adding its profit to system's profit
              buyData[system]['cart'].push({
                'name':buyData[system]['items'][buy.type_id]['name'],
                'amount':buy['volume_remain'],
              });
              console.log(`${buyData[system]['profit']} = ${buyData[system]['items'][buy.type_id]['profit']} * ${buy['volume_remain']}`);
              tempvol -= item.volume * buy['volume_remain'];//decreasing remaining volume
              buyData[system]['items'][Number(item.id)]['orders'].splice(0, 1);;//deleting buy order
              sellData[Number(item.id)].splice(0, 1);//deleting sell order
            }
            if(buyData[system]['items'][Number(item.id)]['orders'][0] === undefined){//deleting item if there are no orders
              delete buyData[system]['items'][Number(item.id)];
              continue;
            }
            if(sellData[Number(item.id)][0] === undefined){//deleting item if there are no orders
              delete buyData[system]['items'][Number(item.id)];
              delete sellData[Number(item.id)];
              continue;
            }
            // calculating new profit for this item
            buyData[system]['items'][Number(item.id)]['profit'] = buyData[system]['items'][Number(item.id)]['orders'][0]['price'] * (1 - userData.tax) - sellData[Number(item.id)][0]['price'];
            buyData[system]['items'][Number(item.id)]['vol_profit'] = buyData[system]['items'][Number(item.id)]['profit'] / buyData[system]['items'][Number(item.id)]['volume'];
            if(buyData[system]['items'][Number(item.id)]['profit'] <= 0){//deleting item if it's profit is < 0
              delete buyData[system]['items'][Number(item.id)];
            }
        }
    }
    console.log(buyData);
    var max_profit_system = Object.keys(buyData)
    .map(o => buyData[o])
    .reduce((prev, current) => (+prev.profit > +current.profit) ? prev : current);
    console.log(max_profit_system);
}

export default ProcessOrders;