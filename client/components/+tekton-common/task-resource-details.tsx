import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Select} from "../select";
import {Icon} from "../icon";
import {Trans} from "@lingui/macro";
import {taskResources} from "./common";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {Input} from "../input";
import {TaskResource} from "../../api/endpoints";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;
  title?: string;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class TaskResourceDetails extends React.Component<Props> {
  static defaultProps = {title: "Pipeline Resources"};

  @observable value: TaskResource[] = this.props.value || [];

  add = () => {
    this.value.push(taskResources);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  get typeOptions() {
    return ["image", "git"];
  }

  rTab() {
    return (
      <>
        <br/>
        <Grid container spacing={3} alignItems="center" direction="row">
          <Grid item xs={3} zeroMinWidth>
            <Trans>Name</Trans>
          </Grid>
          <Grid item xs={4} zeroMinWidth>
            <Trans>ResourceType</Trans>
          </Grid>
          <Grid item xs={3} zeroMinWidth>
            <Trans>TargetPath</Trans>
          </Grid>
        </Grid>
        <br/>
      </>
    )
  }

  rForm(index: number) {
    return (
      <>
        <Grid container spacing={3} alignItems="center" direction="row">
          <Grid item xs={3} zeroMinWidth>
            <Input
              placeholder={"Name"}
              value={this.value[index].name}
              onChange={(value) => (this.value[index].name = value)}
            />
          </Grid>
          <Grid item xs={4} zeroMinWidth>
            <Select
              themeName={"light"}
              value={this.value[index].type}
              options={this.typeOptions}
              onChange={(value) => (this.value[index].type = value.value)}
            />
          </Grid>
          <Grid item xs={3} zeroMinWidth>
            <Input
              placeholder={"TargetPath"}
              value={this.value[index].targetPath}
              onChange={(value) => (this.value[index].targetPath = value)}
            />
          </Grid>
          <Grid item xs zeroMinWidth>
            <Icon
              small
              className="remove-icon"
              material="clear"
              onClick={(event) => {
                stopPropagation(event);
                this.remove(index);
              }}
            />
          </Grid>
        </Grid>
        <br/>
      </>
    )
  }

  render() {

    const {title} = this.props;
    return (
      <div className="Resource">
        <SubTitle
          title={
            <>
              {_i18n._(title)}
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>
            </>
          }>
        </SubTitle>
        {this.value.length > 0 ? this.rTab() : null}
        {this.value.map((item, index) => {
          return this.rForm(index);
        })}
      </div>
    );
  }

}
