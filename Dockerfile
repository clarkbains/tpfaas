FROM mhart/alpine-node
WORKDIR /app
COPY src/package.json /app
ENV PROD=true
RUN apk add curl
RUN npm install
COPY ./src /app
CMD node index.js
HEALTHCHECK --interval=30s --retries=3 CMD pgrep node || exit 1
