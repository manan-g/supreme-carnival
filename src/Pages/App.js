import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import User from "./User";
import NewsPage from "./NewsPage";
import UploadNewsPage from "./UploadNewsPage";
import SingleNewsView from "./SingleNewsView";
import { useStateValue } from "./StateProvider";

function App() {
    //state variables
    const [
        Loading,,
        CompatibilityMessage
    ] = useStateValue();

    return (
        <>
            {Loading ? (
                <div>{CompatibilityMessage}</div>
            ) : (
                <Router>
                        <Switch>
                            <Route exact path="/upload">
                                <UploadNewsPage />
                            </Route>
                            <Route exact path="/">
                                <NewsPage />
                            </Route>
                            <Route exact path="/user">
                                <User />
                            </Route>
                            <Route
                                exact
                                path="/:Id"
                                component={SingleNewsView}
                            ></Route>
                        </Switch>
                </Router>
            )}
        </>
    );
}

export default App;
