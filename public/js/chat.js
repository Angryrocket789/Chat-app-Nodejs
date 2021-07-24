const socket = io();

//socket.on receives event from the server
// socket.on("countUpdated", (count) => {
//   console.log("The count has been updated !!", count);
// });

// const btn = document.querySelector("#increment");

// btn.addEventListener("click", () => {
//   socket.emit("increment");
// });

// ----chat app-----//

const input = document.querySelector("#sendMessage");
const form = document.querySelector(".message-form");
const formBtn = document.querySelector("#send");
const shareBtn = document.querySelector(".share");
const $messages = document.querySelector(".messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;

const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Automatic Scrolling
const autoScroll = () => {
  //New message Element
  const $newMessage = $messages.lastElementChild;

  // height of the new message
  const newMessageStyle = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyle.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // how far have i scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

// ---------------------//
socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("HH:mm"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (urlobj) => {
  console.log(urlobj);
  const html = Mustache.render(locationMessageTemplate, {
    username: urlobj.username,
    url: urlobj.url,
    createdAt: moment(urlobj.createdAt).format("HH:mm"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomdata", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector(".sidebar-left").innerHTML = html;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //   Disabling the button
  formBtn.setAttribute("disabled", "disabled");

  const message = input.value;
  socket.emit("sendMessage", message, (error) => {
    formBtn.removeAttribute("disabled");
    input.value = "";
    input.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message Delivered");
  });
});

shareBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("GeoLocation is not supported by your browser");
  }
  shareBtn.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (message) => {
        shareBtn.removeAttribute("disabled");
        console.log(message);
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

// document.querySelector(".fa-sign-out-alt").addEventListener("click", () => {
//   location.href = "/";
// });
