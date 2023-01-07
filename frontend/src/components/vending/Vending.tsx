import { useState, useEffect, useRef, useContext } from "react";
import { Button, Product, Price } from ".";
import { AppContext } from '../../context/globalState';
import { scrollLeft } from "../../utils/text";
import hand from "../../assets/img/hand.svg";
import trash from "../../assets/img/trash.png";
import { images, keyPad, ButtonValue, Screen } from './Config';

type ItemProps = {
  _id: string;
  cost: number,
  shelfLocation: string,
  image: string,
  amountAvailable?: number,
};

type ShelveProps = {
  letter: string;
  items: ItemProps[];
};

function Vending({ depositCallback, buyCallback, resetCallback }: 
  {
    depositCallback: (value: number) => Promise<void>, 
    buyCallback: (id: string, quantity?: number) => Promise<void>, 
    resetCallback: () => Promise<void>
  }  
) {
  const { products } = useContext(AppContext);

  const [shelves, setShelves] = useState<ShelveProps[]>([]);
  const [inputCode, setInputCode] = useState("");
  const [balance, setBalance] = useState(0);
  const [screen, setScreen] = useState<Screen>("BALANCE");
  const [message, setMessage] = useState("");
  const [dispensingId, setDispensingId] = useState<string | null>(null);
  const productsRef = useRef(null);

  useEffect(() => {
    const shelves = ["A", "B", "C", "D", "E", "F"].map(letter => {
      const empty = new Array(4).fill({
        _id: ""+Math.random(),
        cost: 0,
        shelfLocation: ""+Math.random(),
        image: "empty",
        amountAvailable: 0,
      });
      const items = products?.filter(item => item?.shelfLocation.startsWith(letter)) || [];
      const filled = items.concat(empty).slice(0, 4)
      return { letter, items: filled }});
    
    setShelves(shelves);
  }, [JSON.stringify(products)]);

  const handleCodeClick = (value: ButtonValue) => {
    setScreen("INPUT_CODE");
    if (value === "CLR") {
      setInputCode("");
    } else {
      setInputCode(inputCode + value);
    }
  };

  const addMoney = (amount: number) => {
    setScreen("BALANCE");
    setBalance(balance + amount);
    depositCallback(amount);
  };

  const withdrawMoney = () => {
    setBalance(0);
    resetCallback();
  };

  const displayMessage = async (msg: string) => {
    setScreen("MESSAGE");

    await scrollLeft(msg, setMessage);

    setMessage("");
    setScreen("BALANCE");
  };

  const dispense = (inputCode: string) => {
    const shelf = shelves.find((shelf) => shelf.letter === inputCode[0]);
    const index = Number(inputCode[1]) - 1;
    const product = shelf?.items[index];

    if (product == null || product.cost === 0) {
      displayMessage("INVALID");
    } else if (balance >= product.cost && product.amountAvailable > 0) {
      setBalance(0);
      setScreen(balance - product.cost > 0 ? "CHANGE" : "BALANCE");
      setDispensingId(product.shelfLocation);
      buyCallback(product._id);
    } else {
      displayMessage("INSUFFICIENT FUNDS");
    }
  };

  useEffect(() => {
    if (dispensingId == null) return;
    setTimeout(() => setDispensingId(null), 2000);
  }, [dispensingId]);

  useEffect(() => {
    if (inputCode.length < 2) return;
    if (inputCode.length === 2) {
      dispense(inputCode);
      setInputCode("");
    }
  }, [inputCode]);

  return (
    <>
      <div className="vendingMachine">
        <img className="trash" src={trash} />
        <div>
          <div className="products" ref={productsRef}>
            {shelves?.map((shelf, index) => (
              <div className="shelf" key={index}>
                {shelf?.items?.map((item: ItemProps, i: number) => {
                  return (
                    <Product
                      key={item.shelfLocation + i}
                      id={item.shelfLocation}
                      dispensingId={dispensingId}
                      cost={item.cost}
                      image={images[item.image]}
                      code={shelf.letter + (i + 1)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="doorFrame">
            <div className="door" />
          </div>
          <img src={hand} className="hand" />
          <div className="money">
            <button className="coin1" onClick={(e) => addMoney(100)}>
              1€
            </button>
            <button className="coin2" onClick={(e) => addMoney(50)}>
              50c
            </button>
            <button className="coin3" onClick={(e) => addMoney(20)}>
              20c
            </button>
            <button className="coin4" onClick={(e) => addMoney(10)}>
              10c
            </button>
            <button className="coin5" onClick={(e) => addMoney(5)}>
              5c
            </button>
          </div>
        </div>

        <div className="keypadContainer">
          <div className="keypad">
            <div
              className={`screen ${screen === "MESSAGE" && "scrolling"}`}
            >
              {screen === "INPUT_CODE" && <span>{inputCode}</span>}
              {screen === "BALANCE" && <Price value={balance / 100} />}
              {screen === "MESSAGE" && <span>{message}</span>}
            </div>

            {keyPad.map((keys, row) => (
              <div key={row} className="keyPadRow">
                {keys.map((key, col) => (
                  <Button key={col} value={key} onClick={handleCodeClick} />
                ))}
              </div>
            ))}
            <div className="paymentContainer">
              <button
                className="changeButton"
                onClick={withdrawMoney}
              />
              <div className="coinSlot"></div>
            </div>
          </div>
        </div>
        <div className="poster">
          EAT.
          <br />
          SLEEP.
          <br />
          WORK.
          <br />
          REPEAT.
        </div>
      </div>
    </>
  );
}

export default Vending;
