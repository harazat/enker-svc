# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm config set unsafe-perm true
RUN npm install --silent
COPY . /app
RUN npm run build

RUN npm install -g serve

CMD ["serve", "-l", "80", "-s", "build"]
