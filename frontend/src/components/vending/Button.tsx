import { ButtonValue } from './Config';

type ButtonProps = {
  value: ButtonValue;
  onClick: (value: ButtonValue) => void;
};

function Button({ value, onClick }: ButtonProps) {
  return (
    <button
      className={`button ${value}`}
      onClick={(e) => onClick(value)}
    >
      {value}
    </button>
  );
}

export default Button;