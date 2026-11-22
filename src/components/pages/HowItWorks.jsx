/* Imports the files needed for the HowItWorks component */
import React from 'react';
import styles from '../../css/howitworks.module.css';

function HowItWorks() {
  return (
    <div className={styles.howItWorksContainer}>

      {/* Page heading */}
      <h1>How to Use Recipe Search</h1>

      {/* Instructions for using the recipe search */}
      <section className={styles.searchHelp}>

        <div className={styles.helpSteps}>

          {/* First step */}
          <div className={styles.helpStep}>
            <span className={styles.stepNumber}>1</span>
            <h3>Search for a Recipe</h3>
            <p>
              Enter a recipe name or keyword to find dishes
              that match what you are looking for.
            </p>
          </div>

          {/* Second step */}
          <div className={styles.helpStep}>
            <span className={styles.stepNumber}>2</span>
            <h3>Enter Your Ingredients</h3>
            <p>
              List ingredients separated by commas to find
              recipes using ingredients you already have.
            </p>
          </div>

          {/* Third step */}
          <div className={styles.helpStep}>
            <span className={styles.stepNumber}>3</span>
            <h3>Customize Your Search</h3>
            <p>
              Select your preferred cooking time and dietary
              requirements to narrow down your results.
            </p>
          </div>

        </div>
      </section>

      {/* Tips for getting better recipe results */}
      <section className={styles.searchTips}>

        <h2>Tips for Better Results</h2>

        <ul>
          <li>
            <strong>Be specific: </strong> Use clear recipe names
            or keywords when searching.
          </li>

          <li>
            <strong>Separate ingredients with commas: </strong>
            For example, chicken, potatoes, carrots, and onions.
          </li>

          <li>
            <strong>Set a realistic cooking time: </strong>
            Choose a time that fits your schedule.
          </li>

          <li>
            <strong>Choose your dietary preference: </strong>
            Apply the dietary filter that matches your needs.
          </li>

          <li>
            <strong>Combine your filters: </strong>
            Use multiple search options together to find
            recipes that better match your preferences.
          </li>
        </ul>

      </section>

    </div>
  );
}

/* Exports the HowItWorks component */
export default HowItWorks;
