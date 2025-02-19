import './GameOverModal.css'

export default function GameOverModal({score, restart}) {
  return (
    <div className='popup'>
        <div className='popup-content'>
            <h1>Game over !</h1>
            <h2>Score : {score}</h2>
            <button onClick={restart}>try again</button>
        </div>
    </div>
  )
}