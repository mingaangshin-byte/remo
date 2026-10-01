'use client';

import { useState, type FormEvent } from 'react';

type InquiryType = '일반 문의' | '프로젝트 문의' | '협업 문의';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      inquiryType: String(formData.get('inquiryType') ?? '일반 문의'),
      title: String(formData.get('title') ?? ''),
      content: String(formData.get('content') ?? ''),
      consent: formData.get('consent') === 'on',
    };

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? '문의 접수에 실패했습니다.');

      form.reset();
      setStatus('sent');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.');
    }
  }

  return (
    <main className="page">
      <section className="content">
        <div className="page-hero">
          <div>
            <p className="eyebrow">GET IN TOUCH</p>
            <h1 className="pixel">Contact</h1>
            <p>궁금한 점이 있으신가요? 언제든지 문의해주세요.</p>
          </div>
        </div>
        <div className="contact-layout">
          <form className="form-card" onSubmit={handleSubmit}>
            <label>이름<input name="name" required maxLength={100} /></label>
            <label>이메일<input name="email" required type="email" maxLength={254} /></label>
            <label>문의 유형
              <select name="inquiryType" defaultValue="일반 문의">
                <option>일반 문의</option>
                <option>프로젝트 문의</option>
                <option>협업 문의</option>
              </select>
            </label>
            <label>제목<input name="title" required maxLength={200} /></label>
            <label>내용<textarea name="content" required maxLength={10000} /></label>
            <label className="check"><input name="consent" type="checkbox" required /> 개인정보 수집 및 이용에 동의합니다.</label>
            <button className="primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? '접수 중...' : '문의하기'}
            </button>
            {status === 'sent' && <p role="status">문의가 정상적으로 접수되었습니다.</p>}
            {status === 'error' && <p role="alert">{errorMessage}</p>}
          </form>
          <div className="notice-card">
            <h2 className="pixel">문의 게시판</h2>
            <p>문의 내용을 작성하면 안전하게 접수되어 관리자가 확인할 수 있습니다.</p>
            <div className="notice"><span>안내</span><b>문의 접수 후 확인까지 시간이 걸릴 수 있습니다.</b></div>
          </div>
        </div>
      </section>
    </main>
  );
}
