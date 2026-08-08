export const buildCensored = (text: string, entities: any[]) => {
  if (!text) return [];
  if (!entities || entities.length === 0) return [{ type: 'text', content: text }];

  const sortedEntities = [...entities].sort((a, b) => a.index - b.index);
  
  const result = [];
  let lastIndex = 0;

  for (const entity of sortedEntities) {
    if (entity.index >= lastIndex) {
      if (entity.index > lastIndex) {
        result.push({ type: 'text', content: text.substring(lastIndex, entity.index) });
      }
      result.push({ type: 'redacted', content: entity.value });
      lastIndex = entity.index + entity.length;
    }
  }

  if (lastIndex < text.length) {
    result.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return result;
};

