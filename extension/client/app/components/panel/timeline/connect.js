import Timeline from "./index";
import { connect } from "react-redux";
import moment from "moment";
import { fetchUtil, actionCreator } from "../../../actions/util";

export default connect(state => {
  return {
    selectedPage: state.actions.selectedPage
  };
}, dispatch => {
  return {
  };
})(Timeline);
