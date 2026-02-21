(function () {
  var mount = document.getElementById("footer");
  if (!mount) {
    return;
  }

  fetch("footer.html")
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      mount.innerHTML = html;
      var yearNode = mount.querySelector("[data-current-year]");
      if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
      }
    })
    .catch(function (error) {
      console.error("Failed to load footer:", error);
    });
})();
