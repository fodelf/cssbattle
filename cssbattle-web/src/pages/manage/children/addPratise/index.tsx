/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-05 17:34:18
 * @LastEditors: pym
 * @LastEditTime: 2021-10-10 19:28:12
 */
import { useState, useRef, useEffect } from 'react'
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Form, Input, Button, Radio, Checkbox, message } from 'antd'
const { Option } = Select
const { TextArea } = Input
import styles from './index.less'
import { createExercise,  getAuditionExerciseDetail, updateExercise} from '@/api/manage'
import { history } from 'umi'

interface IProps {
  type: string
  name: string
  match: any
  formObj: any
}

const Choice: React.FC<any> = (props: IProps)=>{
  const formRef = useRef(null);
  const [choiceList, setChoiceList] = useState<any[]>(['',''])
  const [initialValues, setInitialValues] = useState({"choiceContent":  ['','']})

  useEffect(()=> {
    if(JSON.stringify(props.formObj) !== "{}") {
      queryPratiseDetail()
    } 
  },[props.formObj])

  const queryPratiseDetail = ()=> {
    (formRef.current as any).setFieldsValue({
      content: props.formObj?.content,
      describe: props.formObj?.describe,
      choiceContent: (props.formObj?.options && props.formObj?.options.map((item:any)=>item.des)) || [],
      answer: props.formObj?.type === 1 ? props.formObj?.answer: props.formObj?.answer[0]
    })
  }

  const onFinish = (values: any)=> {
    console.log(values)
    let options = values.choiceContent.map((item: any, index: number)=> {
      return {
        key: String.fromCharCode(65 + index),
        des: item
      }
    })
    let params = {
      name: props.name || '习题1',
      type: parseFloat(props.type),
      content: values.content,
      options: options,
      answer: props.type !== '1' ? [values.answer]: values.answer,
      describe: values.describe,
      auditionId: props.match.params.id
    }
    if(location.search) {
      updateExcise(params)
    }else {
      addExcise(params)
    }
  }

  const addExcise = (params: any)=> {
    createExercise(params).then(res=> {
      message.success('新增习题成功')
      history.push(`/index/detail/${props.match.params.id}/pratiseManage`)
    })
  }

  const updateExcise = (params: any)=> {
    updateExercise({
      ...params,
      id: location.search.split('=')[1] 
    }).then(res=> {
      message.success('更新习题成功')
      history.push(`/index/detail/${props.match.params.id}/pratiseManage`)
    })
  }

  return (
    <Form
      ref={formRef}
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 15 }}
      onFinish={onFinish}
      layout="horizontal"
      initialValues={initialValues}
    >
      <Form.Item label="题目" name="content" rules={[{ required: true }]}>
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="描述" name="describe">
        <TextArea rows={4} />
      </Form.Item>
      {
        props.type !== '2' &&
        <Form.List 
          name="choiceContent"
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
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 15 }}
                  label={`选项${String.fromCharCode(65 + index)}`}
                  required={index < 2 ? true: false}
                  {...field}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "请输入选项内容",
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="请输入选项内容" style={{ width: '60%' }} />
                  </Form.Item>
                  {fields.length > 2 ? (
                    <MinusCircleOutlined
                      title="删除"
                      className="dynamic-delete-button"
                      onClick={() => {
                        remove(field.name); 
                        let list = [...choiceList]
                        list.splice(index,1); 
                        setChoiceList(list)
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{
                sm: { span: 15, offset: 3 },
              }}>
                <Button
                  type="dashed"
                  onClick={() => {add(); setChoiceList([...choiceList, ''])}}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  添加选项
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
               
            </>
          )}
        </Form.List>
      } 
      <Form.Item label="答案" name="answer" rules={[{ required: true, message: '请选择答案选项' }]}>
        {
            props.type === '0' ? 
            <Radio.Group>
            {
              choiceList.map((item, index)=> {
                return (
                  <Radio value={String.fromCharCode(65 + index)}>{String.fromCharCode(65 + index)}</Radio>
                )
              })
            }
          </Radio.Group>
          :
          <Checkbox.Group>
            {
              choiceList.map((item, index)=> {
                return (
                  <Checkbox value={String.fromCharCode(65 + index)}>{String.fromCharCode(65 + index)}</Checkbox>
                )
              })
            }
          </Checkbox.Group>
        }
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 3, span: 15 }}>
        <Button type="primary" htmlType="submit">
          确  认
        </Button>
      </Form.Item>
    </Form>
  )
}

const AddPraise: React.FC = (props: any)=> {
  const [selectValue, setValue] = useState('0')
  const [name, setName] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [formObj, setForm] = useState({})

  useEffect(()=> {
    if(location.search) {
      queryPratiseDetail()
    }
  },[])

  const handleChange = (value: string)=> {
    setValue(value)
  }

  const changeStatus = () => {
    setIsEdit(true)
  }

  const confirmName =(e: any) => {
    setName(e.target.value)
    setIsEdit(false)
  }

  const queryPratiseDetail = ()=> {
    let params = {
      id: location.search.split('=')[1],
      auditionId: props.match.params.id
    }
    getAuditionExerciseDetail(params).then(res=> {
      setValue(`${res.data.data.type}`)
      setForm(res.data.data)
    })
  }


  return (
    <div className={styles.addPratise}>
      <div className={styles.pratiseTit}>
        <div className={styles.choiceOption}>
          <Select defaultValue={selectValue} value={selectValue} style={{ width: 120 }} onChange={handleChange}>
            <Option value="0">单选题</Option>
            <Option value="1">多选题</Option>
            <Option value="2">主观题</Option>
          </Select>
        </div>
        <p>
          {
            isEdit ? 
            <Input placeholder="请输入习题名称" onPressEnter={confirmName}></Input>
            :
            <>
              <span>{name || '习题1'}</span>
              <EditOutlined title="编辑" onClick={changeStatus} />
            </>
          }
           
        </p>
      </div>
      <div>
       
      <Choice type={selectValue} name={name} match={props.match} formObj={formObj}></Choice>
      </div>
    </div>
  )
}

export default AddPraise