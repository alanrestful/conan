import Timeline from "./index";
import { connect } from "react-redux";
// import { GET_ADDRESS_SUCCESS } from 'actionTypes';
import { listenerTarrayStorage, fetchUtil, actionCreator } from "../../../actions/util";

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
      listenerTarrayStorage((a) => {
        console.log(a);
      }, (a) => {
        console.log(a);
      });
      // fetchUtil({ url: '/api/buyer/receiver-infos', hrefCallback: "/address", history })
      // .then(data => {
      //   let selectedAddressId = 1; // confirmAddressId(data);
      //   dispatch(actionCreator("GET_ADDRESS_SUCCESS", { result: data, selectedAddressId: selectedAddressId }))
      // })
    }
  }
})(Timeline);
