
/* Imports the files needed for the CardItem component */
import React from 'react';

/* Creates a reusable card component that receives information through props */
function CardItem(props) {

    return (
        /* Creates a list item to contain the recipe card */
        <li className="cards__item">

            {/* Makes the entire card clickable */}
            <button
                type="button"
                className="cards__item__link cards__item__button"
                onClick={props.onClick}
            >

                {/* Displays the recipe image and category label */}
                <figure
                    className="cards__item__pic-wrap"
                    data-category={props.label}
                >
                    <img
                        src={props.src}
                        alt={props.label}
                        className="cards__item__img"
                    />
                </figure>

                {/* Contains the description of the recipe */}
                <div className="cards__item__info">
                    <h5 className="cards__item__text">
                        {props.text}
                    </h5>
                </div>

            </button>
        </li>
    );
}

/* Exports the CardItem component for use in other files */
export default CardItem;
