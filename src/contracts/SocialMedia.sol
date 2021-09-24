pragma solidity ^0.5.0;

contract SocialMedia {
    string public name = "Ethereum Social Media";
    uint public imageCount = 0;
    mapping(uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }

    event ImageUploaded (
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    event ImageAuthorTipped (
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    function uploadImage(
        string memory _imageHash,
        string memory _description
    ) public {
        require(bytes(_imageHash).length > 0, "Image hash cannot be blank");
        require(bytes(_description).length > 0, "Description cannot be blank");
        require(msg.sender != address(0), "Author cannot be blank");

        imageCount++;
        images[imageCount] = Image(imageCount, _imageHash, _description, 0, msg.sender);
        emit ImageUploaded(imageCount, _imageHash, _description, 0, msg.sender);
    }

    function tipImageAuthor(uint _id) public payable{
        require(_id > 0 && _id <= imageCount);
        Image memory _image = images[_id];
        address payable _author = _image.author;
        address(_author).transfer(msg.value);
        _image.tipAmount = _image.tipAmount + msg.value;
        images[_id] = _image;
        emit ImageAuthorTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
    }
}