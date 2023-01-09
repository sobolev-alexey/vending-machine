import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import { images, shelves } from '../vending/Config';
import { Product } from '../../types/Product';

const AddProducts = ({ callback }: { callback: (products: Product[]) => void }) => {
  const onFinish = (values: { products: Product[] }) => {
    callback(values.products);
  };

  return (
    <Form 
      name="products-form-add" 
      className="products-form" 
      onFinish={onFinish} 
      autoComplete="off"
      initialValues={{
        products: [''],
      }}
    >
      <Form.List name="products">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} 
                style={{ 
                  width: 700, 
                  display: 'flex',
                  marginBottom: 8,
                  columnGap: 20
                }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'productName']}
                  rules={[{ required: true, message: 'Missing product name' }]}
                >
                  <Input size="large" placeholder="Name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'cost']}
                  rules={[{ required: true, message: 'Missing cost' }]}
                >
                  <InputNumber size="large" placeholder="Cost" min={5} max={10000} step={5} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'shelfLocation']}
                  rules={[{ required: true, message: 'Missing shelf' }]}
                >
                  <Select size="large">
                    {
                      shelves.map(shelfRow => 
                        Array.from({length: 4}, (x, i) => i + 1).map(shelfIndex =>(
                          <Select.Option value={shelfRow + shelfIndex} key={shelfRow + shelfIndex}>
                            {shelfRow + shelfIndex}
                          </Select.Option>
                      )))
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'amountAvailable']}
                  rules={[{ required: true, message: 'Missing QTY' }]}
                >
                  <InputNumber size="large" placeholder="Quantity" min={1} max={20} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'image']}
                  rules={[{ required: true, message: 'Missing img' }]}
                >
                  <Select size="large">
                    {
                      Object.keys(images).slice(0, -1).map((image, index) => (
                        <Select.Option value={image} key={image + index}>
                          <img src={images[image]} className="product-image" alt="product-image" height={50} />
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add another product
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddProducts;