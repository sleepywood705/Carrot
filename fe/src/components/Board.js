export function Board({ isLoading, error, filteredTrips, handleEditClick, userId }) {
  return (
    <section id="Board">
      {isLoading ? (
        <p>데이터를 불러오는 중...</p>
      ) : error ? (
        <p>에러: {error}</p>
      ) : (
        <div className="Board">
          {filteredTrips
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((trip, index) => {

              const reservationCount = trip.reservations ? trip.reservations.length : 0;
              const isUserReserved = trip.reservations &&
                trip.reservations.some(reservation => reservation.bookerId === userId);
              const isReservationClosed = trip.title.endsWith('[예약마감]');

              const titleParts = trip.title.split(" ");
              const genderInfo = titleParts[6];
              const isSameGender = genderInfo === "동성";
              const tripType = titleParts[3].toLowerCase();

              return (
                <div
                  key={trip.id || index}
                  id="Card"
                  onClick={() => handleEditClick(trip)}
                >
                  <div className="row1">
                    <div className="user-name">
                      <span>{trip.author?.name || "알 수 없음"}{" "}</span>
                    </div>
                    <div className="card-title">
                      <div className="user-type">

                        <span className={`type type-${tripType}`}>
                          {titleParts[3]}
                        </span>
                        <span style={{ color: isSameGender ? 'blue' : 'inherit' }}>
                          {titleParts[3] === "택시" ? titleParts[6] : genderInfo}
                        </span>
                      </div>
                      <div
                        className={`switch ${isSameGender ? 'switch-on' : ''}`}
                      >
                        <div className="gear"></div>
                      </div>
                    </div>
                  </div>
                  <div className="row2">
                    <div className="route">
                      <p>출발지<span>{trip.title.split(" ")[0]}</span></p>
                      <p>도착지<span>{trip.title.split(" ")[2]}</span></p>
                    </div>
                    <div className="date">
                      <p>날짜<span>{trip.title.split(" ")[4]}{" "}</span></p>
                      <p>출발<span>{trip.title.split(" ")[5]}</span></p>
                    </div>
                  </div>
                  {(isReservationClosed || reservationCount > 0) && (
                    <div
                      className={`row3 ${isReservationClosed
                          ? 'booking'
                          : reservationCount > 0
                            ? 'booking-finished'
                            : ''
                        }`}
                    >
                       {isReservationClosed ? (
                        "예약 마감"
                      ) : (
                        reservationCount > 0 && (
                          <span className="sparkling-text">
                            {`${reservationCount}명 예약 중`}
                          </span>
                        )
                      )}
                    </div>
                  )}
                  <div className="Cover">
                    {isReservationClosed ? (
                      <img src="/img/finish.png" alt="예약 마감" />
                    ) : (
                      isUserReserved && userId === trip.reservations.find(res => res.bookerId === userId)?.bookerId ? (
                        <img src="/img/booking.png" alt="예약 중" />
                      ) : null
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}