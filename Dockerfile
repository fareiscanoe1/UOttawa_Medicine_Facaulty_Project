FROM node:latest

# application container directory
WORKDIR /app

# add dependencies to path
ENV PATH /app/node_modules/.bin:$PATH

# copy the content of the local folder to the container's folder
COPY frontend .

# install dependencies 
RUN npm install --force

# expose container port 3000
EXPOSE 3000

#start the server
CMD ["npm", "start"]