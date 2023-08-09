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
  console.log(req.body);
  const result = dataSet.filter((element) => element.id == req.params.id);
  if (result.length === 0) {
    res.status(404).json();
    return;
  }
  const targetObject = result[0];
  const apiData = new Object(req.body);
  // current implementation doesn't cover if no properties get updated by request
  // is that okay? If so, I'm done.
  // just to be explicit here, {} will return 200;
  targetObject.name = String(apiData.name ?? targetObject.name);
  // I'm making the decision that username can't be updated
  // these usually are customer-facing unique values,
  // although I'm not controlling for unique usernames during object creation
  targetObject.email = String(apiData.email ?? targetObject.email);
  if (apiData.address && typeof apiData.address == "object") {
    targetObject.address.street = `${
      apiData.address.street ?? targetObject.address.street
    }`;
    targetObject.address.suite = String(
      apiData.address.suite ?? targetObject.address.suite
    );
    targetObject.address.city = String(
      apiData.address.city ?? targetObject.address.city
    );
    targetObject.address.zipcode = String(
      apiData.address.zipcode ?? targetObject.address.zipcode
    );
    targetObject.address.geo.lat = String(
      apiData.address.geo?.lat ?? targetObject.address
    );
    targetObject.address.geo.lng = String(
      apiData.address.geo?.lng ?? targetObject.address
    );
  } else if (apiData.address && typeof apiData.address !== "object") {
    res.status(400).json({
      message: "address is not an object",
    });
    return;
  }

  if (apiData.company && typeof apiData.company == "object") {
    targetObject.company.name = String(
      apiData.company.name ?? targetObject.company.name
    );
    targetObject.company.catchPhrase = String(
      apiData.company.catchPhrase ?? targetObject.company.catchPhrase
    );
    targetObject.company.bs = String(
      apiData.company.bs ?? targetObject.company.bs
    );
  } else if (apiData.company && typeof apiData.company !== "object") {
    res.status(400).json({
      message: "company is not an object",
    });
    return;
  }
  console.log(targetObject);
  res.json(targetObject);
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
  res.json({ message: `user successfully deleted!` });
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
