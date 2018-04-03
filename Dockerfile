FROM node:8-alpine
WORKDIR /opt/tplink-monitor
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]