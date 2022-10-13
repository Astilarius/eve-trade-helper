import React from 'react';
import { setRoute } from './dataProcessing/setRoute';

function ResultCard(props) {
  function handleSetRoute(){
    setRoute(props.token, props.obj.id);
  }
  function handleClipboard(){
    navigator.clipboard.writeText(props.obj.toClipBoard)
  }
  console.log(props);
  console.log(props.obj);
  console.log(props.obj.jumps);
  console.log(props.obj.prof_per_jump);
  console.log(props.obj['jumps']);
  console.log(props.obj['prof_per_jump']);
  return (
    <div className="ResultCard" >
      <h1>{props.obj.name}</h1>
      <span>jumps: {props.obj.jumps} </span>
      <span>total profit: {props.obj.profit}isk </span>
      <span>profit per jump: {props.obj.prof_per_jump}isk </span>
      <span>total cost: {props.obj.order_price}isk </span>
      <span>total volume: {props.obj.order_vol}m3 </span>
      <button onClick={handleSetRoute}>set route in-game</button>
      <button onClick={handleClipboard}>copy cart to clipboard</button>
    </div>
  )
}

export default ResultCard;