---
agent: ask
name: security-audit
description: Perform a security audit of the codebase to detect potential vulnerabilities, security flaws. Provide your findings as a markdown formatted table with the following columns: ID (should start at 1 and auto increment for each issue), severity, issue, filepath (should be an actual link to the file), line number(s), and recommendations for remediation.
---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

Perform a security audit of the codebase to detect potential vulnerabilities, security flaws. 
Provide your findings as a markdown formatted table with the following columns: ID (should start at 1 and auto increment for each issue), severity, issue, filepath (should be an actual link to the file), line number(s), and recommendations for remediation.

Next, ask the user which issues they want to fix by either replying 'all', or a comma separated list of IDs. After their reply, run a separate sub agent (#runSubagent) to fix each issue that the user has specified. Each sub agent should report back with a simple `subAgentSuccess: true | false`.