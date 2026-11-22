/* Imports the files needed for the Home component */
import React from 'react';
import '../../App.css';
import HeroSection from '../HeroSection';
import Cards from '../Cards';

/* Creates the Home page component */
function Home(){
	return(
		<>
			{/* Displays the main hero section */}
			<HeroSection />

			{/* Displays the quick recipe cards */}
			<Cards />
			
		</>
	);
}

/* Exports the Home component for use in other files */
export default Home;