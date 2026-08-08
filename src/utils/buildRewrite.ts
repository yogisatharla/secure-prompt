export const buildRewrite = (text: string, entities: any[]) => {
  if (!text) return "";
  if (!entities || entities.length === 0) return text;

  let rewritten = text;
  const sortedEntities = [...entities].sort((a, b) => b.index - a.index); // Replace from end to avoid index shift

  for (const entity of sortedEntities) {
    let replacement = `[${entity.label.toUpperCase().replace(/\s+/g, '_')}]`;
    if (entity.type === 'PERSON') replacement = 'the employee';
    if (entity.type === 'EMAIL') replacement = 'an email address';
    if (entity.type === 'PHONE') replacement = 'a contact number';
    if (entity.type === 'ACCOUNT_NUMBER') replacement = 'an account identifier';
    if (entity.type === 'API_KEY') replacement = 'an API credential';
    if (entity.type === 'PASSWORD') replacement = 'authentication credentials';
    if (entity.type === 'PROJECT_NAME') replacement = 'an internal project';
    if (entity.type === 'ORGANIZATION') replacement = 'the organization';
    if (entity.type === 'FINANCIAL_AMOUNT') replacement = 'financial information';
    if (entity.type === 'ADDRESS') replacement = 'a physical address';

    rewritten = rewritten.substring(0, entity.index) + replacement + rewritten.substring(entity.index + entity.length);
  }

  return rewritten;
};

