import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { generate } from "random-words";

const TypeRacerContext = createContext();

export const TypeRacerContextProvider = ({ children }) => {
    //array for challenge
    const [wordsArray, setWordsArray] = useState(generate(100));

    //Timer for game
    const [timer, setTimer] = useState(60);
    const [gameOver, setGameOver] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameStartState, setGameStartState] = useState(true);

    // For Stats
    const [wrongWordsCount, setWrongWordsCount] = useState(0);
    const [wrongCharactersCount, setWrongCharactersCount] = useState(0);
    const [correctCharactersCount, setCorrectCharactersCount] = useState(0);
    const [correctWordsCount, setCorrectWordsCount] = useState(0);
    const [totalCharacterTyped, setTotalCharacterTyped] = useState(0);
    const [totalWordTyped, setTotalWordTyped] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0); // To track time elapsed

    //ref for inputbox 
    const inputbox = useRef(null);
    const eachcharacterref = useRef(null);
    const wordRefs = useRef([])
    const textMeasureRef = useRef(null)
    const ChallengeRef = useRef(null)

    // widths for sliding challenge
    const [challengeWidth, setChallengeWidth] = useState(0)
    const [currentWordOffset, setCurrentWordOffset] = useState(0)

    // for Saving input
    const [inputValue, setInputValue] = useState('')
    // Input words array
    const [InputValueArray, setInputValueArray] = useState([])


    const gameRestart = () => {
        setTimer(60);
        setWrongWordsCount(0);
        setWrongCharactersCount(0);
        setCorrectCharactersCount(0);
        setCorrectWordsCount(0);
        setTotalCharacterTyped(0);
        setTotalWordTyped(0);
        setElapsedTime(0);
        setGameStartState(false);
        inputbox.current.focus();
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    // Calculate WPM (Words Per Minute)
    const calculateWPM = () => {
        return (correctWordsCount / (elapsedTime / 60)).toFixed(2);
    };

    // Calculate Character Accuracy
    const calculateCharacterAccuracy = () => {
        return totalCharacterTyped > 0
            ? ((correctCharactersCount / totalCharacterTyped) * 100).toFixed(2)
            : 0;
    };

    // Calculate Word Accuracy
    const calculateWordAccuracy = () => {
        return totalWordTyped > 0
            ? ((correctWordsCount / totalWordTyped) * 100).toFixed(2)
            : 0;
    };


    const CheckWordIsCorrectOrNot = () => {
        const CurrentWordfromWordsArray = wordsArray[InputValueArray.length - 1]
        const CurrentWordfromInputArray = InputValueArray[InputValueArray.length - 1]
        const currentIndex = InputValueArray.length - 1;

        ChangeColorToWhite(wordRefs, currentIndex + 1)

        if (wordRefs.current[currentIndex] !== undefined) {
            ChangeColorToWhite(wordRefs, currentIndex)

            if (CurrentWordfromWordsArray === CurrentWordfromInputArray) {
                wordRefs.current[currentIndex].style.color = `#6b7280`
                setCorrectWordsCount(prev => prev + 1);
            }
            else {
                ChangeColorToRed(wordRefs, currentIndex)
                setWrongWordsCount(prev => prev + 1);
            }
        }
    }

    const CheckCharacterCorrectOrNot = () => {

        //get the currect character of the words from word array
        let currentWord = wordsArray[InputValueArray.length];
        let isCorrect = true;

        // Check each character up to the current input length
        for (let i = 0; i < inputValue.length; i++) {
            let currentCharacterOfWordsArray = currentWord ? currentWord[i] : undefined;
            let currentTypedCharacter = inputValue[i];
            setTotalCharacterTyped(prev => prev + 1);

            // If any character does not match, set isCorrect to false
            if (currentCharacterOfWordsArray !== currentTypedCharacter) {
                setWrongCharactersCount(prev => prev + 1);
                isCorrect = false;
                break;
            }
        }

        // Change the color on basis of isCorrect
        if (isCorrect) {
            ChangeColorToWhite(inputbox);
            setCorrectCharactersCount(prev => prev + 1);

            // Measure text width for dynamic adjustment when correct
            if (textMeasureRef.current) {
                const textwidth = textMeasureRef.current.offsetWidth;
                setCurrentWordOffset(textwidth);
            }
        } else {
            ChangeColorToRed(inputbox);
        }
    }

    const ChangeColorToRed = (EleRef, index = "") => {
        if (index !== "") {
            EleRef.current[index].style.transition = "all 0.4s ease-out";
            EleRef.current[index].style.color = "red";
        } else {
            EleRef.current.style.transition = "all 0.4s ease-out";
            EleRef.current.style.color = "red";
        }
    };

    const ChangeColorToWhite = (EleRef, index = "") => {
        if (index !== "") {
            EleRef.current[index].style.transition = "all 0.4s ease-out";
            EleRef.current[index].style.color = "white";
        } else {
            EleRef.current.style.transition = "all 0.4s ease-out";
            EleRef.current.style.color = "white";
        }
    };


    // Move the challenge view to keep the current word in the center
    const shiftChallengeView = () => {
        if (ChallengeRef.current && wordRefs.current[InputValueArray.length - 1]) {
            const wordWidth = wordRefs.current[InputValueArray.length - 1].offsetWidth;
            setChallengeWidth((prev) => prev + wordWidth);
            // console.log(wordWidth, " : ", wordRefs.current[InputValueArray.length])
        }
    };

    const handleInput = (e) => {
        //saving string in a variable
        if (gameStartState || gameStarted) {

            let inputString = e.target.value

            //start the game
            if (!gameStarted) {
                setGameStarted(true);
                setGameOver(false)
                setGameStartState(false)
            }

            if (inputString.endsWith(" ")) {

                if (inputString === " ") {
                    // space at start
                    inputString = ""
                }

                if (inputString.length > 1) {
                    // space at end
                    setInputValue(inputString.trim(" "))

                    // Word is completed proceed for word inspection

                    setInputValueArray((prevArray) => [
                        ...prevArray,
                        inputValue.trim(" ")
                    ]);
                    inputString = "";
                }
            }
            // For Showing on Inputbox
            setInputValue(inputString)
        }
    }



    const values = {
        wordsArray, setWordsArray,
        timer,
        setTimer,
        formatTime,
        gameOver, setGameOver,
        gameStarted, setGameStarted,
        gameStartState, setGameStartState,
        inputbox,
        gameRestart,
        inputValue,
        setInputValue,
        eachcharacterref,
        wordRefs,
        textMeasureRef,
        ChallengeRef,
        challengeWidth,
        setChallengeWidth,
        currentWordOffset,
        setCurrentWordOffset,
        InputValueArray,
        setInputValueArray,
        shiftChallengeView,
        ChangeColorToWhite,
        ChangeColorToRed,
        CheckCharacterCorrectOrNot,
        CheckWordIsCorrectOrNot,
        handleInput,
        calculateWPM, calculateCharacterAccuracy, calculateWordAccuracy, wrongWordsCount, wrongCharactersCount, elapsedTime
    };

    return (
        <TypeRacerContext.Provider value={values}>
            {children}
        </TypeRacerContext.Provider>
    );
};

export const useTypeRacerContext = () => useContext(TypeRacerContext);
