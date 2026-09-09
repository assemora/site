# assemora.com.
#
# The site is a page tree rather than a template: `src/seed.ts` writes it through the
# Command Bus on first deploy, in three languages, and after that it is content — an
# editor changes a line in Studio at `/studio` and an agent proposes changing one over
# MCP. Nobody edits this repository to fix a sentence.
#
# `README.md` is the deployment around this file.

FROM node:24-slim

WORKDIR /app

RUN corepack enable

# The manifest first, so a change to a block view does not reinstall the framework.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Only this project's own bundle: the framework arrives compiled, from npm. That is
# what makes this image small enough to build on a small server, and it is the same
# install any project gets from `pnpm create assemora`.
RUN pnpm build

# `PORT` and `HOST` are read by the umbrella and nowhere else (ADR-0022). Loopback is
# its default deliberately, so a container is the deployment that says otherwise.
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Refuse to start without the administrator's password rather than mint one at random:
# unset, `src/seed.ts` generates 144 bits and writes them to a `.env` inside the
# container, which is an account nobody can ever sign in as.
CMD ["sh", "-c", ": \"${ASSEMORA_SEED_PASSWORD:?is required — it is the password of the administrator this site is edited as, and an unset one is generated at random inside the container and known to nobody}\"; exec pnpm start"]
