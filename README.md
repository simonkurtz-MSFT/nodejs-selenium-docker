# NodeJS & Selenium

This simple project illustrates how NodeJS and Selenium can be used for website testing.

## Getting Started

1. Ensure that you have NodeJS (and npm installed). Run `node -v` in a terminal. If not found, download [NodeJS](https://nodejs.org/en/).
1. Install Google Chrome.
1. Run `npm i` from this directory in a terminal to install all dependencies.
1. Run `npm start` to execute a simple retrieval of a website and its title.

## Selenium

Selenium recently introduced [Selenium Manager](https://www.selenium.dev/blog/2022/introducing-selenium-manager) which automatically acquires the necessary browser driver. This is a great change as we no longer need to obtain a driver for a particular browser version ourselves. This project focuses on Google Chrome as it remains the world's most used browser, but you can, of course, adapt this to work for other browser as well, which is why I encapsulated the browser setup in its own method.
