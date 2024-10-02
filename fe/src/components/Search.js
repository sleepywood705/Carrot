export function Search({ onSearch }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const newSearchParams = {
      departure: event.target.departure.value,
      arrival: event.target.arrival.value,
      date: event.target.tripDate.value,
    };
    onSearch(newSearchParams);
  };

  return (
    <section id="Search">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="departure"
          placeholder="출발지"
        />
        <input
          type="text"
          id="arrival"
          placeholder="도착지"
        />
        <input
          type="date"
          id="tripDate"
        />
        <button
          type="submit"
          className="butn_search"
        >
          검색
        </button>
      </form>
    </section>
  );
}