import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function makeCoupon() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MOOD-';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: '서버 데이터베이스 설정이 완료되지 않았습니다.' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const purchaseIntent = typeof body.purchaseIntent === 'string' ? body.purchaseIntent : '';
    const improvement = typeof body.improvement === 'string' ? body.improvement.trim() : '';
    const gender = typeof body.gender === 'string' ? body.gender : null;
    const ageGroup = typeof body.ageGroup === 'string' ? body.ageGroup : null;
    const styles = Array.isArray(body.styles) ? body.styles.filter((x: unknown) => typeof x === 'string') : [];
    const consent = body.consent === true;

    if (!['yes', 'maybe', 'improve'].includes(purchaseIntent)) {
      return NextResponse.json({ error: '구매 의향을 선택해주세요.' }, { status: 400 });
    }
    if (improvement.length > 2000) {
      return NextResponse.json({ error: '개선 의견은 2,000자 이내로 작성해주세요.' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: '설문 응답 수집에 동의해주세요.' }, { status: 400 });
    }

    const sql = neon(databaseUrl);
    await sql`
      CREATE TABLE IF NOT EXISTS moodism_surveys (
        id BIGSERIAL PRIMARY KEY,
        purchase_intent VARCHAR(20) NOT NULL,
        improvement TEXT,
        gender VARCHAR(30),
        age_group VARCHAR(30),
        styles TEXT[] NOT NULL DEFAULT '{}',
        consent BOOLEAN NOT NULL DEFAULT TRUE,
        coupon_code VARCHAR(30) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    let couponCode = makeCoupon();
    for (let i = 0; i < 5; i++) {
      try {
        await sql`
          INSERT INTO moodism_surveys
            (purchase_intent, improvement, gender, age_group, styles, consent, coupon_code)
          VALUES
            (${purchaseIntent}, ${improvement || null}, ${gender}, ${ageGroup}, ${styles}, ${consent}, ${couponCode})
        `;
        return NextResponse.json({ success: true, couponCode }, { status: 201 });
      } catch (error) {
        if (i === 4) throw error;
        couponCode = makeCoupon();
      }
    }

    return NextResponse.json({ error: '설문 저장에 실패했습니다.' }, { status: 500 });
  } catch {
    return NextResponse.json({ error: '설문 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
