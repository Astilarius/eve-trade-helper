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
  return (
    <div className="ResultCard" >
      <h1 className='sysname'>{props.obj.name}</h1>
      <span><b>jumps:</b> {props.obj.jumps} </span>
      <span><b>total profit:</b> {props.obj.profit}isk </span>
      <span><b>profit per jump</b> {props.obj.prof_per_jump}isk </span>
      <span><b>total cost:</b> {props.obj.order_price}isk </span>
      <span><b>total volume:</b> {props.obj.order_vol}m3 </span>
      <span className='buttons'>
        {
          props.logged_in ? 
          <button className='routeButton' onClick={handleSetRoute}>set route in-game</button> :
          <> </>
        }
        <button className='copyButton' onClick={handleClipboard}>copy cart to clipboard</button>
      </span>
    </div>
  )
}

export default ResultCard;