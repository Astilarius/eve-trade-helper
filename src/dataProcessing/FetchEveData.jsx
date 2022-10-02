//download orders from single region
async function FetchEveData(region, isSell = true){
    var url;
    var promises = [];
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

    if (isSell){
        sellData = sellData.concat(json);
    } else {
        buyData = buyData.concat(json);
    }
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
        .then(console.log(`page ${i} of ${region.region} loaded`))
        .then(resp => resp.json())
        .then(json => {
        if (isSell){
            sellData = sellData.concat(json);
        } else {
            buyData = buyData.concat(json);
        }
        })
        .then(setCount(`sell:${sellData.length} buy:${buyData.length}`));
        promises.push(promise);
    }
    await Promise.allSettled(promises)
        .then(console.log('all promises fulfilled'));
    }

export default FetchEveData