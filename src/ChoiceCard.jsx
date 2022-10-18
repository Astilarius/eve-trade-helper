import React from 'react';

function ChoiceCard() {
  const chosenOrders = "";
  return (
    <div className='ChoiceCard'>
      <table>
        <tr>
          <th>You will buy</th>
          <th>You will sell</th>
        </tr>
        
        <tr>
          <td>
          </td>
          <td>
            <h3>station name</h3>
            <li>list of items</li>
            <li>list of items</li>
            <li>list of items</li>
          </td>
        </tr>
        
        <tr>
          <td>
            <h3>station name</h3>
            <li>list of items</li>
            <li>list of items</li>
            <li>list of items</li>
          </td>
          <td>
            <h3>station name</h3>
            <li>list of items</li>
            <li>list of items</li>
            <li>list of items</li>
          </td>
        </tr>

      </table>
    </div>
  )
}

export default ChoiceCard;