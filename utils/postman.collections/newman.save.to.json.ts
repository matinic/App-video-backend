const fs = require('fs');
const path = require('path');
const newman = require('newman');

const OUT_DIR = path.resolve(__dirname, 'out');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

newman.run({
  collection: path.resolve(__dirname, 'collection.json'),
  environment: path.resolve(__dirname, 'env.json'), // optional
  reporters: 'cli'
})
.on('request', (err, args) => {
  if (err) return;

  // Build a filename based on request name + iteration + timestamp
  const nameSafe = args.item.name.replace(/[^a-z0-9-_]+/gi, '_');
  const time = new Date().toISOString().replace(/[:.]/g, '-');
  const iteration = args.cursor?.iteration ?? 0;

  // Detect content type to choose extension
  const ct = args.response.headers.get('content-type') || '';
  const ext = ct.includes('application/json') ? 'json' : 'txt';

  const file = path.join(OUT_DIR, `${nameSafe}_iter${iteration}_${time}.${ext}`);
  fs.writeFileSync(file, args.response.stream);
  console.log('Saved:', file);
})
.on('done', (err, summary) => {
  if (err) {
    console.error('Newman run error:', err);
    process.exit(1);
  }
  console.log('Run complete. Total requests:', summary.run.stats.requests.total);
});