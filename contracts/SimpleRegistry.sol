// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleRegistry {
    string private entityName;
    uint private entityAge;
    address private entityAddress;
    string private entityLocation;

    constructor(string memory name, uint age, string memory location) {
        entityName = name;
        entityAge = age;
        entityAddress = msg.sender;
        entityLocation = location;
    }

    // Function to update the entity's name
    function updateName(string memory newName) public {
        entityName = newName;
    }

    // Function to update the entity's address
    function updateAddress(address newAddress) public {
        entityAddress = newAddress;
    }

    // Function to update the entity's Location
    function updateLocation(string memory newLocation) public {
        entityLocation = newLocation;
    }

    // Function to update the entity's age
    function updateAge(uint newAge) public {
        entityAge = newAge;
    }

    // Function to retrieve the entity's name and age
    function getEntityDetails()
        public
        view
        returns (string memory name, uint age, address, string memory)
    {
        return (entityName, entityAge, entityAddress, entityLocation);
    }
}
