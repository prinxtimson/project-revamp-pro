import React from "react";

const App = () => {
    return <div></div>;
};

export default App;

if (document.getElementById("app")) {
    ReactDOM.render(<App />, document.getElementById("app"));
}
