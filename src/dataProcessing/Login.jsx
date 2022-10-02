import items from '../data/items';
import getNameFromID from '../dataProcessing/getNameFromID';
import FetchEveData from '../dataProcessing/FetchEveData';
import { Buffer } from "buffer";

//finds parameter passed in url by its name
function get(name){
if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}
//logs in user, downloads user data
async function Login() {
    let auth_code = get("code");
    if (typeof auth_code !== 'undefined'){
        let loginData = {
        "grant_type": "authorization_code",
        "code": auth_code,
        }

        let secret = Buffer.from(`${client_id}:${secret_key}`).toString('base64');
        console.log('Sending data');

        const XHR = new XMLHttpRequest();

        const urlEncodedDataPairs = [];

        // Turn the data object into an array of URL-encoded key/value pairs.
        for (const [name, value] of Object.entries(loginData)) {
        urlEncodedDataPairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
        }

        // Combine the pairs into a single string and replace all %-encoded spaces to
        // the '+' character; matches the behavior of browser form submissions.
        const urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

        const res = await fetch('https://login.eveonline.com/v2/oauth/token',{
        method: 'post',
        body: urlEncodedData,
        headers:{
            'Authorization': `Basic ${secret}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        }).then(data => {return data.json()});
        var access_token = res.access_token;

        const res2 = await fetch("https://esi.evetech.net/verify/?datasource=tranquility",{
        headers:{
            'Authorization': `Bearer ${access_token}`
        }
        }).then(data => {return data.json()})
        var char_id = res2.CharacterID;
        console.log(res2);
        console.log(char_id);

        const user_balance = await fetch(`https://esi.evetech.net/latest/characters/${char_id}/wallet/?datasource=tranquility&token=${access_token}`)
        .then(res => res.json())
        .then(res => {
        console.log(res);
        setClientData(prev => `${prev} Your moneee: ${res}`);
        return res;
        });

        const user_ship = await fetch(`https://esi.evetech.net/latest/characters/${char_id}/ship/?datasource=tranquility&token=${access_token}`)
        .then(res => res.json())
        .then(res => getNameFromID(res.ship_type_id))
        .then(res => {
        console.log(res);
        setClientData(prev => `${prev} Your ship: ${res.name}`);
        return res;
        });

        const user_capacity = await fetch(`https://esi.evetech.net/latest/universe/types/${user_ship.id}/?datasource=tranquility&language=en`)
        .then(res => res.json())
        .then(res => res.capacity)
        .then(res => {
        console.log(res);
        setClientData(prev => `${prev} Your ship's capacity: ${res}`);
        return res;
        });

        const user_location = await fetch(`https://esi.evetech.net/latest/characters/${char_id}/location/?datasource=tranquility&token=${access_token}`)
        .then(res => res.json())
        .then(res => {
        console.log(res);
        return res.solar_system_id;
        });
        let sys_name = await getNameFromID(user_location);
        setClientData(prev => `${prev} Your solar system: ${sys_name.name}`);;

        const user_tax = await fetch(`https://esi.evetech.net/latest/characters/${char_id}/skills/?datasource=tranquility&token=${access_token}`)
        .then(res => res.json())
        .then(res => {
        console.log(res);
        let obj = res.skills.find(o => o.skill_id === 16622);
        console.log(obj);
        setClientData(prev => `${prev} Your accounting level: ${obj.active_skill_level}`);
        var tax = 0.08*(1-0.11*obj.active_skill_level);
        setClientData(prev => `${prev} Your tax: ${0.08*(1-0.11*obj.active_skill_level)}`);
        return tax;
        });

        var user_system = systems.find(system => system.id === user_location);
        var user_region = regions.find(region => region.id === user_system.system_region_id);
        localStorage.removeItem('orders');
        await FetchEveData(user_region, true);
        console.log(`size sell:${sellData.length} buy:${buyData.length}`);
        
        let wrong_system = 0;
        let too_expensive = 0;
        let too_bulky = 0;
        sellData.forEach(order => {
        if(order.system_id !== user_system.id){// sort out all orders that are not in users system
            let index = sellData.indexOf(order);
            wrong_system += 1;
            sellData.splice(index, 1);
            return;
        }
        if(order.price > user_balance){// sort out all orders where item costs more than user has money
            let index = sellData.indexOf(order);
            too_expensive += 1;
            sellData.splice(index, 1);
            return
        }
        let order_item = items.find(item => item.id === order.type_id);
        if (typeof order_item === 'undefined') {
            return;
        }
        if(order_item.volume > user_capacity){// sort out all orders where item takes more place than user has available
            let index = sellData.indexOf(order);
            too_bulky += 1;
            sellData.splice(index, 1);
            return;
        }
        });
        setCount(`sell:${sellData.length} buy:${buyData.length}`);
        console.log(`wrong system = ${wrong_system}`);
        console.log(`too expensive = ${too_expensive}`);
        console.log(`too bulky = ${too_bulky}`);
        console.log(`new size sell:${sellData.length} buy:${buyData.length}`);
    }
  }

export default Login