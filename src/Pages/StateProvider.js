import React, { useContext, useEffect, useState } from "react";
import { loadBlockchainData, loadWeb3 } from "./Util";
export const UserContext = React.createContext();

export const StateProvider = ({ children }) => {
    const [Loading, setLoading] = useState(true);
    const [CompatibilityMessage, setCompatibilityMessage] = useState("Loading...");
    const [UserArticle, setUserArticle] = useState([]);
    const [Account, setAccount] = useState(0x0);
    const [NewsList, setNewsList] = useState([]);
    const [Contract, setContract] = useState(); //contract
    const [NewsCount, setNewsCount] = useState(0);

    useEffect(() => {
        let isCancelled = false;
        const runAsync = async () => {
            try {
                if (!isCancelled) {
                    // do the job
                    let browser_compatibility = await loadWeb3();

                    if (browser_compatibility) {
                        await loadBlockchainData(
                            setUserArticle,
                            setAccount,
                            setNewsList,
                            setContract,
                            setNewsCount,
                            setLoading
                        );
                        setLoading(false);
                        window.ethereum.on('accountsChanged', function (accounts) {
                            // Time to reload your interface with accounts[0]!
                            window.location.reload();
                          })
                    } else {
                        setCompatibilityMessage(
                            "Non-Ethereum browser detected. You should consider trying MetaMask!"
                        );
                    }
                }
            } catch (e) {
                if (!isCancelled) {
                    throw e;
                }
            }
        };
        runAsync();

        return () => {
            isCancelled = true;
        };
    }, []);

    
    
    return (
        <UserContext.Provider
            value={[Loading, setLoading,CompatibilityMessage, setCompatibilityMessage,UserArticle, setUserArticle,Account, setAccount,NewsList, setNewsList,Contract, setContract,NewsCount, setNewsCount]}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useStateValue = () => useContext(UserContext);
