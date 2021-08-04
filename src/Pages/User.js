import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { v4 as uuidv4 } from "uuid";
import MenuAppBar from "../components/MenuAppBar";
import UserNewsTable from "../components/UserNewsTable";

export default function User() {
    const [
        Loading,
        ,
        ,
        ,
        UserArticle,
        setUserArticle,
        Account,
        ,
        ,
        ,
        Contract,
    ] = useStateValue();

    useEffect(() => {
        let isCancelled = false;
        const runAsync = async () => {
            try {
                if (!isCancelled && Loading) {
                    // do the job
                    const user_article = await Contract.methods
                        .getPlatformUserArticles(Account)
                        .call();
                    setUserArticle(user_article);
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
    }, [Loading]);

    return (
        <div>
            {!Loading && (
                <>
                    <MenuAppBar Header="Profile" />
                    <div>
                        <UserNewsTable />
                    </div>
                </>
            )}
        </div>
    );
}
