import Timeline from "./index";
import { connect } from "react-redux";
// import { GET_ADDRESS_SUCCESS } from 'actionTypes';
import { initConnect, listenerTarrayStorage, initNativeMessage, clientInit, clientPlay, fetchUtil, actionCreator } from "../../../actions/util";

const confirmAddressId = (addressList) => {
  let address = {}
  if(addressList.length == 0){
    return ;
  }else if(_.find(addressList, (address)=> {return address.isDefault == 1})){
    address = _.find(addressList, (address)=> {return address.isDefault == 1});
  }else{
    address = addressList[0];
  }
  return address.id;
}

export default connect((state) => {
  return {
    result: state
  };
}, (dispatch) => {
  return {
    getData: (history) => {
      // 这个需要在页面加载时候就调用
      initConnect();

      listenerTarrayStorage((a) => {
        console.log(a);
      }, (a) => {
        console.log(a);
      });

      //数据回调
      initNativeMessage(() => {
        console.log("clientInitSuccess");
      }, (error) => {
        console.log("clientInitFailed");
        console.log(error);
      }, (error) => {
        console.log("clientDisconnected");
        console.log(error);
      }, (result) => {
        console.log("clientPlayRes");
      });

      clientInit();

      clientPlay({"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","isFormEl":true,"name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id='loginId']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","isFormEl":true,"name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id='password']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","isFormEl":false,"tagName":"BUTTON","type":"submit","xPath":"//*[@class='user-login-form']/button[1]"}],"url":"http://mallt.jidd.com.cn:8888/"});

      // fetchUtil({ url: '/api/buyer/receiver-infos', hrefCallback: "/address", history })
      // .then(data => {
      //   let selectedAddressId = 1; // confirmAddressId(data);
      //   dispatch(actionCreator("GET_ADDRESS_SUCCESS", { result: data, selectedAddressId: selectedAddressId }))
      // })
    }
  };
})(Timeline);
