import type { Metadata } from 'next';
import MoodismSurvey from './MoodismSurvey';

export const metadata: Metadata = {
  title: 'MOODISM — Anxious, still dreaming',
  description: '불안해도 계속 꿈꾸는 사람들을 위한 무디즘의 첫 번째 옷.',
};

export default function MoodismPage() {
  return <MoodismSurvey />;
}
