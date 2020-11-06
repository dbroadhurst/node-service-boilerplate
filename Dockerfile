# Stage 1 - transpile typescript into javascript
FROM node:12 AS builder

WORKDIR /service
COPY . .
RUN npm install && npm run build

# Stage 2 - build a production version (without devDependancies) of the node modules
FROM node:12

WORKDIR /service

COPY --from=builder service/lib lib
COPY --from=builder service/package.json package.json
COPY --from=builder service/package-lock.json package-lock.json
RUN npm --production=true install

ENTRYPOINT [ "node", "lib/index.js" ]
