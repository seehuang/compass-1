import "./copy-task-dialog.scss";

import { observer } from "mobx-react";
import React from "react";
import {
  PipelineParamsDetails,
  PipelineResourceDetails,
  MultiTaskStepDetails,
  PipelineParams,
  PipelineResources,
  TaskStep,
  taskStep,
} from "../+tekton-task-detail";
import { observable, toJS } from "mobx";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Trans } from "@lingui/macro";
import { ActionMeta } from "react-select/src/types";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { taskStore } from "../+tekton-task/task.store";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";

interface Props<T = any> extends Partial<Props> {
  value?: T;

  onChange?(option: T, meta?: ActionMeta): void;

  themeName?: "dark" | "light" | "outlined";
}

class Volume {
  name: string;
  emptyDir: any;
}

export interface TaskResult {
  taskName: string;
  pipelineParams: PipelineParams[];
  pipelineResources: PipelineResources[];
  taskSteps: TaskStep[];
  volumes?: Volume[];
}

export const task: TaskResult = {
  taskName: "defaultName",
  pipelineParams: [],
  pipelineResources: [],
  taskSteps: [taskStep],
  volumes: [],
};

@observer
export class CopyTaskDialog extends React.Component<Props> {
  @observable value: TaskResult = this.props.value || task;
  @observable static isOpen = false;
  @observable static graph: any;
  @observable static node: any;
  @observable static data: any;
  @observable ifSwitch: boolean = false;

  static open(graph: any, node: any) {
    CopyTaskDialog.isOpen = true;
    this.graph = graph;
    this.node = node;
  }

  onOpen = () => {
    const group = CopyTaskDialog.node.getContainer();
    let shape = group.get("children")[2];
    const name = shape.attrs.text;
    const defaultNameSpace = "ops";
    const task = taskStore.getByName(name, defaultNameSpace);
    if (task !== undefined) {
      task.spec.inputs?.resources?.map((item: any, index: number) => {
        this.value.pipelineResources[index].name = item.name;
        this.value.pipelineResources[index].type = item.type;
      });
      task.spec?.params?.map((item: any, index: number) => {
        this.value.pipelineParams[index].default = item.default;
        this.value.pipelineParams[index].description = item.description;
        this.value.pipelineParams[index].name = item.name;
        this.value.pipelineParams[index].type = item.type;
      });
      this.value.taskSteps = task.spec.steps;
      this.value.volumes = task.spec.volumes;
      this.value.taskName = task.metadata.name;
    }
  };

  static close() {
    CopyTaskDialog.isOpen = false;
  }

  close = () => {
    CopyTaskDialog.close();
  };

  handle = () => {
    CopyTaskDialog.graph.setTaskName(this.value.taskName, CopyTaskDialog.node);
    this.saveTask();
    CopyTaskDialog.close();
  };

  saveTask = async () => {
    const resources = toJS(this.value.pipelineResources);
    const gitResources = resources.map((item) => {
      if (item.type === "git") {
        return item;
      }
    });
    const imageResources = resources.map((item) => {
      if (item.type === "image") {
        return item;
      }
    });

    const params = this.value.pipelineParams;
    try {
      await taskStore.create(
        { name: this.value.taskName, namespace: "" },
        {
          spec: {
            params: params,
            inputs: {
              resources: gitResources,
            },
            outputs: {
              resources: imageResources,
            },
            steps: this.value.taskSteps,
            volumes: [
              {
                name: "build-path",
                emptyDir: {},
              },
            ],
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = (event: any) => {
    this.ifSwitch = event.target.checked;
  };

  formatOptionLabel = (option: SelectOption) => {
    const { value, label } = option;
    return (
      label || (
        <>
          <Icon small material="layers" />
          {value}
        </>
      )
    );
  };

  get taskOptions() {
    const options = taskStore
      .getAllByNs("ops")
      .map((item) => ({ value: item.getName() }))
      .slice();
    return [...options];
  }

  render() {
    const header = (
      <h5>
        <Trans>Apply Task</Trans>
      </h5>
    );

    return (
      <Dialog
        isOpen={CopyTaskDialog.isOpen}
        onOpen={this.onOpen}
        close={this.close}
      >
        <Wizard
          className="CopyAddDeployDialog"
          header={header}
          done={this.close}
        >
          <WizardStep contentClass="flex gaps column" next={this.handle}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    name="checkedA"
                    color="primary"
                    checked={this.ifSwitch}
                    onChange={this.handleChange}
                  />
                }
                label={this.ifSwitch ? "select" : "input"}
              />
            </FormGroup>
            <div hidden={this.ifSwitch}>
              <SubTitle title={"Task Name"} />
              <Input
                required={true}
                placeholder={_i18n._("Task Name")}
                value={this.value.taskName}
                onChange={(value) => (this.value.taskName = value)}
              />
              <br />
              <PipelineParamsDetails
                value={this.value.pipelineParams}
                onChange={(value) => {
                  this.value.pipelineParams = value;
                }}
              />
              <br />
              <PipelineResourceDetails
                value={this.value.pipelineResources}
                onChange={(value) => {
                  this.value.pipelineResources = value;
                }}
              />
              <br />
              <MultiTaskStepDetails
                value={this.value.taskSteps}
                onChange={(value) => {
                  this.value.taskSteps = value;
                }}
              />
            </div>
            <div hidden={!this.ifSwitch}>
              <Select
                value={this.value.taskName}
                options={this.taskOptions}
                formatOptionLabel={this.formatOptionLabel}
                onChange={(value: string) => {
                  this.value.taskName = value;
                  const taskName: any = toJS(this.value.taskName);
                  this.value.taskName = taskName.value;
                }}
              />
            </div>
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
