import "./GameOverModal.css";

export default function GameOverModal({ score, restart, highScores }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <h1>Sorry... game over</h1>
        <h2>Score : {score}</h2>
        <h3>Bests scores</h3>
        {highScores.map((score, index) => (
          <p key={index}>
            {index + 1}. {score} points
          </p>
        ))}
        <button onClick={restart}>try again</button>
      </div>
    </div>
  );
}
