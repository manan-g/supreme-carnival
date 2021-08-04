import { useState } from "react";
import { useStateValue } from "../Pages/StateProvider";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiTextField-root": {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        display: "flex",
        flexDirection: "column",
    },
}));

//Declare IPFS
const { create } = require("ipfs-http-client");
const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

export default function UploadMediaComp({
    NewsIndex,
    setNewsIndex,}) {
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
    ] = useStateValue();
    const classes = useStyles();

    const [Media, setMedia] = useState();
    const [Description, setDescription] = useState();
    const captureFile = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        const reader = new window.FileReader();

        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setMedia({
                buffer: Buffer(reader.result),
                type: file.type !== "" ? file.type : "none",
                name: file.name,
            });
        };
    };

    async function UploadMedia(e) {
        e.preventDefault();
        if (Media === undefined || NewsIndex === null) return;

        setLoading(true);
        console.log("Submitting file to IPFS...");

        try {
            const temp_media = await ipfs.add(Media.buffer);
            //Call smart contract uploadFile function
            await Contract.methods
                .uploadMediaToNewsArticle(
                    parseInt(NewsIndex),
                    temp_media.path,
                    temp_media.size,
                    Media.type,
                    Media.name,
                    Description
                )
                .send({ from: Account })
                .on("transactionHash", (hash) => {
                    // setMedia(undefined);
                    setLoading(false);
                })
                .on("error", (e) => {
                    window.alert("Error");
                });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={UploadMedia} className = {classes.root}>
            <TextField
                required
                label="Description"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                    e.preventDefault();
                    setDescription(e.target.value);
                }}
                placeholder="description..."
            />
            {Media && <Button variant="contained" type="submit">
                <b>Upload!</b>
            </Button>}
            <Button variant="contained" component="label">
            Choose File
                <input type="file" hidden onChange={captureFile} />
            </Button>

        </form>
    );
}
