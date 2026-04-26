---
description: Read this file to understand how to fetch data in this project.
---

# Data Fetching Instructions

This document provides the best practices and guidelines on how to fetch data in this project. Follow these instructions to ensure consistency and efficiency in your data fetching methods.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS use Server Components to fetch data. This allows you to fetch data on the server side, which can improve performance and reduce the amount of JavaScript sent to the client. NEVER use Client Components for data fetching, as this can lead to unnecessary client-side rendering and increased load times.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in your components.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions. This ensures that all data fetching is consistent and follows the same patterns.
