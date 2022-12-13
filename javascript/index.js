document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("section");
  const playerLivesCount = document.querySelector("span");
  let playerLives = 6;
  const modal = document.querySelector(".modal");
  const span = document.querySelector(".close");
  let paragrapheText = document.querySelector(".winOrLose");

  // link player lives text
  playerLivesCount.textContent = playerLives;

  // we make a const for all the cards in array
  const cardsArray = () => [
    {
      name: "abra",
      imageSrc: "./img/abra.png",
    },
    {
      name: "abra",
      imageSrc: "./img/abra.png",
    },
    {
      name: "bulbizar",
      imageSrc: "./img/bulbizar.png",
    },
    {
      name: "bulbizar",
      imageSrc: "./img/bulbizar.png",
    },
    {
      name: "carapuce",
      imageSrc: "./img/carapuce.png",
    },
    {
      name: "carapuce",
      imageSrc: "./img/carapuce.png",
    },
    {
      name: "evoli",
      imageSrc: "./img/evoli.png",
    },
    {
      name: "evoli",
      imageSrc: "./img/evoli.png",
    },
    {
      name: "mini-draco",
      imageSrc: "./img/mini-draco.png",
    },
    {
      name: "mini-draco",
      imageSrc: "./img/mini-draco.png",
    },
    {
      name: "pikachu",
      imageSrc: "./img/pikachu.png",
    },
    {
      name: "pikachu",
      imageSrc: "./img/pikachu.png",
    },
    {
      name: "psykokwak",
      imageSrc: "./img/psykokwak.png",
    },
    {
      name: "psykokwak",
      imageSrc: "./img/psykokwak.png",
    },
    {
      name: "rondoudou",
      imageSrc: "./img/rondoudou.png",
    },
    {
      name: "rondoudou",
      imageSrc: "./img/rondoudou.png",
    },
    {
      name: "ronflex",
      imageSrc: "./img/ronflex.png",
    },
    {
      name: "ronflex",
      imageSrc: "./img/ronflex.png",
    },
    {
      name: "salameche",
      imageSrc: "./img/salameche.png",
    },
    {
      name: "salameche",
      imageSrc: "./img/salameche.png",
    },
  ];

  // we have to randomize the cards
  const random = () => {
    const cardData = cardsArray();
    cardData.sort(() => Math.random() - 0.5);
    return cardData;
  };
  // we have to generate the cards
  const cardGenerate = () => {
    const cardData = random();
    // generate HTML

    cardData.forEach((item, index) => {
      const card = document.createElement("div");
      const face = document.createElement("img");
      const back = document.createElement("div");
      card.classList = "card";
      face.classList = "face";
      back.classList = "back";
      // attach the src to the cards
      face.src = item.imageSrc;
      // attach the name to the cards
      card.setAttribute("name", item.name);

      // put the card in the div element
      section.appendChild(card);
      card.appendChild(face);
      card.appendChild(back);

      // make event click for cards
      card.addEventListener("click", (event) => {
        card.classList.toggle("toggleCard");
        checkCards(event);
      });
    });
  };

  // checks the cards

  const checkCards = (event) => {
    console.log(event);
    const clickedCard = event.target;
    console.log(clickedCard);
    clickedCard.classList.add("flipped");
    const flippedCards = document.querySelectorAll(".flipped");
    const toggleCard = document.querySelectorAll(".toggleCard");

    // checking if the 1st flipped cards is same than the 2nd one
    if (flippedCards.length === 2) {
      if (
        flippedCards[0].getAttribute("name") ===
        flippedCards[1].getAttribute("name")
      ) {
        flippedCards.forEach((card) => {
          card.classList.remove("flipped");
          card.style.pointerEvents = "none";
        });
      } else {
        flippedCards.forEach((card) => {
          card.classList.remove("flipped");
          // setting Timeout before the card flip back
          setTimeout(() => card.classList.remove("toggleCard"), 1000);
        });
        playerLives--;
        playerLivesCount.textContent = playerLives;
        if (playerLives === 0) {
          modal.style.display = "block";
          modal.style.backgroundColor = "red";
          paragrapheText.textContent = "You lose !";
          span.addEventListener("click", () => {
            modal.style.display = "none";
          });
          restart();
        }
      }
    }
    if (toggleCard.length === 20) {
      modal.style.display = "block";
      modal.style.backgroundColor = "green";
      paragrapheText.textContent = "You won!";
      span.addEventListener("click", () => {
        modal.style.display = "none";
      });
      restart();
    }
  };
  // making a restart function
  const restart = () => {
    let cardData = random();
    let faces = document.querySelectorAll(".face");
    let cards = document.querySelectorAll(".card");
    section.style.pointerEvents = "none";
    cardData.forEach((item, index) => {
      cards[index].classList.remove("toggleCard");
      // need to randomize the cards again
      // and make a Timeout to not see the img before make the randomize
      setTimeout(() => {
        cards[index].style.pointerEvents = "all";
        faces[index].src = item.imageSrc;
        cards[index].setAttribute("name", item.name);
        section.style.pointerEvents = "all";
      }, 1000);
    });
    playerLives = 6;
    playerLivesCount.textContent = playerLives;
  };

  // const winner = () => {
  //   let modal = document.querySelector(".modal");
  //   let win = document.querySelector(".win");
  //   let span = document.querySelectorAll(".close")[0];
  //   span.addEventListener("click", () => {
  //     modal.style.display = "none";
  //     span.textContent = "You Won"
  //   });
  //   modal.style.display = "block";
  //   window.addEventListener("click", (e) => {
  //     if (e.target == modal) {
  //       modal.style.display = "none";
  //     }
  //   });
  // };

  cardGenerate();
});
