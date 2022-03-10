// Set up nav contents and write them to the page
const navDiv = document.getElementById('primary-nav');
let navContents = "";

navContents += '<div class="container-fluid">';
navContents += '<h1><a class="navbar-brand" href="#"><img src="assets/logo/logo-white.svg" alt="" class="logo"/>&nbsp;Distance Goals</a></h1>';
navContents += '<div class="nav-buttons">';
navContents += '<button class="btn btn-sm btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#aboutModal" id="nav-about">About</button>';
navContents += '<button class="btn btn-sm btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#resetModal" id="nav-demo">Demo</button>';
navContents += '</div></div>';

navDiv.innerHTML = navContents;

// Set up footer contents and write them to the page
const footerDiv = document.getElementById('footer');
let footerContents = '<div class="container"><p>Designed &amp; built by Stephanie Cervi<br><a href="https://ko-fi.com/sdcervi" target="_blank">Please buy me a coffee if you like my work</a></p></div>';

footerDiv.innerHTML = footerContents;