FROM node:16.13.2 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist/itemsinventoryapp /usr/share/nginx/html
