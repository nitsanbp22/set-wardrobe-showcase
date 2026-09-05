# Security and Public Showcase Scope

This repository is intentionally separated from SET's private production repository.

## What is intentionally excluded

The public-facing showcase must never include:

- `.env` files or production environment values;
- Supabase service-role credentials or other privileged tokens;
- administrative or destructive data-management scripts;
- production user data, wardrobe images, account details or exports;
- deployment-only configuration that is unnecessary to understand the engineering work;
- internal AI/agent tooling directories;
- production Git history.

## Why this repository has fresh history

The showcase is a curated snapshot rather than a fork. A fresh history prevents historical production-only files or credentials from becoming public when the showcase visibility changes.

## Code sample policy

Files under `code-samples/` are selected domain modules copied from the private application. They may reference production architecture modules that are intentionally not included here. The showcase is therefore not intended to be deployed as the live application.

## Before changing visibility to Public

Run a final review for credential-like values, private URLs, user data and administrative scripts. The production repository should remain private and separate.
