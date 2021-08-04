import React from "react";
import NewsListComp from "../components/NewsListComp";
import './NewsPage.css'
import MenuAppBar from "../components/MenuAppBar"

export default function NewsPage() {
    return (
        <div>
        <MenuAppBar Header="News"/>
            <NewsListComp />
        </div>
    );
}
