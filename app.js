const APIURL = "https://api.github.com/users/";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard("No user found!");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos");

    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem fetching repos...");
  }
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;

  main.innerHTML = cardHTML;
}

function createUserCard(user) {
  const cardHTML = `
  <div class="card">
    <div class="image-profile">
    <img
    src="${user.avatar_url}"
    alt="${user.name}"
    class="avatar blur"
    />
    <i class='bx bx-log-out-circle icon'></i>
    </div>
    <div class="user-info">
      <h2><a href="${user.html_url}" target="_blank">${
    user.name == null ? user.login : user.name
  }</a></h2>
      <p>
      ${user.bio == null ? "No bio" : user.bio}
      </p>

      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>

      <div id="repos">
      </div>
    </div>
  </div>`;

  main.innerHTML = cardHTML;
  const iconEl = document.querySelector(".icon");
  const imageEl = document.querySelector(".image-profile");
  const link = user.html_url;
  hoverAction(imageEl, iconEl, link);
}

function hoverAction(element, action, link) {
  element.addEventListener("mouseover", () => {
    action.style.opacity = 1;
  });

  element.addEventListener("mouseout", () => {
    action.style.opacity = 0;
  });

  element.addEventListener("click", () => {
    window.open(link);
  });
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
