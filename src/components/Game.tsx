import { useMemo } from 'react';
import useGame from '../hooks/useGame';
import { Difficulty } from '../types';
import Timer from './Timer';




export default ({ difficulty = Difficulty.Easy }: { difficulty?: Difficulty }) => {
    const { startGame, stopGame, gameIsOn, currentWord, onChange, displayWords, statistics, gameStartTime, gameStopTime } = useGame(difficulty);


    const wordsPerMinute = useMemo(() => {
        //@ts-ignore
        const totalTime = Math.round((gameStopTime - gameStartTime) / 1000) / 60;
        const perMinute = isNaN(totalTime) ? 0 : statistics.correctWords / totalTime;
        return Math.round(perMinute * 100) / 100
    }, [statistics, gameStartTime, gameStopTime])

    console.log(wordsPerMinute)
    //@ts-ignore
    const Statistics = <div>{Object.keys(statistics).map(key => <div>{`${key} => ${statistics[key] + ""}`}</div>)}</div>
    return <div >
        {Statistics}
        <div>words per minute {wordsPerMinute}</div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <button onClick={!gameIsOn ? startGame : stopGame}>{!gameIsOn ? 'Start Game' : 'Stop Game'}</button>
            {gameIsOn && <Timer seconds={60} onTimerDone={() => stopGame()} />}
        </div>
        <input type={"text"} value={currentWord} onChange={onChange} />
        {displayWords.map((word) => <div key={word}>{word}</div>)}

    </div>
}