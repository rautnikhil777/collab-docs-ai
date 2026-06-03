require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});

const { createApp } = require('./app');
const { connectMongo } = require('./startup/connectMongo');
const { seedDemoData } = require('./startup/seedDemoData');

async function main() {
  const app = createApp();

  await connectMongo();
  await seedDemoData();

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});