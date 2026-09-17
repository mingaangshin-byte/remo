import {members, teamTimeline} from '@/lib/data';

export default function About(){
  return (
    <main className="page">
      <section className="content about-content">
        <div className="page-hero">
          <div>
            <p className="eyebrow">TEAM COMPANY</p>
            <h1 className="pixel">REMO</h1>
            <p className="about-lead">한계를 두지 않고, 끊임없이 모험하는 팀</p>
          </div>
        </div>

        <section className="section identity-section">
          <p className="eyebrow">01 · IDENTITY</p>
          <h2>팀 이름과 정체성</h2>
          <div className="identity-grid">
            <article>
              <h3>팀 이름 유래 / 의미</h3>
              <p><strong>limit + 無 + ver</strong></p>
              <p>한계가 없는 팀, 한계를 정하지 않는 팀이라는 의미를 담아 <em>Remover</em>가 제안되었습니다. 이후 ‘니모(니모를 찾아서)’와 어감이 비슷한 <strong>REMO</strong>로 발전시켜 모험을 두려워하지 않는 팀이라는 의미를 더했습니다.</p>
            </article>
            <article>
              <h3>팀 슬로건 / 한 줄 정의</h3>
              <p className="slogan">우리의 가능성에 한계를 두지 않고,<br/>두려워도 끊임없이 도전하는 팀</p>
            </article>
          </div>
        </section>

        <section className="section">
          <p className="eyebrow">02 · BACKGROUND</p>
          <h2>팀 배경 소개</h2>
          <div className="team-facts">
            <div><span>소속</span><strong>몬드라곤 경영대학 LEINN 학과 서울랩 6기</strong></div>
            <div><span>형태</span><strong>학생 협동조합</strong></div>
            <div><span>결성 시기</span><strong>2025년 8월 18일</strong></div>
            <div><span>팀원 수</span><strong>10명</strong></div>
          </div>
        </section>

        <section className="section">
          <p className="eyebrow">03 · TIMELINE</p>
          <h2>REMO의 시작</h2>
          <div className="timeline">{teamTimeline.map(([date,title,desc])=><div className="timeline-item" key={date}><strong>{date}</strong><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div>
        </section>

        <section className="section">
          <p className="eyebrow">04 · ARCHIVE</p>
          <h2>팀 활동 사진</h2>
          <div className="gallery">{[1,2,3,4].map(i=><div className="gallery-img" key={i}><span>PHOTO {i}</span></div>)}</div>
        </section>

        <section className="section">
          <p className="eyebrow">05 · MEMBERS</p>
          <h2>팀원 소개</h2>
          <div className="members">{members.map((m,index)=><article className="member" key={m.name}><div className="avatar">{index+1}</div><h3>{m.name}</h3></article>)}</div>
        </section>
      </section>
    </main>
  );
}
