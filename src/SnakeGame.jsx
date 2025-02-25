import { useEffect, useState } from 'react'
import './index.css'
import GameOverModal from './GameOverModal/GameOverModal'

const gridSize = 15
const initialPosition = [[5,5]]
const initialDirection = "RIGHT"

export default function SnakeGame() {
    const [snake, setSnake] = useState(initialPosition)
    const [direction, setDirection] = useState(initialDirection)
    const [food, setFood] = useState(generateFood())
    const [score, setScore] = useState(0)
    const [speed, setSpeed] = useState(200)
    const [highScores, setHighScores] = useState([])
    
    const [gameOver, setGameOver] = useState(false);

    const miamSoud = new Audio("/miam.wav")
    const gameStart = new Audio("gamestart.mp3")

    const playSoud = (sound) => {
      sound.currentTime = 0
      sound.play()
    }

    const saveScores = (newScore) => {
      let scores = [...highScores, newScore].sort((a,b) => b - a).slice(0,5)
      setHighScores(scores)
      localStorage.setItem("highScores", JSON.stringify(scores))
    }

    useEffect(() => {
      // localstorage high scores
      const scores = JSON.parse(localStorage.getItem("highScores")) ||[]
      setHighScores(scores)

        const handleKeyPress = (event) => {
            const newDirection = getDirection(event.key)
            if(newDirection) setDirection(newDirection)
        }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
    }, [])

    useEffect(() => {
      if (gameOver) return

      const interval = setInterval(moveSnake, speed)
      return () => clearInterval(interval)
    }, [snake, direction, speed])

    function generateFood() {
        let x, y
        do {
            x = Math.floor(Math.random()* gridSize)
            y = Math.floor(Math.random()* gridSize)
        } while (snake.some(([sx, sy]) => sx === x && sy === y))
        return [x,y]
    }

    function moveSnake() {
        const newSnake = [...snake]
        const head = [...newSnake[newSnake.length - 1]]

        switch(direction) {
            case "UP": head[1] -=1; break
            case "DOWN": head[1] +=1; break
            case "LEFT": head[0] -=1; break
            case "RIGHT": head[0] +=1; break
            default: return
        }

        if (head[0] < 0 || head[0] >= gridSize || head[1] < 0 || head[1] >= gridSize || snake.some(([x, y]) => x === head[0] && y === head[1])) {
            setGameOver(true)
            saveScores(score)
            return
          }

          newSnake.push(head)
          if (head[0] === food[0] && head[1] === food[1]) {
            setFood(generateFood());
            setScore(score +1)
            setSpeed((prevSpeed) => Math.max(50, prevSpeed - 5))
            playSoud(miamSoud)
          } else {
            newSnake.shift();
          }
          setSnake(newSnake);
    }

    function getDirection(key) {
        const directions = {
            ArrowUp: "UP",
            ArrowDown: "DOWN",
            ArrowLeft: "LEFT",
            ArrowRight: "RIGHT"
          }
          return directions[key]
    }

    const restartGame = () => {
      setSnake(initialPosition)
      setFood(generateFood())
      setScore(0)
      setSpeed(200)
      setGameOver(false)
      playSoud(gameStart)
    }
    
  return (
    <div className="board">
      <h1 className='title'>Snake game</h1>
    {Array.from({ length: gridSize }, (_, y) => (
      <div key={y} className="row">
        {Array.from({ length: gridSize }, (_, x) => {
          let className = "cell";
          let isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          let isApple = food[0] === x && food[1] === y;
          if (isSnake) {
            className += " snake";
          }
          if (isApple) {
            className += " food";
          }
          return <div key={x} className={className} />;
        })}      

        {gameOver && <GameOverModal restart={restartGame} score={score} highScores={highScores}/>}
      </div>
    ))}
   
    {gameOver === false ? <p id='score'>Score : {score}</p> : ""}
      
    <p id='credit'>by Quentin Ribardière <br /> <a href="https://github.com/Quentinrbd/snake-game" target='_blank'>Github repo</a></p>
  </div>
  )
}