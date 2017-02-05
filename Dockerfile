FROM mhart/alpine-node:7.0

# Install dumb-init to fix Ctrl-C behavior
RUN apk add --no-cache curl python bash openssh git && \
  curl -L -o /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.0.0/dumb-init_1.0.0_amd64 && \
  chmod +x /usr/local/bin/dumb-init && \

RUN npm install --global yarn
RUN mkdir /server
WORKDIR /server
ADD yarn.lock package.json /server/
RUN yarn
ADD src /server/src
EXPOSE 8080
HEALTHCHECK CMD curl --fail http://localhost:8080/healthz || exit 1
ENTRYPOINT ["dumb-init", "yarn"]
