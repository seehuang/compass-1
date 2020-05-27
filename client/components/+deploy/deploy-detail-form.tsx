import React from 'react'
import { Input, Button, Row, Col, Collapse, Select, Switch, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './deploy-detail-form.scss'
const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
interface Props {

}

interface State {
  type: string,
  name: string,
  strategy: string,
  forms: Array<any>,
  activeKey?: any
}


export class DetailForm extends React.Component<Props, State>{

  default_node() {
    return {
      type: 'Stone',
      name: 'app-name',
      strategy: 'Aplha',
      forms: [
        {
          id: this.random(),
          name: 'default',
          image: 'app:latest',
          imagePullPolicy: 'IfNotPresent',
          resource: {
            limits: {
              cpu: 170,
              memory: 170,
            },
            requests: {
              cpu: 100,
              memory: 30,
            }
          },
          startCommand: new Array,
          startParams: new Array,
          oneEnvConfig: new Array,
          // {
          //   id: this.random(),
          //   type: '1',
          //   envConfigName: '', //环境变量名称
          //   envConfigValue: '', //环境变量值
          //   configSetName: '', //配置集Name
          //   configSetKey: '', //配置集Key
          //   encryptionName: '',//加密字典名称
          //   encryptionKey: '',//加密字典key
          // }

          multipleEnvConfig: new Array,
          readyProbe: {
            status: false,
            timeout: '',
            cycle: '',
            retryCount: '',
            delay: '',
            pattern: {
              type: '1',
              httpPort: '',
              url: '',
              tcpPort: '',
              command: ''
            }
          },
          aliveProbe: {
            status: false,
            timeout: '',
            cycle: '',
            retryCount: '',
            delay: '',
            pattern: {
              type: '1',
              httpPort: '',
              url: '',
              tcpPort: '',
              command: ''
            }
          },
          lifeCycle: {
            status: false,
            postStart: {
              type: '1',
              httpPort: '',
              url: '',
              tcpPort: '',
              command: ''
            },
            preStop: {
              type: '1',
              httpPort: '',
              url: '',
              tcpPort: '',
              command: ''
            }
          },
        }
      ]
    };
  }

  constructor(props: any) {
    super(props)
    this.state = this.default_node();
  }

  changeSelectType(value: string) {
    this.setState({ type: value })
  }

  changeSelectStrategy(value: string) {
    this.setState({ strategy: value })
  }

  changeInputName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: e.target.value })
  }

  addContainer() {
    let { forms } = this.state
    forms.push(this.default_node());
    this.setState({ forms: forms })
  }

  genExtra(index: number) {
    let { forms } = this.state
    return (
      <Popconfirm
        title="Confirm Delete?"
        onConfirm={(event: any) => {
          event.preventDefault()
          event.stopPropagation()
          forms.splice(index, 1)
          this.setState({ forms: forms })
        }}
        onCancel={(event: any) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        okText="Yes"
        cancelText="No">
        <DeleteOutlined translate style={{ color: '#ff4d4f' }}
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
          }}
        />

      </Popconfirm>

    )
  };

  changeInputValue(index: number, e: React.ChangeEvent<HTMLInputElement>, filed: string) {
    e.stopPropagation()
    let { forms } = this.state
    const value = e.target.value
    switch (filed) {
      case 'name':
        forms[index].name = value
        break;
      case 'image':
        forms[index].image = value
        break;
    }
    this.setState({ forms: forms })
  }

  random() {
    let s = (Math.ceil(Math.random() * 10000000)).toString()
    return s.substr(0, 7)
  }

  changeSelectValue(index: number, value: string, filed: string) {
    let { forms } = this.state
    const val = value
    // switch (filed) {
    //   case 'imagePullPolicy':
    forms[index].imagePullPolicy = val
    // break;
    // }
    this.setState({ forms: forms });
  }

  getData() {
    let obj = { ...this.state };
    console.log("-------------------------------- getData", obj);
  }

  changeInputCpuAndMemory(index: number, value: any, resourceType: string, resourceTypeField: string) {
    let { forms } = this.state;
    const val = value;

    switch (resourceType) {
      case 'limits':
        switch (resourceTypeField) {
          case 'cpu':
            forms[index].resource.limits.cpu = val;
            break;
          case 'memory':
            forms[index].resource.limits.memory = val;
            break;
        }
        break;
      case 'requests':
        switch (resourceTypeField) {
          case 'cpu':
            forms[index].resource.requests.cpu = val;
            break;
          case 'memory':
            forms[index].resource.requests.memory = val;
            break;
        }
        break;
    }
    this.setState({ forms: forms })
  }

  addStartCommand(index: number) {
    let { forms } = this.state
    let obj = {
      id: this.random(),
      value: ''
    }
    forms[index].startCommand.push(obj)
    this.setState({ forms: forms })
  }

  changeInputStartCommand(index: number, scIndex: number, e: React.ChangeEvent<HTMLInputElement>) {
    e.stopPropagation()
    let { forms } = this.state
    const value = e.target.value
    forms[index].startCommand[scIndex].value = value
    this.setState({ forms: forms })
  }

  deleteStartCommand(index: number, id: string) {
    let { forms } = this.state
    let com = forms[index].startCommand
    for (let i = 0; i < com.length; i++) {
      if (com[i].id == id) {
        com.splice(i, 1)
      }
    }
    this.setState({ forms: forms })
  }

  addStartParams(index: number) {
    let { forms } = this.state
    let obj = {
      id: this.random(),
      value: ''
    }
    forms[index].startParams.push(obj)
    this.setState({ forms: forms })
  }

  changeInputStartParams(index: number, scIndex: number, e: React.ChangeEvent<HTMLInputElement>) {
    let { forms } = this.state
    const value = e.target.value
    forms[index].startParams[scIndex].value = value
    this.setState({ forms: forms })
  }

  deleteStartParams(index: number, id: string) {
    let { forms } = this.state
    let com = forms[index].startParams
    for (let i = 0; i < com.length; i++) {
      if (com[i].id == id) {
        com.splice(i, 1)
      }
    }
    this.setState({ forms: forms })
  }

  addEnvConfigByOne(index: number) {
    let { forms } = this.state
    let obj = {
      id: this.random(),
      type: '1',
      configName: '',
      configKey: '',
      configType: ''
    }
    forms[index].oneEnvConfig.push(obj)
    this.setState({ forms: forms })
  }

  deleteEnvConfigByOne(index: number, id: string) {
    let { forms } = this.state
    let data = forms[index].oneEnvConfig
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data.splice(i, 1)
      }
    }
    this.setState({ forms: forms })
  }

  selectChangeEnvConfigByOne(index: number, cIndex: number, value: string) {
    let { forms } = this.state
    const val = value
    forms[index].oneEnvConfig[cIndex].type = value
    this.setState({ forms: forms })
  }

  inputChangeEnvConfigByOne(index: number, cIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, filed: string) {
    let { forms } = this.state
    const val = e.target.value
    switch (filed) {
      case 'envConfigName':
        forms[index].oneEnvConfig[cIndex].envConfigName = val
        break;
      case 'envConfigValue':
        forms[index].oneEnvConfig[cIndex].envConfigValue = val
        break;
      case 'configSetName':
        forms[index].oneEnvConfig[cIndex].configSetName = val
        break;
      case 'configSetKey':
        forms[index].oneEnvConfig[cIndex].configSetKey = val
        break;
      case 'encryptionName':
        forms[index].oneEnvConfig[cIndex].encryptionName = val
        break;
      case 'encryptionKey':
        forms[index].oneEnvConfig[cIndex].encryptionKey = val
        break;
    }
    this.setState({ forms: forms })
  }

  switchChange(index: number, status: boolean, filed: string) {
    let { forms } = this.state
    switch (filed) {
      case 'readyProbe':
        forms[index].readyProbe.status = status
        break;
      case 'aliveProbe':
        forms[index].aliveProbe.status = status
        break;
      case 'lifeCycle':
        forms[index].lifeCycle.status = status
        break;
    }
    this.setState({ forms: forms })
  }

  readyProbeInputChange(index: number, e: string | any | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, filed: string) {
    let { forms } = this.state
    let val = ''

    if (e && e.target) {
      console.log(e.target)
      val = e.target.value
    }
    else {
      val = e
    }
    let data = forms[index].readyProbe
    switch (filed) {
      case 'timeout':
        data.timeout = val
        break;
      case 'cycle':
        data.cycle = val
        break;
      case 'retryCount':
        data.retryCount = val
        break;
      case 'delay':
        data.delay = val
        break;
      case 'httpPort':
        data.pattern.httpPort = val
        break;
      case 'url':
        data.pattern.url = val
      case 'tcpPort':
        data.pattern.tcpPort = val
        break;
      case 'command':
        data.pattern.command = val
        break;
    }
    this.setState({ forms: forms })
  }

  readyProbeSelectChange(index: number, value: string) {
    let { forms } = this.state
    forms[index].readyProbe.pattern.type = value
    this.setState({ forms: forms })
  }

  aliveProbeInputChange(index: number, e: string | any | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, filed: string) {
    let { forms } = this.state
    let val = ''
    if (e && e.target) {
      val = e.target.value
    }
    else {
      val = e
    }
    let data = forms[index].aliveProbe
    switch (filed) {
      case 'timeout':
        data.timeout = val
        break;
      case 'cycle':
        data.cycle = val
        break;
      case 'retryCount':
        data.retryCount = val
        break;
      case 'delay':
        data.delay = val
        break;
      case 'httpPort':
        data.pattern.httpPort = val
        break;
      case 'url':
        data.pattern.url = val
      case 'tcpPort':
        data.pattern.tcpPort = val
        break;
      case 'command':
        data.pattern.command = val
        break;
    }
    this.setState({ forms: forms })
  }

  aliveProbeSelectChange(index: number, value: string) {
    let { forms } = this.state
    forms[index].aliveProbe.pattern.type = value
    this.setState({ forms: forms })
  }

  lifeCycleInputChange(index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string, filed: string) {
    let { forms } = this.state
    const val = e.target.value
    let data: any = {}
    if (type == 'postStart') {
      data = forms[index].lifeCycle.postStart
    }
    if (type == 'preStop') {
      data = forms[index].lifeCycle.preStop
    }
    switch (filed) {
      case 'httpPort':
        data.httpPort = val
        break;
      case 'url':
        data.url = val
        break;
      case 'tcpPort':
        data.tcpPort = val
        break;
      case 'command':
        data.command = val
        break;
    }
    this.setState({ forms: forms })
  }

  lifeCycleSelectChange(index: number, value: string, filed: string) {
    let { forms } = this.state
    switch (filed) {
      case 'postStart':
        forms[index].lifeCycle.postStart.type = value
        break;
      case 'preStop':
        forms[index].lifeCycle.preStop.type = value
        break;
    }
    this.setState({ forms: forms })
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        activeKey: 0
      })
    }, 1000)

  }

  render() {
    const { forms, type, name, strategy, activeKey } = this.state
    return (
      <>
        <Button onClick={() => this.getData()}>Submit</Button>
        <div className="top-form mt-10">
          <Row>
            <Col span={2} className="text-right fs-14 top-form-text">Type:&nbsp; </Col>
            <Col span={18}>
              <Select value={type} size="small" className="top-form-text" style={{ width: '100%' }} onChange={(value) => this.changeSelectType(value)} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <Option value="1">Stone</Option>
                <Option value="2">Water</Option>
              </Select>
            </Col>
          </Row>

          <Row className="mt-10">
            <Col span={2} className="text-right fs-14 top-form-text">Name:</Col>
            <Col span={18}>
              <Input size="small" className="top-form-text" value={name} onChange={(e) => this.changeInputName(e)} />
            </Col>
          </Row>
        </div>

        <Button type="primary" className="mt-10" shape="circle" icon={<PlusOutlined translate />} onClick={() => this.addContainer()}></Button> <span className="btn-right-text3">Addition Container</span>
        <Row className="mt-10"></Row>
        <Collapse defaultActiveKey={'0'} >
          {
            forms.map((item: any, index: number) => {
              return (
                <Panel header={`Container`} key={index} extra={this.genExtra(index)}>
                  <Row>
                    <Col span={4} className="text-right fs-14 top-form-text">ContainerName:&nbsp;</Col>
                    <Col span={18}><Input size="small" value={forms[index].name} onChange={(e) => this.changeInputValue(index, e, 'name')} /></Col>
                  </Row>
                  <Row className="mt-10">
                    <Col span={4} className="text-right fs-14 top-form-text">ImageAddress:&nbsp;</Col>
                    <Col span={18}>
                      <Input size="small" value={forms[index].image} onChange={(e) => this.changeInputValue(index, e, 'image')} />
                    </Col>
                  </Row>


                  <Row className="mt-10">
                    <Col span={4} className="text-right fs-14 top-form-text">ImagePullPolicy:&nbsp;</Col>
                    <Col span={18}>
                      <Select value={forms[index].imagePullPolicy} size="small" style={{ width: '100%' }} onChange={(value) => this.changeSelectValue(index, value, 'imagePullPolicy')} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <Option value="1">IfNotPresent</Option>
                        <Option value="2">Always</Option>
                        <Option value="3">Never</Option>
                      </Select>
                    </Col>
                  </Row>

                  <Row className="mt-10">
                    <Col span={4} className="text-right fs-14 top-form-text">Limit CPU:&nbsp;</Col>
                    <Col span={6} className="text-right fs-14 top-form-text"><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="Limit CPU" value={forms[index].resource.limits.cpu} onChange={(e) => this.changeInputCpuAndMemory(index, e, 'limits', 'cpu')} /> (M) </Col>
                    <Col span={2}></Col>
                    <Col span={5} className="text-right fs-14 top-form-text">Limit Memory:&nbsp;</Col>
                    <Col span={5} className="text-right fs-14 top-form-text"><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="Limit Memory" value={forms[index].resource.limits.memory} onChange={(e) => this.changeInputCpuAndMemory(index, e, 'limits', 'memory')} /> (Mi) </Col>
                  </Row>

                  <Row className="mt-10">
                    <Col span={4} className="text-right fs-14 top-form-text">Require CPU:&nbsp;</Col>
                    <Col span={6} className="text-right fs-14 top-form-text"><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="Require CPU" value={forms[index].resource.requests.cpu} onChange={(e) => this.changeInputCpuAndMemory(index, e, 'requests', 'cpu')} /> (M) </Col>
                    <Col span={2}></Col>
                    <Col span={5} className="text-right fs-14 top-form-text">Require Memory:&nbsp;</Col>
                    <Col span={5} className="text-right fs-14 top-form-text"><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="Require Memory" value={forms[index].resource.requests.memory} onChange={(e) => this.changeInputCpuAndMemory(index, e, 'requests', 'memory')} /> (Mi) </Col>
                  </Row>


                  <Row><Button size="small" type="primary" className="mt-10" shape="circle" icon={<PlusOutlined translate />} onClick={() => this.addStartCommand(index)}></Button> <span className="btn-right-text1">Addition Command</span> </Row>
                  {
                    forms[index].startCommand.map((item: any, scIndex: number) => {
                      return (
                        <Row>
                          <Col span={20} className="mt-10"><Input size="small" addonBefore="Command" value={forms[index].startCommand[scIndex].value} onChange={(e) => this.changeInputStartCommand(index, scIndex, e)} /></Col>
                          <Col span={4} className="mt-10"><Button size="small" className="ml-10" icon={<DeleteOutlined translate />} shape="circle" danger onClick={(e) => { e.stopPropagation(); this.deleteStartCommand(index, item.id) }}></Button></Col>
                        </Row>
                      )
                    })
                  }

                  <Row><Button size="small" type="primary" className="mt-10" shape="circle" icon={<PlusOutlined translate />} onClick={() => this.addStartParams(index)}></Button> <span className="btn-right-text1">Addition Start Command</span> </Row>
                  {
                    forms[index].startParams.map((item: any, scIndex: number) => {
                      return (
                        <Row>
                          <Col span={20} className="mt-10"><Input size="small" addonBefore="Start Command" value={forms[index].startParams[scIndex].value} onChange={(e) => this.changeInputStartParams(index, scIndex, e)} /></Col>
                          <Col span={4} className="mt-10"><Button size="small" className="ml-10" icon={<DeleteOutlined translate />} shape="circle" danger onClick={(e) => { e.stopPropagation(); this.deleteStartParams(index, item.id) }}></Button></Col>
                        </Row>
                      )
                    })
                  }
                  <Row className="mt-10"><Button type="primary" size="small" shape="circle" icon={<PlusOutlined translate />} onClick={() => this.addEnvConfigByOne(index)}></Button><span className="btn-right-text2">Environment </span></Row>
                  {
                    forms[index].oneEnvConfig.map((item: any, cIndex: number) => {
                      return (
                        <div className="env-config-block">
                          <Row className="mt-10">
                            <Col span={4} className="text-right">Type:&nbsp;</Col>
                            <Col span={18}>
                              <Select size="small" style={{ width: '100%' }} value={item.type} onChange={(value) => this.selectChangeEnvConfigByOne(index, cIndex, value)} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <Option value="1">Custom Environment</Option>
                                <Option value="2">From Configuration</Option>
                                <Option value="3">From Secret</Option>
                                <Option value="4">Other</Option>
                              </Select>
                            </Col>
                            <Button size="small" icon={<DeleteOutlined translate />} className="ml-10" shape="circle" danger onClick={(e) => { e.stopPropagation(); this.deleteEnvConfigByOne(index, item.id) }}></Button>
                          </Row>
                          {
                            item.type == '1' ?
                              <>
                                <Row className="mt-10">
                                  <Col span={4} className="text-right">Name:&nbsp;</Col>
                                  <Col span={18}><Input size="small" placeholder="Environment Name" value={forms[index].oneEnvConfig[cIndex].envConfigName} onChange={(e) => this.inputChangeEnvConfigByOne(index, cIndex, e, 'envConfigName')} /></Col>
                                </Row>
                                <Row className="mt-10">
                                  <Col span={4} className="text-right">Value:&nbsp;</Col>
                                  <Col span={18}><Input size="small" placeholder="Environment Value" value={forms[index].oneEnvConfig[cIndex].envConfigValue} onChange={(e) => this.inputChangeEnvConfigByOne(index, cIndex, e, 'envConfigValue')} /></Col>
                                </Row>
                              </>
                              : <></>
                          }
                          {
                            item.type == '2' ?
                              <>
                                <Row className="mt-10">
                                  <Col span={4} className="text-right">Environment:&nbsp;</Col>
                                  <Col span={18}><Input size="small" placeholder="Environment Name" value={forms[index].oneEnvConfig[cIndex].envConfigName} onChange={(e) => this.inputChangeEnvConfigByOne(index, cIndex, e, 'envConfigName')} /></Col>
                                </Row>
                                <Row className="mt-10">
                                  <Col span={4} className="text-right">Configure:&nbsp;</Col>
                                  <Col span={18}><Input size="small" placeholder="Configure Name" value={forms[index].oneEnvConfig[cIndex].configSetName} onChange={(e) => this.inputChangeEnvConfigByOne(index, cIndex, e, 'configSetName')} /></Col>
                                </Row>
                                <Row className="mt-10">
                                  <Col span={4} className="text-right">Key:&nbsp;</Col>
                                  <Col span={18}><Input size="small" placeholder="Configure Key" value={forms[index].oneEnvConfig[cIndex].configSetKey} onChange={(e) => this.inputChangeEnvConfigByOne(index, cIndex, e, 'configSetKey')} /></Col>
                                </Row>
                              </>
                              : <></>
                          }
                          {
                            item.type == '3' ?
                              <>
                                <Row className="mt-10">
                                  <Col span={4} className="text-right">Name:&nbsp;</Col>
                                  <Col span={18}><Input size="small" placeholder="Environment Name" value={forms[index].oneEnvConfig[cIndex].envConfigName} onChange={(e) => this.inputChangeEnvConfigByOne(index, cIndex, e, 'envConfigName')} /></Col>
                                </Row>
                                <Row className="mt-10">
                                  <Col span={4} className="text-right">Secret Name:&nbsp;</Col>
                                  <Col span={18}><Input size="small" placeholder="Secret Name" value={forms[index].oneEnvConfig[cIndex].encryptionName} onChange={(e) => this.inputChangeEnvConfigByOne(index, cIndex, e, 'encryptionName')} /></Col>
                                </Row>
                                <Row className="mt-10">
                                  <Col span={4} className="text-right">Secret Key:&nbsp;</Col>
                                  <Col span={18}><Input size="small" placeholder="Secret Key" value={forms[index].oneEnvConfig[cIndex].encryptionKey} onChange={(e) => this.inputChangeEnvConfigByOne(index, cIndex, e, 'encryptionKey')} /></Col>
                                </Row>
                              </>
                              : <></>
                          }
                          {
                            item.type == '4' ?
                              <Row className="mt-10">
                                <Col span={4} className="text-right">Enter Command:&nbsp;</Col>
                                <Col span={18}><TextArea rows={4} placeholder="Enter Command" value={forms[index].oneEnvConfig[cIndex].envConfigName} onChange={(e) => this.inputChangeEnvConfigByOne(index, cIndex, e, 'envConfigName')} /></Col>
                              </Row>
                              : <></>
                          }
                        </div>
                      )
                    })
                  }
                  <Row>
                    <Switch size="small" style={{ marginTop: '13px' }} checked={forms[index].readyProbe.status} onChange={(e) => this.switchChange(index, e, 'readyProbe')} /><span className="btn-right-text1">Readiness Probe:&nbsp;</span>
                  </Row>
                  {
                    forms[index].readyProbe.status === true ?
                      <div className="ready-probe-block">
                        <Row className="mt-10">
                          <Col span={4} className="text-right">Timeout:&nbsp;</Col>
                          <Col span={4}><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="TimeoutSeconds" value={forms[index].readyProbe.timeout} onChange={(e) => this.readyProbeInputChange(index, e, 'timeout')} /></Col>
                          <Col span={1}></Col>
                          <Col span={4} className="text-right">Period:&nbsp;</Col>
                          <Col span={4}><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="PeriodSeconds" value={forms[index].readyProbe.cycle} onChange={(e) => this.readyProbeInputChange(index, e, 'cycle')} /></Col>
                        </Row>
                        <Row className="mt-10">
                          <Col span={4} className="text-right">Failure:&nbsp;</Col>
                          <Col span={4}><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="FailureThreshold" value={forms[index].readyProbe.retryCount} onChange={(e) => this.readyProbeInputChange(index, e, 'retryCount')} /></Col>
                          <Col span={1}></Col>
                          <Col span={4} className="text-right">InitialDelay:&nbsp;</Col>
                          <Col span={4}><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="InitialDelaySeconds" value={forms[index].readyProbe.delay} onChange={(e) => this.readyProbeInputChange(index, e, 'delay')} /></Col>
                        </Row>
                        <Row className="mt-10">
                          <Col span={4} className="text-right">Probe Type:&nbsp;</Col>
                          <Col span={6}>
                            <Select size="small" style={{ width: '100%' }} value={forms[index].readyProbe.pattern.type} onChange={(value) => this.readyProbeSelectChange(index, value)} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                              <Option value="1">HTTP</Option>
                              <Option value="2">TCP</Option>
                              <Option value="3">Command</Option>
                            </Select>
                          </Col>
                        </Row>
                        {
                          forms[index].readyProbe && forms[index].readyProbe.pattern && forms[index].readyProbe.pattern.type == '1' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">HTTP:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="HTTP port" value={forms[index].readyProbe.pattern.httpPort} onChange={(e) => this.readyProbeInputChange(index, e, 'httpPort')} /></Col>
                              <Col span={1}></Col>
                              <Col span={4} className="text-right">URL:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="URL" value={forms[index].readyProbe.pattern.url} onChange={(e) => this.readyProbeInputChange(index, e, 'url')} /></Col>
                            </Row>
                            : <></>
                        }
                        {
                          forms[index].readyProbe && forms[index].readyProbe.pattern && forms[index].readyProbe.pattern.type == '2' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">TCP:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="TCP Port" value={forms[index].readyProbe.pattern.tcpPort} onChange={(e) => this.readyProbeInputChange(index, e, 'tcpPort')} /></Col>
                            </Row>
                            : <></>
                        }
                        {
                          forms[index].readyProbe && forms[index].readyProbe.pattern && forms[index].readyProbe.pattern.type == '3' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">Command:&nbsp;</Col>
                              <Col span={18}><TextArea rows={4} placeholder="Shell Command" value={forms[index].readyProbe.pattern.command} onChange={(e) => this.readyProbeInputChange(index, e, 'command')} /></Col>
                            </Row>
                            : <></>
                        }
                      </div>
                      : <></>
                  }


                  <Row>
                    <Switch size="small" style={{ marginTop: '13px' }} checked={forms[index].aliveProbe.status} onChange={(e) => this.switchChange(index, e, 'aliveProbe')} /><span className="btn-right-text1">Liveness Probe</span>
                  </Row>
                  {
                    forms[index].aliveProbe.status === true ?
                      <div className="ready-probe-block">
                        <Row className="mt-10">
                          <Col span={4} className="text-right">Timeout:&nbsp;</Col>
                          <Col span={6}><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="TimeoutSeconds" value={forms[index].aliveProbe.timeout} onChange={(e) => this.aliveProbeInputChange(index, e, 'timeout')} /></Col>
                          <Col span={1}></Col>
                          <Col span={4} className="text-right">Period:&nbsp;</Col>
                          <Col span={6}><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="PeriodSeconds" value={forms[index].aliveProbe.cycle} onChange={(e) => this.aliveProbeInputChange(index, e, 'cycle')} /></Col>
                        </Row>
                        <Row className="mt-10">
                          <Col span={4} className="text-right">Failure:&nbsp;</Col>
                          <Col span={6}><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="FailureThreshold" value={forms[index].aliveProbe.retryCount} onChange={(e) => this.aliveProbeInputChange(index, e, 'retryCount')} /></Col>
                          <Col span={1}></Col>
                          <Col span={4} className="text-right">InitialDelay:&nbsp;</Col>
                          <Col span={6}><InputNumber min={0} style={{ width: '100%' }} size="small" placeholder="InitialDelaySeconds" value={forms[index].aliveProbe.delay} onChange={(e) => this.aliveProbeInputChange(index, e, 'delay')} /></Col>
                        </Row>
                        <Row className="mt-10">
                          <Col span={4} className="text-right">Probe Type:&nbsp;</Col>
                          <Col span={6}>
                            <Select size="small" style={{ width: '100%' }} value={forms[index].aliveProbe.pattern.type} onChange={(value) => this.aliveProbeSelectChange(index, value)} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                              <Option value="1">HTTP</Option>
                              <Option value="2">TCP</Option>
                              <Option value="3">Command</Option>
                            </Select>
                          </Col>
                        </Row>
                        {
                          forms[index].aliveProbe && forms[index].aliveProbe.pattern && forms[index].aliveProbe.pattern.type == '1' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">HTTP:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="HTTP port" value={forms[index].aliveProbe.pattern.httpPort} onChange={(e) => this.aliveProbeInputChange(index, e, 'httpPort')} /></Col>
                              <Col span={1}></Col>
                              <Col span={4} className="text-right">URL:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="URL" value={forms[index].aliveProbe.pattern.url} onChange={(e) => this.aliveProbeInputChange(index, e, 'url')} /></Col>
                            </Row>
                            : <></>
                        }
                        {
                          forms[index].aliveProbe && forms[index].aliveProbe.pattern && forms[index].aliveProbe.pattern.type == '2' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">TCP:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="TCP port" value={forms[index].aliveProbe.pattern.tcpPort} onChange={(e) => this.aliveProbeInputChange(index, e, 'tcpPort')} /></Col>
                            </Row>
                            : <></>
                        }
                        {
                          forms[index].aliveProbe && forms[index].aliveProbe.pattern && forms[index].aliveProbe.pattern.type == '3' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">Command:&nbsp;</Col>
                              <Col span={18}><TextArea rows={4} placeholder="Shell Command" value={forms[index].aliveProbe.pattern.command} onChange={(e) => this.aliveProbeInputChange(index, e, 'command')} /></Col>
                            </Row>
                            : <></>
                        }
                      </div>
                      : <></>
                  }

                  <Row>
                    <Switch size="small" style={{ marginTop: '13px' }} checked={forms[index].lifeCycle.status} onChange={(e) => this.switchChange(index, e, 'lifeCycle')} /><span className="btn-right-text1">Lifecycle:&nbsp;</span>
                  </Row>
                  {
                    forms[index].lifeCycle.status === true ?
                      <div className="ready-probe-block">
                        <Row className="mt-10">
                          <Col span={4} className="text-right">postStart:&nbsp;</Col>
                          <Col span={6}>
                            <Select size="small" style={{ width: '100%' }} value={forms[index].lifeCycle.postStart.type} onChange={(value) => this.lifeCycleSelectChange(index, value, 'postStart')} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                              <Option value="1">None</Option>
                              <Option value="2">HTTP Request</Option>
                              <Option value="3">TCP Request</Option>
                              <Option value="4">Execute Command</Option>
                            </Select>
                          </Col>
                        </Row>

                        {
                          forms[index].lifeCycle.postStart.type == '2' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">HTTP:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="HTTP port" value={forms[index].lifeCycle.postStart.httpPort} onChange={(e) => this.lifeCycleInputChange(index, e, 'postStart', 'httpPort')} /></Col>
                              <Col span={1}></Col>
                              <Col span={4} className="text-right">URL:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="URL" value={forms[index].lifeCycle.postStart.url} onChange={(e) => this.lifeCycleInputChange(index, e, 'postStart', 'url')} /></Col>
                            </Row>
                            : <></>
                        }
                        {
                          forms[index].lifeCycle.postStart.type == '3' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">TCP:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="TCP port" value={forms[index].lifeCycle.postStart.tcpPort} onChange={(e) => this.lifeCycleInputChange(index, e, 'postStart', 'tcpPort')} /></Col>
                            </Row>
                            : <></>
                        }
                        {
                          forms[index].lifeCycle.postStart.type == '4' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">Command:&nbsp;</Col>
                              <Col span={18}><TextArea rows={4} placeholder="Shell Command" value={forms[index].lifeCycle.postStart.command} onChange={(e) => this.lifeCycleInputChange(index, e, 'postStart', 'command')} /></Col>
                            </Row>
                            : <></>
                        }

                        <Row className="mt-10">
                          <Col span={4} className="text-right">preStop:&nbsp;</Col>
                          <Col span={6}>
                            <Select size="small" style={{ width: '100%' }} value={forms[index].lifeCycle.preStop.type} onChange={(value) => this.lifeCycleSelectChange(index, value, 'preStop')} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                              <Option value="1">None</Option>
                              <Option value="2">HTTP Request</Option>
                              <Option value="3">TCP Request</Option>
                              <Option value="4">Execute Command</Option>
                              <Option value="5">Grace Exit</Option>
                            </Select>
                          </Col>
                        </Row>
                        {
                          forms[index].lifeCycle.preStop.type == '2' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">HTTP:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="HTTP port" value={forms[index].lifeCycle.preStop.httpPort} onChange={(e) => this.lifeCycleInputChange(index, e, 'preStop', 'httpPort')} /></Col>
                              <Col span={1}></Col>
                              <Col span={4} className="text-right">URL：</Col>
                              <Col span={6}><Input size="small" placeholder="URL" value={forms[index].lifeCycle.preStop.url} onChange={(e) => this.lifeCycleInputChange(index, e, 'preStop', 'url')} /></Col>
                            </Row>
                            : <></>
                        }
                        {
                          forms[index].lifeCycle.preStop.type == '3' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">TCP:&nbsp;</Col>
                              <Col span={6}><Input size="small" placeholder="TCP port" value={forms[index].lifeCycle.preStop.tcpPort} onChange={(e) => this.lifeCycleInputChange(index, e, 'preStop', 'tcpPort')} /></Col>
                            </Row>
                            : <></>
                        }
                        {
                          forms[index].lifeCycle.preStop.type == '4' ?
                            <Row className="mt-10">
                              <Col span={4} className="text-right">Execute Command:&nbsp;</Col>
                              <Col span={18}><TextArea rows={4} placeholder="Shell Command" value={forms[index].lifeCycle.preStop.command} onChange={(e) => this.lifeCycleInputChange(index, e, 'preStop', 'command')} /></Col>
                            </Row>
                            : <></>

                        }
                      </div>
                      : <></>
                  }
                </Panel>
              )
            })
          }
        </Collapse>

      </>
    )
  }
}