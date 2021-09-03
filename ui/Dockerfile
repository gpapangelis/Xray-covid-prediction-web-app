# Use an existing docker image as a base
FROM node:14

#Change working directory
WORKDIR /frontapp

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /frontapp/package*.json ./

RUN npm install

# Bundle app source
COPY ./frontapp ./

# Tell what to do when it starts as a container
EXPOSE 80
CMD [ "node", "index.js" ]
