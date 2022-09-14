# syntax=docker/dockerfile:1
FROM node:18-alpine AS build
WORKDIR /opt/docker/undrgrnd-server
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm i
RUN npm run build
RUN ls -a

FROM node:18-alpine
WORKDIR /opt/docker/undrgrnd-server
COPY package.json package-lock.json ./
RUN npm i --omit=dev
COPY --from=build /opt/docker/undrgrnd-server/dist ./dist
COPY --from=build /opt/docker/undrgrnd-server/src/public ./dist/public
RUN mkdir -p logs
RUN ls -a && cd dist && ls -a
EXPOSE 10000
CMD ["npm", "run", "start"]