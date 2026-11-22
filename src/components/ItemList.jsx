import Item from './Item';

export default function ItemList({ food, isLoading}) {
	return ( 
	   <div>
	   		{isLoading? (
	   			/* Displays while ingredients are loading */
	   			<p>Loading ingredients...</p>
	   		) : (

	   		  /* Displays each ingredient using the Item component */
	   		  food.extendedIngredients?.map((item, index) => (

	   		  	 /* Combines the ingredient ID and index to create a unique key */
		 	     <Item 
		 	        key={`${item.id}-${index}`}
                    item={item}
		 	     />
		      ))
	   	   )}
	   </div>
    );
}