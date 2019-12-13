###########################################################
#
# Dockerfile
#
###########################################################

# Setting the base to nodejs 10
FROM mhart/alpine-node:10@sha256:e8f39cc2d82dad1d79ea76713719ded3e303555923068dd747691f6d3daaae28

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

