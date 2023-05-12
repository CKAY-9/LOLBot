FROM node:18-alpine

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install\
    && npm install typescript -g

COPY . .

RUN tsc

CMD ["npm", "run", "start"]