import DNN from "../abis/DNN.json";
import Web3 from "web3";

export async function loadWeb3() {
    let browser_compatibility = false;
    //Setting up Web3
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        browser_compatibility = true;
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        browser_compatibility = true;
    }
    return browser_compatibility;

}

export async function loadBlockchainData(
    setUserArticle,
    setAccount,
    setNewsList,
    setContract,
    setNewsCount,
    setLoading
) {
    //Declare Web3
    const web3 = window.web3;

    //Load account
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    //Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = DNN.networks[networkId];

    //IF got connection, get data from contracts
    if (networkData) {
        //Assign contract
        const d_news = new web3.eth.Contract(DNN.abi, networkData.address);
        setContract(d_news);
        //Get files amount

        const user_article = await d_news.methods.getPlatformUserArticles(accounts[0]).call();
        setUserArticle(user_article);

        const news_count = await d_news.methods.newsCount().call();
        setNewsCount(news_count);

        //Load news
        for (let i = news_count; i >= 1; i--) {
            const news_t = await d_news.methods.news(i).call();
            setNewsList((prev) => {
                return [...prev, news_t];
            });
        }
    } else {
        //alert Error
        window.alert("Contract not deployed to detected network.");
        setLoading(true);
    }
}
