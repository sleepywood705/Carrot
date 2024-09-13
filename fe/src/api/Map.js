import './Map.css';
import { useEffect, useRef, useState, useCallback } from 'react';

const KakaoMap = ({ onMapSubmit }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [distance, setDistance] = useState(0);
  const [fuelCost, setFuelCost] = useState('');
  const [taxiCost, setTaxiCost] = useState('');

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

  const setMarker = useCallback((coords, type) => {
    if (!map) return;

    if (type === 'S' && startMarker) {
      startMarker.setMap(null);
    } else if (type === 'E' && endMarker) {
      endMarker.setMap(null);
    }

    const marker = new window.kakao.maps.Marker({
      position: coords,
      map: map,
      title: type,
      image: new window.kakao.maps.MarkerImage(
        `https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png`,
        new window.kakao.maps.Size(24, 35)
      )
    });

    if (type === 'S') {
      setStartMarker(marker);
    } else if (type === 'E') {
      setEndMarker(marker);
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
        if (data.features && data.features.length > 0) {
          data.features.forEach(feature => {
            if (feature.geometry.type === "LineString") {
              feature.geometry.coordinates.forEach(coord => {
                path.push(new window.kakao.maps.LatLng(coord[1], coord[0]));
              });
            }
            if (feature.properties && feature.properties.distance) {
              newDistance += feature.properties.distance;
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
          calculateCosts(newDistance);
        } else {
          alert('경로를 찾을 수 없습니다.');
        }
      })
      .catch(error => console.error('경로 가져오기 실패:', error));
  }, [map, polyline]);

  const calculateCosts = useCallback((distance) => {
    const distanceKm = distance / 1000;
    const fuelPrice = 1800;
    const fuelEfficiency = 10;
    const fuelCost = (distanceKm / fuelEfficiency) * fuelPrice;
    setFuelCost(`기름값: 약 ${fuelCost.toFixed(0)}원`);

    const baseFare = 4000;
    const per100mFare = 132;
    const taxiCost = baseFare + (distance / 100 * per100mFare);
    setTaxiCost(`택시비: 약 ${taxiCost.toFixed(0)}원`);
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const startName = event.target.startName.value.trim();
    const endName = event.target.endName.value.trim();

    if (!startName || !endName) {
      alert('출발지와 도착지 이름을 모두 입력해 주세요.');
      return;
    }

    searchPlaceByName(startName, 'S', (startCoords) => {
      searchPlaceByName(endName, 'E', (endCoords) => {
        drawRoute(startCoords, endCoords);
        if (onMapSubmit) {
          onMapSubmit({ startName, endName, distance, fuelCost, taxiCost });
        }
      });
    });
  }, [searchPlaceByName, drawRoute, distance, fuelCost, taxiCost, onMapSubmit]);
  
  if (!kakaoLoaded) {
    return <div>카카오맵을 로딩 중입니다...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="right PostingForm">
      <div className="a">
        <h2>경로 검색</h2>
        <div className="map-view" ref={mapRef}></div>
      </div>
      <div className="a">
        <h2>비용 계산 결과</h2>
        <div className="cost-result">
          <p>{fuelCost}</p>
          <p>{taxiCost}</p>
        </div>
      </div>
      <div className="a">
        <div className="c">
          <input type="text" id="startName" name="startName" placeholder="출발지 이름을 입력하세요" required />
          <input type="text" id="endName" name="endName" placeholder="도착지 이름을 입력하세요" required />
        </div>
      </div>
      <button type="submit">경로 검색</button>
    </form>
  );
};

export default KakaoMap;