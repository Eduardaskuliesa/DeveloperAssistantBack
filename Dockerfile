FROM node:22
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./

RUN npm ci && \
    npm install -g typescript ts-node nodemon

COPY . .

EXPOSE 4040
CMD ["npm", "start"]