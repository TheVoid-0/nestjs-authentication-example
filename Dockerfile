FROM node:16-alpine as development

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node:16-alpine as production

RUN mkdir -p /home/app

WORKDIR /home/app

COPY package*.json ./

RUN npm i --omit=dev

COPY . .

COPY --from=development /home/app/dist ./dist

EXPOSE 3002

CMD ["npm", "run", "start:deploy"];

