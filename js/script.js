// Element select
const loader = document.querySelector(".loader");
const container = document.querySelector(".container");
const containerContent = document.querySelector(".container_content");

// Header select
const headerBox = document.querySelector(".header_box");
const overlay = document.querySelector(".overlay");

// content select
const content = document.querySelector(".content");
const contentBox = document.querySelector(".content_box");
const helper = document.querySelector(".helper");
const closeBtn = document.querySelector(".close_btn");
const shoosesContainer = document.querySelector(".shooses");
const itemShoose = document.querySelectorAll(".item-shoose");
const options = document.querySelectorAll(".option");

// Footer select
const replayBtn = document.querySelector(".replay");
const showAnsBtn = document.querySelector(".show-ans");

// Dimensions
const containerContentBCR = containerContent.getBoundingClientRect();
// let entrieCR;

// Observer resize

const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entrie) => {

    const entrieCR = entrie.contentRect; // Container dimenions

    const scaleHeight = entrieCR.height / containerContentBCR.height;

    const widthContainerContent = containerContentBCR.width * scaleHeight; // Width container content
    const widthContainer = entrieCR.width;

    const scaleWidth = widthContainer / widthContainerContent;

    const moveLeft = (widthContainer - widthContainerContent) / 2;

    containerContent.style.transform = `scale(${
      scaleHeight < scaleWidth ? scaleHeight : scaleWidth
    })`;

    containerContent.style.left = `${moveLeft > 0 ? moveLeft : 0}px`;
  });
});

resizeObserver.observe(container);

// Height child container content

(function () {
  const handleHeight = (ele, height) => {
    document.querySelector(`.${ele}`).style.height = `${
      containerContentBCR.height * +height
    }px`;
  };

  handleHeight("header", "0.13");
  handleHeight("content", "0.74");
  handleHeight("footer", "0.13");
})();

// show helper container

headerBox.addEventListener("click", (e) => {
  const { add } = e.target.dataset;
  const [, classRemove] = content.classList;

  content.classList.add(add);
  content.classList.remove(classRemove);
});

// close helper container

closeBtn.addEventListener("click", () => {
  const [, classRemove] = content.classList;
  content.classList.remove(classRemove);
  content.classList.add("questions");
});

// Select shoose

shoosesContainer.addEventListener("click", (e) => {
  const item = e.target;
  const parent = item.parentElement;

  if (!item.classList.contains("item-shoose")) return;
  if (parent.classList.contains("disabled")) return;

  itemShoose.forEach((item) => item.classList.remove("select"));

  item.classList.add("select");
});

// option filed

let optionFiledCount = 0;

options.forEach((option) => {
  option.addEventListener("click", (e) => {
    const el = e.target;

    if (el.parentElement.classList.contains("filled")) return;
    if (el.parentElement.parentElement.classList.contains("filled")) return;

    itemShoose.forEach((item) => {
      // check element has class select
      if (item.classList.contains("select")) {
        // check if data answer is correct
        if (item.dataset.answer === "correct") {
          const html = `<div class="answer">
                        <span>${item.textContent}</span>
                        <img src="images/icons/tikMark-small.png" alt="icon" />
                      </div>`;

          el.insertAdjacentHTML("afterbegin", html);
          el.classList.add("filled");
          item.classList.remove("select");
          item.classList.add("selected");
          optionFiledCount++;

          if (optionFiledCount === options.length) {
            shoosesContainer.classList.add("disabled");
            optionFiledCount = 0;
            showAnsBtn.classList.add("disabled");
          }
        } else {
          const html = `<div class="answer">
                        <span>${item.textContent}</span>
                        <img src="images/icons/crossMark-small.png" alt="icon" />
                      </div>`;

          el.insertAdjacentHTML("afterbegin", html);
          setTimeout(() => el.children[0].remove(), 500);
        }
      }
    });
  });
});

// replay Answer
const replay = () => {
  options.forEach((item) => {
    if (item.children[0]) item.children[0].remove();
    shoosesContainer.classList.remove("disabled");
    itemShoose.forEach((item) => item.classList.remove("selected"));
    options.forEach((option) => option.classList.remove("filled"));
    showAnsBtn.classList.remove("disabled");
    optionFiledCount = 0;
  });
};
replayBtn.addEventListener("click", replay);

// show answers function

const showAns = () => {
  const correctAns = [];
  let showCount = 0;

  if (showAnsBtn.classList.contains("disabled")) return;

  itemShoose.forEach((itemSh) => {
    if (
      itemSh.dataset.answer === "correct" &&
      !itemSh.classList.contains("selected")
    ) {
      correctAns.push(itemSh.textContent);
      itemSh.classList.add("selected");
      shoosesContainer.classList.add("disabled");
    }
  });

  options.forEach((option) => {
    if (option.classList.contains("filled")) return;
    const html = `
        <div class="answer">
          <span>${correctAns[showCount]}</span>
          <img src="images/icons/tikMark-small.png" alt="icon" />
        </div>
      `;

    option.insertAdjacentHTML("afterbegin", html);
    showCount++;
  });

  showAnsBtn.classList.add("disabled");
};

showAnsBtn.addEventListener("click", showAns);

// Loader

(() => {
  loader.style.opacity = "0";
  loader.style.visibility = "hidden";
})();
