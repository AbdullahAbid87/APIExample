// michelin.js

const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports.get = async function() {

  var restaurantsList = [];
  
  //Function that return all url of restaurants page informations
  const getAllUrl = async browser => {
    const page = await browser.newPage();
    await page.goto('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand');
    await page.waitFor('body');
    const result = await page.evaluate(() =>
      [...document.querySelectorAll('.card__menu.js-restaurant__list_item.js-match-height.js-map .link')].map(link => link.href),
    );
    return result;
  }
  
  //Function that get data from a web page and push it
  const getDataFromUrl = async (browser, url) => {
    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.waitFor('body');
      return page.evaluate(() => {
        let nameRest = document.querySelector('.restaurant-details__heading--title').innerText;
        let websiteRestUrl = '';
        if(document.querySelector('.collapse__block-item.link-item .collapse__block-title.d-flex .d-flex .flex-fill') != null) {
          websiteRestUrl = document.querySelector('.collapse__block-item.link-item .collapse__block-title.d-flex .d-flex .flex-fill').innerText;
        }
        else {
          websiteRestUrl = '';
        }
        let addressRest = document.querySelector('.restaurant-details__heading--list li').innerText;
        let priceStyleRest = document.querySelector('.restaurant-details__heading-price').innerText;
        let phoneRest = document.querySelector('.collapse__block-title .d-flex .flex-fill').innerText;
        return {
          name: nameRest,
          url: websiteRestUrl,
          address: addressRest,
          price_style: priceStyleRest,
          phone: phoneRest,
        };
      })
    } catch (error) {
      console.log(`error in getDataFromUrl: ${e}`);
    }
  }
  
  //Function that get all urls, and get all data from each url
  const scrap = async function() {
    const browser = await puppeteer.launch({ headless: false });
    const urlList = await getAllUrl(browser);
    const results = await Promise.all(
      urlList.map(url => getDataFromUrl(browser, url)),
    );
    browser.close();
    return results;
  }
  
  //Display, assign and write gathered data to a json file
  scrap()
    .then(value => {
      console.log(value);
      restaurantsList = value;
      fs.writeFileSync('./server-side/michelin.json', JSON.stringify(restaurantsList));
    })
    .catch(e => console.log(`error: ${e}`));

  return restaurantsList;
};