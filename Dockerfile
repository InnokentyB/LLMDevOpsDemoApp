FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1

ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

COPY --chown=node:node package.json server.js ./
COPY --chown=node:node src ./src

USER node
EXPOSE 8080

CMD ["node", "server.js"]
