const FILTER_SELECTOR = "js-filter";
const CATEGORY_PARENT_SELECTOR = "js-cat-container";
const FILTER_SELECTED_SELECTOR = "filter-selected";
const FILTERING_ACTIVE_SELECTOR = "filters-active";
const FILTER_RESET_SELECTOR = "js-filter-reset";
const DISPLAY_NONE_SELECTOR = "d-none";
const projectGrid = document.querySelector(".o-grid--projects");
const projectTiles = document.querySelectorAll(".project-tile");
let activeFilters = [];
let windowUrl = new URL(window.location.href);
let tilesFilteredCount = 0;

// onload check/manage filters
const checkSearchParams = (url) => {
  let searchParams = url.searchParams;
  console.log(searchParams.toString());
  if (searchParams.has("filter")) {
    // apply available searchParams to activeFilters
    activeFilters = searchParams.getAll("filter");
    console.log(activeFilters);
    for (let i = 0; i < searchParams.getAll("filter").length; i++) {
      if (
        document.querySelector(`.js-filter [data-filter='${activeFilters[i]}']`)
      ) {
        const projectFilter = document.querySelector(
          `.js-filter [data-filter='${activeFilters[i]}']`
        );
        if (projectFilter.dataset.filter.toLowerCase() == activeFilters[i]) {
          projectFilter.click();
        }
      }
    }
  }
  // console.log(activeFilters);
};

const handleSearchParams = (type, cssClass) => {
  let queryParams = new URLSearchParams(window.location.search);
  if (type == "add" && !queryParams.toString().includes(cssClass)) {
    queryParams.append("filter", cssClass);
  } else if (type == "remove" && queryParams.toString().includes(cssClass)) {
    //queryParams.toString().split("&")
    queryParams = new URLSearchParams(
      queryParams.toString().replace(`filter=${cssClass}`, "")
    );
  } else if (type == "reset") {
    queryParams.delete("filter");
  }

  history.pushState(queryParams.toString(), null, "?" + queryParams.toString());
};

const handleHistory = () => {
  windowUrl = new URL(window.location.href);
  console.log(windowUrl);
  console.log(window.location);
  checkSearchParams(windowUrl);
  // handleFilters(activeFilters);
};

const getCategories = () => {
  const catArray = [];
  const categories = document.querySelectorAll(
    `.${CATEGORY_PARENT_SELECTOR} span[title]`
  );

  categories.forEach((category) => {
    const categoryTitle = category.title.split(" ")[0].toString();
    if (catArray.indexOf(categoryTitle) == -1) {
      catArray.push(categoryTitle);
    }
  });

  return catArray;
};

const addProjectCategories = () => {
  const categoryContainers = document.querySelectorAll(
    `.${CATEGORY_PARENT_SELECTOR} `
  );

  categoryContainers.forEach((container) => {
    for (child of container.children) {
      container.parentElement.classList.add(
        child.title.split(" ")[0].toLowerCase()
      );
    }
  });
};

const handleFilterReset = (e, resetId, arr) => {
  const filterReset = document.querySelector(`#${resetId}`);
  if (arr.length > 0) {
    filterReset.classList.remove(DISPLAY_NONE_SELECTOR);
  } else {
    filterReset.classList.add(DISPLAY_NONE_SELECTOR);
  }
};

const handleFilters = (arr, reset = false) => {
  const filterParent = document.querySelector(`.${FILTER_SELECTOR}`);
  // TODO: figure out a behavior for labeling the tags
  // filterParent.innerHTML =
  //   '<p class="text-center text-light">View projects by</p>';

  if (reset == false) {
    filterParent.innerHTML += arr
      .map((item) => {
        return `<button class="btn btn-outline-secondary m-1" data-filter="${item.toLowerCase()}">${item}</button>`;
      })
      .join("");

    filterParent.innerHTML +=
      '<button id="js-filter-reset" class="btn btn-reset-filters btn-outline-secondary m-1 d-none" data-filter="reset">Reset filters</button>';

    for (filter of filterParent.children) {
      filter.addEventListener("click", (e) => {
        handleFilter(e);
        if (filter.id == FILTER_RESET_SELECTOR) {
          handleFilterReset(e, filter.id, activeFilters);
        }
      });
    }
  } else {
    // empty active filters array
    while (arr.length) {
      arr.pop();
    }
    // remove active filter class from filters
    for (filter of filterParent.children) {
      filter.classList.remove(FILTER_SELECTED_SELECTOR);
    }
  }
};

const handleFilter = (e) => {
  //TODO: update url and allow for filtering from query string
  const filter = e.target;
  const FILTERED_SELECTOR = "filtered-out";
  const targetClass = filter.dataset.filter.toLowerCase();

  //TODO: apply logic to add updte search params for url params

  const checkTiles = (cssClass, reset = false) => {
    projectTiles.forEach((tile) => {
      if (reset == false) {
        if (
          !activeFilters.some((filter) => tile.classList.value.includes(filter))
        ) {
          tile.classList.add(cssClass);
        } else {
          tile.classList.remove(cssClass);
        }
      } else {
        tile.classList.remove(cssClass);
      }
    });
  };
  // if reset
  if (filter.id == FILTER_RESET_SELECTOR) {
    handleFilters(activeFilters, true);
    checkTiles(FILTERED_SELECTOR, true);
    handleSearchParams("reset", "reset");
    return;
  }

  filter.classList.toggle(FILTER_SELECTED_SELECTOR);

  if (filter.classList.value.toLowerCase().includes(FILTER_SELECTED_SELECTOR)) {
    // add filter to activeFilters
    activeFilters.push(targetClass);
    checkTiles(FILTERED_SELECTOR);
    handleSearchParams("add", targetClass);
  } else {
    // remove filter from activeFilters
    activeFilters.splice(activeFilters.indexOf(targetClass), 1);
    checkTiles(FILTERED_SELECTOR);
    handleSearchParams("remove", targetClass);
  }

  if (activeFilters.length == 0) {
    projectTiles.forEach((tile) => {
      tile.classList.remove(FILTERED_SELECTOR);
    });
  }
};

addProjectCategories();
handleFilters(getCategories());
checkSearchParams(windowUrl);

window.addEventListener("popstate", (e) => {
  handleHistory();
});
