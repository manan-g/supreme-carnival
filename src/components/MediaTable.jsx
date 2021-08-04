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
        id: "fileName",
        label: "File Name",
        minWidth: 170,
    },
    {
        id: "fileDescription",
        label: "File Description",
        minWidth: 170,
    },
    {
        id: "fileHash",
        label: "File Hash",
        minWidth: 170,
    },
    {
        id: "fileSize",
        label: "File Size",
        minWidth: 170,
    },
    {
        id: "fileType",
        label: "File Type",
        minWidth: 170,
    },
    {
        id: "uploadTime",
        label: "Upload Time",
        minWidth: 170,
    },
    //   {
    //     id: 'Files',
    //     label: 'Media',
    //     minWidth: 170,
    //     align: 'right',
    //   },
];

// [
//     "1",
//     "2",
//     "QmefWggo8yAhFnmo7r4YhEwvqMorQFfZY42sDXXNtcfVDN",
//     "139615",
//     "image/jpeg",
//     "WhatsApp Image 2020-07-24 at 17.00.55.jpeg",
//     "lsndlndlnsldnlsd",
//     "1628056993",
//     "0x58D69048a41BEdc7B7C6A5Df1207DF3e6EACCE7E"
// ]

function createData(
    fileName,
    fileDescription,
    fileHash,
    fileSize,
    fileType,
    uploadTime
) {
    return {
        fileName,
        fileDescription,
        fileHash,
        fileSize,
        fileType,
        uploadTime: moment.unix(uploadTime).format("hh:mm:ss A M/D/Y"),
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

export default function StickyHeadTable({ files }) {
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
    files.map((value) => {
        rows.push(
            createData(
                value.fileName,
                value.fileDescription,
                value.fileHash,
                value.fileSize,
                value.fileType,
                value.uploadTime
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
                                            if (column.id === "fileHash")
                                            {
                                                return(<TableCell
                                                    key={uuidv4()}
                                                    align={column.align}
                                                >
                                                <a
                                                href={
                                                    "https://ipfs.infura.io/ipfs/" +
                                                    row["fileHash"]
                                                }
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            >
                                                {row["fileHash"].substring(
                                                    0,
                                                    10
                                                )}
                                                ...
                                            </a>
                                            </TableCell>)
                                            }
                                            else
                                            {
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
                                            );}
                                        })}
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
