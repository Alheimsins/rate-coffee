###########################################################
#
# Dockerfile
#
###########################################################

# Setting the base to nodejs 10
FROM mhart/alpine-node:16@sha256:828042a9a8f37e47147f7b74c6bb91d230ee3ba6d34674cde1bbc61f1f55c14e

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

