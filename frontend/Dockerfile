FROM node:18-alpine

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
