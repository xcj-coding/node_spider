// const express = require('express');
// const app = express();
const http = require('http');
const fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');

let spider_config = require('./spider_config');

let i = 0;
let first_url = spider_config.firstLink;

function fetchPage(first_url) {
    startRequest(first_url);
}

function startRequest(first_url) {

    request.defaults({ 'proxy': 'http://125.89.52.41:8118' }).get(first_url, function(err, response, body){
        console.log(err)
        console.log(response)
        console.log(body)
    })
    // http.request({
    //     host: '125.89.52.41',
    //     port: '8118',
    //     method: 'GET',
    //     path: first_url,
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    // }, function (res) {
    //     let html = '';

    //     res.setEncoding('utf-8');

    //     res.on('data', function (chunk) {
    //         html += chunk;
    //     });

    //     res.on('end', function () {
    //         $ = cheerio.load(html);

    //         let news_item = {
    //             title: $(spider_config.spider_element.title).text().trim(),
    //             time: $(spider_config.spider_element.time).text().trim(),
    //             link: spider_config.host + $(spider_config.spider_element.nowLink).attr('href'),
    //             author: $(spider_config.spider_element.author).text().trim(),
    //             index: i++
    //         };

    //         savedContent($, news_item.title);
    //         savedImg($, news_item.title);

    //         let nextUrl = spider_config.host + $(spider_config.spider_element.nextLink).attr('href');

    //         let strArray = nextUrl.split('-');

    //         let strUrl = encodeURI(strArray[0]);

    //         if (i <= 1) {
    //             fetchPage(strUrl);
    //         }

    //     });
    // });
}

function savedContent($, title) {
    let p_context = '';
    $(spider_config.spider_element.content).each(function (index, item) {
        let p_istext = $(this).text().substring(0, 2).trim();
        if (p_istext == '') {
            p_context += $(this).text() + '\n';
        }
        // let p_context = $(this).text();
        // let p_istext = p_context.substring(0, 2).trim();
        // if(p_istext == ''){
        //     p_context = p_context + '\n';
        //     fs.appendFile('./data/' + title + '.txt', p_context, 'utf-8', function (err) {
        //         if (err) {
        //             console.log(err);
        //         }
        //     });
        // }
    });


    fs.writeFileSync('./data/' + title + '.txt', p_context, 'utf-8', function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function savedImg($, title) {
    $(spider_config.spider_element.img).each(function (index, item) {
        let img_title = $(this).parent().next().text().trim();
        if (img_title.length > 35 || img_title == '') {
            img_title = 'default';
        }
        let img_filename = img_title + '.jpg';
        let img_src = spider_config.host + $(this).attr('src');
        console.log(img_src);
        request.head(img_src, function (err, res, body) {
            if (err) {
                console.log(err);
            }
        });

        request(img_src).pipe(fs.createWriteStream('./image/' + i + '-' + img_filename));

        let img_content = $(this).attr('src');
    });
}

fetchPage(first_url);





// app.get('/', (req, res)=>{
//     request('https://www.jd.com/', (error, response, body)=>{
//         if(!error && response.statusCode == 200){
//             console.log(response);
//             console.log(body);
//             $ = cheerio.load(body);
//             res.json({
//                 cat: $('.cate_menu_item').length,
//                 response: response,
//                 body: body
//             });
//         }
//     });
// });

// const server = app.listen(3000, ()=>{
//     console.log('listening at 3000');
// });


//        3月2日上午，台湾实践大学校长陈振贵一行访问无锡校区。北京大学软件与微电子学院常务副院长吴中海、新兴交叉学科组教授罗正忠、软件技术与服务工程学科组副教授段莉华等参加了会见。
//        陈振贵校长一行首先在吴中海常务副院长的陪同下参观了校园，对校区优美的环境和良好的教学科研条件表示了充分的肯定。

//        在无锡校区就读的2015级硕士研究生中有四名是实践大学毕业生，陈校长一行专程去学生宿舍看望他们，详细了解同学们在无锡的学习生活情况，与同学们亲切交流，并勉励他们用功学习，保重身体。
//        参观结束后，双方进行了座谈。陈振贵校长首先介绍了实践大学的相关情况和“跨领域、多专长”人才的培养理念，表示期待与北京大学软件与微电子学院开展相关合作。吴中海常务副院长对陈振贵校长一行的到来表示欢迎，并介绍了学院的学科发展和人才培养情况，学院在教学与科研等多领域已与境内外多所知名高校建立了良好的合作关系，希望实践大学此次来访，能够取得更多有益的成果。双方就在学科建设、人才培养等方面开展进一步合作，达成了初步意向。
