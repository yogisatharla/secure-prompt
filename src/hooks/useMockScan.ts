import { useState } from 'react';
import { detectEntities, calculateRisk } from '../utils/detectEntities';
import { buildRewrite } from '../utils/buildRewrite';
import { buildCensored } from '../utils/buildCensored';

export const useMockScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const scan = async (text: string) => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate network delay and rotating loading states in UI
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const entities = detectEntities(text);
    const risk = calculateRisk(entities);
    const rewrite = buildRewrite(text, entities);
    const censored = buildCensored(text, entities);

    setScanResult({
      entities,
      risk,
      rewrite,
      censored,
      stats: {
        pii: entities.filter((e: any) => ['PERSON', 'EMAIL', 'PHONE', 'ADDRESS'].includes(e.type)).length,
        credential: entities.filter((e: any) => ['API_KEY', 'PASSWORD'].includes(e.type)).length,
        financial: entities.filter((e: any) => ['FINANCIAL_AMOUNT', 'ACCOUNT_NUMBER'].includes(e.type)).length,
        project: entities.filter((e: any) => ['PROJECT_NAME', 'ORGANIZATION'].includes(e.type)).length,
      },
    });

    setIsScanning(false);
  };

  const reset = () => {
    setScanResult(null);
  };

  return { scan, reset, isScanning, scanResult };
};
