const elm = document.createElement("div");
const Event = {
  Type: {
    OnUAStatusChange: "OnUAStatusChange",
    OnClickStartRingingTest: "OnClickStartRingingTest",
    OnClickCustomerListCallBtn: "OnClickCustomerListCallBtn",
  },
  dispatch(ename, data) {
    elm.dispatchEvent(new CustomEvent(ename, { detail: data }));
  },
  on(ename, callback) {
    elm.addEventListener(ename, callback);
  },
  off(ename, callback) {
    elm.removeEventListener(ename, callback);
  },
};
export default Event;
