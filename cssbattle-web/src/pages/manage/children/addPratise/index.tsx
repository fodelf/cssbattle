/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-05 17:34:18
 * @LastEditors: pym
 * @LastEditTime: 2021-10-05 23:14:42
 */
import { useState } from 'react'
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Form, Input, Button, Radio, Checkbox } from 'antd'
const { Option } = Select
const { TextArea } = Input
import styles from './index.less'

interface IProps {
  pratiseType: string
}

const Choice: React.FC<any> = (props: IProps)=>{

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
    >
      <Form.Item label="题目" rules={[{ required: true }]}>
        <TextArea rows={4} />
      </Form.Item>
      {
        props.pratiseType !== 'subjective' &&
        <Form.List 
          name="choice"
          rules={[
            {
              validator: async (_, choice) => {
                if (!choice || choice.length < 2) {
                  return Promise.reject(new Error('至少2个选项'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 14 }}
                  label={`选项${String.fromCharCode(65 + index)}`}
                  required={index < 2 ? true: false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please input passenger's name or delete this field.",
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="请输入选项内容" style={{ width: '60%' }} />
                  </Form.Item>
                  {fields.length > 2 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{
                sm: { span: 14, offset: 4 },
              }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  添加选项
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
              <Form.Item label="答案">
                {
                    props.pratiseType === 'single' ? 
                    <Radio.Group>
                    {
                      fields.map((item, index)=> {
                        return (
                          <Radio value={String.fromCharCode(65 + index)}>{String.fromCharCode(65 + index)}</Radio>
                        )
                      })
                    }
                  </Radio.Group>
                  :
                  <Checkbox.Group>
                    {
                      fields.map((item, index)=> {
                        return (
                          <Checkbox value={String.fromCharCode(65 + index)}>{String.fromCharCode(65 + index)}</Checkbox>
                        )
                      })
                    }
                  </Checkbox.Group>
                }
                
                

              </Form.Item>
            </>
          )}
        </Form.List>
      } 
       
    </Form>
  )
}

const AddPraise: React.FC = (props)=> {
  const [selectValue, setValue] = useState('single')

  const handleChange = (value: string)=> {
    setValue(value)
  }

  return (
    <div className={styles.addPratise}>
      <div className={styles.pratiseTit}>
        <p>
          <span>习题1</span>
          <EditOutlined />
        </p>
      </div>
      <div>
      <Select defaultValue={selectValue} style={{ width: 120 }} onChange={handleChange}>
        <Option value="single">单选题</Option>
        <Option value="multiple">多选题</Option>
        <Option value="subjective">主观题</Option>
      </Select>
      <Choice pratiseType={selectValue}></Choice>
      </div>
    </div>
  )
}

export default AddPraise