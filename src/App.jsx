import { useState, useEffect } from "react";
import { GameHeader } from "./components/GameHeader";
import { Card } from "./components/Card";
import { WinMessage } from "./components/WinMessage";

const cardValues = [
  "🍎","🍌","🍇","🍐","🍓","🍑","🍊","🍒",
  "🍎","🍌","🍇","🍐","🍓","🍑","🍊","🍒",
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedcards] = useState([]);
  const [matchedCards, setMatchedcards] = useState([]);
  const [score,setScore] = useState(0);
  const [moves,setMoves] = useState(0);
  const [isLocked,setIsLocked] = useState(false);

  const shuffleArray = (array) =>{
    const shuffled = [...array];
    for (let i = shuffled.length-1; i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [shuffled[i],shuffled[j]]= [shuffled[j],shuffled[i]]
    }
    return shuffled;
  }
  const initializeGame = () => {
    // Shuffling Cards
    const shuffled = shuffleArray(cardValues);
    const finalCards = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(finalCards);
    setIsLocked(false);
    setMoves(0);
    setScore(0);
    setMatchedcards([]);
    setFlippedcards([]);

  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (card)=>
  { 
    //Dont allow clocking card if it is already fliped of matched
    if(card.isFlipped ||
       card.isMatched ||
        isLocked || 
        flippedCards.length === 2) {
      return;
    }
    //Update the card flipped state
    const newCards = cards.map((c) => {
      if (c.id === card.id){
        return {...c, isFlipped: true};
      }
      else {
        return c;
      }
    })
    setCards(newCards)
    const newFlippedCards = [...flippedCards, card.id ]
    setFlippedcards(newFlippedCards)

    // Check if two cards are flipped
    if(flippedCards.length === 1 ){
      setIsLocked(true);
      const firstCard = cards[flippedCards[0]];

      if(firstCard.value === card.value){
        setTimeout(() => {
         setMatchedcards((prev)=> [...prev , firstCard.id, card.id]);
         setScore((prev) => prev+1);
         setCards((prev)=>
          prev.map((c) => {
          if (c.id === card.id || c.id === firstCard.id){
            return {...c, isMatched: true};
          }
          else {
            return c;
          }
         })
        )
         setFlippedcards([])
         setIsLocked(false)
          },500);
        
      } else {
        // flip back card1 and card2
        setTimeout(()=>{
          const flippedBackCard =newCards.map((c)=>{
         if(newFlippedCards.includes(c.id) || c.id === card.id){
          return{...c, isFlipped: false}
         }
          else{
            return c;

          }
         
        })
        setCards(flippedBackCard);
        setIsLocked(false);
        setFlippedcards([]);
        
        },1000);
        
      }
      setMoves((prev) => prev+1);
    }
    
  };
  
  const isGameComplete = matchedCards.length === cardValues.length;
  return (
    <div className="app">
      <GameHeader score={score} moves={moves} onReset={initializeGame}/>
      {isGameComplete && <WinMessage moves={moves}/>}
      <div className="cards-grid">
        {cards.map((card) => (
          <Card card={card} onClick={handleCardClick}/>
        ))}
      </div>
    </div>
  );
}

export default App;
