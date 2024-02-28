



const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((navItem, i) => {
  navItem.addEventListener("click", () => {
    navItems.forEach((item, j) => {
      item.className = "nav-item";
    });
    navItem.className = "nav-item active";
  });
});

// Your existing JavaScript code

// resource-upload.js
// Import axios at the beginning of your script
import axios from 'axios';

// Update your uploadResource function
function uploadResource() {
  const fileInput = document.getElementById('resourceFile');
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('resourceFile', file);

    axios.post('/upload', formData)
      .then(response => {
        alert(response.data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    alert('Please select a file');
  }
}




document.addEventListener('DOMContentLoaded', function () {
  // Get the path from the URL (e.g., /home.html or /resource-upload.html)
  var currentPath = window.location.pathname;

  // Show the selected section or the home section by default
  if (currentPath) {
    var selectedSection = document.getElementById(currentPath.substring(1));
    if (selectedSection) {
      selectedSection.style.display = 'block';
    } else {
      // If the selected section is not found, default to home section
      document.getElementById('home').style.display = 'block';
    }
  } else {
    // If no path is present, default to home section
    document.getElementById('home').style.display = 'block';
  }

  // Add event listeners for drag and drop
  var dropZone = document.getElementById('dropZone');
  var fullDropZone = document.querySelector('.full-drop-zone');

  dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    fullDropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', function () {
    fullDropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    fullDropZone.classList.remove('dragover');

    var files = e.dataTransfer.files;
    if (files.length > 0) {
      // Use the first file from the dropped files
      var droppedFile = files[0];
      uploadResource(droppedFile);
    }
  });

  // Update content when clicking on navigation links
  document.querySelectorAll('.nav-item a').forEach(function (link) {
    link.addEventListener('click', function (event) {
      // Get the target section id from the href attribute
      var targetSectionId = link.getAttribute('href').substring(1);

      // Show the selected section
      var targetSection = document.getElementById(targetSectionId);
      if (targetSection) {
        targetSection.style.display = 'block';
      } else {
        // If the selected section is not found, default to home section
        document.getElementById('home').style.display = 'block';
      }

      // Prevent the default link behavior to avoid navigating to a different page
      event.preventDefault();
    });
  });
});


// script.js

