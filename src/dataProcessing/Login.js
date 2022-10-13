import { Buffer } from "buffer";
import { client_id, secret_key, url } from "D:/VScode/private_data";
import getNameFromID from "../dataProcessing/getNameFromID";
import systems from '../data/systems'

async function Login(auth_code) {
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
    })
    .then(res =>{
        console.log(res);
        if (!res.ok){
            console.log("login failed");
            return "error";
        } else {
            return res.json();
        }
    });
    if (res === "error"){
        return {
            user_capacity:null, 
            user_balance:null, 
            user_tax:null, 
            user_system:null,
            sec:null,
        };
    }
    var access_token = res.access_token;
    const res2 = await fetch("https://esi.evetech.net/verify/?datasource=tranquility",{
    headers:{
        'Authorization': `Bearer ${access_token}`
    }
    }).then(data => {return data.json()})
    var char_id = res2.CharacterID;
    console.log(char_id);

    const user_balance = await fetch(`https://esi.evetech.net/latest/characters/${char_id}/wallet/?datasource=tranquility&token=${access_token}`)
    .then(res => res.json())
    .then(res => {
    console.log(res);
    return res;
    });

    const user_ship = await fetch(`https://esi.evetech.net/latest/characters/${char_id}/ship/?datasource=tranquility&token=${access_token}`)
    .then(res => res.json())
    .then(res => getNameFromID(res.ship_type_id))
    .then(res => {
    console.log(res);
    return res;
    });

    const user_capacity = await fetch(`https://esi.evetech.net/latest/universe/types/${user_ship.id}/?datasource=tranquility&language=en`)
    .then(res => res.json())
    .then(res => res.capacity)
    .then(res => {
    console.log(res);
    return res;
    });

    const user_location = await fetch(`https://esi.evetech.net/latest/characters/${char_id}/location/?datasource=tranquility&token=${access_token}`)
    .then(res => res.json())
    .then(res => {
    console.log(res);
    return res.solar_system_id;
    });
    let sys_name = await getNameFromID(user_location);
    // setClientData(prev => `${prev} Your solar system: ${sys_name.name}`);;

    const user_tax = await fetch(`https://esi.evetech.net/latest/characters/${char_id}/skills/?datasource=tranquility&token=${access_token}`)
    .then(res => res.json())
    .then(res => {
    console.log(res);
    let obj = res.skills.find(o => o.skill_id === 16622);
    console.log(obj);
    // setClientData(prev => `${prev} Your accounting level: ${obj.active_skill_level}`);
    var tax = 0.08*(1-0.11*obj.active_skill_level);
    // setClientData(prev => `${prev} Your tax: ${0.08*(1-0.11*obj.active_skill_level)}`);
    return tax;
    });
    var user_system = systems.find(system => system.id === user_location).system_name;
    return {user_capacity, user_balance, user_tax, user_system, access_token};
}

export default Login;