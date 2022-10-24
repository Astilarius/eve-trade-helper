import React from 'react';
import { setRoute } from './dataProcessing/setRoute';
import './ResultCard.css'

function ResultCard(props) {
  function handleSetRoute(){
    setRoute(props.token, props.obj.id);
  }
  function handleClipboard(){
    console.log(props.obj);
    props.func(props.obj.total_cart.map(item => <p>{`sell ${item.amount} ${item.name} in ${item.system_name}`}</p>))
    var toclipboard = '';
    props.obj.total_cart.forEach(item=>{
      toclipboard += `${item.name} ${item.amount}\n`;
    });
    navigator.clipboard.writeText(toclipboard);
  }
  
  const [routeTip, setRouteTip] = React.useState(<></>);
  const [clipTip, setClipTip] = React.useState(<></>);
  function handleRouteHover(){
    setRouteTip(<p className='RouteTip'>This button sets route to {props.obj.name} in-game</p>)
  }
  function handleRouteHoverEnd(){
    setRouteTip(<></>)
  }
  function handleClipHover(){
    setClipTip(<p className='ClipTip'>This button copies all needed items in your clipboard, so you can paste it in multibuy in-game</p>)
  }
  function handleClipHoverEnd(){
    setClipTip(<></>)
  }
  return (
    <tr className="ResultCard" >
      <td><h2 className='sysname'>{props.obj.name}</h2></td>
      <td><span>{props.obj.jumps} </span></td>
      <td><span>{Math.floor(props.obj.total_profit)}isk </span></td>
      <td><span>{Math.floor(props.obj.prof_per_jump)}isk </span></td>
      <td><span>{Math.floor(props.obj.total_price)}isk </span></td>
      <td><span>{props.obj.total_vol}m3 </span></td>
      <div className='buttons'>
        {
          props.logged_in ? 
          <>
            <td><button className='routeButton' onClick={handleSetRoute}>set route in-game</button></td>
            
          </> : <></>
        }
        <td><button className='copyButton' onClick={handleClipboard}>copy cart to clipboard</button></td>
        {routeTip}
        {clipTip}
      </div>
    </tr>
  )
}

export default ResultCard;