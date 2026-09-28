// The 2021 circle-K mark (originally inline in public/index.html) —
// real, stays. Single source so it's never hand-copied into a second
// file and drifts.
export default function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 327.68 327.69" aria-hidden="true">
      <path
        fill="var(--signature)"
        d="M183.77,16.31A163.85,163.85,0,1,0,347.6,180.16,163.85,163.85,0,0,0,183.77,16.31ZM86.05,97.37h47.89V125c-31.92,16.47-47.89,50-47.89,50ZM133.93,263H86V185.24s16,33.57,47.9,50Zm147.56,0H235.57s-71.69-15.32-112.74-82.41c41.05-67.12,112.74-83.18,112.74-83.18h45.92C237.87,110,194,153.44,170,180.44,194,207.21,237.87,250.32,281.49,263Z"
        transform="translate(-19.92 -16.31)"
      />
    </svg>
  );
}
