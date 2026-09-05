# Security and Public Showcase Scope

This repository is intentionally separated from SET's private production repository.

SET is still under active development. Security controls, dependency posture, data access rules, deployment configuration, and hardening practices will continue to evolve alongside the product.

## What is intentionally excluded

The public-facing showcase must never include:

- `.env` files or production environment values;
- Supabase service-role credentials or other privileged tokens;
- administrative or destructive data-management scripts;
- raw production user-data exports, account details, private storage assets, or other non-public personal data;
- deployment-only configuration that is unnecessary to understand the engineering work;
- internal AI/agent tooling directories;
- production Git history.

Approved product screenshots may contain non-sensitive wardrobe examples used to demonstrate the UI. They are reviewed separately before publication and are not a substitute for exposing the underlying production storage or user-data records.

## Why this repository has fresh history

The showcase is a curated snapshot rather than a fork. A fresh history prevents historical production-only files or credentials from becoming public when the showcase visibility changes.

## Code sample policy

Files under `code-samples/` are selected domain modules copied from the private application. They may reference production architecture modules that are intentionally not included here. The showcase is therefore not intended to be deployed as the live application.

## Ongoing security review

Security review is iterative rather than a one-time sign-off. The private production project should be re-audited at meaningful milestones, especially before broader releases or substantial architecture changes.

Future reviews should prioritize:

- secret and credential exposure;
- privileged Supabase key usage;
- Row Level Security and authorization boundaries;
- authentication and session handling;
- server/client trust boundaries;
- unsafe administrative or destructive operations;
- storage bucket access policies;
- dependency and framework vulnerabilities;
- input validation and injection risks;
- sensitive logging and error leakage;
- CORS, headers, cookies and deployment configuration;
- rate limiting / abuse controls where relevant;
- privacy and exposure of user-generated data.

Critical findings should be fixed in the private production repository first. Only then should affected showcase documentation or code samples be refreshed.

## Before changing visibility to Public

Run a final review for credential-like values, private URLs, user data, administrative scripts, screenshots, and any code samples that no longer reflect the current architecture.

The production repository should remain private and separate.
