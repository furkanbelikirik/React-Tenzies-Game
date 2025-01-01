import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import "./styles/style.css";
import Dice from "./Dice";

function App() {
	const [dice, setDice] = useState(allNewDice());
	const [tenzies, setTenzies] = useState(false);
	const [rollNumber, setRollNumber] = useState(0);
	const [time, setTime] = useState(0);
	const [gameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		const allHeld = dice.every((dice) => dice.isHeld);
		const firstValue = dice[0].value;
		const allSameValue = dice.every((dice) => dice.value === firstValue);
		if (allHeld && allSameValue) {
			setTenzies(true);
		}
	}, [dice]);

	useEffect(() => {
		let interval;

		if (!tenzies && gameStarted) {
			interval = setInterval(() => {
				setTime((prevTime) => {
					const newTime = prevTime + 10;
					return newTime;
				});
			}, 10);
		} else {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [tenzies, gameStarted]);

	function formatTime(milliseconds) {
		const minutes = Math.floor(milliseconds / (60 * 1000));
		const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
		const ms = milliseconds % 1000;
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${ms
			.toString()
			.padStart(3, "0")}`;
	}

	function generateNewdice() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		};
	}

	function allNewDice() {
		const newDice = [];
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewdice());
		}
		return newDice;
	}

	function rollDice() {
		if (!tenzies) {
			setDice((oldDice) =>
				oldDice.map((dice) => {
					return dice.isHeld ? dice : generateNewdice();
				})
			);
			setRollNumber(rollNumber + 1);
		} else {
			setTenzies(false);
			setRollNumber(0);
			setTime(0);
			setGameStarted(false);
			setDice(allNewDice());
		}
	}

	function holdDice(id) {
		setGameStarted(true);
		setDice((oldDice) =>
			oldDice.map((dice) => {
				return dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice;
			})
		);
	}

	const diceElements = dice.map((dice) => (
		<Dice key={dice.id} value={dice.value} isHeld={dice.isHeld} holdDice={() => holdDice(dice.id)} tenzies={tenzies} />
	));

	return (
		<div className="container">
			{tenzies && <Confetti />}
			<img src="/src/images/logo.png" alt="" width={150} />
			<h1 className="title">TENZIES</h1>
			<p className="instructions">Tüm zarlar aynı olana kadar atın.</p>
			<p className="instructions">Atışlar arasında mevcut değerinde dondurmak için o zara tıklayın.</p>
			<div className="dice-container">{diceElements}</div>
			<div className="info">
				<p className="info-roll">
					<strong>Zar Atma Sayısı: </strong>
					{rollNumber}
				</p>
				<p className="info-time">
					<strong>Süre: </strong>
					{formatTime(time)}
				</p>
			</div>
			<button className="roll-dice" onClick={rollDice} disabled = {!gameStarted}>
				{tenzies ? "Yeni Oyun" : "Zar At"}
			</button>
			<footer>
				<a href="https://github.com/furkanbelikirik" className="name">
					Furkan Belikırık
				</a>{" "}
				/{" "}
				<a href="https://scrimba.com/the-frontend-developer-career-path-c0j" className="course">
					Scrimba
				</a>
			</footer>
		</div>
	);
}

export default App;
