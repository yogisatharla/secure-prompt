export const detectEntities = (text: string) => {
  if (!text) return [];
  const entities: any[] = [];
  let idCounter = 1;

  const addEntity = (regex: RegExp, type: string, label: string) => {
    let match;
    while ((match = regex.exec(text)) !== null) {
      entities.push({
        id: idCounter++,
        type,
        label,
        value: match[0],
        index: match.index,
        length: match[0].length
      });
    }
  };

  const addEntityWithGroup = (regex: RegExp, type: string, label: string) => {
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        entities.push({
          id: idCounter++,
          type,
          label,
          value: match[1],
          index: match.index + match[0].indexOf(match[1]),
          length: match[1].length
        });
      }
    }
  };

  // Regex Pipeline Simulation
  addEntity(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, 'EMAIL', 'Email');
  addEntity(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, 'PHONE', 'Phone');
  addEntity(/\bsk-[a-zA-Z0-9-]+\b/g, 'API_KEY', 'API Key');
  addEntity(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g, 'FINANCIAL_AMOUNT', 'Financial Amount');
  addEntity(/\b\d{6,12}\b/g, 'ACCOUNT_NUMBER', 'Account Number');
  addEntityWithGroup(/(?:password|pwd)\s*(?:is|:|=)\s*([A-Za-z0-9_!@#$%^&*]+)/gi, 'PASSWORD', 'Password');

  // Simulate NER (spaCy/Presidio) for Names and Projects
  const nameRegex = /\b(?:[A-Z][a-z]+)\s(?:[A-Z][a-z]+)\b/g;
  let match;
  while ((match = nameRegex.exec(text)) !== null) {
    const val = match[0];
    const lower = val.toLowerCase();
    if (lower.startsWith('hi ') || lower.startsWith('can ') || lower.startsWith('hello ')) continue;
    
    if (val.includes('Project')) {
      entities.push({ id: idCounter++, type: 'PROJECT_NAME', label: 'Project Name', value: val, index: match.index, length: val.length });
    } else {
      entities.push({ id: idCounter++, type: 'PERSON', label: 'Person', value: val, index: match.index, length: val.length });
    }
  }

  // Remove overlapping entities (prefer earlier/longer ones)
  const sortedEntities = entities.sort((a, b) => {
    if (a.index === b.index) return b.length - a.length;
    return a.index - b.index;
  });

  const finalEntities = [];
  let lastEnd = -1;
  for (const entity of sortedEntities) {
    if (entity.index >= lastEnd) {
      finalEntities.push(entity);
      lastEnd = entity.index + entity.length;
    }
  }

  return finalEntities;
};

export const calculateRisk = (entities: any[]) => {
  if (entities.length === 0) return { score: 0, level: 'LOW' };
  
  const hasCritical = entities.some((e) => e.type === 'API_KEY' || e.type === 'PASSWORD');
  if (hasCritical) {
    return { score: 100, level: 'CRITICAL' };
  }
  
  if (entities.length > 3) {
    return { score: 82, level: 'HIGH' };
  }
  
  return { score: 45, level: 'MEDIUM' };
};
