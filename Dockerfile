FROM node:7.5.0-alpine

RUN apk add --update \
    findutils \
    g++ \
    make \
    postgresql-dev \
    python

ADD server/package.json tmp/package.json
RUN cd tmp && npm install
RUN mkdir server && mv tmp/node_modules server/node_modules

ADD server server
CMD cd server && npm run produce

EXPOSE 80 443
