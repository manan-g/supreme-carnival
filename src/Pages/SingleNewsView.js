import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import UploadMediaComp from "../components/UploadMediaComp";
import MediaTable from "../components/MediaTable";
import { Divider, Typography } from "@material-ui/core";
import moment from "moment";
import MenuAppBar from "../components/MenuAppBar";

export default function SingleNewsView() {
    const [
        Loading,
        setLoading,
        CompatibilityMessage,
        setCompatibilityMessage,
        UserArticle,
        setUserArticle,
        Account,
        setAccount,
        NewsList,
        setNewsList,
        Contract,
        setContract,
        NewsCount,
        setNewsCount,
    ] = useStateValue();
    const [CurrentNews, setCurrentNews] = useState(null);
    const [CurrentNewsFiles, setCurrentNewsFiles] = useState(null);
    const [NewsIndex, setNewsIndex] = useState();

    useEffect(() => {
        let isCancelled = false;
        const runAsync = async () => {
            try {
                if (!isCancelled) {
                    let i = parseInt(window.location.href.split("/")[3]);
                    if (typeof i === "number") {
                        const news_t = await Contract.methods.news(i).call();
                        setCurrentNews(news_t);
                        const files = await Contract.methods
                            .getArticleMediaList(i)
                            .call();
                        setCurrentNewsFiles(files);
                        setNewsIndex(i);
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
        <>
            <MenuAppBar Header="News" />
            {!CurrentNews && <div> Invalid</div>}
            <div>
                {CurrentNews && (
                    <div>
                        <Typography variant="h3"
                        style={{marginTop:"10px"}}>
                            {CurrentNews.NewsTopic}
                        </Typography>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                                style={{ marginTop: "10px", flex: "1" }}
                            >
                                {moment
                                    .unix(CurrentNews.uploadTime)
                                    .format("M/D/Y hh:mm:ss A ")}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                                style={{
                                    marginTop: "10px",
                                    textAlign: "right",
                                    flex: "1",
                                }}
                            >
                                Auther:{" "}
                                <a
                                    href={
                                        "https://etherscan.io/address/" +
                                        CurrentNews.uploader
                                    }
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    {CurrentNews.uploader.substring(0, 10)}
                                    ...
                                </a>
                            </Typography>
                        </div>
                        <Divider />
                        <Typography variant="body1"
                        style={{marginTop:"10px"}}>
                            {CurrentNews.NewsDescription}
                        </Typography>
                    </div>
                )}
            </div>

            <Divider />
            <div style={{marginTop:"10px"}}>
            <Typography  variant="h5" style={{marginBottom:"10px"}}>
                        Attached Media
                    </Typography>
            {CurrentNewsFiles && <MediaTable files={CurrentNewsFiles} />}
            </div>

            <Divider />
            <div style={{marginTop:"10px"}}>
                {CurrentNews && CurrentNews.uploader === Account && (
                    <><Typography  variant="h5">
                        Attach New Media
                    </Typography>
                    <UploadMediaComp NewsIndex={NewsIndex} />
                    </>
                )}
            </div>
        </>
    );
}
