export default function DrawButton({ label, isLoading, onDraw }) {
  return (
    <button className="btn btn-primary draw-button" onClick={onDraw} disabled={isLoading}>
      {isLoading ? '🎲 Rolling...' : label}
    </button>
  );
}
