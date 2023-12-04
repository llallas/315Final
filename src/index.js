import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

var cartCount = 0;
var productInfo = {};

const firebaseConfig = {
  apiKey: "AIzaSyC1H2VZFrukwJ31PF69PbOJjrZlIqJEmog",
  authDomain: "n315-ea.firebaseapp.com",
  projectId: "n315-ea",
  storageBucket: "n315-ea.appspot.com",
  messagingSenderId: "244728055229",
  appId: "1:244728055229:web:c74b21e118bcb575217ed4",
  measurementId: "G-7SD2L5JQY1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function initListeners() {
  $("#createBtn").on("click", (e) => {
    let fName = $("#fNameC").val();
    let email = $("#emailC").val();
    let pw = $("#pwC").val();

    createUserWithEmailAndPassword(auth, email, pw)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error" + errorMessage);
      });
  });

  $("#signin").on("click", (e) => {
    let fName = $("#fName").val();
    let email = $("#email").val();
    let pw = $("#pw").val();

    signInWithEmailAndPassword(auth, email, pw)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error Message" + errorMessage);
      });
  });

  $("#signOut").on("click", (e) => {
    signOut(auth).then(() => {
      console.log("signed out");
    });
  });
}

function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  //   console.log(hashTag + ' ' + pageID);

  if (pageID != "" && pageID != "home") {
    $.get(`pages/${pageID}.html`, function (data) {
      console.log("data" + data);
      $("#app").html(data);
      loadCart();
    });
  } else {
    $.get(`pages/home.html`, function (data) {
      console.log("data" + data);
      $("#app").html(data);
      loadCoffee();
    });
  }
}

function loadCart() {
  $.each(productInfo.Cart, (idx, cartItem) => {
    let coffee = productInfo.Products[cartItem.itemIdx];
    $(".cart").append(`<div class="coffee">
    <div class="coffeeImage">
        <img src="images/${coffee.productImage}" alt="">
    </div>
    <div class="coffeeDetails">
        <h3>${coffee.productName} </h3>
        <p>${coffee.productShortDesc} </p>
        <p class="price">${coffee.productPrice}</p>
        <div id="${idx}" class="buyNow">Delete</div>
    </div>
</div>`);
  });
}

function loadCoffee() {
  $(".buyNow").on("click", (e) => {
    let productIdx = e.currentTarget.id;
    let obj = {
      itemIdx: productIdx,
    };
    productInfo.Cart.push(obj);
    console.log(productInfo.Cart);
    cartCount = productInfo.Cart.length;
    updateCartCount();
  });
}

function updateCartCount() {
  if (cartCount == 0) {
    $(".cartCounter").css("display", "none");
  } else if (cartCount >= 1) {
    $(".cartCounter").css("display", "block");
    $(".cartCounter").html(cartCount);
  }
}

function getData() {
  $.get(`data/data.json`, (data) => {
    productInfo = data;
  }).fail(function () {
    alert("error");
  });
}


$(document).ready(function() {
  $('#signin-btn').click(function() {
      $('#signin-popup').slideToggle(); 
  });

  $('#signin-form').submit(function(event) {
      // Add your sign-in logic here

      event.preventDefault();

      $('#signin-popup').slideUp();
  });
});



function initURLListener() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
  updateCartCount();
  getData();

}

$(document).ready(function () {
  initListeners();
  initURLListener();
});
