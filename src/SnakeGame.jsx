import { useEffect, useState } from 'react'
import './index.css'

const gridSize = 15
const initialPosition = [[5,5]]
const initialDirection = "RIGHT"

export default function SnakeGame() {
    const [snake, setSnake] = useState(initialPosition)
    const [direction, setDirection] = useState(initialDirection)
    const [food, setFood] = useState(generateFood())
    const [score, setScore] = useState(0)
    const [speed, setSpeed] = useState(200)

    useEffect(() => {
        const handleKeyPress = (event) => {
            const newDirection = getDirection(event.key)
            if(newDirection) setDirection(newDirection)
        }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
    }, [])

    useEffect(() => {
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
            alert("Game Over!");
            setSnake(initialPosition)
            setFood(generateFood())
            setScore(0)
            setSpeed(200)
            return
          }

          newSnake.push(head)
          if (head[0] === food[0] && head[1] === food[1]) {
            setFood(generateFood());
            setScore(score +1)
            setSpeed((prevSpeed) => Math.max(20, prevSpeed - 10))
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
  return (
    <div className="board">
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
      </div>
    ))}
    <p>Score : {score}</p>
    <p>{speed}</p>
  </div>
  )
}