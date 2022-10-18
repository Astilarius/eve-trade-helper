import React from 'react';
import { setRoute } from './dataProcessing/setRoute';
import './ResultCard.css'

function ResultCard(props) {
  function handleSetRoute(){
    setRoute(props.token, props.obj.id);
  }
  function handleClipboard(){
    navigator.clipboard.writeText(props.obj.toClipBoard)
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
    <div className="ResultCard" >
      <h1 className='sysname'>{props.obj.name}</h1>
      <span><b>jumps:</b> {props.obj.jumps} </span>
      <span><b>total profit:</b> {props.obj.profit}isk </span>
      <span><b>profit per jump</b> {props.obj.prof_per_jump}isk </span>
      <span><b>total cost:</b> {props.obj.order_price}isk </span>
      <span><b>total volume:</b> {props.obj.order_vol}m3 </span>
      <div className='buttons'>
        {
          props.logged_in ? 
          <>
            <button onMouseOver={handleRouteHover} onMouseLeave={handleRouteHoverEnd} className='routeButton' onClick={handleSetRoute}>set route in-game</button>
            
          </> : <></>
        }
        <button onMouseOver={handleClipHover} onMouseLeave={handleClipHoverEnd} className='copyButton' onClick={handleClipboard}>copy cart to clipboard</button>
        {routeTip}
        {clipTip}
      </div>
    </div>
  )
}

export default ResultCard;