/* Imports the files needed for the button component. */
import React from 'react';
import '../css/Button.css';
import { Link } from 'react-router-dom';

/* Lists the available button styles. */
const STYLES = ['btn--primary', 'btn--outline'];

const SIZES = ['btn--medium', 'btn--large'];

/* Creates a reusable button component. */
export const Button = ({
	children, /* Text or content shown inside the button. */
	type, /* Sets the button type. */
	onClick, /* Runs when the button is clicked. */
	buttonStyle, /* Sets the style for the button. */
	buttonSize, /* Sets the size for the button. */
	to, /* Sets the destination page. */
}) => {
	/* Uses the selected style or the default style. */
	const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

	/* Uses the selected size or the default size. */
	const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

	return (
		/* Takes the user to the specified page. */
		<Link to={to} className='btn-mobile'>
			<button 
				className={`btn ${checkButtonStyle} ${checkButtonSize}`}
            	onClick={onClick}
            	type={type}
			>
				{children}
			</button>
		</Link>
	);
};