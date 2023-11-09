FROM node:16.15-alpine as build

LABEL author="wtchana@clicdev-consulting.com"
LABEL version="1.0"
LABEL description="Frontend container for DOUNS App"


# set working dir
WORKDIR /app

# add node_modules to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache dependencies
COPY package.json /app/package.json
COPY nginx-docker.conf /app/nginx-docker.conf
RUN npm i --legacy-peer-deps
RUN npm i -g @angular/cli

# add app
COPY . /app

# PROD #


RUN ng build -c production  --output-path=dist

FROM nginx:1.21.6-alpine

COPY --from=build /app/dist   /usr/share/nginx/html
COPY --from=build /app/nginx-docker.conf /etc/nginx/conf.d/default.conf

EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
