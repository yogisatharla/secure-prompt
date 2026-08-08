import { useEffect } from 'react';
export function TestFetch() {
  useEffect(() => {
    fetch('/assets/lanyard/card.glb')
      .then(res => res.arrayBuffer())
      .then(ab => console.log('Fetched card.glb size:', ab.byteLength))
      .catch(err => console.error('Fetch error:', err));
  }, []);
  return null;
}
