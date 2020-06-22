import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Collapse, Popconfirm} from "antd";
import {Button} from "../button";
import {DeleteOutlined} from '@ant-design/icons';
import {taskStep, TaskStep} from "./common";
import {TaskStepDetails} from "./task-step-details";

const {Panel} = Collapse;

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class MultiTaskStepDetails extends React.Component<Props> {

  @observable value: TaskStep[] = this.props.value || []

  add() {
    this.value.push(taskStep)
  }

  remove = (index: number) => {
    this.value.splice(index, 1)
  }

  render() {

    const genExtra = (index: number) => {
      if (this.value.length > 1) {
        return (
          <Popconfirm
            title="Confirm Delete?"
            onConfirm={(event: any) => {
              this.remove(index);
              event.stopPropagation();
            }}
            onCancel={(event: any) => {
              event.stopPropagation();
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              translate
              style={{color: "#ff4d4f"}}
              onClick={(event: any) => {
                event.stopPropagation();
              }}
            />
          </Popconfirm>
        );
      }
      return <></>;
    }

    return (
      <div>
        <Button primary onClick={() => this.add()}>
          <span>Add Step</span>
        </Button>
        <br/>
        <br/>
        {this.value.length > 0 ?
          <Collapse>
            {this.value.map((item, index) => {
              return (
                <Panel header={`Step`} key={index} extra={genExtra(index)}>
                  <TaskStepDetails value={this.value[index]} onChange={value => this.value[index] = value}/>
                </Panel>
              );
            })}
          </Collapse> : <></>}
      </div>
    )
  }
}