import items from '../data/items'

function ProcessOrders(inpBuyOrders, inpSellOrders, userData) {
    var data = [];
    items.forEach(item => {
        data[item.id] = {
            buyOrders: inpBuyOrders.filter(order => order.type_id === item.id),
            sellOrders : inpSellOrders.filter(order => order.type_id === item.id),
            volume : item.volume,
            name : item.name,
            profit : 0,
            profitVol : 0
        };
    });
    console.log(data);
    data = data.filter(item => item.buyOrders.length > 0 & item.sellOrders.length > 0);
    console.log(data);
    data.forEach(item => {
        item.buyOrders = item.buyOrders.sort((a, b) => b - a);
        item.sellOrders = item.sellOrders.sort((a, b) => b - a);
        item.profit = item.buyOrders[0].price*(1-userData.tax) - item.sellOrders[0].price;
        item.profitVol = item.profit / item.volume;
    });
    data = data.filter(item => item.profit > 1);
    console.log(data);
    return data;
}

export default ProcessOrders;