//downloads object by its id
async function getNameTypeID(id){
    console.log(id);
    let localData = [id];
    var toReturn;
    const res = await fetch(`https://esi.evetech.net/latest/universe/types/${id}/?datasource=tranquility&language=en`,{
        method: 'get',
    }).then(data => {return data.json()})
    toReturn = res;
    console.log(toReturn);
    return toReturn;
}

export default getNameTypeID