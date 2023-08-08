const dataSet = require("../data/index");

console.log(dataSet);

const listUsers = (req, res) => {
  res.json(dataSet);
};

const showUser = (req, res) => {
  const result = dataSet.filter((element) => element.id == req.params.id);
  if (result.length === 0) {
    res.status(404).json();
    // res.json(`This doesn't appear to be a valid comment ID`);
  } else {
    res.json(result[0]);
  }
};

const createUser = (req, res) => {
  // will handle validation later

  const newOb = new Object(req);
  const newUser = {};

  for (let item in newOb) {
    // do some iteration here
    // make the properties of the newUser object the same as the newOb
    newUser.item = newOb.item;
    // what if there's properties in the request
    // that aren't a part of my data model?

    // what if I just make a class instance and check for validation that way?
  }

  // explicit handling is probably the best thing

  // react: class based programming
  // now: functional programming

  /*

  only doing one thing at a time
  don't want to get username mixed up, so not really a loop

  script and reading from spreadsheet

  CSV -> loop through to create instance of object

  no class, nor object creation. Just like line 55 and below.

  can reference values as an array in place as the properties of the object.

  */

  newUser.id = dataSet.length + 1;
  newUser.name = req.body.name;
  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.address = req.body.address;
  newUser.phone = req.body.phone;
  newUser.website = req.body.website;
  newUser.company = req.body.company;
  dataSet.push(newUser);
  res.json(newUser);
  console.log(dataSet);
};

const updateUser = (req, res) => {
  // do something
};

// const deleteUser = (req, res) => {
//   let targetIndex;
//   const selectUser = dataSet.filter((element, index) => {
//     if (element.id == req.params.id) {
//       targetIndex = index;
//       return true;
//     }
//   });
//   res.json(`target index is ${targetIndex}`);
//   dataSet.splice(targetIndex, 1);
//   console.log(dataSet);
// };

const deleteUser = (req, res) => {
  let targetIndex;
  dataSet.forEach((element, index) => {
    if (element.id == req.params.id) {
      targetIndex = index;
    }
  });
  if (!targetIndex) {
    res.status(404).json();
    return;
  }
  // res.json(`target index is ${targetIndex}`);
  dataSet.splice(targetIndex, 1);
  console.log(dataSet);
  res.status(200).json({ message: `user successfully deleted!` });
};

/*

ex. object:

{
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  },

*/

module.exports = {
  listUsers,
  showUser,
  createUser,
  updateUser,
  deleteUser,
};

// if (!req.body.name || !req.body.description) {
//     res
//       .status(400)
//       .json({ message: "you have not supplied a product property" });
