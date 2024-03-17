import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(function loadDeckFromAPI() {
    async function fetchData() {
      const d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(d.data);
    }
    fetchData();
  }, []);

  // Draw card
  async function draw() {
    try {
      const drawRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);

      if (drawRes.data.remaining === 0) throw new Error("Deck empty!");

      const card = drawRes.data.cards[0];

      setDrawn((d) => [
        ...d,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);
    } catch (err) {
      alert(err);
    }
  }

  async function startShuffling() {
    setIsShuffling(true);
    try {
      await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
      setDrawn([]);
    } catch (err) {
      alert(err);
    } finally {
      setIsShuffling(false);
    }
  }
  // SHUFFLE
    function renderDrawBtnIfOk() {
        if (!deck) return null;
        return (
            <button classname="Deck-btn" onClick={draw} disabled={isShuffling}>
                Draw a card!
            </button>
        );
    }

    function renderShuffleBtnIfOk() {
        if (!deck) return null;
        return (
            <button classname="Deck-btn" onClick={startShuffling} disabled={isShuffling}>
                Shuffle the deck!
            </button>
        );
    }

    return (
        <main className="Deck">
            <h1 className="Deck-title">♦ Card Dealer ♦</h1>
            {renderDrawBtnIfOk()}
            {renderShuffleBtnIfOk()}
            <div className="Deck-cardarea">
                {drawn.map((card) => (
                    <Card key={card.id} name={card.name} image={card.image} />
                ))}
            </div>
        </main>
    );
}

export default Deck;