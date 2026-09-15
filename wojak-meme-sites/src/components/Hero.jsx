export default function Hero({ config }) {
  const heroImage = config.images[0]?.image;

  return (
    <section className="hero">
      {heroImage && (
        <div className="hero-visual">
          <img src={heroImage} alt={`${config.ticker} character`} className="hero-image" />
        </div>
      )}
      {config.slogan && <p className="hero-slogan">{config.slogan}</p>}
      <a className="btn btn-primary hero-cta" href="#draw">
        {config.tagText}
      </a>
    </section>
  );
}
