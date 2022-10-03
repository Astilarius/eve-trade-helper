import React from 'react';
import { useEffect } from 'react';
import { client_id, secret_key, url } from "D:/VScode/private_data";
import Login from "./dataProcessing/Login";

function Body() {
  const [userData, setUserData] = React.useState({
    user_capacity:0,
    user_balance:0,
    user_tax:0,
    user_location:''
  });
  const [data,setData] = React.useState(JSON.stringify({
    volume:0,
    capital:0,
    tax:0,
    system:"",
  }));
  // const [count, setCount] = React.useState(0);
  // const [excMsg, setExcMsg] = React.useState("");
  

  // //just calls FetchEveData inside try catch
  // function HandleSubmit(e){
  //   e.preventDefault();
  //   try{
  //     var region = regions.filter(obj => {
  //       return obj.region === e.target[0].value;
  //     })[0];
  //     console.log(region);
  //     setExcMsg("");
  //     FetchEveData(region);
  //   } catch(err){
  //     console.log(err)
  //     setExcMsg(`could not find '${e.target[0].value}' region`)
  //   }
  // }

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
        .then(res => setUserData(res))
        .then(res=>console.log(res));
      console.log("page loaded and you logged in");
    }
    return () => { pageloaded = true; }
    },[]);

  function handleSubmit(e){
    e.preventDefault();
    setData(JSON.stringify({
      volume:e.target[0].value,
      capital:e.target[1].value,
      tax:e.target[2].value,
      system:e.target[3].value,
    }));
    console.log(e.target);
  }

  return (
    <div className="App" >
      {
        logged_in ? 
        <p>welcome back</p> :
        <a href={url}>Log in</a>
      }
      <form onSubmit={handleSubmit}>
          <label htmlFor="volume">Available volume:</label><br/>
          <input value={userData.user_capacity} id="volume" name="volume" type="number"/><br/>
          <label htmlFor="capital">Available capital:</label><br/>
          <input value={userData.user_balance} id="capital" name="capital" type="number"/><br/>
          <label htmlFor="tax">Your sales tax:</label><br/>
          <input value={userData.user_tax} step={0.01} id="tax" name="tax" type="number"/><br/>
          <label htmlFor="system">Your system:</label><br/>
          <input value={userData.user_location} id="system" name="system" type="text"/><br/>
          <button type="submit" >submit</button>
      </form>
      <p>{data}</p>
    </div>
  )
}

export default Body;

//   <form>
//   <input id="color" list="suggestions"/>
//   <datalist id="suggestions">
//       <option value="The Forge"/>
//       <option value="Verge Vendor"/>
//       <option value="Metropolis"/>
//       <option value="Heimatar"/>
//       <option value="Kor-Azor"/>
//       <option value="Lonetrek"/>
//       <option value="Placid"/>
//       <option value="Black Rise"/>
//       <option value="The Citadel"/>
//       <option value="Everyshore"/>
//       <option value="Sinq Laison"/>
//       <option value="Solitude"/>
//       <option value="Molden Heath"/>
//       <option value="The Bleak Lands"/>
//       <option value="Aridia"/>
//       <option value="Kador"/>
//       <option value="Domain"/>
//       <option value="Devoid"/>
//       <option value="Khanid"/>
//       <option value="Tash-Murkon"/>
//       <option value="Derelik"/>
//   </datalist>
//   <button type="submit">click</button>
// </form>