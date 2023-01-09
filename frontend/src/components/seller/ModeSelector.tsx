import { Radio, RadioChangeEvent } from 'antd';

const ModeSelector = ({ callback }: { callback: (mode: string) => void }) => {

  return (
    <div className='mode-selector'>
      <Radio.Group 
        onChange={(e: RadioChangeEvent) => callback(e.target.value)}
        defaultValue="create"
        buttonStyle="solid"
      >
        <Radio.Button value="create">Add products</Radio.Button>
        <Radio.Button value="manage">Manage products</Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default ModeSelector;