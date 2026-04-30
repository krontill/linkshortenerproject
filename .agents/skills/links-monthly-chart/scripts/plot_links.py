#!/usr/bin/env python3
"""
plot_links.py

Queries the 'links' table in the project's Neon PostgreSQL database and
produces a bar chart PNG showing the total number of links created per month
for the past 12 months.

Usage:
    python plot_links.py [--output <path>] [--env <path>]

Requirements:
    pip install psycopg2-binary python-dotenv matplotlib
"""

import argparse
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


def check_imports():
    missing = []
    for pkg, import_name in [
        ("psycopg2-binary", "psycopg2"),
        ("python-dotenv", "dotenv"),
        ("matplotlib", "matplotlib"),
    ]:
        try:
            __import__(import_name)
        except ImportError:
            missing.append(pkg)
    if missing:
        print(
            f"Missing packages: {', '.join(missing)}\n"
            f"Install with: pip install {' '.join(missing)}"
        )
        sys.exit(1)


check_imports()

import psycopg2  # noqa: E402
from dotenv import load_dotenv  # noqa: E402
import matplotlib  # noqa: E402

matplotlib.use("Agg")  # headless — no display needed
import matplotlib.pyplot as plt  # noqa: E402
import matplotlib.ticker as ticker  # noqa: E402


def load_database_url(env_path: Path) -> str:
    if not env_path.exists():
        print(f"Error: .env file not found at {env_path}")
        print("Run this script from the project root, or pass --env <path>.")
        sys.exit(1)
    load_dotenv(env_path)
    url = os.environ.get("DATABASE_URL")
    if not url:
        print("Error: DATABASE_URL not set in .env file.")
        sys.exit(1)
    return url


def query_monthly_counts(database_url: str) -> dict[str, int]:
    """
    Returns a dict mapping 'YYYY-MM' -> count for the past 12 months.
    Months with no links are included with count 0.
    """
    now = datetime.now(tz=timezone.utc)

    # Build the ordered list of the last 12 months (oldest first)
    months: list[str] = []
    for offset in range(11, -1, -1):
        year = now.year
        month = now.month - offset
        while month <= 0:
            month += 12
            year -= 1
        months.append(f"{year:04d}-{month:02d}")

    counts: dict[str, int] = {m: 0 for m in months}

    sql = """
        SELECT
            TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM') AS month,
            COUNT(*) AS total
        FROM links
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month;
    """

    conn = psycopg2.connect(database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
    finally:
        conn.close()

    for month_str, total in rows:
        if month_str in counts:
            counts[month_str] = int(total)

    return counts


def make_labels(months: list[str]) -> list[str]:
    """Convert 'YYYY-MM' keys to human-readable 'Mon YYYY' labels."""
    labels = []
    for m in months:
        dt = datetime.strptime(m, "%Y-%m")
        labels.append(dt.strftime("%b %Y"))
    return labels


def plot_chart(counts: dict[str, int], output_path: Path) -> None:
    months = sorted(counts.keys())
    values = [counts[m] for m in months]
    labels = make_labels(months)

    fig, ax = plt.subplots(figsize=(14, 6))

    bars = ax.bar(labels, values, color="#4f87c5", edgecolor="white", linewidth=0.5)

    # Add count labels on top of each bar
    for bar, val in zip(bars, values):
        if val > 0:
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + max(values) * 0.01,
                str(val),
                ha="center",
                va="bottom",
                fontsize=9,
                color="#333333",
            )

    ax.set_title("Links Created — Past 12 Months", fontsize=15, pad=14)
    ax.set_xlabel("Month", labelpad=10)
    ax.set_ylabel("Links Created", labelpad=10)
    ax.yaxis.set_major_locator(ticker.MaxNLocator(integer=True))
    ax.set_ylim(bottom=0)

    plt.xticks(rotation=30, ha="right", fontsize=9)
    plt.tight_layout()

    fig.savefig(output_path, dpi=150)
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser(description="Plot monthly link creation counts.")
    parser.add_argument(
        "--output",
        default="links_monthly_chart.png",
        help="Output PNG file path (default: links_monthly_chart.png)",
    )
    parser.add_argument(
        "--env",
        default=".env",
        help="Path to .env file (default: .env in current directory)",
    )
    args = parser.parse_args()

    env_path = Path(args.env)
    output_path = Path(args.output)

    database_url = load_database_url(env_path)

    print("Querying database…")
    counts = query_monthly_counts(database_url)

    print("Rendering chart…")
    plot_chart(counts, output_path)

    total = sum(counts.values())
    print(f"Done. Chart saved to: {output_path.resolve()}")
    print(f"Total links in the past 12 months: {total}")


if __name__ == "__main__":
    main()
