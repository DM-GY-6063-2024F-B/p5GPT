const TEST_URL = "https://www.arquigrafia.org.br/arquigrafia-images/10026_view.jpg";
const OA_URL = "https://api.openai.com/v1/chat/completions";

const API_KEY = "ADD-YOUR-KEY-HERE";

const reqOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
  body: "",
};

const reqBody = {
  model: "gpt-4o-2024-08-06",
  messages: [{
    role: "user",
    content: [
      { type: "text", text: "Describe the objects in this image" },
      { type: "image_url", image_url: { url: "" } },
    ],
  }],
  max_tokens: 200,
};

let mCamera;
let mImg;
let mDescription;

function setup() {
  createCanvas(windowWidth, windowHeight);
  const camWidth = int(width / 2);
  const camHeight = int((0.75 * width) / 2);
  textAlign(LEFT, TOP);
  textSize(int(0.04 * height));
  fill(255);
  noStroke();

  mCamera = createCapture(VIDEO);
  mCamera.size(camWidth, camHeight);
  mCamera.hide();

  mImg = createImage(camWidth, camHeight);
  mDescription = "";
}

function draw() {
  background(0);
  image(mCamera, 0, 0);
  image(mImg, mCamera.width, 0);
  text(mDescription, width / 2, mCamera.height, width / 2, height / 2);
}

function mousePressed() {
  mCamera.loadPixels();
  const camData = mCamera.canvas.toDataURL();
  console.log("data url:", camData.slice(0, 64));

  // captured image
  mImg = loadImage(camData);

  // reqBody["messages"][0]["content"][1]["image_url"]["url"] = TEST_URL;
  reqBody["messages"][0]["content"][1]["image_url"]["url"] = camData;

  reqOptions.body = JSON.stringify(reqBody);

  fetch(OA_URL, reqOptions).then(async (res) => {
    const response = await res.json();
    console.log(response);
    if (response.choices && response.choices[0]) {
      const msg = response.choices[0]["message"];
      console.log(msg);
      mDescription = msg["content"];
    }
  });
}
