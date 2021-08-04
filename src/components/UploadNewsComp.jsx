import { useState } from "react";
import { useStateValue } from "../Pages/StateProvider";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
      display:'flex',
      flexDirection:'column',
    },
    text:{
        
    }
  }));

export default function UploadNewsComp({News, setNews}) {
    const [Loading, setLoading,CompatibilityMessage, setCompatibilityMessage,UserArticle, setUserArticle,Account, setAccount,NewsList, setNewsList,Contract, setContract,NewsCount, setNewsCount] = useStateValue();
    const classes = useStyles();
    const history = useHistory();

    async function UploadNews(e) {
        e.preventDefault();
        const topic = News.topic;
        const description = News.description;
        if(topic!='' && description != '')
        {
        Contract.methods
            .uploadNews(topic, description)
            .send({ from: Account })
            .on("transactionHash", async (hash) => {
                setNews({
                    topic: "",
                    description: "",
                });

                const news_count = await Contract.methods.newsCount().call();
                //Load news
                for (let i = news_count; i > NewsCount; i--) {
                    const news_t = await Contract.methods.news(i).call();
                    setNewsList((prev) => {
                        return [news_t, ...prev];
                    });
                }
                setNewsCount(news_count);
            })
            .on('receipt',async (receipt)=>{
                
                const user_article = await Contract.methods.getPlatformUserArticles(Account).call();
                setUserArticle(user_article);
                history.push(`/${receipt.events.NewsUploaded.returnValues.newsId}`)
            })
            .on("error", (e) => {
                window.alert("Error");
            });
        }
    }

    return (
        <form onSubmit={UploadNews} className={classes.root} autoComplete="off">
            <div className={classes.text}>
        <TextField  required label="Headline" variant="outlined" fullWidth
        onChange={(e) =>
                    setNews((prev) => {
                        return {
                            topic: e.target.value,
                            description: prev.description,
                        };
                    })
                } />
            </div>

            <div>
            <TextField required label="Description" fullWidth
            multiline variant="outlined"
                onChange={(e) =>
                    setNews((prev) => {
                        return {
                            topic: prev.topic,
                            description: e.target.value,
                        };
                    })
                }
            ></TextField>
            </div>
            <Button type="submit" variant="contained">Submit</Button>
        </form>
    );
}
