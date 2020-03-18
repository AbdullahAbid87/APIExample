// maitre.js

const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports.get = async function() {

  var restaurantsList = [];
	
  //Function for sleep (time delay)
  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }
  
  //Function that return all url of restaurants page informations
  const getAllUrl = async browser => {
    const page = await browser.newPage();
    await page.goto('https://www.maitresrestaurateurs.fr/annuaire/recherche');
    await sleep(1000);
    await page.click(
        '.col-sm-offset-3.col-xs-6.text-center .bt-big'
    );
    await sleep(1000);
    await page.waitFor('body');
    const result = await page.evaluate(() =>
      [...document.querySelectorAll('.single_desc .single_libel a')].map(link => link.href),
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
        let nameRest = '';
        if(document.querySelector('.ep-section.ep-section-parcours.row .ep-section-body .ep-section-item.flex .section-item-right.text.flex-5 span strong') != null) {
            nameRest = document.querySelector('.ep-section.ep-section-parcours.row .ep-section-body .ep-section-item.flex .section-item-right.text.flex-5 span strong').innerText;
        }
        else {
            nameRest = '';
        }

        let websiteRestUrl = '';
        if(document.querySelector('.section-item-right.text.flex-5 a') != null) {
            websiteRestUrl = document.querySelector('.section-item-right.text.flex-5 > a').innerText.trim().replace(/(\r\n|\n|\r)/gm, "");
        }
        else {
            websiteRestUrl = '';
        }

        let addressRest = '';
        if(document.querySelector('.profil-tooltip p a') != null) {
            addressRest = document.querySelector('.profil-tooltip p a').innerText.trim().replace(/\s\s+/g, ' ');
        }
        else {
            addressRest = '';
        }

        let priceStyleRest = '';

        let phoneRest = '';
        if(document.querySelector('.section-item-right.text.flex-5') != null) {
            phoneRest = document.querySelector('.section-item-right.text.flex-5').innerText.trim().replace(/\D/g,'');
        }
        else {
            phoneRest = '';
        }

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
      fs.writeFileSync('./server-side/maitre.json', JSON.stringify(restaurantsList));
    })
    .catch(e => console.log(`error: ${e}`));

  return restaurantsList;
};