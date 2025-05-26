FROM openjdk:17-oracle

# set the jar file as argument
ARG JAR_FILE=DatabaseBackend/build/libs/DatabaseBackend-0.0.1-SNAPSHOT.jar

# copy the jar file from local computer to container. This file will be found in the container as backendApp.jar
COPY ${JAR_FILE} backendApp.jar

# run applicaton 
ENTRYPOINT ["java","-jar","/backendApp.jar"]

# the port to be exposed
EXPOSE 8080