const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();

app.get("/", (req, res) => {
  res.send("Webhooks are running");
});
router.route("/webhook").post((req, res) => {
  const {
    id,
    table,
    trigger,
    event,
    delivery_info,
    created_at
  } = req.body;
  res.json({
    id,
    created_at,
    trigger: trigger.name,
    table: `${table.schema}:${table.name}`,
    operator: event.op,
    data: event.data
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/hook", router);
app.listen("8111", function() {
  console.log("Your app is listening on port 8111");
});

if (process.env.NODE_ENV === "production") {
  const ngrok = require("ngrok");
  (async function() {
    const url = await ngrok.connect("8111");
    console.log(url);
  })();
}
