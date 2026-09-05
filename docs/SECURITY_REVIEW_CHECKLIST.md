# SET — Security Review Checklist

> **Reusable review template:** the unchecked boxes below are review prompts for future audits of the private production project. They do **not** represent known unresolved vulnerabilities in this showcase repository.

This checklist is intended for repeat reviews as SET evolves. Findings are assessed against the current production architecture at the time of each audit, and critical production findings are addressed before related showcase material is refreshed.

## Critical — review first

- [ ] No production secrets or privileged tokens are committed anywhere in current Git history.
- [ ] Any previously exposed credential has been rotated or revoked.
- [ ] Supabase `service_role` is never exposed to browser/client code.
- [ ] Row Level Security is enabled where user-owned data requires isolation.
- [ ] RLS policies enforce ownership / authorization for read, insert, update and delete paths.
- [ ] Storage policies prevent cross-user access to private assets.
- [ ] Administrative and destructive actions require explicit privileged authorization.
- [ ] Server endpoints do not trust client-supplied user IDs or authorization-sensitive fields.

## Authentication & sessions

- [ ] Auth redirects and callback URLs are constrained to expected destinations.
- [ ] Session handling does not leak tokens through logs, URLs, analytics or client-visible errors.
- [ ] Sensitive mutations verify the authenticated user on the server / trusted boundary.
- [ ] Account deletion, sign-out and session refresh behavior are reviewed.

## Input & data handling

- [ ] External and user input is validated at trust boundaries.
- [ ] Database queries avoid unsafe string construction.
- [ ] File uploads enforce appropriate type, size and ownership rules.
- [ ] User-generated content is rendered safely.
- [ ] Error messages do not expose internal credentials, SQL, stack details or private data.

## API & abuse controls

- [ ] Sensitive or expensive endpoints have appropriate rate / abuse protections.
- [ ] CORS configuration is intentionally scoped.
- [ ] Public endpoints expose only the minimum required data.
- [ ] Third-party API credentials are server-side where required.

## Dependencies & platform

- [ ] Framework and runtime versions are checked for known high-severity vulnerabilities.
- [ ] Dependency audit findings are triaged rather than blindly auto-fixed.
- [ ] Deprecated or unmaintained security-sensitive packages are identified.
- [ ] Security headers and cookie attributes are reviewed for the deployed environment.

## Privacy & observability

- [ ] Logs do not contain access tokens, service-role keys or unnecessary personal data.
- [ ] Analytics and monitoring collect only intended data.
- [ ] User wardrobe images and profile data are not publicly enumerable.
- [ ] Data deletion / retention behavior matches the product's intended privacy model.

## Showcase publication gate

Before copying a new sample from production into `set-wardrobe-showcase`:

- [ ] Review the exact file for secrets, private URLs and internal identifiers.
- [ ] Remove production-only configuration and privileged implementation details.
- [ ] Confirm the sample contains no raw user data.
- [ ] Review any screenshots for personal or private information before publication.
- [ ] Confirm omitted dependencies do not make the sample misleading.
- [ ] Update documentation if the architecture or behavior changed materially.
- [ ] Run a final credential-like string scan over the showcase repository.

## Suggested cadence

Run this checklist before major public releases, after meaningful auth / database / storage changes, after adding new external integrations, and immediately after any suspected credential exposure or authorization bug.
