pragma solidity ^0.4.18;

contract Ipfs {

  struct FileInfo {
    string name;
    string fileHash;
  }

  FileInfo[] fileinfo;

  function setUploadFileInfo(string _name, string _hash) public {
    FileInfo memory meta = FileInfo(_name, _hash);
    fileinfo.push(meta);
  }

  function getUploadFileInfo(uint _id) public view returns(string, string) {
    return (fileinfo[_id].name, fileinfo[_id].fileHash);
  }

  function getLength() public view returns(uint) {
    return fileinfo.length;
  }
}