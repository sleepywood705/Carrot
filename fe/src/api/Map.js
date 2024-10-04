import '../components/Poster.css'
import { useEffect, useRef, useState, useCallback } from 'react';

const KakaoMap = ({ onMapSubmit, initialDeparture, initialArrival }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [distance, setDistance] = useState(0);
  const [fuelCost, setFuelCost] = useState('');
  const [taxiCost, setTaxiCost] = useState('');
  const [duration, setDuration] = useState(0);

  const [startName, setStartName] = useState(initialDeparture); // 출발지 상태
  const [endName, setEndName] = useState(initialArrival); // 도착지 상태

  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=c2828d7dee20f4b50bd4e887a055a84b&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log('Kakao Maps API loaded');
        setKakaoLoaded(true);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

    const mapOption = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3
    };
    const newMap = new window.kakao.maps.Map(mapRef.current, mapOption);
    setMap(newMap);
  }, []);

  useEffect(() => {
    if (kakaoLoaded && !map) {
      initMap();
    }
  }, [kakaoLoaded, map, initMap]);

  const searchPlaceByName = useCallback((placeName, markerType, callback) => {
    if (!map || !window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error('카카오맵 서비스가 로드되지 않았습니다.');
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(placeName, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const place = data[0];
        const coords = new window.kakao.maps.LatLng(place.y, place.x);
        map.setCenter(coords);
        setMarker(coords, markerType);
        if (callback) callback(coords);
      } else {
        alert(`${placeName}을(를) 찾을 수 없습니다. 다른 이름을 시도해 보세요.`);
      }
    });
  }, [map]);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateCosts = useCallback((distance) => {
    const distanceKm = distance / 1000;
    const fuelPrice = 1800;
    const fuelEfficiency = 10;
    const fuelCost = (distanceKm / fuelEfficiency) * fuelPrice;
    setFuelCost(`기름값: 약 ${numberWithCommas(fuelCost.toFixed(0))}원`);

    const baseFare = 4000;
    const per100mFare = 132;
    const taxiCost = baseFare + (distance / 100 * per100mFare);
    setTaxiCost(`택시비: 약 ${numberWithCommas(taxiCost.toFixed(0))}원`);
  }, []);

  const setMarker = useCallback((coords, type) => {
    if (!map) return;

    if (type === 'S' && startMarker) {
      startMarker.setMap(null);
    } else if (type === 'E' && endMarker) {
      endMarker.setMap(null);
    }

    let markerColor, markerText;
    switch(type) {
      case 'S':
        markerColor = '#ff7f00'; // 출발지 색상
        markerText = '출';
        break;
      case 'E':
        markerColor = '#FF0000'; // 도착지 색상
        markerText = '도';
        break;
      default:
        markerColor = '#0000FF';
        markerText = '경';
    }

    const content = `
      <div style="
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      ">
        <div style="
          background-color: ${markerColor};
          border: 2px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          width: 18px;
          height: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        ">
          <span style="
            color: white;
            transform: rotate(45deg);
            font-weight: bold;
            font-size: 0.625rem;
          ">${markerText}</span>
        </div>
      </div>
    `;

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: coords,
      content: content,
      zIndex: 3
    });

    customOverlay.setMap(map);

    if (type === 'S') {
      setStartMarker(customOverlay);
    } else if (type === 'E') {
      setEndMarker(customOverlay);
    }

    // 두 마커가 모두 설정되었을 때 경계를 업데이트합니다
    if (startMarker && endMarker) {
      const newBounds = new window.kakao.maps.LatLngBounds();
      newBounds.extend(startMarker.getPosition());
      newBounds.extend(endMarker.getPosition());
      setBounds(newBounds);
      map.setBounds(newBounds);
    }
  }, [map, startMarker, endMarker]);

  const drawRoute = useCallback((startCoords, endCoords) => {
    if (polyline) {
      polyline.setMap(null);
    }

    const tmapKey = 'wqfQUHgfrF9iw5X1Csutj9uNrAyZqVmU5xZbXapt';
    const tmapUrl = `https://apis.openapi.sk.com/tmap/routes?version=1&format=json&startX=${startCoords.getLng()}&startY=${startCoords.getLat()}&endX=${endCoords.getLng()}&endY=${endCoords.getLat()}&appKey=${tmapKey}`;

    fetch(tmapUrl)
      .then(response => response.json())
      .then(data => {
        const path = [];
        let newDistance = 0;
        let newDuration = 0;
        if (data.features && data.features.length > 0) {
          data.features.forEach(feature => {
            if (feature.geometry.type === "LineString") {
              feature.geometry.coordinates.forEach(coord => {
                path.push(new window.kakao.maps.LatLng(coord[1], coord[0]));
              });
            }
            if (feature.properties) {
              if (feature.properties.totalDistance) {
                newDistance = feature.properties.totalDistance;
              }
              if (feature.properties.totalTime) {
                newDuration = feature.properties.totalTime;
              }
            }
          });

          const newPolyline = new window.kakao.maps.Polyline({
            path: path,
            strokeWeight: 5,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeStyle: 'solid'
          });
          newPolyline.setMap(map);
          setPolyline(newPolyline);
          setDistance(newDistance);
          setDuration(newDuration);
          calculateCosts(newDistance);

          // 경로가 그려진 후 경계를 업데이트합니다
          const routeBounds = new window.kakao.maps.LatLngBounds();
          path.forEach(coord => routeBounds.extend(coord));
          setBounds(routeBounds);
          map.setBounds(routeBounds);
        } else {
          alert('경로를 찾을 수 없습니다.');
        }
      })
      .catch(error => console.error('경로 가져오기 실패:', error));
  }, [map, polyline, calculateCosts]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const start = startName.trim();
    const end = endName.trim();

    if (!start || !end) {
      alert('출발지와 도착지 이름을 모두 입력해 주세요.');
      return;
    }

    searchPlaceByName(start, 'S', (startCoords) => {
      searchPlaceByName(end, 'E', (endCoords) => {
        drawRoute(startCoords, endCoords);
        if (onMapSubmit) {
          onMapSubmit({ startName: start, endName: end, distance, fuelCost, taxiCost });
        }
      });
    });
  }, [searchPlaceByName, drawRoute, distance, fuelCost, taxiCost, onMapSubmit, startName, endName]);

  useEffect(() => {
    if (initialDeparture) {
      setStartName(initialDeparture); // 초기 출발지 설정
    }
    if (initialArrival) {
      setEndName(initialArrival); // 초기 도착지 설정
    }
  }, [initialDeparture, initialArrival]);

  if (!kakaoLoaded) {
    return <div>카카오맵을 로딩 중입니다...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="PostingForm">
      <div className="row">
     
        <div id="Map" ref={mapRef}></div>
      </div>
      <div className="row">
       
        <div className="outline">
          <input 
            type="text" 
            id="startName" 
            name="startName" 
            placeholder="출발지 이름을 입력하세요" 
            value={startName}
            onChange={(e) => setStartName(e.target.value)}
            required 
          />
          <input 
            type="text" 
            id="endName" 
            name="endName" 
            placeholder="도착지 이름을 입력하세요" 
            value={endName} // 상태를 입력 필드에 연결
            onChange={(e) => setEndName(e.target.value)} // 상태 업데이트
            required 
          />
        </div>
      </div>
      <div className="row">
        <h2>비용 계산 결과</h2>
        <div className="costResult"> 
          <p>거리 : {(distance / 1000).toFixed(2)} km</p>
          <p>예상 시간 : {Math.round(duration / 60)} 분</p>
        </div>
        <div className="costResult">
          <p>{fuelCost}</p>
          <p>{taxiCost}</p>
        </div>
      </div>
      <div className="wrap_btn">
        <button type="submit">경로 검색</button>
      </div>
    </form>
  );
};

export default KakaoMap;
