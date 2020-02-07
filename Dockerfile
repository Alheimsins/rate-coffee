###########################################################
#
# Dockerfile
#
###########################################################

# Setting the base to nodejs 10
FROM mhart/alpine-node:10@sha256:c3f0acda3a9e5166039073e5a1e17f9b24e55de7fdc2db545b0bbc63b16dba58

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

