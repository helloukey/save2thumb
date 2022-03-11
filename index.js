// Document Queries
const form = document.querySelector("form");
const preview = document.querySelector(".preview");
const downloadContainer = document.querySelector(".download-options");
const loader = document.querySelector(".loader");

// Buttons
const small = document.querySelector(".small");
const medium = document.querySelector(".medium");
const large = document.querySelector(".large");
const home = document.querySelector(".home");

// Loader Show & Hide
const loaderShow = () => {
  if (loader.classList.contains("hidden")) {
    loader.classList.remove("hidden");
  }
};
const loaderHide = () => {
  if (!loader.classList.contains("hidden")) {
    loader.classList.add("hidden");
  }
};

// RegEx Pattern
const pattern =
  /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

// Get result from Form Submit
const updateUI = (result) => {
  // Redirect User to the container if URL is valid
  const redirect = () => {
    if (result) {
      const navigate = document.createElement("a");
      navigate.href = "#container";
      navigate.click();
      navigate.remove();
    }
  }

  setTimeout(() => {
    redirect();
  }, 300);

  // Getting Full URL
  const cors = "https://api.codetabs.com/v1/proxy?quest=";
  const baseURL = "https://img.youtube.com/vi/";
  const response = cors + baseURL + result[1];

  // Getting Resolutions
  const hqdefault = response + "/hqdefault.jpg";
  const sddefault = response + "/sddefault.jpg";
  const maxresdefault = response + "/maxresdefault.jpg";

  // Download Trigger
  async function downloadThumbnail(url) {
    // Create Blob Oject from URL
    const image = await fetch(url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    // Create anchor tag and add URL
    const link = document.createElement("a");
    link.href = imageURL;

    // Check URL match and add Download name
    if (image.url.includes("hqdefault")) {
      link.download = "thumbnail-small.jpg";
    } else if (image.url.includes("sddefault")) {
      link.download = "thumbnail-medium.jpg";
    } else if (image.url.includes("maxresdefault")) {
      link.download = "thumbnail-high.jpg";
    }

    // Add link to the DOM, and remove link after click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Adding Preview Image
  preview.src = maxresdefault;

  // Hide Loader & Show Download options
  preview.onload = () => {
    loaderHide();
    downloadContainer.classList.remove("hidden");
  };

  // Download Thumbnail by passing URL onclick
  small.onclick = () => {
    downloadThumbnail(hqdefault);
  };
  medium.onclick = () => {
    downloadThumbnail(sddefault);
  };
  large.onclick = () => {
    downloadThumbnail(maxresdefault);
  };

  // Redirect User to the Home onclick
  home.onclick = () => {
    const a = document.createElement("a");
    a.href = "#home";
    a.click();
    a.remove();
  };
};

// Form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Show Loader
  loaderShow();

  const url = form.search.value;
  const matchPattern = url.match(pattern);
  const result = matchPattern;

  // Check if the URL is valid
  if (result == null) {
    alert("There is something wrong with the URL");
    loaderHide();
  }

  // Send result to UpdateUI
  updateUI(result);

  // Reset Search Input Field
  form.reset();
});
