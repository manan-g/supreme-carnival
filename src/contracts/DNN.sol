pragma solidity ^0.8.0;

contract DNN {

  uint public newsCount = 0;
  mapping(uint => News) public news;
  mapping(address => PlatformUser) public users;

  struct PlatformUser{
    address userId;
    uint[] newsIds;
  }

  struct File{
    uint fileId;
    uint newsId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address uploader;
  }
  
  struct News{
    uint newsId;
    string NewsTopic;
    string NewsDescription;
    uint uploadTime;
    uint filesCount;
    address uploader;
    File[] files;
  }

  // Event
  event UserCreated(
    address userId
  );

  event FileUploaded(
    uint fileId,
    uint newsId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName,
    string fileDescription,
    uint uploadTime,
    address uploader
  );

  //News event
  event NewsUploaded(
    uint newsId,
    string NewsTopic,
    string NewsDescription,
    uint uploadTime,
    address uploader
  );

  // Upload File function
  function uploadMediaToNewsArticle(uint _newsId, string memory _fileHash, uint _fileSize, string memory _fileType,string memory _fileName,string memory _fileDescription) public
  {

    require(bytes(_fileHash).length>0);
    require(bytes(_fileType).length>0);
    require(bytes(_fileName).length>0);
    require(bytes(_fileDescription).length>0);
    require(_fileSize>0);
    require(msg.sender==news[_newsId].uploader);
    
    news[_newsId].filesCount++;
    news[_newsId].files.push(File(news[_newsId].filesCount,_newsId,_fileHash,_fileSize, _fileType,_fileName,_fileDescription,block.timestamp,msg.sender));

    emit FileUploaded(news[_newsId].filesCount,_newsId,_fileHash,_fileSize,_fileType,_fileName,_fileDescription,block.timestamp,msg.sender);
  }


  //Upload News Article
  function uploadNews(string memory _NewsTopic, string memory _NewsDescription) public returns (uint)
  {

    require(bytes(_NewsTopic).length>0);
    require(bytes(_NewsDescription).length>0);
    require(msg.sender!=address(0));
    newsCount++;
    
    News storage temp = news[newsCount];
    temp.newsId = newsCount;
    temp.NewsTopic = _NewsTopic;
    temp.NewsDescription = _NewsDescription;
    temp.uploadTime = block.timestamp;
    temp.uploader = msg.sender;
    temp.filesCount = 0;

    if(users[msg.sender].userId==address(0))
    {
      PlatformUser storage temp_user = users[msg.sender];
      temp_user.userId=msg.sender;
      emit UserCreated(msg.sender);
    }
    
    users[msg.sender].newsIds.push(temp.newsId);
    
    emit NewsUploaded(newsCount, _NewsTopic, _NewsDescription, block.timestamp,msg.sender);
    return newsCount;
  }
    function getPlatformUserArticles(address userId) public view returns (News[] memory)
    {
      News[] memory list = new News[](users[userId].newsIds.length);
      for(uint i = 0;i<users[userId].newsIds.length;i++)
      {
        list[i] = news[users[userId].newsIds[i]];
      }
      return list;
    }
    function getArticleMediaList(uint newsid) public view returns (File[] memory)
    {
      return news[newsid].files;
    }
}