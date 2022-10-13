import items from '../data/items'
import systems from '../data/systems'

async function ProcessOrders(buyData, sellData, userData) {
    for (var system in buyData){
      var tempsys = systems.find(sys => sys.id === Number(system));
      buyData[system] = {//adding 'profit' property to each buyData system
        'items':buyData[system],
        'id':Number(system),
        'name': tempsys.system_name,
        'profit':0,
        'cart':[],
        'order_vol':0,
        'order_price':0,
        // 'jumps':0,
        // 'prof_per_jump':0,
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
          'toClipBoard': ' ',
        };
        buyData[system]['items'][Number(item)]['orders'] = buyData[system]['items'][Number(item)]['orders'].sort((a, b)=>b.price - a.price);
        if (sellData[Number(item)] === undefined){
          console.log(sellData[Number(item)]);
          delete sellData[Number(item)];
          continue;
        }
        buyData[system]['items'][Number(item)]['profit'] = buyData[system]['items'][Number(item)]['orders'][0]['price']*(1-userData.tax) - sellData[Number(item)][0]['price'];
        
        if(buyData[system]['items'][Number(item)]['profit'] <= 0){//deleting item if it's profit is < 0
          delete buyData[system]['items'][Number(item)];
          continue;
        }
        buyData[system]['items'][Number(item)]['vol_profit'] = buyData[system]['items'][Number(item)]['profit'] / buyData[system]['items'][item]['volume'];
      }
      if(Object.keys(buyData[system]['items']).length === 0){//deleting system if it has no items
        delete buyData[system];
        continue;
      }
      var tempvol = userData.volume;//copying user's volume 
      var tempcap = userData.capital;//copying user's volume 
      var itemsAmount = 0;
      var lowest_volume = Math.min(...Object.keys(buyData[system]['items'])
        .map(o => buyData[system]['items'][o].volume));
      var lowest_price = Math.min(...Object.keys(buyData[system]['items'])
        .map(o => buyData[system]['items'][o]['orders'][0].price));
      while (tempvol > lowest_volume & tempcap > lowest_price) // until we used up all the volume
        {
            lowest_volume = Math.min(...Object.keys(buyData[system]['items'])
              .map(o => buyData[system]['items'][o].price));
            lowest_price = Math.min(...Object.keys(buyData[system]['items'])
              .map(o => buyData[system]['items'][o]['orders'][0].price));
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
            if (buy['volume_remain'] < sell['volume_remain'])//if buy has less amount than sell
            {
              itemsAmount = item.volume * buy['volume_remain'] > tempvol ? Math.floor(tempvol / item.volume) : buy['volume_remain'];
              itemsAmount = sell['price'] * itemsAmount > tempcap ? Math.floor(tempcap / sell['price']) : itemsAmount;
              buyData[system]['profit'] += buyData[system]['items'][buy.type_id]['profit'] * itemsAmount;//adding its profit to system's profit
              buyData[system]['cart'].push({
                'name':buyData[system]['items'][buy.type_id]['name'],
                'amount':itemsAmount,
              });
              buyData[system]['order_vol'] += item.volume * itemsAmount;
              buyData[system]['order_price'] += sell['price'] * itemsAmount;
              tempvol -= item.volume * itemsAmount;//decreasing remaining volume
              tempcap -= item.volume * sell['price'];//decreasing remaining moneeeee
              sellData[Number(item.id)][0]['volume_remain'] -= itemsAmount;//decreasing remaining amount in sell
              buyData[system]['items'][Number(item.id)]['orders'].splice(0, 1);//deleting buy order
            }
            else if (sell['volume_remain'] < buy['volume_remain'])//if sell has less amount than buy
            {
              itemsAmount = item.volume * sell['volume_remain'] > tempvol ? Math.floor(tempvol / item.volume) : sell['volume_remain'];
              itemsAmount = sell['price'] * itemsAmount > tempcap ? Math.floor(tempcap / sell['price']) : itemsAmount;
              buyData[system]['profit'] += buyData[system]['items'][buy.type_id]['profit'] * itemsAmount;//adding its profit to system's profit
              buyData[system]['cart'].push({
                'name':buyData[system]['items'][buy.type_id]['name'],
                'amount':itemsAmount,
              });
              buyData[system]['order_vol'] += item.volume * itemsAmount;
              buyData[system]['order_price'] += sell['price'] * itemsAmount;
              tempvol -= item.volume * itemsAmount;//decreasing remaining volume
              tempcap -= item.volume * sell['price'];//decreasing remaining moneeeee
              buyData[system]['items'][Number(item.id)]['orders'][0]['volume_remain'] -= itemsAmount;//decreasing remaining amount in buy
              sellData[Number(item.id)].splice(0, 1);//deleting sell order
            } 
            else //if buy and sell amount is equal
            {
              itemsAmount = item.volume * buy['volume_remain'] > tempvol ? Math.floor(tempvol / item.volume) : buy['volume_remain'];
              itemsAmount = sell['price'] * itemsAmount > tempcap ? Math.floor(tempcap / sell['price']) : itemsAmount;
              buyData[system]['profit'] += buyData[system]['items'][buy.type_id]['profit'] * itemsAmount;//adding its profit to system's profit
              buyData[system]['cart'].push({
                'name':buyData[system]['items'][buy.type_id]['name'],
                'amount':itemsAmount,
              });
              buyData[system]['order_vol'] += item.volume * itemsAmount;
              buyData[system]['order_price'] += sell['price'] * itemsAmount;
              tempvol -= item.volume * itemsAmount;//decreasing remaining volume
              tempcap -= item.volume * sell['price'];//decreasing remaining moneeeee
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
    var result = Object.keys(buyData).map((key) => buyData[key]) 
    console.log(result);
    await Promise.all(result.map(async (i) => {
      i['cart'].forEach(cartItem=>{
        i['toClipBoard'] += `${cartItem.name} ${cartItem.amount} `
      })
      await fetch(`https://esi.evetech.net/latest/route/${userData.system}/${i['id']}/?datasource=tranquility&flag=secure`)
        .then(res => res.json())
        .then(res => {
          i['jumps'] = res.length;
          i['prof_per_jump'] = i['profit'] / i['jumps'];
        });
    }));
    result = result.sort((a, b)=> b['prof_per_jump'] - a['prof_per_jump']); 
    console.log(result);
    return result;
}

export default ProcessOrders;