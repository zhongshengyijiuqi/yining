/*
 * @Author: kendrick任
 * @Date: 2022-06-24 08:39:43
 * @LastEditTime: 2022-06-27 16:00:04
 * @Description: 文件说明
 * @FilePath: \moblie-meeting-future\postcss.config.js
 *
 */
module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 20,
      propList: ["*"],
    },
  },
};
