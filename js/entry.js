document.addEventListener("DOMContentLoaded", function () {
  // pagination buttons
  const prevBtn = document.querySelector("[data-pagination-prev]");
  const nextBtn = document.querySelector("[data-pagination-next]");
  // Clear filters button
  const clearBtn = document.querySelector("#clear");
  const loading = document.querySelector("page-loader");

  // Initialize date picker
  var picker = new Lightpick({
    field: document.getElementById('range-picker'),
    singleDate: false,
    maxDate: moment(),
    maxDays: 20,
    onSelectStart: function (start) {
      startDate = start;
    },
    onSelectEnd: function (end) {
      if (startDate.isAfter(end)) {
        const temp = startDate;
        startDate = end;
        end = temp;
      }
      endDate = end;
      fetchData(
        startDate.format("YYYY-MM-DD"),
        end.format("YYYY-MM-DD")
      );
      nextBtn.setAttribute("disabled", true);
      prevBtn.setAttribute("disabled", true);
      clearBtn.style.display = "block";
    },
  });

  // Show loading UI
  function stopLoading() {
    loading.setAttribute("data-loading", "false");
  }

  // Hide loading UI
  function startLoading() {
    loading.setAttribute("data-loading", "true");
  }

  // Fetch data between two dates
  async function fetchData(start_date, end_date) {
    console.log("End date", endDate.format("YYYY-DD-MM"));
    console.log("date", moment().format("YYYY-DD-MM"));
    if (endDate.isSame(moment())) prevBtn.setAttribute("disabled", true);
    else prevBtn.removeAttribute("disabled");
    startLoading();
    const url = `https://api.nasa.gov/planetary/apod?api_key=L8A9FjUIgrdaLM5iLYhLeqY64Pi9e8D9QIf7gIgL&thumbs=true&start_date=${start_date}&end_date=${end_date}`;
    try {
      const response = await fetch(url);
      stopLoading();
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      document.querySelector(".container").innerHTML = "";
      const json = await response.json();
      let count = 0;
      json.reverse().map((item, index) => {
        if (index !== 0 && index % 6 === 0) {
          count++;
        }
        appendItem(item, index, count, json.length);
      })
    } catch (error) {
      console.error(error.message);
    }
  }

  const ITEM_CLASS_ORDER = [
    null,
    null,
    "vertical",
    "horizontal",
    null,
    null,
    "big"
  ]

  // Inserts item into the container
  function appendItem(item, n, count, length) {
    const elem = document.createElement("post-item");
    const dialog = document.querySelector("[data-dialog]");
    elem.setAttribute("src", item.thumbnail_url || item.url);
    const classOrder = n - (count * (ITEM_CLASS_ORDER.length + 1));
    if (n < length - 4) {
      elem.setAttribute("class", ITEM_CLASS_ORDER[classOrder]);
    }
    elem.innerHTML = `
          <h3 slot="title">${item.title}</h3>
          <p slot="date">${item.date}</p>
        `;
    const container = document.querySelector(".container");
    container.append(elem);
    elem.addEventListener("click", function () {
      dialog.setAttribute("src", item.thumbnail_url || item.url);
      dialog.shadowRoot.querySelector("dialog").showModal();
      dialog.innerHTML = `
        <h3 slot="title">${item.title}</h3>
        <p slot="date">${item.date}</p>
        <p slot="explanation">${item.explanation}</p>
      `
    })
  }

  // startDate & endDate are used for filtering and pagination
  let startDate;
  let endDate;

  // Used for first fetch & refetch after clearing filters
  function fetchLatestData() {
    startDate = moment().subtract(19, "days");
    endDate = moment();
    fetchData(
      startDate.format("YYYY-MM-DD"),
      endDate.format("YYYY-MM-DD")
    );
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  // Clear filters event
  clearBtn.addEventListener("click", function () {
    nextBtn.removeAttribute("disabled");
    prevBtn.removeAttribute("disabled");
    clearBtn.style.display = "none";
    picker.reset();
    fetchLatestData();
  })

  // Pagination: Next event
  nextBtn.addEventListener("click", function () {
    scrollToTop();
    startDate = startDate.subtract(19, "days");
    endDate = endDate.subtract(19, "days");
    fetchData(
      startDate.format("YYYY-MM-DD"),
      endDate.format("YYYY-MM-DD")
    );
  });

  // Pagination: Prev event
  prevBtn.addEventListener("click", function () {
    let diff = Math.abs(endDate.diff(moment(), "days"));
    if (diff > 0) {
      scrollToTop();
      diff = diff < 19 ? 19 : diff;
      startDate = startDate.add(diff, "days");
      endDate = endDate.add(diff, "days");
      fetchData(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD")
      );
    }
  });

  // First fetch
  fetchLatestData();
})
