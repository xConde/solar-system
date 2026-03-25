import { onCLS, onFCP, onLCP } from 'web-vitals';

export function initPerformanceMonitoring(): void {
  onCLS((metric) => {
    console.debug('[Performance] CLS:', metric.value);
  });

  onFCP((metric) => {
    console.debug('[Performance] FCP:', metric.value.toFixed(0), 'ms');
  });

  onLCP((metric) => {
    console.debug('[Performance] LCP:', metric.value.toFixed(0), 'ms');
  });
}
