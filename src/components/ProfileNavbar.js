import './ProfileNavbar.css';


export function ProfileNavbar({ onClose, username }) {
	return (
		<div className="profile-navbar">
			<button className="close-button" onClick={onClose}>&times;</button>
			<h2>{username}님의 프로필</h2>
			<nav>
				<ul>
					<li><a href="/profile">내 정보</a></li>
					<li><a href="/settings">설정</a></li>
					<li><a href="/messages">메시지</a></li>
					<li><a href="/history">거래 내역</a></li>
				</ul>
			</nav>
		</div>
	);
}