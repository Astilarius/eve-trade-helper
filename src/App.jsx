import React from 'react'
import Body from './Body'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1><a className="Title" href='http://localhost:5173/'>Eve Trade Helper</a></h1>
      <hr/>
      <div className='bodyDiv'>
        <Body />
      </div>
    </div>
  )
}

export default App