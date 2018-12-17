 let IP = 'http://127.0.0.1:8081'
/**
 * 清空已中名单
 */
window.deleteAllLog = () => {
    $.ajax({
        url: `${IP}/deleteAllexHerosLog`
    })
}
window.resetAlled = false // 是否执行过resetAll
/**
 * 释放出控制台操作，重置所有英雄
 */
window.resetAll = () => {
    if(!window.resetAlled) {
        $.ajax({
            url: `${IP}/recallAllHeros`
        }).done(() => {
            window.resetAlled = true
        })
        window.deleteAllLog()
    } else {
        console.warn(`%c%s`,"color: red;background: yellow;font-size: 18px",
            '已经执行过resetAll（重置抽奖名单），整个抽奖流程只能开始时执行。如果执意执行，请刷新页面！')
    }
}

export default () => {}
