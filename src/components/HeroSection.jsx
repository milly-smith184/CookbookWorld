/* Imports the files needed for the HeroSection component*/
import React from 'react';
import '../App.css';
import { Button } from './Button';
import '../css/HeroSection.css';

/* Defines the HeroSection component */
function HeroSection() {
	return (
		/* Main container for the hero section */
		<div className='hero-container'>
			{/* Displays the hero section */}
			<img src="/images/hero-image1.png" alt="Fresh ingredients in a refrigerator" />
			<h1>What's in your fridge?</h1>
			<p>GOOD FOOD STARTS HERE</p>

			{/* Container for the call-to-action button */}
			<div className="hero-btns">
				<Button 
					to='/FindRecipes'
					className='btns' 
					buttonStyle='btn--primary'
					buttonSize='btn--large'
				>
					Let's Make Something 
				</Button>
			</div>
		</div>
	);
}

/* Exports the HeroSection component for use in other files */
export default HeroSection

