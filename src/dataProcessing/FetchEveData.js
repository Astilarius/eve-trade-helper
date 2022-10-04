import systems from '../data/systems'
import items from '../data/items'
//download orders from single region
async function FetchEveData(region, isSell = true, userData=null){
    var url;
    var promises = [];
    var orders = [];
    if (isSell){
        url = `https://esi.evetech.net/latest/markets/${region.id}/orders/?datasource=tranquility&order_type=sell&page=1`;
    } else {
        url = `https://esi.evetech.net/latest/markets/${region.id}/orders/?datasource=tranquility&order_type=buy&page=1`;
    }
    var response = await fetch(url);
    if (!response.ok) {
        console.log(`ERROR AT PAGE 1!!!`);
        return;
    }
    console.log(`page 1 loaded`);
    var json = await response.json();
    const currentxpages = await Number(response.headers.get("x-pages"))+1;
    console.log(`total pages = ${currentxpages}`);

    orders = orders.concat(json);
    //data = data.concat(json);
    for (let i = 2; i < (currentxpages); i++){
        if (isSell){
            url = `https://esi.evetech.net/latest/markets/${region.id}/orders/?datasource=tranquility&order_type=sell&page=${i}`;
        } else {
        url = `https://esi.evetech.net/latest/markets/${region.id}/orders/?datasource=tranquility&order_type=buy&page=${i}`;
        }
        var promise = fetch(url)
        .then(resp => {
        if (!resp.ok) {
            console.log(resp.headers.get("x-esi-error-limit-remain"));
            throw new Error(`HTTP error at page ${i}! Status: ${response.status}`);
        }
        return resp;
        })
        .then(console.log(`page ${i} of ${region.region} ${isSell ? 'sell' : 'buy'} orders loaded`))
        .then(resp => resp.json())
        .then(json => {
            orders = orders.concat(json);
        });
        // .then(setCount(`sell:${sellData.length} buy:${buyData.length}`));
        promises.push(promise);
    }
    await Promise.allSettled(promises)
        .then(console.log(`all ${region.region} ${isSell ? 'sell' : 'buy'} orders promises fulfilled`));

    if (userData !== null){
        let wrong_system = 0;
        let high_price = 0;
        let high_volume = 0;
        console.log(`orders size:${orders.length}`);
        await Promise.all(orders.map(async (order) => {
            let order_system = systems.find(system => system.id === order.system_id);
            if (typeof order_system === 'undefined') {
                return;
            }
            if(order_system !== userData.system){// sort out all orders where system is not same as user's
                let index = orders.indexOf(order);
                wrong_system += 1;
                orders.splice(index, 1);
                return;
            }
            if(order.price > userData.capital){// sort out all orders where price is too high
                let index = orders.indexOf(order);
                high_price += 1;
                orders.splice(index, 1);
                return;
            }
            let order_item = items.find(item => item.id === order.type_id);
            if (typeof order_system === 'undefined') {
                return;
            }
            if(order_item.volume > userData.volume){// sort out all orders where item volume is too high
                let index = orders.indexOf(order);
                high_volume += 1;
                orders.splice(index, 1);
                return;
            }
        }));
        console.log(`wrong system ${wrong_system}`);
        console.log(`high price ${high_price}`);
        console.log(`high volume ${high_volume}`);
        console.log(`new orders size:${orders.length}`);
    }
    return orders;
    }

export default FetchEveData