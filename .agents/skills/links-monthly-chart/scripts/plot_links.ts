import { Client } from "pg";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import type { ChartConfiguration } from "chart.js";
import { config } from "dotenv";
import { writeFileSync } from "fs";
import { resolve } from "path";

// Load .env from current working directory (or --env arg)
const envIdx = process.argv.indexOf("--env");
const envPath = envIdx !== -1 ? process.argv[envIdx + 1] : ".env";
config({ path: envPath });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL not set in .env file.");
  process.exit(1);
}

const outIdx = process.argv.indexOf("--output");
const outputPath = resolve(outIdx !== -1 ? process.argv[outIdx + 1] : "links_monthly_chart.png");

// Build ordered list of the last 12 months as "YYYY-MM" strings
function getLast12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${yyyy}-${mm}`);
  }
  return months;
}

function toLabel(yyyyMM: string): string {
  const [year, month] = yyyyMM.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

async function main() {
  const months = getLast12Months();
  const counts: Record<string, number> = Object.fromEntries(months.map((m) => [m, 0]));

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    console.log("Querying database…");
    const { rows } = await client.query<{ month: string; total: string }>(`
      SELECT
        TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM') AS month,
        COUNT(*) AS total
      FROM links
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month
    `);

    for (const { month, total } of rows) {
      if (month in counts) counts[month] = Number(total);
    }
  } finally {
    await client.end();
  }

  const labels = months.map(toLabel);
  const values = months.map((m) => counts[m]);
  const total = values.reduce((a, b) => a + b, 0);

  console.log("Rendering chart…");

  const renderer = new ChartJSNodeCanvas({ width: 1400, height: 600, backgroundColour: "white" });

  const chartConfig: ChartConfiguration = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Links Created",
          data: values,
          backgroundColor: "#4f87c5",
          borderColor: "#ffffff",
          borderWidth: 0.5,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Links Created — Past 12 Months",
          font: { size: 18 },
          padding: { bottom: 16 },
        },
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          title: { display: true, text: "Links Created" },
        },
        x: {
          title: { display: true, text: "Month" },
        },
      },
    },
  };

  const buffer = await renderer.renderToBuffer(chartConfig);
  writeFileSync(outputPath, buffer);

  console.log(`Done. Chart saved to: ${outputPath}`);
  console.log(`Total links in the past 12 months: ${total}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
