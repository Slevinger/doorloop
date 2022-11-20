import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Difficulty } from "../types";
import useTimeInterval from "./useTimeInterval";

const words: string[] = ["account", "act", "addition", "adjustment", "advertisement", "agreement", "air", "amount", "amusement", "animal", "answer", "apparatus", "approval", "argument", "art", "attack", "attempt", "attention", "attraction", "authority", "back", "balance", "base", "behavior", "belief", "birth", "bit", "bite", "blood", "blow", "body", "brass", "bread", "breath", "brother", "building", "burn", "burst", "business", "butter", "canvas", "care", "cause", "chalk", "chance", "change", "cloth", "coal", "color", "comfort", "committee", "company", "comparison", "competition", "condition", "connection", "control", "cook", "copper", "copy", "cork", "cotton", "cough", "country", "cover", "crack", "credit", "crime", "crush", "cry", "current", "curve", "damage", "danger", "daughter", "day", "death", "debt", "decision", "degree", "design", "desire", "destruction", "detail", "development", "digestion", "direction", "discovery", "discussion", "disease", "disgust", "distance", "distribution", "division", "doubt", "drink", "driving", "dust", "earth", "edge", "education", "effect", "end", "error", "event", "example", "exchange", "existence", "expansion", "experience", "expert", "fact", "fall", "family", "father", "fear", "feeling", "fiction", "field", "fight", "fire", "flame", "flight", "flower", "fold", "food", "force", "form", "friend", "front", "fruit"];
export const GAME_TIME = 60;//

export default (difficulty: Difficulty = Difficulty.Easy) => {
    const timeInterval = useTimeInterval(difficulty);
    const [availableWords, setAvailableWords] = useState(words);
    const wordMap = useMemo(() => {
        return availableWords.reduce((acc, word) => ({ ...acc, [word]: true }), {})
    }, []) as { [key: string]: boolean }
    const [displayWords, setDisplayWords] = useState<string[]>([])

    const [gameStartTime, setGameStartTime] = useState<Date>()
    const [gameStopTime, setGameStoptTime] = useState<Date>()
    const [gameIsOn, setGameIsOn] = useState(false)
    const [currentWord, setCurrentWord] = useState('');
    const [totalLetters, setTotalLetters] = useState(0);
    const [typeos, setTypeos] = useState(0);
    const [backspaces, setBackspaces] = useState(0);
    const [correctWords, setCorrectWords] = useState<{ [key: string]: boolean }>({});
    const [usedWords, setUsedWords] = useState<{ [key: string]: boolean }>({});


    const wordCount = useMemo(() => Object.keys(correctWords).length, [correctWords])

    const startGame = useCallback(() => {
        setGameStartTime(new Date())
        setTypeos(0);
        setBackspaces(0);
        setCorrectWords({});
        setAvailableWords(words)
        setDisplayWords([])
        setGameIsOn(true);
    }, [])

    const stopGame = useCallback(() => {
        setGameIsOn(false);
        setGameStoptTime(new Date())
    }, [])


    const addWordToList = useCallback(() => {
        if (gameIsOn) {
            const firstWord = availableWords.splice(0, 1)[0]
            setAvailableWords([...availableWords])
            setUsedWords({ ...usedWords, [firstWord]: true })
            setTotalLetters((totalLetters) => totalLetters + firstWord.length)
            setDisplayWords((displayWords) => [firstWord, ...displayWords.filter(word => !correctWords[word])])
        }
    }, [availableWords, gameIsOn, displayWords, correctWords])

    useLayoutEffect(() => {

        if (displayWords.length) {
            const timeout = setTimeout(() => {
                addWordToList()
            }, timeInterval)

            return () => clearTimeout(timeout)
        } else {
            addWordToList()
        }

    }, [availableWords, timeInterval, displayWords, correctWords, gameIsOn])


    const wordsPerMinute = useMemo(() => {
        //@ts-ignore
        const totalTime = Math.round(((gameStopTime || new Date()) - gameStartTime) / 1000) / GAME_TIME;
        console.log('totalTime', totalTime, gameStopTime, gameStartTime)
        const perMinute = isNaN(totalTime) || !totalTime ? 0 : wordCount / totalTime;
        return Math.round(perMinute * 100) / 100
    }, [wordCount, gameStartTime, gameStopTime])

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = async ({ nativeEvent, target }) => {
        //@ts-ignore
        const inputType = nativeEvent.inputType as string;
        if (gameIsOn) {
            switch (inputType) {
                case "deleteContentBackward":
                    setBackspaces((backspaces) => backspaces + 1);
                    setCurrentWord(target.value)
                    break;
                case "insertText":
                    //@ts-ignore
                    if (nativeEvent.data === ' ') {
                        if (wordMap[currentWord]) {
                            await setCorrectWords({ ...correctWords, [currentWord]: true })
                            setDisplayWords((displayWords) => [...displayWords.filter(word => word !== currentWord)])

                        } else {
                            setTypeos((typeos) => typeos + 1)
                        }
                        setCurrentWord('')
                        break;
                    } else {
                        setCurrentWord(target.value)
                    }
            }
        }
    }
    // wordsPerMinute / wordCount
    return {
        displayWords,
        onInputChange,
        gameStartTime,
        gameStopTime,
        startGame,
        stopGame,
        gameIsOn,
        currentWord,
        statistics: {
            wordsPerMinute,
            typeos,
            backspaces,
            correctWords: Object.keys(correctWords).length,
            // score: Math.round((wordCount || 1 - typeos || 1) / (Object.keys(usedWords).length || 1) * 100) * (((wordCount - typeos - backspaces || 0) / (wordCount || 1))),
        }
    }
}

