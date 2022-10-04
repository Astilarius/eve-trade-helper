import React from 'react';
import { useEffect } from 'react';
import { client_id, secret_key, url } from "D:/VScode/private_data";
import systems from './data/systems'
import Login from "./dataProcessing/Login";
import FetchAllEveData from './dataProcessing/FetchAllEveData';

function Body() {
  var loadedSellOrders = [];
  var loadedBuyOrders = [];
  const [userData, setUserData] = React.useState({
    user_capacity:null,
    user_balance:null,
    user_tax:null,
    user_system:null,
    sec:null,
  });
  // const [data,setData] = React.useState(JSON.stringify({
  //   volume:0,
  //   capital:0,
  //   tax:0,
  //   system:"",
  // }));
  var data;
  const [err,setErr] = React.useState(false);
  const systemItems = systems.map((system) =>
    <option value={system.system_name} key={system.id}/>
  );

  var volume=0;
  var capital=0;
  var tax=0;
  var system="";
  const queryParams = new URLSearchParams(window.location.search);
  const auth_code = queryParams.get("code");
  var logged_in = (auth_code !== null) ? true : false;
  var pageloaded = false;
  useEffect(() => {
    if (!pageloaded && logged_in) {
      Login(auth_code)
        .then(res => {
          if (res.user_balance !== null){
            console.log("page loaded and you logged in");
            setUserData(res);
            console.log(res);
          } else {
            setErr(true);
            console.log("error set");
          }
        });
    }
    return () => { pageloaded = true; }
    },[]);

  function handleSubmit(e){
    e.preventDefault();
    let user_system = systems.find(system => system.system_name === e.target[3].value);
    // setData(JSON.stringify({
    //   volume:e.target[0].value,
    //   capital:e.target[1].value,
    //   tax:e.target[2].value,
    //   system:user_system.id,
    //   sec:e.target[4].checked,
    // }));
    data = {
      volume:e.target[0].value,
      capital:e.target[1].value,
      tax:e.target[2].value,
      system:user_system.id,
      sec:e.target[4].checked,
    };
    FetchAllEveData(data)
      .then(res=>{
        console.log(res);
        loadedBuyOrders = loadedBuyOrders.concat(res.buyOrders);
        loadedSellOrders = loadedSellOrders.concat(res.sellOrders);
      });
  }

  return (
    <div className="App" >
      {
        logged_in & !err ? 
        <></> :
        <div>
          <span>input your data or </span>
          <a href={url}>Log in</a>
        </div>
      }
      <form onSubmit={handleSubmit}>
          <label htmlFor="volume">Available volume:</label><br/>
          <input defaultValue={userData.user_capacity} id="volume" name="volume" type="number"/><br/>
          <label htmlFor="capital">Available capital:</label><br/>
          <input defaultValue={userData.user_balance} id="capital" name="capital" type="number"/><br/>
          <label htmlFor="tax">Your sales tax:</label><br/>
          <input defaultValue={userData.user_tax} step={0.01} id="tax" name="tax" type="number"/><br/>
          <label htmlFor="system">Your system:</label><br/>
          <input defaultValue={userData.user_system} id="system" name="system" list="systemList"/>
          <datalist  id="systemList" name="systemList">
            {systemItems}
          </datalist><br/>
          <label htmlFor="sec">Search only in highsec:</label><br/>
          <input id="sec" name="sec" type="checkbox"/><br/>
          <button type="submit" >submit</button>
      </form>
      <p>{data}</p>
    </div>
  )
}

export default Body;