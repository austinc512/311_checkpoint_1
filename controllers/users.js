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

// I'm not updating the property when it's an empty string for some reason
const updateUser = (req, res) => {
  console.log(req.body);
  const result = dataSet.filter((element) => element.id == req.params.id);
  if (result.length === 0) {
    res.status(404).json();
    return;
  }
  // need to check every time a property gets updated
  let counter = 0;
  const targetObject = result[0];
  const apiData = new Object(req.body);
  // if api.data[property] exists (is neither undefined nor null), update prop on targetObject and increment counter
  if ((apiData.name ?? false) || apiData.name === "") {
    targetObject.name = String(apiData.name ?? targetObject.name);
    counter++;
    // when updating name, it works
    // having only implemented this pattern here, the request fails if I don't include the name property. This is what I want.
    // updating to the exact same value still passes, however

    // so after implementing the || apiData.name === "" for all pieces of the request, these will all get updated if passed.
  }
  // I'm making the decision that username can't be updated because these should be unique values as well.
  if ((apiData.email ?? false) || apiData.email === "") {
    targetObject.email = String(apiData.email ?? targetObject.email);
    counter++;
  }
  if (apiData.address ?? false) {
    console.log(`entering apiData.address ?? false`);
    // if (apiData.address && typeof apiData.address == "object"
    if (typeof apiData.address == "object") {
      console.log(`entering typeof apiData.address == object`);
      // whenever I pass an empty string, it won't update that value.
      // if (apiData.address.street ?? false)
      //    when I pass an empty string as left operand, that's the operand that gets returned, and '' is a falsy value
      //      so I'm not entering these blocks with empty string
      if ((apiData.address.street ?? false) || apiData.address.street === "") {
        targetObject.address.street = String(apiData.address.street);
        counter++;
      }
      if ((apiData.address.suite ?? false) || apiData.address.suite === "") {
        console.log(`entering suite block`);
        targetObject.address.suite = String(apiData.address.suite);
        counter++;
      }
      if ((apiData.address.city ?? false) || apiData.address.city === "") {
        targetObject.address.city = String(apiData.address.city);
        counter++;
      }
      if (
        (apiData.address.zipcode ?? false) ||
        apiData.address.zipcode === ""
      ) {
        targetObject.address.zipcode = String(apiData.address.zipcode);
        counter++;
      }
      if (typeof apiData.address.geo == "object") {
        console.log(`entering typeof apiData.address.geo === object`);
        if (
          (apiData.address.geo.lat ?? false) ||
          apiData.address.geo.lat === ""
        ) {
          targetObject.address.geo.lat = String(apiData.address.geo.lat);
          counter++;
        }
        if (
          (apiData.address.geo.lng ?? false) ||
          apiData.address.geo.lng === ""
        ) {
          targetObject.address.geo.lng = String(apiData.address.geo.lng);
          counter++;
        }
      }
    }
    // truthy values ??
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
