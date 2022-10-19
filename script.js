class View {
    constructor(api) {
      this.app = document.querySelector(".app");
      this.api = api;
      this.searchInput = this.createElement("input", "search-input");
  
      this.resultWrapper = this.createElement("div", "main__wrapper");
      this.resultList = this.createElement("ul", "main__result-list");
      this.resultWrapper.append(this.resultList);
  
      this.savedElements = this.createElement("ul", "main__saved");
  
      this.main = this.createElement("div", "main");
      this.main.append(this.resultWrapper);
      this.main.append(this.savedElements);
  
      this.app.append(this.searchInput);
      this.app.append(this.main);
    }
    createElement(elementTag, elementClass) {
      const element = document.createElement(elementTag);
      if (elementClass) {
        element.classList.add(elementClass);
      }
      return element;
    }
    createRepository(repositoryData, id) {
      const repoElement = this.createElement("li", "main__repository");
  
      repoElement.textContent = repositoryData.name;
      repoElement.id = id;
      this.resultList.append(repoElement);
      console.log(repositoryData);
      repoElement.addEventListener("click", () =>
        this.addRepo(repositoryData, id)
      );
    }
  
    removeSaved(elem) {
      elem.parentNode.removeChild(elem);
    }
  
    addRepo(repo, id) {
      const HTMLelem = document.getElementById(id);
      const savedElement = this.createElement("li", "main__saved-element");
      const name = document.createTextNode( `Name: ${repo.name}`);
      const stars = document.createTextNode( `Stars: ${repo.stargazers_count}`);
      const owner = document.createTextNode(`Owner: ${repo.owner.login}`);
      const deleteButton = this.createElement("button", "remove-button");
      deleteButton.textContent = "X";
  
      savedElement.append(name);
      savedElement.append(stars);
      savedElement.append(owner);
      savedElement.append(deleteButton);
  
      this.savedElements.append(savedElement);
      deleteButton.addEventListener("click", () =>
        this.removeSaved(savedElement)
      );
      HTMLelem.parentNode.removeChild(HTMLelem);
    }
  }
  
  class Search {
    constructor(view, api) {
      this.view = view;
      this.api = api;
  
      this.view.searchInput.addEventListener(
        "keyup",
        this.debounce(this.searchRepo.bind(this), 300)
      );
    }
  
    
searchRepo() {

  let searchValue = this.view.searchInput.value;

  this.clearRepos();
  if (searchValue) {        
  this.repoRequest(searchValue);
  }
}
  
    repoRequest(searchValue) {
      try {
        this.api.loadRepos(searchValue).then((response) => {
          response.json().then((response) => {
            for (let i = 0; i < 5; i++) {
              this.view.createRepository(response.items[i], i + 1);
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  
    clearRepos() {
      this.view.resultList.innerHTML = "";
    }
  
    debounce = (fn, ms) => {
      let timeout;
      return function () {
        const fnCall = () => {
          fn.apply(this, arguments);
        };
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms);
      };
    };
  }
  
  const URL = "https://api.github.com/";
  
  class Api {
    async loadRepos(value) {
      return await fetch(
        `${URL}search/repositories?q=${value}+in%3Aname&sort=stars`
      );
    }
  }
  const request = new Api();
  new Search(new View(request), request);