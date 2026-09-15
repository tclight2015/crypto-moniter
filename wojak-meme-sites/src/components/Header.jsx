export default function Header({ config }) {
  return (
    <header className="site-header">
      <div className="logo">{config.ticker}</div>
      <a className="btn btn-primary" href="#buy">
        Buy {config.ticker}
      </a>
    </header>
  );
}
