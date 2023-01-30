const cardsArray = [
  {
    name: "abra",
    imageSrc: "./img/abra.png",
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
    name: "evoli",
    imageSrc: "./img/evoli.png",
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
    name: "psykokwak",
    imageSrc: "./img/psykokwak.png",
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
    name: "salameche",
    imageSrc: "./img/salameche.png",
  },
];

const getNumberOfLivesForDifficulty = (difficulty) => {
  let lives = 0;
  switch (difficulty) {
    case "easy":
      lives = 3;
      break;
    case "normal":
      lives = 5;
      break;
    case "hard":
      lives = 10;
      break;
  }
  return lives;
};
// numberOfCards is the number of cards we want to generate in our generateRandomlySortedCardArray(3) method here is 3 unique cards
const generateRandomlySortedCardArray = (numberOfCards) => {
  const cardData = cardsArray;
  cardData.sort(() => Math.random() - 0.5);
  let selectedCards = cardData.slice(0, numberOfCards);
  selectedCards = selectedCards.concat(selectedCards);
  selectedCards.sort(() => Math.random() - 0.5);
  return selectedCards;
};

const generateNewCardArrayState = (difficulty) => {
  // TODO: Ajuster le nombre de cartes selon la difficulté ?
  let cards;
  switch (difficulty) {
    case "easy":
      cards = generateRandomlySortedCardArray(3);
      break;
    case "normal":
      cards = generateRandomlySortedCardArray(5);
      break;
    case "hard":
      cards = generateRandomlySortedCardArray(10);
      break;
  }

  return cards.map((card) => new CardState(card.name, card.imageSrc));
};

class CardState {
  constructor(name, imageSrc, isFlipped = false, isConfirmed = false) {
    this.name = name;
    this.imageSrc = imageSrc;
    this.isFlipped = isFlipped;
    this.isConfirmed = isConfirmed;
  }

  changeFlippedFlag(flag) {
    return new CardState(this.name, this.imageSrc, flag, this.isConfirmed);
  }

  changeConfirmedFlag(flag) {
    return new CardState(this.name, this.imageSrc, this.isFlipped, flag);
  }
}

class MemoryGameState {
  constructor(
    difficulty = "normal",
    lives = -1,
    cardArrayState = [],
    flippedCardIndex = -1
  ) {
    this.difficulty = difficulty;
    this.lives =
      lives == -1 ? getNumberOfLivesForDifficulty(difficulty) : lives;
    this.cardArrayState =
      cardArrayState.length !== 0
        ? [...cardArrayState]
        : generateNewCardArrayState(difficulty);
    this.flippedCardIndex = flippedCardIndex;
  }

  changeDifficulty(difficulty) {
    return new MemoryGameState(difficulty);
  }

  writeCardsToScreen() {
    const remainingLivesSpan = document.querySelector(".playerLivesCount");
    remainingLivesSpan.textContent = this.lives.toString();
    const gameDiv = document.getElementById("game");
    gameDiv.innerHTML = "";
    this.cardArrayState.forEach((card, index) => {
      const cardDiv = document.createElement("div");
      const cardFaceImg = document.createElement("img");
      const cardBackDiv = document.createElement("div");

      cardDiv.classList = "card";
      setTimeout(
        () =>
          cardDiv.classList.toggle(
            "toggleCard",
            card.isFlipped || card.isConfirmed
          ),
        100
      );
      cardFaceImg.classList = "face";
      cardBackDiv.classList = "back";
      // attach the src to the cards
      cardFaceImg.src = card.imageSrc;
      // attach the name to the cards
      cardDiv.setAttribute("name", card.name);

      cardDiv.appendChild(cardFaceImg);
      cardDiv.appendChild(cardBackDiv);
      cardDiv.dataset.cardId = index.toString();

      // make event click for cards
      cardDiv.addEventListener("click", (event) => {
        // TODO: Mettre à jour selon l'état cardState
        if (!card.isConfirmed && !card.isFlipped) {
          cardDiv.classList.toggle("toggleCard");
          memGameState = this.checkCards(event);
          memGameState.writeCardsToScreen();
        }
      });

      gameDiv.appendChild(cardDiv);
    });
  }

  checkCards(event) {
    let newState = this;

    if (this.flippedCardIndex == -1) {
      newState = this.updateForSingleCardFlip(event);
    } else {
      const clickedCardId = event.target.dataset.cardId;
      if (this.flippedCardIndex !== clickedCardId) {
        newState = this.updateForDoubleCardFlip(event);
      }
    }
    return newState;
  }

  updateForSingleCardFlip(event) {
    const clickedCard = event.target;
    this.cardArrayState[clickedCard.dataset.cardId].isFlipped = true;
    this.flippedCardIndex = clickedCard.dataset.cardId;

    return new MemoryGameState(
      this.difficulty,
      this.lives,
      this.cardArrayState,
      this.flippedCardIndex
    );
  }

  updateForDoubleCardFlip(event) {
    const clickedCard = event.target.dataset.cardId;
    const [lCard, rCard] = [
      this.cardArrayState[this.flippedCardIndex],
      this.cardArrayState[clickedCard],
    ];
    lCard.isFlipped = false;
    rCard.isFlipped = false;
    if (lCard.name === rCard.name) {
      lCard.isConfirmed = true;
      rCard.isConfirmed = true;
      this.cardArrayState;
    } else {
      // setTimeout(() => event.target.classList.remove("toggleCard"), 1200);
      console.log(event.target);
      this.lives--;
    }
    return new MemoryGameState(
      this.difficulty,
      this.lives,
      this.cardArrayState,
      -1
    );
  }

  // updateForDoubleCardFlip(event) {
  //   const clickedCard = event.target.dataset.cardId;
  //   const [lCard, rCard] = [
  //     this.cardArrayState[this.flippedCardIndex],
  //     this.cardArrayState[clickedCard],
  //   ];
  //   lCard.isFlipped = false;
  //   rCard.isFlipped = false;
  //   if (lCard.name === rCard.name) {
  //     lCard.isConfirmed = true;
  //     rCard.isConfirmed = true;
  //   } else {
  //     this.lives--;
  //     console.log(this.lives);
  //   }
  //   return new MemoryGameState(
  //     this.difficulty,
  //     this.lives,
  //     this.cardArrayState,
  //     -1
  //   );
  // }

  checkIfGameHasEnded() {
    return (
      this.lives === 0 || this.cardArrayState.every((card) => card.isConfirmed)
    );
  }

  showModalWithLossState() {
    this.showModal("red", "You lose ! \r\n 👎");
  }

  showModalWithWinState() {
    this.showModal("green", "You won! \r\n 👍");
  }

  showModal(modalColor, textContent) {
    const modal = document.querySelector(".modal");
    const modalText = document.querySelector(".winOrLose");
    const closeModal = document.querySelector(".close");
    const gameDiv = document.getElementById("game");
    modal.style.backgroundColor = modalColor;
    modalText.textContent = textContent;
    gameDiv.style.pointerEvents = "none";
    closeModal.addEventListener("click", () => {
      this.hideModal();
      memGameState = this.restartGame();
    });
  }

  hideModal() {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
  }

  restartGame() {
    return new MemoryGameState(this.difficulty);
  }
}

let memGameState = new MemoryGameState();
let showDifficultyOnScreen = document.querySelector(".difficulty");
const sectionGame = document.getElementById("game");
document.getElementById("easy").addEventListener("click", () => {
  memGameState = memGameState.changeDifficulty("easy");
  showDifficultyOnScreen.textContent =
    "Vous avez choisi la difficulté : " + memGameState.difficulty;
  sectionGame.style.gridTemplateColumns = "repeat(3, 8rem)";
  sectionGame.style.gridTemplateRows = "repeat(2, 8rem)";
  memGameState.writeCardsToScreen();
});

document.getElementById("normal").addEventListener("click", () => {
  memGameState = memGameState.changeDifficulty("normal");
  showDifficultyOnScreen.textContent =
    "Vous avez choisi la difficulté : " + memGameState.difficulty;
  sectionGame.style.gridTemplateColumns = "repeat(5, 8rem)";
  sectionGame.style.gridTemplateRows = "repeat(2, 8rem)";
  memGameState.writeCardsToScreen();
});

document.getElementById("hard").addEventListener("click", () => {
  memGameState = memGameState.changeDifficulty("hard");
  showDifficultyOnScreen.textContent =
    "Vous avez choisi la difficulté : " + memGameState.difficulty;
  sectionGame.style.gridTemplateColumns = "repeat(5, 8rem)";
  sectionGame.style.gridTemplateRows = "repeat(5, 8rem)";
  memGameState.writeCardsToScreen();
});

memGameState.writeCardsToScreen();
