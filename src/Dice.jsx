import animation from "./styles/dice-animation.module.css";
const Dice = (props) => {
	return (
		<div
			className={`die-face ${props.isHeld ? animation.diceIsHeldAnimation : ""}`}
			style={props.isHeld ? {} : { backgroundColor: "white" }}
			onClick={props.tenzies ? null : props.holdDice}>
			<h2 className="die-num">{props.value}</h2>
		</div>
	);
};

export default Dice;
