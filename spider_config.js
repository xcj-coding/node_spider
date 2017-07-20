module.exports = {
    host: 'http://www.ss.pku.edu.cn/',
    firstLink : "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391",
    spider_element: {
        title: 'div.article-title a', 
        time: '.article-info a:last-child',
        nowLink: 'div.article-title a',
        nextLink: 'li.next a',
        author: '[title=供稿]',
        content: '.article-content p',
        img: '.article-content img'
    },
}