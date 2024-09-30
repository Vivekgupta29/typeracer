import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useTypeRacerContext } from '../contexts/TypeRacerContext';
import ScoreBoardBoxes from './ScoreBoardBoxes';

function Scoreboard() {

    const {
        calculateWPM, calculateCharacterAccuracy, calculateWordAccuracy, wrongWordsCount, wrongCharactersCount,
        gameStartState, gameOver, setElapsedTime, correctWordsCount, gameRestart, slideInVariant
    } = useTypeRacerContext();

    // Basic stats visible during the game
    const basicScoreObj = {
        "WPM": { value: calculateWPM(), color: "text-green-400" },
        "Correct Words": { value: correctWordsCount, color: "text-blue-400" },
        "Incorrect Words": { value: wrongWordsCount, color: "text-red-400" },
        "Incorrect Letters": { value: wrongCharactersCount, color: "text-red-300" },
    };

    // Advanced stats that will show after the game ends
    const advancedScoreObj = {
        "Word Accuracy": { value: `${calculateWordAccuracy()}%`, color: "text-purple-400" },
        "Letter Accuracy": { value: `${calculateCharacterAccuracy()}%`, color: "text-yellow-600" },
    };

    // Timer to track elapsed time
    useEffect(() => {
        if (!gameStartState && !gameOver) {
            const interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameStartState, gameOver]);

    // Framer Motion variants for the slide-in effect


    return (
        <>
            <div className={`w-[70vw] mx-auto flex flex-wrap justify-center items-center transition-all duration-500 h-full`}>
                <div className="w-full flex justify-center gap-4 my-2 transition-all duration-500">
                    {Object.keys(basicScoreObj).map((key) => (
                        <motion.div
                            key={key}
                            variants={slideInVariant}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <ScoreBoardBoxes
                                key={key}
                                scoreheading={key}
                                scorevalue={basicScoreObj[key].value}
                                color={basicScoreObj[key].color}
                            />
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {gameOver && (
                        <>
                            <div className="w-full flex justify-center gap-4 mb-2">
                                {Object.keys(advancedScoreObj).map((key) => (
                                    <motion.div
                                        key={key}
                                        variants={slideInVariant}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <ScoreBoardBoxes
                                            scoreheading={key}
                                            scorevalue={advancedScoreObj[key].value}
                                            color={advancedScoreObj[key].color}
                                        />
                                    </motion.div>
                                ))}


                                <motion.div
                                    key="restartButton"
                                    variants={slideInVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="bg-slate-900 rounded-lg h-[20vh] p-2 text-white flex items-center justify-center flex-col basis-[15vw] cursor-pointer hover:bg-blue-900"
                                    onClick={gameRestart}
                                >
                                    <div className="text-2xl"><i className="ri-restart-line"></i> Restart!</div>
                                </motion.div>
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

export default Scoreboard;
