import React, { useEffect, useState } from "react";
import MenuAppBar from "../components/MenuAppBar";
import UploadNewsComp from "../components/UploadNewsComp";

export default function UploadNewsPage() {
    const [News, setNews] = useState({ topic: "", description: "" });

    return (
        <div>
            <MenuAppBar Header="Upload News" />
            <UploadNewsComp
                News={News}
                setNews={setNews}
            />
        </div>
    );
}
