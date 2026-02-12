// To run this test:
// 1. npm run build
// 2. npm link /Users/ruimolefas/Code/skill-poc-v2/packages/trik-gateway
// 3. Copy .trikhub/secrets.example.json to .trikhub/secrets.json and add your ANTHROPIC_API_KEY
// 4. npm test

import { TrikGateway, FileConfigStore } from '@trikhub/gateway';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  // Create config store that reads from .trikhub/secrets.json
  const configStore = new FileConfigStore({
    localSecretsPath: join(__dirname, '.trikhub', 'secrets.json'),
  });
  await configStore.load();

  // Create gateway with config store
  const gateway = new TrikGateway({ configStore });

  // Load trik from current directory
  await gateway.loadTrik(__dirname);

  console.log('Trik loaded!\n');

  // Test 1: Search action
  console.log('--- TEST: search ---');
  const searchResult = await gateway.execute('article-search-3', 'search', {
    topic: 'artificial intelligence',
  });
  console.log(JSON.stringify(searchResult, null, 2));

  // Test 2: List action (uses session from search)
  console.log('\n--- TEST: list ---');
  const sessionId = (searchResult as { sessionId?: string }).sessionId;
  const listResult = await gateway.execute('article-search-3', 'list', {}, { sessionId });
  console.log(JSON.stringify(listResult, null, 2));

  // If passthrough, deliver content
  if (listResult.success && listResult.responseMode === 'passthrough') {
    const ref = (listResult as { userContentRef: string }).userContentRef;
    const content = gateway.deliverContent(ref);
    console.log('\n--- PASSTHROUGH CONTENT ---');
    console.log(content);
  }

  // Test 3: Details action
  console.log('\n--- TEST: details ---');
  const detailsResult = await gateway.execute(
    'article-search-3',
    'details',
    {
      articleId: 'art-001',
    },
    { sessionId }
  );
  console.log(JSON.stringify(detailsResult, null, 2));

  // Deliver passthrough content
  if (detailsResult.success && detailsResult.responseMode === 'passthrough') {
    const ref = (detailsResult as { userContentRef: string }).userContentRef;
    const content = gateway.deliverContent(ref);
    console.log('\n--- ARTICLE CONTENT ---');
    console.log(content);
  }
}

main().catch(console.error);
