let app = require("express")();
app.use(require("cors")());

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const baseUrl = "https://hamon-interviewapi.herokuapp.com";

async function curl(url, method = "", data = "") {
  try {
    url += "?api_key=8Eb6a";
    let curlString = `curl ${data ? '-d "' + data + '"' : ""} ${
      method ? `-X ${method}` : ""
    } '${url}'`;
    console.log("curlString", curlString);
    let { stdout, stderr } = await exec(curlString);
    try {
      stdout = JSON.parse(stdout);
    } catch (er) {
      console.error("Error converting response to JSON");
      console.error(er);
      stdout = {};
    }
    console.log("std", stdout, stderr);
    return { stderr, stdout };
  } catch (err) {
    console.log("err", err);
    return { error: err };
  }
}

app.get("/subjects", async (req, res) => {
  let { error, stdout: success } = await curl(baseUrl + "/subjects/", "GET");
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ subjects: success.subjects || [] });
  }
});

app.get("/subjects/:id", async (req, res) => {
  let { id = "" } = req.params;
  let { error, stdout: success } = await curl(
    baseUrl + "/subjects/" + id + "/",
    "GET"
  );
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ subjects: success.subjects || [] });
  }
});

app.get("/students", async (req, res) => {
  let { error, stdout: success } = await curl(baseUrl + "/students/", "GET");
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ students: success.students || [] });
  }
});

app.get("/students/:id", async (req, res) => {
  let { id = "" } = req.params;
  let { error, stdout: success } = await curl(
    baseUrl + "/students/" + id + "/",
    "GET"
  );
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ students: success.students || [] });
  }
});

app.get("/classrooms", async (req, res) => {
  let { error, stdout: success } = await curl(baseUrl + "/classrooms/", "GET");
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ classrooms: success.classrooms || [] });
  }
});

app.get("/classrooms/:id", async (req, res) => {
  let { id = "" } = req.params;
  let { error, stdout: success } = await curl(
    baseUrl + "/classrooms/" + id,
    "GET"
  );
  if (error) {
    return res.json({ error });
  } else {
    return res.json(success);
  }
});

app.put("/classrooms/:id", async (req, res) => {
  let { id = "" } = req.params;
  let { subject = "" } = req.query;
  let { error, stdout: success } = await curl(
    baseUrl + "/classrooms/" + id + "/",
    "UPDATE",
    `subject=${subject}`
  );
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ classrooms: success.classrooms || [] });
  }
});

app.get("/registration", async (req, res) => {
  let { error, stdout: success } = await curl(
    baseUrl + "/registration/",
    "GET"
  );
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ registrations: success.registrations || [] });
  }
});

app.get("/registration/:id", async (req, res) => {
  let { id = "" } = req;
  let { error, stdout: success } = await curl(
    baseUrl + "/registration/" + id + "/",
    "GET"
  );
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ registrations: success.registrations || [] });
  }
});

app.post("/registration", async (req, res) => {
  let { student = "", subject = "" } = req.query;
  let { error, stdout: success } = await curl(
    baseUrl + "/registration/",
    "POST",
    `student=${student}&subject=${subject}`
  );
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ registration: success.registration || [] });
  }
});

app.delete("/registration/:id", async (req, res) => {
  let { id = "" } = req.params;
  let { error, stdout: success } = await curl(
    baseUrl + "/registration/" + id,
    "DELETE"
  );
  if (error) {
    return res.json({ error });
  } else {
    return res.json({ message: success.message || "" });
  }
});

app.listen(8080);
