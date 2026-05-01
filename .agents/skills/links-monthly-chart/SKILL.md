---
name: links-monthly-chart
description: >
  Queries the PostgreSQL database (using DATABASE_URL from the project's .env
  file) for all links created in the past 12 months, then generates a bar chart
  PNG showing the total number of links created per month. Use this skill
  whenever the user asks to visualize link creation trends, see how many links
  were created per month, generate a monthly links report, chart link activity
  over time, or export a chart/graph of link data. Trigger even if the user
  just says "show me the links chart" or "how many links were created each month".
---

# Links Monthly Chart

Generate a bar chart PNG showing how many links were created each month over the
past 12 months, pulling live data from the project's Neon PostgreSQL database.

## What this skill does

1. Reads `DATABASE_URL` from the `.env` file at the project root.
2. Queries the `links` table for all rows where `created_at` falls within the
   past 12 calendar months.
3. Groups the rows by month and counts them.
4. Runs `scripts/plot_links.py` to render a bar chart and save it as a PNG.

## How to invoke

Run the bundled script from the project root:

```bash
python .agents/skills/links-monthly-chart/scripts/plot_links.py
```

The script accepts an optional `--output` argument (default: `links_monthly_chart.png`):

```bash
python .agents/skills/links-monthly-chart/scripts/plot_links.py --output my_chart.png
```

After the script exits, tell the user where the PNG was saved.

## Dependencies

Make sure these Python packages are available. If any are missing, install them:

```bash
pip install psycopg2-binary python-dotenv matplotlib
```

The script will print a clear error and exit if a package is missing.

## Notes

- The script reads `.env` from the **current working directory**, so run it
  from the project root (or wherever `.env` lives).
- The x-axis always shows the last 12 months in chronological order, even if
  some months have zero links.
- Months with zero links show a bar of height 0, so gaps in activity are
  visible.
