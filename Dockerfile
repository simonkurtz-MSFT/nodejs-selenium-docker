# 1) Use alpine-based NodeJS base image. We lock to specific version rather than `latest` to ensure stability.
FROM node:22.2.0

# 2) Install latest stable Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable libxss1

# 3) Install the stable Chromedriver version that corresponds to the installed major Chrome version.
#    Sometimes, the installed Chrome version is newer. If need be, hard-code the latest stable version: https://googlechromelabs.github.io/chrome-for-testing
ARG CHROMEDRIVERVERSION="125.0.6422.78"

RUN wget --no-verbose -O /tmp/chromedriver_linux64.zip https://storage.googleapis.com/chrome-for-testing-public/${CHROMEDRIVERVERSION}/linux64/chrome-linux64.zip && \
    rm -rf /opt/selenium/chromedriver && \
    unzip /tmp/chromedriver_linux64.zip -d /opt/selenium && \
    rm /tmp/chromedriver_linux64.zip && \
    mv /opt/selenium/chrome-linux64 /opt/selenium/chromedriver-${CHROMEDRIVERVERSION} && \
    chmod 755 /opt/selenium/chromedriver-${CHROMEDRIVERVERSION} && \
    ln -fs /opt/selenium/chromedriver-${CHROMEDRIVERVERSION} /usr/bin/chromedriver

# 4) Set the variable for the container working directory, create and set the working directory
WORKDIR /program

# 5) Install npm packages (do this AFTER setting the working directory)
COPY package.json .
RUN npm i
ENV NODE_ENV=development NODE_PATH=/program

# 6) Copy necessary files to working directory
COPY index.js .

# 7) Execute the script in NodeJS
CMD ["npm", "start"]
