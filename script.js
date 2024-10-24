// Initialize the map
const map = L.map("map").setView([-6.2, 106.816666], 13); // Default location to Jakarta
const lintasan = "a";
const latDom = document.querySelector("#latitude");
const lngDom = document.querySelector("#longitude");
const speedDom = document.querySelector("#Speed");
const cogDom = document.querySelector("#cog");

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

function updateImageMission() {
  setInterval(async () => {
    try {
      const response = await fetch("/gambar-misi");
      const data = await response.json();

      // Set the src attributes of the images
      if (data.overwater) {
        document.getElementById("img-overwater").src = data.overwater;
      }

      if (data.underwater) {
        document.getElementById("img-underwater").src = data.underwater;
      }
    } catch (error) {
      console.error("Error loading images:", error);
    }
  }, 2000);
}

// Create a marker for the ship's location
const marker = L.marker([-6.2, 106.816666]).addTo(map); // Initial position

function updateLocData(prevLat, prevLng, lat, long, speed) {
  marker.setLatLng([lat, long]);
  map.setView([lat, long]);
  latDom.innerHTML = lat;
  lngDom.innerHTML = long;
  speedDom.innerHTML = `${speed}m/s | ${speed_ms_to_knots(speed)} knots`;
  cogDom.innerHTML = calculateCOG(prevLat, prevLng, lat, long);
}

const speed_ms_to_knots = (speed) => speed * 1.94384;

function calculateCOG(lat1, lon1, lat2, lon2) {
  const deltaLon = lon2 - lon1;
  const deltaLat = lat2 - lat1;

  // Calculate COG in degrees
  const cog = (Math.atan2(deltaLon, deltaLat) * (180 / Math.PI)) % 360;

  // Normalize the COG to be between 0 and 360 degrees
  return (cog + 360) % 360;
}

function cor_to_px(lat1, lng1, lat2, lng2) {
  const latitude = lat1;

  const meters_per_degree_latitude = 111000;
  const meters_per_degree_longitude =
    111000 * Math.cos(latitude * (Math.PI / 180));
  const lat_diff = lat2 - lat1;
  const long_diff = lng2 - lng1;

  const lat_distance = lat_diff * meters_per_degree_latitude;
  const long_distance = long_diff * meters_per_degree_longitude;

  const pixels_per_meter = 1 / 0.5;

  const y_diff_pixels = lat_distance * pixels_per_meter;
  const x_diff_pixels = long_distance * pixels_per_meter;

  return [x_diff_pixels, y_diff_pixels];
}

const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const points = [[70, 450]];

function addNewPoint(xOffset, yOffset) {
  points.push([
    points[points.length - 1][0] + xOffset,
    points[points.length - 1][1] + yOffset,
  ]);
  updatePoints();
}

function updatePoints() {
  points.forEach((item) => {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(item[0], item[1], 5, 0, Math.PI * 2);
    ctx.fill();
  });
  for (let i = 0; i < points.length - 1; i++) {
    ctx.beginPath(); // Start a new path
    ctx.moveTo(points[i][0], points[i][1]); // Move the pen to the starting point (x1, y1)
    ctx.lineTo(points[i + 1][0], points[i + 1][1]); // Draw a line to the ending point (x2, y2)
    ctx.strokeStyle = "#000"; // Set the color of the line
    ctx.lineWidth = 2; // Set the line width
    ctx.stroke();
  }
}

function mesh() {
  ctx.fillText("Trajectory", 230, 20);
}

mesh();
updateImageMission();
