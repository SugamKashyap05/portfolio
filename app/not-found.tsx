import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf-stage">
      <p className="nf-kicker">ERROR 404 · SIGNAL LOST</p>
      <h1 className="nf-title">LOST IN SPACE</h1>
      <p className="nf-lede">
        This telemetry does not correspond to any known waypoint.
      </p>
      <Link href="/" className="btn">
        RETURN TO LAUNCHPAD ↗
      </Link>
    </main>
  );
}
