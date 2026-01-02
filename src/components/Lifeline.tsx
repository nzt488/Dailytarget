interface LifelineProps {
  points: Array<{ date: string; value: number }>;
}

export function Lifeline({ points }: LifelineProps) {
  if (points.length === 0) return null;

  const width = 800;
  const height = 200;
  const padding = 40;

  const maxValue = 100;
  const minValue = 0;

  const xScale = (index: number) => {
    return padding + (index / (points.length - 1 || 1)) * (width - padding * 2);
  };

  const yScale = (value: number) => {
    return (
      height -
      padding -
      ((value - minValue) / (maxValue - minValue)) * (height - padding * 2)
    );
  };

  const pathData = points
    .map((point, index) => {
      const x = xScale(index);
      const y = yScale(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const lastValue = points[points.length - 1]?.value || 50;
  const color =
    lastValue >= 70 ? 'rgb(34, 197, 94)' : lastValue >= 40 ? 'rgb(234, 179, 8)' : 'rgb(239, 68, 68)';

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded p-6">
      <div className="mb-4">
        <h2 className="text-xs text-neutral-500 uppercase tracking-wider">Lifeline</h2>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: '200px' }}
      >
        <line
          x1={padding}
          y1={yScale(50)}
          x2={width - padding}
          y2={yScale(50)}
          stroke="rgb(64, 64, 64)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        <path d={pathData} fill="none" stroke={color} strokeWidth="2" />

        {points.map((point, index) => (
          <circle
            key={index}
            cx={xScale(index)}
            cy={yScale(point.value)}
            r="3"
            fill={color}
          />
        ))}

        <text
          x={padding}
          y={yScale(100) - 10}
          fill="rgb(115, 115, 115)"
          fontSize="12"
        >
          100
        </text>
        <text
          x={padding}
          y={yScale(50) - 10}
          fill="rgb(115, 115, 115)"
          fontSize="12"
        >
          50
        </text>
        <text
          x={padding}
          y={yScale(0) + 20}
          fill="rgb(115, 115, 115)"
          fontSize="12"
        >
          0
        </text>
      </svg>
    </div>
  );
}
