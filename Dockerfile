FROM node:24-alpine

ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

COPY --chown=node:node package.json server.js ./
COPY --chown=node:node src ./src

USER node
EXPOSE 8080

CMD ["node", "server.js"]
