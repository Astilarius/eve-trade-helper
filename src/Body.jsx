import React from 'react';
import regions from './data/regions';
import FetchEveData from './dataProcessing/FetchEveData';
import FetchAllEveData from './dataProcessing/FetchAllEveData';
import client_id from 'D:/VScode/private_data';
import secret_key from 'D:/VScode/private_data';
import Login from './dataProcessing/Login';
import { useEffect } from 'react';

var buyData = [];
var sellData = [];
function Body() {
  var data = [];
  const [count, setCount] = React.useState(0);
  const [excMsg, setExcMsg] = React.useState("");
  const [clientData, setClientData] = React.useState("");
  const scopes = "esi-location.read_location.v1 esi-location.read_ship_type.v1 esi-skills.read_skills.v1 esi-wallet.read_character_wallet.v1 esi-ui.write_waypoint.v1 esi-markets.structure_markets.v1"
  var url = `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${encodeURIComponent("http://localhost:5173")}&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&state=teststate`;
  var loaded = false;

  var ignore = false;
  useEffect(() => {
    
    if (!ignore) {
      Login();
    }
    return () => { ignore = true; }
    },[]);

  //just calls FetchEveData inside try catch
  function HandleSubmit(e){
    e.preventDefault();
    try{
      var region = regions.filter(obj => {
        return obj.region === e.target[0].value;
      })[0];
      console.log(region);
      setExcMsg("");
      FetchEveData(region);
    } catch(err){
      console.log(err)
      setExcMsg(`could not find '${e.target[0].value}' region`)
    }
  }
  //deletes all downloaded orders
  function HandleReset(e){
    sellData = [];
    buyData = [];
    setCount(`sell:${sellData.length} buy:${buyData.length}`);
  }

  return (
    <div onSubmit={HandleSubmit} className="App">
      <form>
        <input id="color" list="suggestions"/>
        <datalist id="suggestions">
            <option value="The Forge"/>
            <option value="Verge Vendor"/>
            <option value="Metropolis"/>
            <option value="Heimatar"/>
            <option value="Kor-Azor"/>
            <option value="Lonetrek"/>
            <option value="Placid"/>
            <option value="Black Rise"/>
            <option value="The Citadel"/>
            <option value="Everyshore"/>
            <option value="Sinq Laison"/>
            <option value="Solitude"/>
            <option value="Molden Heath"/>
            <option value="The Bleak Lands"/>
            <option value="Aridia"/>
            <option value="Kador"/>
            <option value="Domain"/>
            <option value="Devoid"/>
            <option value="Khanid"/>
            <option value="Tash-Murkon"/>
            <option value="Derelik"/>
        </datalist>
        <button type="submit">click</button>
      </form>
      <div>{excMsg}</div>
      <button onClick={FetchAllEveData}>download all data</button>
      <button onClick={HandleReset}>reset</button>
      <p>elements amount: {count}</p>
      <a href={url}>login</a>
      <p>{clientData}</p>
    </div>
  )
}

export default Body;