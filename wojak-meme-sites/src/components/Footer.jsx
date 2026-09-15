export default function Footer({ config }) {
  return (
    <footer className="site-footer">
      <a href={config.social.twitter} target="_blank" rel="noopener noreferrer">
        X
      </a>
      <a href={config.social.telegram} target="_blank" rel="noopener noreferrer">
        Telegram
      </a>
    </footer>
  );
}
