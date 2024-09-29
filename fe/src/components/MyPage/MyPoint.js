import { useState, useEffect } from "react";
import axios from '../../api/axios';

export function MyPoint({ user }) {

  return (
    <div id="MyPoint">
      <h2>내 포인트</h2>
      <div className="currentPoint">{user.point}</div>
      <h3>포인트 내역</h3>
      <ul>
        <li className="pointHistory"></li>
      </ul>
    </div>
  );
}