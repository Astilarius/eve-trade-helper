//downloads object by its id
async function getNameFromID(id){
    console.log(id);
    let localData = [id];
    var toReturn;
    const res = await fetch('https://esi.evetech.net/latest/universe/names/?datasource=tranquility',{
      method: 'post',
      body: JSON.stringify(localData)
    }).then(data => {return data.json()})
    toReturn = res;
    console.log(toReturn);
    return toReturn[0];
  }

export default getNameFromID