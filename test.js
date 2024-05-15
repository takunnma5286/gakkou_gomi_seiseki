const axios = require('axios');
const cheerio = require('cheerio');

// POSTリクエストを送信して解析結果を返す関数
async function postRequestAndParseHtml(num) {
try {
    const url = 'https://mstdy.com/tec1/index.cgi';
    let postData = `mode=dispScr&scrfile=..%2Fadm_tec1%2Ftec1%2F07%2F${num}.csv&logName=%E4%B8%AD%E5%B7%9D%E7%A5%90%E9%80%9F&cls=07`
    // POSTリクエストを送信
    const response = await axios.post(url, postData);
    // 取得したHTMLを解析
    const html = response.data;
    const $ = cheerio.load(html);
    
    // 任意の <tr> 要素を取得 (例として、全ての <tr> 要素を取得)
    const trElements = $('tr');
    
    // 解析結果を格納する配列
    const results = [];

    // 各 <tr> 要素の子の <td> 要素を抽出
    trElements.each((index, trElement) => {
    const tdTexts = [];
    $(trElement).find('td').each((i, tdElement) => {
        tdTexts.push($(tdElement).text());
    });
    results.push(tdTexts);
    });

    // 解析結果を返す
    let newresults = {
        "goukaku":[
        ],
        "kako":[
        ],
        "num":num
    }
    let flug = 0;
    for (let doko = 0; doko < results.length; doko++) {
        const ima = results[doko];
        if (flug == 0){
            if (ima.length == 0){flug++}
        }
        else if(flug == 1){
            if (ima.length == 0){flug++}
            else{newresults.goukaku.push(Number(ima[1].slice(0,-2)))}
        }
        else if(flug == 2){
            if (ima.length == 0){flug++}
        }
        else if(flug == 3){
            if (ima.length == 0){flug++}
            else {
                let tempzisho = {}
                tempzisho["per"] = (Number(ima[0].slice(0,-2)))
                tempzisho["sec"] = (Number(ima[1].slice(0,-2)))
                tempzisho["time"] = ima[2]
                tempzisho["testname"] = ima[3]
                newresults.kako.push(tempzisho)
            }
        }
    }
    return newresults;
    
} catch (error) {
    console.error('Error making POST request or parsing HTML:', error);
    throw error; // エラーが発生した場合は、エラーを再スローして呼び出し元に通知
}
}
async function aaaa() {
    let kekka = []
    let asyncFunctions = []
    for (let bangou = 0; bangou < 44; bangou++) {
        let num = `17${String(bangou).padStart(2, '0')}`
        asyncFunctions.push(postRequestAndParseHtml(num))
        Promise.all(asyncFunctions).then((results) => {
            kekka = results
        });
    }
    await Promise.all(asyncFunctions);
    return kekka
}
aaaa().then(results => {
    let ketugou = ""
    for (let ima = 0; ima < results.length; ima++) {
        ketugou = ketugou + results[ima].goukaku + "\n";
    }
    console.log(ketugou)
})