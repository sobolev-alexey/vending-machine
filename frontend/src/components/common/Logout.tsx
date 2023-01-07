import exit from '../../assets/exit-black.png';

const Logout = ({ callback }: { callback: () => Promise<void> }) => (
  <div className='logout'>
    <img 
      className="logout-img"
      src={exit} 
      role="button" 
      alt="Logout" 
      onClick={callback} 
    />
  </div>
);

export default Logout;