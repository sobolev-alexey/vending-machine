import { MinusCircleTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Space, Popconfirm } from 'antd';
import { images, shelves } from '../vending/Config';
import { Product } from '../../types/Product';

const ManageProducts = ({ 
  products,
  updateCallback,
  deleteCallback 
}: { 
  products: Product[],
  updateCallback: (product: Product) => void,
  deleteCallback: (product: Product) => void,
}) => {
  const [productsForm] = Form.useForm();

  const confirm = (e: React.MouseEvent<HTMLElement>) => {
    console.log('Click on Yes', e);
  };
  
  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log('Click on No', e);
  };

  if (!products.length) {
    return <h3>No products</h3>
  }

  return (
    <Form 
      form={productsForm}
      name="products-form-manage" 
      className="products-form" 
      autoComplete="off"
      initialValues={{
        products: products.sort((a: Product, b: Product) => 
          a.shelfLocation.localeCompare(b.shelfLocation)) || [''],
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
                  rules={[{ required: true, message: 'Missing shelf location' }]}
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
                  rules={[{ required: true, message: 'Missing quantity' }]}
                >
                  <InputNumber size="large" placeholder="Quantity" min={1} max={20} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'image']}
                  rules={[{ required: true, message: 'Missing image' }]}
                >
                  <Select size="large">
                    {
                      Object.keys(images).slice(0, -1).map((image, index) => (
                        <Select.Option value={image} key={image + index}>
                          <img src={images[image]} className="product-image" alt="product-image" height={40} />
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button size="large" type="primary" onClick={() =>
                    updateCallback(productsForm.getFieldsValue()?.products?.[key])
                  }>
                    Update
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Popconfirm
                    title="Are you sure to delete this product?"
                    onConfirm={() => {
                      remove(name);
                      deleteCallback(products?.[key]);
                    }}
                    onCancel={() => null}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  >
                    <MinusCircleTwoTone twoToneColor="#f81d22" />
                  </Popconfirm>
                </Form.Item>
              </Space>
            ))}
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default ManageProducts;