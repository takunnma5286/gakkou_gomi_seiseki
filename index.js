const axios = require('axios');
const cheerio = require('cheerio');

// POSTリクエストを送信する関数
async function seiseki(num) {
    const url = 'https://mstdy.com/tec1/index.cgi';
    const postData = `mode=dispScr&scrfile=..%2Fadm_tec1%2Ftec1%2F07%2F${num}.csv&logName=%E4%B8%AD%E5%B7%9D%E7%A5%90%E9%80%9F&cls=07`
    try {
        const response = await axios.post(url, postData);
        
        const html = response.data;
        const $ = cheerio.load(html);

        const tdElements = $('td[align="right"]');
        const kekka = {
            "goukakunum":[],
            "kako":{
                
            }
        }
        tdElements.each((index, element) => {
            let temp = $(element).text()
            let saigo = temp[temp.length-1]
            if (saigo == "回"){kekka.push(Number(temp.slice(0,-2)))}
        });
        return kekka
    } catch (error) {
        console.error('取得に失敗しました', error);
        return -1
    }
}


seiseki(1733).then(results => {
    console.log(results)
})
