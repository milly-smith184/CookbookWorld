import FoodItem from "./FoodItem";
import styles from "../css/foodlist.module.css";

export default function FoodList({
  foodData,
  setFoodId,
  currentPage,
  setCurrentPage,
  totalPages
}) {

  /* Determines which group of 5 pages is currently displayed */
  const pagesPerGroup = 5;
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);

  /* Calculates the first and last page in the group */
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  /* Creates the page numbers for the current group */
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <>
      <div className={styles.foodList}>
        {foodData.map((food) => (
          <FoodItem
            setFoodId={setFoodId}
            key={food.id}
            food={food}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>

          {/* Previous group */}
          <button
            className={styles.pageButton}
            disabled={currentGroup === 1}
            onClick={() => {
              setCurrentPage(startPage - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Previous
          </button>

          {/* Page numbers */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={
                currentPage === page
                  ? styles.activePage
                  : styles.pageButton
              }
            >
              {page}
            </button>
          ))}

          {/* Next group */}
          <button
            className={styles.pageButton}
            disabled={currentGroup === Math.ceil(totalPages / pagesPerGroup)}
            onClick={() => {
              setCurrentPage(endPage + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next
          </button>

        </div>
      )}
    </>
  );
}