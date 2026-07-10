import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Thin wrapper around Chart.js for React. Chart.js mutates a raw <canvas>
 * directly, which conflicts with React's own DOM diffing unless we manage
 * the chart instance's lifecycle ourselves: create once, destroy on unmount,
 * and re-render in place whenever `config` changes (instead of letting
 * Chart.js and React fight over the same node).
 */
export default function ChartCanvas({ config, className = '' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(config)]);

  return <canvas ref={canvasRef} className={className} />;
}
