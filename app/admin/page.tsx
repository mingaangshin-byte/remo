import Link from 'next/link';
export default function Admin(){return <main className="admin-page"><h1 className="pixel">REMO ADMIN</h1><p>안녕하세요, remo_admin님</p><div className="stats"><div>전체 멤버<b>10명</b></div><div>프로젝트 수<b>4개</b></div><div>문의 수<b>12개</b></div></div><div className="admin-card"><h2>빠른 관리</h2><Link href="/about">팀 정보 보기</Link><Link href="/projects">프로젝트 관리 보기</Link></div></main>}
