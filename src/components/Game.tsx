import { useMemo } from 'react';
import useGame, { GAME_TIME } from '../hooks/useGame';
import { Difficulty } from '../types';
import Statistics from './Statistics';
import Timer from './Timer';




export default ({ difficulty = Difficulty.Easy }: { difficulty?: Difficulty }) => {
    const { startGame, stopGame, gameIsOn, currentWord, onInputChange, displayWords, statistics } = useGame(difficulty);




    //@ts-ignore
    return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <Statistics values={statistics}
            dictionary={{
                'backspaces': "Back Spaces",
                'typeos': 'Typeoes',
                'correctWords': 'Correct Words',
                'wordsPerMinute': 'Words Per Minute',
                'score': "Score"
            }} />
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', margin: 20 }}>
            <button onClick={!gameIsOn ? startGame : stopGame}>{!gameIsOn ? 'Start Game' : 'Stop Game'}</button>
            {gameIsOn && <Timer seconds={GAME_TIME} onTimerDone={() => stopGame()} />}
        </div>
        <input type={"text"} value={currentWord} onChange={onInputChange} />
        {displayWords.map((word) => <div key={word}>{word}</div>)}

    </div>
}