import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const allowedTypes = new Set(['일반 문의', '프로젝트 문의', '협업 문의']);

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: '서버 데이터베이스 설정이 완료되지 않았습니다.' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const inquiryType = typeof body.inquiryType === 'string' ? body.inquiryType : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const consent = body.consent === true;

    if (!name || name.length > 100) {
      return NextResponse.json({ error: '이름을 입력해주세요. (최대 100자)' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: '올바른 이메일 주소를 입력해주세요.' }, { status: 400 });
    }
    if (!allowedTypes.has(inquiryType)) {
      return NextResponse.json({ error: '문의 유형을 확인해주세요.' }, { status: 400 });
    }
    if (!title || title.length > 200 || !content || content.length > 10000) {
      return NextResponse.json({ error: '제목 또는 내용의 길이를 확인해주세요.' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: '개인정보 수집 및 이용에 동의해주세요.' }, { status: 400 });
    }

    const sql = neon(databaseUrl);
    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(254) NOT NULL,
        inquiry_type VARCHAR(40) NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        consent BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    const rows = await sql`
      INSERT INTO inquiries (name, email, inquiry_type, title, content, consent)
      VALUES (${name}, ${email}, ${inquiryType}, ${title}, ${content}, ${consent})
      RETURNING id, created_at
    `;

    return NextResponse.json({ success: true, inquiry: rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: '문의 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
