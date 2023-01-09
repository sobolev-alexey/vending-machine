import { useState, useEffect, useRef, useContext } from "react";
import { Button, Product, Price } from ".";
import { AppContext } from '../../context/globalState';
import { scrollLeft } from "../../utils/text";
import hand from "../../assets/img/hand.svg";
import trash from "../../assets/img/trash.png";
import { images, shelves as shelveIndexes, keyPad, ButtonValue, Screen } from './Config';
import { Product as ProductType } from '../../types/Product';

type ShelveProps = {
  letter: string;
  items: ProductType[];
};

function Vending({ depositCallback, buyCallback, resetCallback }: 
  {
    depositCallback: (value: number) => Promise<boolean>, 
    buyCallback: (id: string, quantity?: number) => Promise<void>, 
    resetCallback: () => Promise<boolean>
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
    const placeholder = {
      _id: ""+Math.random(),
      cost: 0,
      image: "empty",
      amountAvailable: 0,
    };
    const shelves = shelveIndexes.map(shelfRow => {
      const items = Array.from({length: 4}, (x, i) => i + 1).map(shelfIndex => {
        const shelfLocation = `${shelfRow}${shelfIndex}`;
        const item = products?.find((prod: ProductType) => prod?.shelfLocation === shelfLocation);
        return item || { ...placeholder, shelfLocation };
      });
      return { letter: shelfRow, items };
    });
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

  const addMoney = async (amount: number) => {
    const result = await depositCallback(amount);
    if (result) {
      setScreen("BALANCE");
      setBalance(balance + amount);
    }
  };

  const withdrawMoney = async () => {
    const result = await resetCallback();
    result && setBalance(0);
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
      buyCallback(product._id);
      setBalance(0);
      setScreen(balance - product.cost > 0 ? "CHANGE" : "BALANCE");
      setDispensingId(product.shelfLocation);
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
                {shelf?.items?.map((item: ProductType, i: number) => {
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
