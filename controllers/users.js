const dataSet = require("../data/index");

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
  // require name and username
  if (!req.body.name || !req.body.username) {
    res.status(400).json({
      message: "Creating a user requires both a name and a username.",
    });
    return;
  }
  let newUser = {};
  const data = req.body;
  newUser.id = dataSet.length + 1;
  newUser.name = `${data.name ?? ""}`;
  newUser.username = `${data.username ?? ""}`;
  newUser.email = `${data.email ?? ""}`;
  newUser.address = {}; // without doing this "Cannot set properties of undefined (setting 'street')"

  // only write to newUser.address if request payload passes an address object
  if (typeof data.address == "object") {
    newUser.address.street = `${data.address.street ?? ""}`;
    newUser.address.suite = String(data.address.suite ?? "");
    newUser.address.city = String(data.address.city ?? "");
    newUser.address.zipcode = String(data.address.zipcode ?? "");
    newUser.address.geo = {}; // without doing this "Cannot set properties of undefined (setting 'lat')"
    newUser.address.geo.lat = String(data.address.geo?.lat ?? "");
    newUser.address.geo.lng = String(data.address.geo?.lng ?? "");
  } else {
    res.status(400).json({
      message: "address is not an object",
    });
    return;
  }

  newUser.phone = String(data.phone ?? "");
  newUser.website = String(data.website ?? "");
  newUser.company = {}; // without doing this "Cannot set properties of undefined (setting 'name')"

  // only write to newUser.company if request payload passes a company object
  if (typeof data.company == "object") {
    newUser.company.name = String(data.company.name ?? "");
    newUser.company.catchPhrase = String(data.company.catchPhrase ?? "");
    newUser.company.bs = String(data.company.bs ?? "");
  } else {
    res.status(400).json({
      message: "company is not an object",
    });
    return;
  }
  console.log(newUser);
  dataSet.push(newUser);
  res.json(newUser);
};

const updateUser = (req, res) => {
  res.json({ message: "lookin good" });
  const result = dataSet.filter((element) => element.id == req.params.id);
  if (result.length === 0) {
    res.status(404).json();
    return;
  }
  const targetObject = result[0];
  // console.log(targetObject);
  const apiData = new Object(req.body);
  for (property in targetObject) {
    if (property == "id") {
      console.log(`nope`);
      continue;
    }
    if (apiData[property]) {
      targetObject[property] = apiData[property];
    }
    // if API request body passes a falsy value for some property, it's not updated.
    // is that okay?
  }
  console.log(targetObject);
};

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
}

minimum post object:

{
    "name": "LEEANNE GRAHAM",
    "username": "SUH DUUUDE",
    "address": {},
    "company": {}
}

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
