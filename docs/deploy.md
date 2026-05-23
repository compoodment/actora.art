# Hosting boundary

actora.art is a live website at https://actora.art.

This public document explains only the broad visitor-facing shape. It is not an operations runbook.

## Public shape

- Main site pages and assets are served from `https://actora.art/`.
- Main site interactive surfaces use site-owned requests from the page.
- Pages should remain understandable even if an interactive feature is temporarily unavailable.

These notes describe what visitors should be able to reach, not how the site is deployed.

## Not public

Deployment details, source paths, server configuration, non-public routes, admin/moderation/security controls, auth internals, service layout, secrets, logs, recovery steps, and operational procedures live in private docs.
