import React from "react";

import Header from "header";
import Footer from "footer";

export default class extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <br />
        <h2>404</h2>
        <br />
        <h3>你知道吗？</h3>
        <br />
        <p>404是一个http错误代码，指的是网页不存在。这些错误代码是一个叫Tim Berners-Lee的家伙定义的。他在1990年开发了世界上第一款网页浏览器。http错误代码是在ftp错误代码的基础上演变而来的。</p>
        <br />
        <p>404的含义：第一个4表示客户端出错，也就是服务器对你说：嘿，天堂有路你不走，404无门你偏要闯进来；第二个0表示你把网址打错了；最后一个4表示这个错误代码在4开头的错误代码中排行老四。</p>
        <br />
        <p>关于404还有一个有趣的故事，现实版的哦。Room 404，一般表示的是4楼第四个房间。在CERN（欧洲粒子物理研究所）是找不到这个房间的，因为在CERN第一个数4表示的第四栋楼，第二个数表示的不是第几层，后面两个数字合起来表示的办公室的编号，而第四号楼是没有编号为04的办公室的。</p>
        <br />
        <p>你知道正常页面返回的http代码是什么吗？答案是：200，我们看不到这个代码，因为浏览器正在显示服务器发送过来的页面。</p>
        <Footer />
      </div>
    )
  }
}
