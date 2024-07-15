var mainMap, modalMap, chosenLocation;
var treeDataLayer, addTreeLayer, deleteTreeLayer;
var isInDeleteMode = false;
var selectedTreeMarker = null;
var selectedUprootType = "";

function initializeModalMap() {
  if (!modalMap) {
    modalMap = L.map("treeLocationMap").setView([19.0211, 72.8710], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(modalMap);

    var geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      placeholder: "Search for location...",
      showResultIcons: true,
    }).addTo(modalMap);

    geocoder.on("markgeocode", function (e) {
      var latlng = e.geocode.center;
      modalMap.setView(latlng, 16);
      if (chosenLocation) {
        modalMap.removeLayer(chosenLocation);
      }
      chosenLocation = L.marker(latlng).addTo(modalMap);
    });

    modalMap.on("click", function (e) {
      if (chosenLocation) {
        modalMap.removeLayer(chosenLocation);
      }
      chosenLocation = L.marker(e.latlng).addTo(modalMap);
    });
  } else {
    modalMap.invalidateSize();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  mainMap = L.map("map").setView([19.0211, 72.8710], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(mainMap);

  treeDataLayer = L.layerGroup().addTo(mainMap);
  addTreeLayer = L.layerGroup().addTo(mainMap);
  deleteTreeLayer = L.layerGroup().addTo(mainMap);

  $("#addTreeModal").on("shown.bs.modal", initializeModalMap);

  $("#addTreeForm").on("submit", function (e) {
    e.preventDefault();
    var treeName = $("#tree-name").val();
    var treeAge = $("#tree-age").val();
    var treeHeight = $("#tree-height").val();

    if (chosenLocation) {
      var treeMarker = L.marker(chosenLocation.getLatLng())
        .bindPopup(
          "<b>" + treeName + "</b><br>Age: " + treeAge + "<br>Height: " + treeHeight
        )
        .addTo(treeDataLayer);

      $("#addTreeModal").modal("hide");
      $("#addTreeForm")[0].reset();
      modalMap.removeLayer(chosenLocation);
      chosenLocation = null;
    } else {
      alert("Please select a location for the tree.");
    }
  });

  mainMap.on("click", function (e) {
    if (isInDeleteMode) {
      if (selectedTreeMarker) {
        mainMap.removeLayer(selectedTreeMarker);
        selectedTreeMarker = null;
        isInDeleteMode = false;
      } else {
        selectedTreeMarker = L.marker(e.latlng).addTo(deleteTreeLayer);
      }
    }
  });

  $("#deleteTreeForm").on("submit", function (e) {
    e.preventDefault();
    var treeName = $("#tree-name-delete").val();

    if (selectedTreeMarker) {
      mainMap.removeLayer(selectedTreeMarker);
      selectedTreeMarker = null;
    } else {
      alert("Please select a tree to delete.");
    }
  });

  $(".upvote").on("click", function () {
    if (!selectedUprootType) {
      selectedUprootType = "upvote";
    }
  });

  $(".downvote").on("click", function () {
    if (!selectedUprootType) {
      selectedUprootType = "downvote";
    }
  });

  $("#addTreeModal").on("hide.bs.modal", function () {
    modalMap.removeLayer(chosenLocation);
    chosenLocation = null;
  });
});

function enableDeleteMode() {
  isInDeleteMode = true;
  selectedTreeMarker = null;
}
