import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {useHistory} from 'react-router-dom';
import PublishIcon from '@material-ui/icons/Publish';
import Tooltip from '@material-ui/core/Tooltip';
import { useStateValue } from '../Pages/StateProvider';
import ListIcon from '@material-ui/icons/List';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link:{
    color: "white",
    textDecoration: 'none',

  }
}));

export default function MenuAppBar({Header}) {
  const classes = useStyles();
  const history = useHistory();
  const [Loading, setLoading,CompatibilityMessage, setCompatibilityMessage,UserArticle, setUserArticle,Account, setAccount,NewsList, setNewsList,Contract, setContract,NewsCount, setNewsCount,NewsIndex, setNewsIndex] = useStateValue();

  const handleOnClickProfile = () => history.push('/user');
  const handleOnClickUpload = () => history.push('/upload');
  const handleOnClickNews = () => history.push('/');

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {/* <a target="_blank"
                 rel="noopener noreferrer"
                 className={classes.link}
                 href={"https://etherscan.io/address/" + Account}>
                {Account.substring(0,6)}...{Account.substring(38,42)}
              </a> */}
              {Header}
          </Typography>
          <div>
          <Tooltip title="News">
              <IconButton
                onClick={handleOnClickNews}
                color="inherit"
              >
                <ListIcon />
              </IconButton>  
              </Tooltip>            
            </div>
          <div>
          <Tooltip title="Upload News">
              <IconButton
                onClick={handleOnClickUpload}
                color="inherit"
              >
                <PublishIcon />
              </IconButton>  
              </Tooltip>            
            </div>
            <div>
            <Tooltip title="Profile">
              <IconButton
                onClick={handleOnClickProfile}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              </Tooltip>              
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}