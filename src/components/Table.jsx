import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { useStateValue } from "../Pages/StateProvider";

const columns = [
    {
        id: "uploadTime",
        label: "Upload Time",
        minWidth: 170,
    },
    { id: "NewsTopic", label: "News Topic", minWidth: 100 },
    {
        id: "uploader",
        label: "Auther",
        minWidth: 170,
    },
    //   {
    //     id: 'Files',
    //     label: 'Media',
    //     minWidth: 170,
    //     align: 'right',
    //   },
];

function createData(uploadTime, NewsTopic, NewsDescription, uploader, newsId) {
    return {
        uploadTime: moment.unix(uploadTime).format("hh:mm:ss A M/D/Y"),
        NewsTopic,
        NewsDescription,
        uploader,
        newsId,
    };
}

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
});

export default function StickyHeadTable(props) {
    const [,,,,,,,,NewsList,...others] = useStateValue();
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rows = [];
    NewsList.map((value) => {
        rows.push(
            createData(
                value.uploadTime,
                value.NewsTopic,
                value.NewsDescription,
                value.uploader,
                value.newsId
            )
        );
    });

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={uuidv4()}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={uuidv4()}
                                    >
                                        {columns.map((column) => {
                                            if (
                                                column.id === "uploader" ||
                                                column.id === "NewsTopic"
                                            )
                                                return;
                                            const value = row[column.id];
                                            return (
                                                <TableCell
                                                    key={uuidv4()}
                                                    align={column.align}
                                                >
                                                    {column.format &&
                                                    typeof value === "number"
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell key={uuidv4()}>
                                            <Link
                                                to={{
                                                    pathname: `/${row["newsId"]}`
                                                }}
                                            >
                                                {row["NewsTopic"]}
                                            </Link>
                                        </TableCell>
                                        <TableCell key={uuidv4()}>
                                            <a
                                                href={
                                                    "https://etherscan.io/address/" +
                                                    row["uploader"]
                                                }
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            >
                                                {row["uploader"].substring(
                                                    0,
                                                    10
                                                )}
                                                ...
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
