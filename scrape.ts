import cheerio from 'cheerio'

type ProgressSummary = {
  timestamp: string
  done: number
  outdated: number
  missing: number
}

const url = 'https://i18n.docs.astro.build/';

const response = await fetch(url, {
  signal: AbortSignal.timeout(5000),
  verbose: true,
});
const html = await response.text();
const $ = cheerio.load(html);
const progress = $('main > .limit-to-viewport > details')
  .toArray()
  .find((el) => $('summary > strong', el).text() === "日本語 (ja)")
if (!progress) {
  throw new Error('Not found progress summary');
}

const progressSummaryText = $('summary > .progress-summary', progress).text().replace(/\s+/g, ' ')

const matches = progressSummaryText.match(/(\d+) done, (\d+) outdated, (\d+) missing/)
if (!matches) {
  throw new Error('Not found progress summary');
}

const progressSummary: ProgressSummary = {
  timestamp: new Date().toISOString(),
  done: parseInt(matches[1]),
  outdated: parseInt(matches[2]),
  missing: parseInt(matches[3]),
}
console.log(JSON.stringify(progressSummary))
