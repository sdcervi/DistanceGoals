// Set up nav contents and write them to the page
const navDiv = document.getElementById('primary-nav');
let navContents = "";

navContents += '<div class="container-fluid">';
navContents += '<h1><a class="navbar-brand" href="#"><img src="assets/logo/logo-white.svg" alt="" class="logo"/>&nbsp;Distance Goals</a></h1>';
navContents += '<div class="nav-buttons">';
navContents += '<a href="index.html"><button class="btn btn-sm btn-primary" id="nav-index"><img src="assets/home-icon.svg" alt="" class="icon-white" /></button></a>';
navContents += '<a href="demo.html"><button class="btn btn-sm btn-primary ms-2" id="nav-demo">Demo</button></a>';
navContents += '<button class="btn btn-sm btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#aboutModal" id="nav-about">About</button>';
navContents += '</div></div>';

navDiv.innerHTML = navContents;

// Change active state of current page's nav button
const currentPage = document.location.pathname;

let filename = currentPage.substring(currentPage.lastIndexOf('/')+1);
filename = filename.substring(0, filename.length - 5);
let navID = "nav-" + filename;

const navElement = document.getElementById(navID);

navElement.classList.add('active');

// Set up footer contents and write them to the page
const footerDiv = document.getElementById('footer');
let footerContents = '<div class="container"><p>Designed &amp; built by Stephanie Cervi<br><a href="https://ko-fi.com/sdcervi" target="_blank">Please buy me a coffee if you like my work</a></p></div>';

footerDiv.innerHTML = footerContents;