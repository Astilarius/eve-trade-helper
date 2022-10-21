import React from 'react';
import { useEffect } from 'react';
import { client_id } from "D:/VScode/private_data";
import systems from './data/systems'
import Login from "./dataProcessing/Login";
import FetchAllEveData from './dataProcessing/FetchAllEveData';
import ProcessOrders from './dataProcessing/ProcessOrders';
import ResultCard from './ResultCard';
import './Body.css'
import ChoiceCard from './ChoiceCard';

const scopes = "esi-location.read_location.v1 esi-location.read_ship_type.v1 esi-skills.read_skills.v1 esi-wallet.read_character_wallet.v1 esi-ui.write_waypoint.v1 esi-markets.structure_markets.v1"
var url = `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${encodeURIComponent("https://astilarius.github.io")}&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&state=teststate`
var token = '';
var ordersData;

function Body() {
  const [userData, setUserData] = React.useState({
    user_capacity:null,
    user_balance:null,
    user_tax:null,
    user_system:null,
    sec:null,
    CharacterName:null,
  });
  const [results, setResults] = React.useState([]);
  const [todo, setToDo] = React.useState(<></>);
  var data;
  const [err,setErr] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const systemItems = systems.map((system) =>
    <option value={system.system_name} key={system.id}/>
  );

  const queryParams = new URLSearchParams(window.location.search);
  const auth_code = queryParams.get("code");
  var logged_in = (auth_code !== null) ? true : false;
  var pageloaded = false;

  const [stars, setStars] = React.useState(generateStars());
  function generateStars(){
    var stars = [];
    var setleft = 0;
    var settop = 0;
    var setrotate = 0;
    for(var i = 0; i < 150; i++){
      setleft = Math.floor(Math.random() * 99);
      settop = Math.floor(Math.random() * 99);
      var star=<div className="star" 
      grows={ Math.random() > 0.5 ? 'false' : 'true'} 
      key={i}
      style={
        {left: (setleft)+'%',
        top: (settop)+'%',
        opacity: (Math.floor(Math.random() * 10) / 10)}}>
      </div>
      stars.push(star)
    }
    return stars;
  }
  setTimeout(()=>{
    var resstars = stars.map(star=>{
      if(star.props.style['opacity'] > 0.9 & star.props.grows === 'true'){
        var resstar=<div className="star" 
        key = {Math.random()}
        grows={'false'} 
        style={
          {left: (star.props.style['left']),
          top: (star.props.style['top']),
          opacity: (1)}}>
        </div>
        return resstar;
      } else if (star.props.grows === 'true') {
        var resstar=<div className="star"  
        key = {Math.random()}
        grows={'true'} 
        style={
          {left: (star.props.style['left']),
          top: (star.props.style['top']),
          opacity: (star.props.style['opacity'] + 0.05)}}>
        </div>
        return resstar;
      }
      if(star.props.style['opacity'] < 0.1 & star.props.grows === 'false'){
        var resstar=<div className="star"  
        key = {Math.random()}
        grows={'true'} 
        style={
          {left: (star.props.style['left']),
          top: (star.props.style['top']),
          opacity: (0)}
        }>
        </div>
        return resstar;
      } else if (star.props.grows === 'false') {
        var resstar=<div className="star"  
        key = {Math.random()}
        grows={'false'} 
        style={
          {left: (star.props.style['left']),
          top: (star.props.style['top']),
          opacity: (star.props.style['opacity'] - 0.05)}}>
        </div>
        return resstar;
      }
    });
    setStars(resstars);
  },125)

  useEffect(() => {
    if (!pageloaded && logged_in) {
      Login(auth_code)
        .then(res => {
          if (res.user_balance !== null){
            console.log("page loaded and you logged in");
            token = res.access_token;
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
    data = {
      volume:e.target[0].value,
      capital:e.target[1].value,
      tax:e.target[2].value,
      system:user_system.id,
      sec:e.target[4].checked,
    };
    FetchAllEveData(data, setMsg, ordersData)
      .then(res=>{
        console.log(ordersData);
        console.log(res);
        if(res === undefined & ordersData === undefined) return;
        ordersData = res;
        setMsg('Calculating result...');
        console.log(ordersData);
        ProcessOrders(ordersData.buyData, ordersData.sellData, data)
        .then(r=>{
          setResults(r.map(i => {
            return <ResultCard 
              obj = {i}
              token = {token}
              key = {i.id}
              logged_in = {logged_in & !err ? true : false}
              func = {setToDo}
            />
          }))
          setMsg('');
        })
      });
    }
  return (
    <div className='Body'>
      <div className="BodyForm">
        <form onSubmit={handleSubmit}>
          <div className='centerMe'>
            {
              logged_in & !err ? 
              <span>Logged in as {userData.CharacterName}<br/></span> :
              <p>
                <span>Input your data or </span>
                <a href={url}>Log in</a>
                <br/>
              </p>
            }
            <label htmlFor="volume">Available volume:</label><br/>
            <input min={0} defaultValue={userData.user_capacity} id="volume" name="volume" type="number"/><br/>
            <label htmlFor="capital">Available capital:</label><br/>
            <input min={0} defaultValue={userData.user_balance} id="capital" name="capital" type="number"/><br/>
            <label htmlFor="tax">Your sales tax:</label><br/>
            <input min={0} defaultValue={userData.user_tax} step={0.01} id="tax" name="tax" type="number"/><br/>
            <label htmlFor="system">Your system:</label><br/>
            <input defaultValue={userData.user_system} id="system" name="system" list="systemList"/>
            <datalist  id="systemList" name="systemList">
              {systemItems}
            </datalist><br/>
            <label htmlFor="sec">Search only in highsec:</label><br/>
            <input id="sec" name="sec" type="checkbox"/><br/>
            <button type="submit" >submit</button>
          </div>
          <p className='loadmsg'>{msg}</p>
        </form>
      </div>
      {/* <ChoiceCard/> */}
      {
        results.length > 0 ?
        <div>
          <div className='todo'>
            {todo}
          </div>
          <table className='resultsTable'>
            <tr>
              <th>system name</ th>
              <th>jumps</th>
              <th>total profit</th>
              <th>profit per jump</th>
              <th>total cost</th>
              <th>total volume</th>
              <th>copy cart</th>
            </tr>
            {results}
          </table>
        </div> : <></>
      }
      {stars}
    </div>
  )
}

export default Body;