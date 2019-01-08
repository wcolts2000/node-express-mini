// implement your API here
const express = require("express");
const db = require("./data/db.js");
const PORT = 5000;

const server = express();

// wireup global middleware
server.use(express.json());

server.get("/", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.json(err);
    });
});

server.get("/api/users/:userid", (req, res) => {
  const id = req.params.userid;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })

    .catch(err => res.json(err));
});

server.post("/api/users", (req, res) => {
  const userInfo = req.body; // reads information from the body of the request

  db.insert(userInfo) // returns a promise, so we need to use .then
    .then(result => {
      db.findById(result.id)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err =>
          res.status(500).json({ message: "the get by id failed", error: err })
        );
    })
    .catch(err =>
      res.status(500).json({ message: "the post failed", error: err })
    );
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if (user) {
        db.remove(id).then(count => {
          res.status(200).json(user);
        });
      } else {
        res.status(500);
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get("/users/first/:first/last/:last", (req, res) => {
  res.send({ hello: `${req.params.first} ${req.params.last}` });
});

// greet?first=kai&last=Lovingfoss
server.get("/greet", (req, res) => {
  const { first, last } = req.query;

  res.send({ greetings: `${first} ${last}` });
});

server.put("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  try {
    const result = await db.update(id, changes);

    console.log("result", result);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
