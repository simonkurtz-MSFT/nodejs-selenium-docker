# 1) Use alpine-based NodeJS base image. We lock to specific version rather than `latest` to ensure stability.
FROM node:22.2.0

WORKDIR /program

# Copy package.json and package-lock.json if available
COPY package*.json ./
COPY . .

# Copy necessary files to working directory
COPY . .

RUN npm install

RUN apt-get update && apt-get install -y wget unzip

# Download and install the latest stable Chrome
RUN wget http://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install

## Downloading and installing the linux build for chromedriver
RUN wget https://storage.googleapis.com/chrome-for-testing-public/125.0.6422.78/linux64/chromedriver-linux64.zip 

## Unzipping it and accessing the chromedriver
RUN unzip chromedriver-linux64.zip \
    && chmod +x chromedriver-linux64 \
    && mkdir /usr/local/bin/chromedriver-linux64 \
    && mv chromedriver-linux64 /usr/local/bin

ENV NODE_ENV=development 
ENV PATH="/usr/local/bin/chromedriver-linux64:${PATH}"

# 6) Execute the script in NodeJS
CMD ["npm", "start"]
