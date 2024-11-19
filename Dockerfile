FROM arm64v8/node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN chown -R node /usr/src/app
USER node

RUN cd client && npm ci
RUN cd server && npm ci

RUN cd client && npm run build
RUN cd server && npm run build

WORKDIR /usr/src/app/server

ENV NODE_ENV=production
ENV PORT=3000
ENV WS_PORT=3001
EXPOSE 3000
EXPOSE 3001

CMD ["node", "dist/src/main.js"]