import "./Poster.css";
import Map from "../api/Map.js";
import { PosterForm } from "./PosterForm";
import React, { useState, useEffect } from "react";


export function Poster({ isOpen, onClose, onSubmit }) {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") { onClose(); }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // handleMapSubmit 함수 정의
  const handleMapSubmit = (data) => {
    console.log('Map data received:', data); // 데이터 확인
    if (!mapData || mapData.from !== data.startName || mapData.to !== data.endName) {
      setMapData({
        from: data.startName,
        to: data.endName,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div id="Post">
      <Map onMapSubmit={handleMapSubmit} />
      <PosterForm onSubmit={onSubmit} onClose={onClose} mapData={mapData} />
    </div>
  );
}

