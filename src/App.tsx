import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { increment } from './store/counterSlice';

function App() {
  const count = useAppSelector(s => s.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="App">
      <div className="card">
        <button onClick={() => dispatch(increment())}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
