const dataSet = require("../data/index");

const listUsers = (req, res) => {
  res.json(dataSet);
};

const showUser = (req, res) => {
  const result = dataSet.filter((element) => element.id == req.params.id);
  if (result.length === 0) {
    res.status(404).json();
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
  // if (typeof data.name)
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

// you should be able to update a property to an empty string. I'm allowing this everywhere.
// use case: user needs to update to a new address that doesn't have a suite.
// users are still referred to uniquely by their id (which cannot be updated).
// everything else is fair game.
// properties sent in the PUT request WILL be updated so long as they're of the correct datatype.
const updateUser = (req, res) => {
  console.log(req.body);
  const result = dataSet.filter((element) => element.id == req.params.id);
  if (result.length === 0) {
    res.status(404).json();
    return;
  }
  // use a counter to tally every time a property gets updated.
  // if no properties are updated, return an error.
  let counter = 0;
  const targetObject = result[0];
  const apiData = new Object(req.body);
  // I only want string inputs, so only accept if string.
  if (typeof apiData.name === "string") {
    targetObject.name = apiData.name;
    counter++;
  }
  // I'm making the decision that username can't be updated because these should be unique values as well.
  if (typeof apiData.email === "string") {
    targetObject.email = apiData.email;
    counter++;
  }

  if (typeof apiData.address == "object") {
    console.log(`entering typeof apiData.address == object`);
    if (typeof apiData.address.street === "string") {
      targetObject.address.street = apiData.address.street;
      counter++;
    }
    if (typeof apiData.address.suite === "string") {
      console.log(`entering suite block`);
      targetObject.address.suite = apiData.address.suite;
      counter++;
    }
    if (typeof apiData.address.city === "string") {
      targetObject.address.city = apiData.address.city;
      counter++;
    }
    if (typeof apiData.address.zipcode === "string") {
      targetObject.address.zipcode = apiData.address.zipcode;
      counter++;
    }
    if (typeof apiData.address.geo == "object") {
      console.log(`entering typeof apiData.address.geo === object`);
      if (typeof apiData.address.geo.lat === "string") {
        targetObject.address.geo.lat = apiData.address.geo.lat;
        counter++;
      }
      if (typeof apiData.address.geo.lng === "string") {
        targetObject.address.geo.lng = apiData.address.geo.lng;
        counter++;
      }
    }
    // if apiData.address is a falsy value, it's just getting ignored.
    // if I pass 0 into it, it'll get ignored (good) but it won't throw an error (bad).
    // want to avoid null and undefined getting caught in falsy, so not including that in condition.
    // how can I add nullish to the condition again?
  } else if (apiData.address && typeof apiData.address !== "object") {
    res.status(400).json({
      message: "address is not an object",
    });
    return;
  }

  if (typeof apiData.phone === "string") {
    targetObject.phone = apiData.phone;
  }
  if (typeof apiData.website === "string") {
    targetObject.website = apiData.website;
  }

  if (typeof apiData.company == "object") {
    if (typeof apiData.company.name === "string") {
      targetObject.company.name = apiData.company.name;
      counter++;
    }

    if (typeof apiData.company.catchPhrase === "string") {
      targetObject.company.catchPhrase = apiData.company.catchPhrase;
      counter++;
    }

    if (typeof apiData.company.bs === "string") {
      targetObject.company.bs = apiData.company.bs;
      counter++;
    }
    // truthy values?
  } else if (apiData.company && typeof apiData.company !== "object") {
    res.status(400).json({
      message: "company is not an object",
    });
    return;
  }
  console.log(targetObject);
  if (counter === 0) {
    res
      .status(400)
      .json({ message: "no properties of the target object were updated" });
  } else {
    res.json(targetObject);
  }
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
