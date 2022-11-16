import { useMemo } from "react";

enum Difficulty {
    Hard,
    Medium,
    Easy
}

export default (difficulty:Difficulty)=>{
    const timeInterval = useMemo(() => {
        switch (difficulty) {
            case Difficulty.Hard:
                return 500;
                break;
            case Difficulty.Medium:
                return 1000;
                break;
            case Difficulty.Easy:
            default:
                return 2000;
                break;

        }
    }, [difficulty])

    return timeInterval
}