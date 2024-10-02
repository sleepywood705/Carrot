export function FilterButtons({ onFilterChange, onWriteClick }) {
    const filters = ["전체", "택시", "운전자", "탑승자"];
    const filtersClass = ["butn_all", "butn_taxi", "butn_driver", "butn_passenger"];
    const filterImages = [null, "/img/taxi.png", "/img/wheel.png", "/img/siren.png"];
  
    return (
      <div id="FilterButtons">
        {filters.map((filter, index) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={filtersClass[index]}
          >
            {filterImages[index] && <img src={filterImages[index]} />}
            {filter}
          </button>
        ))}
        <button className="butn_write" onClick={onWriteClick}>
          <img src="/img/plus.png" />
        </button>
      </div>
    );
  }