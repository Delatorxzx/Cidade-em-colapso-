import Image from 'next/image'

const SMOKE = [
  { left: '18%', top: '30%', size: '22%', delay: '0s', dur: '9s', drift: '20px' },
  { left: '62%', top: '22%', size: '26%', delay: '2s', dur: '11s', drift: '-15px' },
  { left: '8%', top: '52%', size: '20%', delay: '4s', dur: '10s', drift: '25px' },
  { left: '72%', top: '46%', size: '24%', delay: '1s', dur: '12s', drift: '10px' },
  { left: '40%', top: '35%', size: '22%', delay: '5s', dur: '9.5s', drift: '-20px' },
  { left: '28%', top: '62%', size: '26%', delay: '3s', dur: '13s', drift: '18px' },
  { left: '82%', top: '64%', size: '20%', delay: '6s', dur: '10s', drift: '-10px' },
  { left: '52%', top: '58%', size: '24%', delay: '7s', dur: '11s', drift: '14px' },
  { left: '4%', top: '18%', size: '22%', delay: '2.5s', dur: '12s', drift: '22px' },
  { left: '88%', top: '28%', size: '22%', delay: '4.5s', dur: '9s', drift: '-18px' },
]

const TINTS = [
  'transparent',
  'linear-gradient(180deg, rgba(16,28,44,0.15), rgba(16,28,44,0.35))',
  'linear-gradient(180deg, rgba(16,28,44,0.25), rgba(224,138,62,0.18))',
  'linear-gradient(180deg, rgba(16,28,44,0.35), rgba(201,74,69,0.28))',
  'linear-gradient(180deg, rgba(10,18,29,0.55), rgba(201,74,69,0.42))',
]

export function CityEffects({ level, effects }: { level: number; effects: boolean }) {
  const brightness = 1 - (level - 1) * 0.09
  const saturation = 1 - (level - 1) * 0.12
  const smokeCount = effects ? Math.min(SMOKE.length, (level - 1) * 3 + 1) : 0

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <Image
        src="/images/city-center.png"
        alt=""
        fill
        priority
        sizes="70vh"
        className="object-cover transition-[filter] duration-1000"
        style={{ filter: `brightness(${brightness}) saturate(${saturation}) contrast(1.05)` }}
      />
      <div className="absolute inset-0 transition-[background] duration-1000" style={{ background: TINTS[level - 1] }} />

      {SMOKE.slice(0, smokeCount).map((s, i) => (
        <span
          key={i}
          className="smoke-puff"
          style={
            {
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              '--delay': s.delay,
              '--dur': s.dur,
              '--drift': s.drift,
            } as React.CSSProperties
          }
        />
      ))}

      {effects && level >= 3 && (
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 animate-flicker"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(224,138,62,0.35), transparent 70%)' }}
        />
      )}

      {effects && level >= 4 && (
        <>
          <div
            className="emergency-light absolute inset-0"
            style={{ background: 'radial-gradient(circle at 0% 50%, rgba(201,74,69,0.45), transparent 45%)' }}
          />
          <div
            className="emergency-light absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 100% 50%, rgba(201,74,69,0.45), transparent 45%)',
              animationDelay: '0.8s',
            }}
          />
        </>
      )}

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,18,29,0.75) 100%)' }}
      />
    </div>
  )
}
