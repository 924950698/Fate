/**
 * 魔法阵：召唤英雄的魔法阵
 *        选召新英雄的方法
 *        抽奖算法
 * @return
 */

let MagicCircle = {
    /**
     * 激活魔法阵：执行抽奖算法
     * (均匀随机算法)
     * params: inHeroList: 输入的列表, num: 人数
     * @return {calledHeros: 已中奖的人, newHerosList: 新的列表}
     */
    call: (inRawHeroList = [], num = 1) => {
        let inHeroList = inRawHeroList.concat()
        let myHeros = []
        for(let order = 0; order < num; order++) {
            inHeroList = MagicCircle.shuffle(inHeroList)
            let hero = inHeroList.splice(MagicCircle.selectOneNumber(0, inHeroList.length), 1)
            myHeros = myHeros.concat( hero )
        }

        return {
            calledHeros: myHeros || [],
            newHerosList: inHeroList || []
        }
    },
    // 产生 [0 , inHeroList.length) 的随机整数
    // test: test/selectOneNumber.js
    selectOneNumber: (start, end) => Math.floor(Math.random() * (end - start) + start),
    /**
     * 均匀随机洗牌
     * 打乱顺序
     * test: test/shuffle.js
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */
    /**
     * 数学归纳法证明 https://www.h5jun.com/post/array-shuffle.html
    对 n 个数进行随机：
    1. 首先我们考虑 n = 2 的情况，根据算法，显然有 1/2 的概率两个数交换，有 1/2 的概率两个数不交换，
        因此对 n = 2 的情况，元素出现在每个位置的概率都是 1/2，满足随机性要求。
    2. 假设有 i 个数， i >= 2 时，算法随机性符合要求，即每个数出现在 i 个位置上每个位置的概率都是 1/i。
    3. 对于 i + 1 个数，按照我们的算法，在第一次循环时，每个数都有 1/(i+1) 的概率被交换到最末尾，
        所以每个元素出现在最末一位的概率都是 1/(i+1) 。而每个数也都有 i/(i+1) 的概率不被交换到最末尾，
        如果不被交换，从第二次循环开始还原成 i 个数随机，根据 2. 的假设，它们出现在 i 个位置的概率是 1/i。
        因此每个数出现在前 i 位任意一位的概率是 (i/(i+1)) * (1/i) = 1/(i+1)，也是 1/(i+1)。
    4. 综合 1. 2. 3. 得出，对于任意 n >= 2，经过这个算法，每个元素出现在 n 个位置任意一个位置的概率都是 1/n。
     */
    shuffle: (arr) => {
      var len = arr.length
      for(var i = 0; i < len - 1; i++){
        var idx = Math.floor(Math.random() * (len - i))
        var temp = arr[idx]
        arr[idx] = arr[len - i - 1]
        arr[len - i -1] = temp
      }
      return arr
    }
}

module.exports = MagicCircle
