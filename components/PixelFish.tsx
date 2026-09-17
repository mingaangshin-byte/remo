import Link from 'next/link';

export default function PixelFish(){
  return (
    <Link href="/about" className="fish-link" aria-label="Remo 소개로 이동">
      <span className="fish" aria-hidden="true">
        <span className="fish-eye" />
      </span>
    </Link>
  );
}
