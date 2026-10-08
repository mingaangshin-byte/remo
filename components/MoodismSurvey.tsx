'use client';

import { FormEvent, useState } from 'react';

const styleOptions = ['미니멀', '캐주얼', '스트리트', '빈티지', '페미닌', '아메카지', '모던', '기타'];
const ageOptions = ['10대', '20대', '30대', '40대', '50대 이상'];
const genderOptions = ['여성', '남성', '논바이너리', '응답하지 않음'];
const purchaseOptions = [
  { value: 'yes', label: '사고 싶어요', note: '출시되면 구매할 의향이 있어요' },
  { value: 'maybe', label: '아직 고민돼요', note: '조금 더 보고 결정하고 싶어요' },
  { value: 'improve', label: '개선되면 사고 싶어요', note: '몇 가지가 바뀐다면 구매할 것 같아요' },
];

export default function MoodismSurvey() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [coupon, setCoupon] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    // React의 이벤트 객체는 비동기 작업(await) 이후 currentTarget이 null이 될 수 있으므로
    // submit 시작 시 form element를 별도로 보관합니다.
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      purchaseIntent: String(data.get('purchaseIntent') || ''),
      improvement: String(data.get('improvement') || ''),
      gender: String(data.get('gender') || ''),
      ageGroup: String(data.get('ageGroup') || ''),
      styles: data.getAll('styles').map(String),
      consent: data.get('consent') === 'on',
    };

    try {
      const response = await fetch('/api/moodism/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '설문 제출에 실패했습니다.');
      setCoupon(result.couponCode);
      setStatus('done');
      form.reset();
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : '잠시 후 다시 시도해주세요.');
    }
  }

  if (status === 'done') {
    return (
      <div className="moodism-page">
        <section className="moodism-success">
          <p className="moodism-kicker">THANK YOU FOR DREAMING WITH US</p>
          <h1>Anxious,<br />still dreaming.</h1>
          <p className="success-copy">당신의 응답이 다음 무디즘을 만드는 데 쓰입니다.</p>
          <div className="coupon-card">
            <span>MOODISM SURVEY COUPON</span>
            <strong>{coupon}</strong>
            <p>홈페이지에서 사용할 수 있는 10% 할인 쿠폰</p>
          </div>
          <button className="moodism-button" onClick={() => navigator.clipboard?.writeText(coupon)}>
            쿠폰 코드 복사
          </button>
          <button className="text-button" onClick={() => { setStatus('idle'); setCoupon(''); }}>
            랜딩으로 돌아가기
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="moodism-page">
      <nav className="moodism-nav">
        <span>MOODISM</span>
        <span>01 / FIRST PIECE</span>
      </nav>

      <section className="moodism-hero">
        <div className="hero-text">
          <p className="moodism-kicker">MOODISM 001</p>
          <h1>Anxious,<br /><em>still dreaming.</em></h1>
          <p className="hero-lead">불안은, 아직 꿈을 포기하지 않았다는 증거입니다.</p>
          <a href="#survey" className="moodism-button">이 옷에 대한 의견 남기기 ↓</a>
        </div>
        <div className="garment-visual" aria-label="버건디와 차콜 컬러의 변형 가능한 롱슬리브">
          <div className="garment burgundy"><i /><b /><span>01</span></div>
          <div className="garment charcoal"><i /><b /><span>02</span></div>
        </div>
      </section>

      <section className="moodism-statement">
        <p className="moodism-kicker">WHY THIS SHIRT?</p>
        <h2>하나의 옷,<br />여러 가지의 나.</h2>
        <div className="statement-grid">
          <p>오늘은 딱 맞게.<br />내일은 조금 느슨하게.</p>
          <p>레이어드할 때도,<br />혼자 입을 때도.</p>
          <p>약속이 있는 날도,<br />갑자기 일정이 바뀐 날도.</p>
        </div>
        <p className="statement-foot">등의 단추와 어깨의 단추를 이용해 실루엣과 착용 방식을 바꿀 수 있습니다.</p>
      </section>

      <section className="moodism-detail">
        <div><span>01</span><h3>BACK BUTTON</h3><p>등의 단추를 조절해 몸에 맞는 정도와 실루엣을 바꿉니다.</p></div>
        <div><span>02</span><h3>SHOULDER BUTTON</h3><p>어깨를 열고 닫으며 레이어드와 스타일링의 선택지를 만듭니다.</p></div>
        <div><span>03</span><h3>ALL SEASON</h3><p>단독으로, 레이어드로. 한 계절에만 머물지 않도록 설계했습니다.</p></div>
      </section>

      <section className="moodism-survey" id="survey">
        <div className="survey-intro">
          <p className="moodism-kicker">BEFORE WE MAKE IT</p>
          <h2>이 옷,<br />당신이라면 어떻게 입을까요?</h2>
          <p>구매 의향과 개선 의견을 남겨주세요. 선택 정보는 원할 때만 입력할 수 있습니다.</p>
        </div>

        <form className="survey-form" onSubmit={submit}>
          <fieldset>
            <legend>01. 출시된다면 어떻게 생각하시나요? <small>필수</small></legend>
            <div className="intent-grid">
              {purchaseOptions.map((option) => (
                <label className="choice-card" key={option.value}>
                  <input type="radio" name="purchaseIntent" value={option.value} required />
                  <strong>{option.label}</strong>
                  <span>{option.note}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>02. 개선했으면 하는 점이 있나요?</legend>
            <textarea name="improvement" maxLength={2000} placeholder="가격, 색상, 핏, 디테일, 소재 등 자유롭게 적어주세요." />
          </fieldset>

          <fieldset>
            <legend>03. 조금 더 알려주셔도 좋아요 <small>선택</small></legend>
            <label className="field-label">성별</label>
            <div className="pill-row">
              {genderOptions.map((item) => <label key={item}><input type="radio" name="gender" value={item} /><span>{item}</span></label>)}
            </div>
            <label className="field-label">연령대</label>
            <div className="pill-row">
              {ageOptions.map((item) => <label key={item}><input type="radio" name="ageGroup" value={item} /><span>{item}</span></label>)}
            </div>
            <label className="field-label">평소 스타일 <small>복수 선택 가능</small></label>
            <div className="pill-row">
              {styleOptions.map((item) => <label key={item}><input type="checkbox" name="styles" value={item} /><span>{item}</span></label>)}
            </div>
          </fieldset>

          <label className="privacy-check">
            <input name="consent" type="checkbox" required />
            <span>설문 응답을 제품 개선 목적으로 수집·이용하는 데 동의합니다.</span>
          </label>

          <button className="moodism-submit" disabled={status === 'sending'}>
            {status === 'sending' ? '응답을 저장하고 있어요…' : '응답하고 쿠폰 받기 →'}
          </button>
          {status === 'error' && <p className="survey-error" role="alert">{error}</p>}
        </form>
      </section>

      <footer className="moodism-footer">
        <strong>MOODISM</strong>
        <span>Anxious, still dreaming.</span>
      </footer>
    </div>
  );
}
