import styles from "../css/item.module.css";

function convertToFraction(amount) {
    const fractions = {
        0.125: "1/8",
        0.25: "1/4",
        0.333: "1/3",
        0.375: "3/8",
        0.5: "1/2",
        0.625: "5/8",
        0.667: "2/3",
        0.75: "3/4",
        0.875: "7/8"
    };

    return fractions[amount] || amount;
}

export default function Item({ item }) {
	return (
	    <div className={styles.itemContainer}>
		   <ul>
              <li>
                 <span className={styles.amount}>
                    {convertToFraction(item.amount)} {item.unit}
                 </span>{" "}
                 <span className={styles.name}>
                    {item.name}
                 </span>
               </li>
           </ul>
        </div>
    );
}