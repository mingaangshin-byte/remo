import PixelFish from '@/components/PixelFish';

export default function Home(){
  return (
    <main className="home ocean-page">
      <section className="hero">
        <div className="hero-copy">
          <h1 className="pixel">REMO</h1>
          <p>한계를 두지 않고, 끊임없이 모험하는 팀</p>
        </div>
        <PixelFish />
        <span className="roaming-fish fish-two" aria-hidden="true" />
        <span className="roaming-fish fish-three" aria-hidden="true" />
      </section>
    </main>
  );
}
