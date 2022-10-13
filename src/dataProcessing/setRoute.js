//sets route in users interface
export function setRoute(token, dest){
    fetch(`https://esi.evetech.net/latest/ui/autopilot/waypoint/?add_to_beginning=false&clear_other_waypoints=false&datasource=tranquility&destination_id=${dest}&token=${token}`,{
        method: 'post',
    });
  }

// export default setRoute