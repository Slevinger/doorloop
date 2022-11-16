import { useEffect, useState } from "react";

const Timer = ({ seconds, onTimerDone }: { seconds: number, onTimerDone: () => void }) => {
    const [time, setTime] = useState(seconds);

    useEffect(() => {
        if (time > 0) {
            setTimeout(() => {
                setTime((time) => time - 1)
            }, 1000)
        } else {
            onTimerDone()
        }
    }, [time])

    return <div>{time}</div>


}

export default Timer