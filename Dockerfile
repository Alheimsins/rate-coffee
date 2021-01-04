###########################################################
#
# Dockerfile
#
###########################################################

# Setting the base to nodejs 10
FROM mhart/alpine-node:10@sha256:0741da5c7d4c4b0396bc75eaf6aded18208bc0a50d5d67a7e859e94e5b06cfc4

# Maintainer
MAINTAINER Jonas Enge

#### Begin setup ####

# Extra tools for native dependencies
RUN apk add --no-cache make gcc g++ python git

# Bundle app source
COPY . /src

# Change working directory
WORKDIR "/src"

# Install dependencies
RUN npm install --production

RUN npm run build

# Expose 3000
EXPOSE 3000

# Startup
ENTRYPOINT npm run start

